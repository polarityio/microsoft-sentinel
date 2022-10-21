const { ConfidentialClientApplication } = require('@azure/msal-node');
const { get, flow, pick, join, concat, values, add, sum } = require('lodash/fp');

const NodeCache = require('node-cache');
const clientCache = new NodeCache();
const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

const { mapObject } = require('../dataTransformations');
const { globalState } = require('../../integration');

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
  const clientId = flow(
    pick(['clientId', 'tenantId', 'clientSecret']),
    values,
    join(''),
    concat(site),
    join('')
  )(options);

  const client = await getClient(clientId, options);

  const accessToken = await getAccessToken(clientId, client, site);

  return accessToken;
};

const getClient = async (clientId, options) => {
  let client = clientCache.get(clientId);
  if (!client) {
    const config = {
      auth: {
        clientId: options.clientId,
        authority: urlBySite.login + options.tenantId,
        clientSecret: options.clientSecret
      }
    };
    client = new ConfidentialClientApplication(config);
    //TODO: check later to make sure sensitive info not logged
    await client.setLogger(globalState.get('Logger'));
    clientCache.set(clientId, client);
  }
  return client;
};

const getAccessToken = async (clientId, client, site) => {
  let accessToken = tokenCache.get(clientId);
  if (!accessToken) {
    accessToken = get(
      'accessToken',
      await client.acquireTokenByClientCredential({ scopes: [scopesBySite[site]] })
    );

    tokenCache.set(clientId, accessToken);
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
