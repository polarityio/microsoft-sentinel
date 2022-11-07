const { parallelLimit } = require('async');
const { map, get } = require('lodash/fp');
const createRequestWithDefaults = require('./createRequestWithDefaults');

const requestWithDefaults = createRequestWithDefaults();

const requestsInParallel = async (
  requestsOptions,
  responseGetPath = 'body',
  limit = 10
) => {
  const unexecutedRequestFunctions = map(
    ({ entity, ...requestOptions }) =>
      async () => {
        const result = get(responseGetPath, await requestWithDefaults(requestOptions));
        return entity ? { entity, result } : result;
      },
    requestsOptions
  );

  return await parallelLimit(unexecutedRequestFunctions, limit);
};

module.exports = { createRequestWithDefaults, requestWithDefaults, requestsInParallel };
