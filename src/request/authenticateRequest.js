const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, concat, values } = require('lodash/fp');
const { mapObject } = require('../dataTransformations');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

const authenticateRequest = async ({ site, route, options, ...requestOptions }) => {
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
        authority: urlBySite.login + options.tenantId,
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

const urlBySite = {
  logs: 'https://api.loganalytics.io/',
  management: 'https://management.azure.com/',
  login: 'https://login.microsoftonline.com/'
};

const scopesBySite = mapObject((value, key) => [key, `${value}.default`], urlBySite);

module.exports = authenticateRequest;
