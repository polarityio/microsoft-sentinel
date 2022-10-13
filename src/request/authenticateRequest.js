const NodeCache = require('node-cache');

const tokenCache = new NodeCache({
  stdTTL: 30 * 60
});

const { isEqual } = require('lodash/fp');
const { mapObject } = require('../dataTransformations');
const globalState = require('../../integration');

const authenticateRequest = async ({ site, route, ...requestOptions }) => {
  const accessToken = await getAccessToken(site);

  return {
    ...requestOptions,
    url: urlBySite[site] + route,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${accessToken}`
    }
  };
};

const getAccessToken = async (site) => {
  const options = globalState.get('options');

  const client = await getClient(options);

  const tokenId = options.clientId + options.tenantId + options.clientSecret + site;
  let accessToken = tokenCache.get(tokenId);
  if (!accessToken) {
    accessToken = get(
      'accessToken',
      await client.acquireTokenByClientCredential({ scopes: [scopesBySite[site]] })
    );
    tokenCache.set(tokenId, accessToken);
  }

  return accessToken;
};

let client;
let optionsCache;
const getClient = async (options) => {
  if (!client || !isEqual(options, optionsCache)) {
    optionsCache = options;
    const config = {
      auth: {
        clientId: options.clientId,
        authority: urlBySite.login + options.tenantId,
        clientSecret: options.clientSecret
      }
    };
    client = new ConfidentialClientApplication(config);
    await client.setLogger(globalState.get('Logger'));
  }
  return client;
};

const urlBySite = {
  logs: 'https://api.loganalytics.io/',
  management: 'https://management.azure.com/',
  login: 'https://login.microsoftonline.com/'
};

const scopesBySite = mapObject((value, key) => [key, `${value}.default`], urlBySite);

module.exports = authenticateRequest;
