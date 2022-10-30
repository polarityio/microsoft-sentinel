const { flatMap, flow, get, map } = require('lodash/fp');
const { MAX_DISPLAY_RESULTS } = require('../constants');
const { requestsInParallel } = require('../request');
const { getIdMetaData } = require('./utils');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/securityinsights/stable/threat-intelligence-indicator/query-indicators
const getIndicators = async (entities, options) => {
  const indicatorRequests = flow(
    get('allSubscriptionResourceAndWorkspaceCombinations'),
    flatMap(({ subscriptionId, resourceGroupName, workspaceName }) =>
      map(
        (entity) => ({
          entity,
          method: 'POST',
          site: 'management',
          route: `subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/${workspaceName}/providers/Microsoft.SecurityInsights/threatIntelligence/main/queryIndicators?api-version=2021-10-01`,
          body: {
            keyword: entity.value,
            pageSize: MAX_DISPLAY_RESULTS
          },
          options
        }),
        entities
      )
    )
  )(options);

  const indicators = await requestsInParallel(indicatorRequests, 'body.value');

  const indicatorsWithMetaData = getIdMetaData(indicators);

  return indicatorsWithMetaData;
};

module.exports = getIndicators;
