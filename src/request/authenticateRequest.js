const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, concat, values } = require('lodash/fp');
const { mapObject } = require('../dataTransformations');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

let scopesBySite;

const authenticateRequest = async ({ site, route, options, ...requestOptions }) => {
  const urlBySite = {
    management: options.managementApiUrl + '/',
    logs: options.logAnalyticsApiUrl + '/'
  };

  scopesBySite = mapObject((value, key) => [key, `${value}.default`], urlBySite);
  
  const accessToken = await getToken(site, options);

  return {
    ...requestOptions,
    url: urlBySite[site] + route,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`
    }
  };
};

const getToken = async (site, options) => {
  const clientCacheId = flow(
    pick(['clientId', 'tenantId', 'clientSecret']),
    values,
    join(''),
    concat(site),
    join('')
  )(options);

  const client = await getClient(clientCacheId, options);

  const accessToken = await getAccessToken(clientCacheId, client, site);

  return accessToken;
};

const getClient = async (clientCacheId, options) => {
  let client = clientCache.get(clientCacheId);
  if (!client) {
    const config = {
      auth: {
        clientId: options.clientId,
        authority: 'https://login.microsoftonline.com/' + options.tenantId,
        clientSecret: options.clientSecret
      }
    };
    client = new ConfidentialClientApplication(config);
    clientCache.set(clientCacheId, client);
  }
  return client;
};

const getAccessToken = async (clientCacheId, client, site) => {
  let accessToken = tokenCache.get(clientCacheId);
  if (!accessToken) {
    accessToken = get(
      'accessToken',
      await client.acquireTokenByClientCredential({ scopes: [scopesBySite[site]] })
    );

    tokenCache.set(clientCacheId, accessToken);
  }
  return accessToken;
};

module.exports = authenticateRequest;
