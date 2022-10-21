const { flow, get, eq, first } = require('lodash/fp');
const { requestsInParallel } = require('../request');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/securityinsights/preview/ip-geodata/get?tabs=HTTP&tryIt=true&source=docs
const getIpGeodata = async (entities, options) => {
  const domainEntities = filter(flow(get('type'), eq('IPv4')), entities); 
  const ipGeodataRequests = flow(
    get('allSubscriptionAndResourceCombinations'),
    first,
    ({ subscriptionId, resourceGroupName }) =>
      map(
        (entity) => ({
          entity,
          site: 'management',
          route: `subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.SecurityInsights/enrichment/ip/geodata/`,
          qs: {
            'api-version': '2022-07-01-preview',
            domain: entity.value
          },
          options
        }),
        domainEntities
      )
  )(options);

  const ipGeodata = await requestsInParallel(ipGeodataRequests);

  return ipGeodata;
};

module.exports = getIpGeodata;
