const { flow, get, eq, first } = require('lodash/fp');
const { requestsInParallel } = require('../request');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/securityinsights/preview/domain-whois/get?tabs=HTTP&tryIt=true&source=docs
const getDomainWhois = async (entities, options) => {
  const domainEntities = filter(flow(get('type'), eq('domain')), entities); 
  const domainWhoisRequests = flow(
    get('allSubscriptionAndResourceCombinations'),
    first,
    ({ subscriptionId, resourceGroupName }) =>
      map(
        (entity) => ({
          entity,
          site: 'management',
          route: `subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.SecurityInsights/enrichment/domain/whois/`,
          qs: {
            'api-version': '2022-07-01-preview',
            domain: entity.value
          },
          options
        }),
        domainEntities
      )
  )(options);

  const domainWhois = await requestsInParallel(domainWhoisRequests);

  return domainWhois;
};

module.exports = getDomainWhois;
