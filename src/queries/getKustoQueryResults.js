const { flow, flatMap, replace, values, map, chunk, flatten } = require('lodash/fp');
const { requestsInParallel } = require('../request');
const { escapeQuotes, getDaysBackFormattedDate } = require('./utils');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/loganalytics/dataaccess/query/batch?tabs=HTTP
const getKustoQueryResults = async (entities, options) => {
  const workspaceIds = values(options.parsedWorkspaceNamesAndIds);

  const queryHttpPathWithTimestamp = `/query?timespan${getDaysBackFormattedDate(
    options.lookbackDays
  )}/${getDaysBackFormattedDate(0)}`;

  const kustoQueryRequests = flow(
    chunk(10),
    flatMap((entitiesChunk) =>
      map(
        (workspaceId) =>
          createBatchLogRequest(
            entitiesChunk,
            workspaceId,
            queryHttpPathWithTimestamp,
            options
          ),
        workspaceIds
      )
    )
  )(entities);

  const kustoQueryResult = flatten(
    await requestsInParallel(kustoQueryRequests, 'body.responses')
  );

  return kustoQueryResult;
};

const createBatchLogRequest = (entities, workspace, path, options) => ({
  method: 'POST',
  site: 'logs',
  route: 'v1/$batch',
  body: {
    requests: map(
      ({ value: entityValue }) => ({
        id: entityValue,
        method: 'POST',
        path,
        workspace,
        body: {
          query: replace(
            /{{ENTITY}}/gi,
            escapeQuotes(entityValue),
            options.kustoQueryString
          )
        }
      }),
      entities
    )
  },
  options
});

module.exports = getKustoQueryResults;
