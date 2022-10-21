const { map } = require('lodash');
const m = require('moment');

const { flow, flatMap, get, eq, first, replace, values } = require('lodash/fp');
const { requestsInParallel } = require('../request');
const { escapeQuotes } = require('./utils');

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
          createBatchLogRequest(entitiesChunk, workspaceId, queryHttpPathWithTimestamp),
        workspaceIds
      )
    )
  )(entities);

  //TODO: make queries be associated with 
  const kustoQuery = await requestsInParallel(kustoQueryRequests, 'body.responses');

  return kustoQuery;
};

const createBatchLogRequest = (entities, workspace, path) => ({
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
