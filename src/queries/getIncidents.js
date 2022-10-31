const { flatMap, flow, get, toLower, map, join, replace } = require('lodash/fp');
const { MAX_DISPLAY_RESULTS } = require('../constants');
const { requestsInParallel } = require('../request');
const { getIdMetaData, getDaysBackFormattedDate } = require('./utils');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/securityinsights/preview/incidents/list?tabs=HTTP
const getIncidents = async (entities, options) => {
  // NOTE: Could improve speed with aggregate queries in one request
  const incidentRequests = flow(
    get('allSubscriptionResourceAndWorkspaceCombinations'),
    flatMap(({ subscriptionId, resourceGroupName, workspaceName }) =>
      map(
        (entity) => ({
          entity,
          site: 'management',
          route: `subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/${workspaceName}/providers/Microsoft.SecurityInsights/incidents`,
          qs: {
            'api-version': '2022-07-01-preview',
            $filter: buildIncidentFilterQuery(entity, options),
            $orderby: 'properties/lastModifiedTimeUtc desc',
            $top: MAX_DISPLAY_RESULTS
          },
          options
        }),
        entities
      )
    )
  )(options);

  const incidents = await requestsInParallel(incidentRequests, 'body.value');

  const incidentsWithMetaData = getIdMetaData(incidents);

  return incidentsWithMetaData;
};

const buildIncidentFilterQuery = (entity, options) => {
  const entityValue = flow(get('value'), toLower)(entity);
  const queryPaths = [
    'title',
    'description',
    'owner.email',
    'owner.assignedTo',
    'owner.userPrincipalName'
  ];

  return (
    "(properties/status eq 'New' or properties/status eq 'Active') and " +
    buildLookbackQuerySection(options) +
    `(properties/labels/any(item: contains(toLower(item/labelName), '${entityValue}'))) or ` +
    buildFieldContainsQueries(queryPaths, entityValue)
  );
};

const buildLookbackQuerySection = (options) => {
  const endDateTime = getDaysBackFormattedDate(0);

  const startDateTime = getDaysBackFormattedDate(options.lookbackDays);

  return (
    `(properties/lastModifiedTimeUtc ge ${startDateTime} and ` +
    `properties/lastModifiedTimeUtc le ${endDateTime}) and `
  );
};

const buildFieldContainsQueries = (queryPaths, entityValue) =>
  `(${flow(
    map(
      (queryPath) =>
        `(contains(toLower(properties/${replace(
          '.',
          '/',
          queryPath
        )}), '${entityValue}'))`
    ),
    join(' or ')
  )(queryPaths)})`;

module.exports = getIncidents;
