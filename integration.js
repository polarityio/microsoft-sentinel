'use strict';

const validateOptions = require('./src/validateOptions');

const getLookupResults = require('./src/getLookupResults');
const { parseErrorToReadableJSON } = require('./src/dataTransformations');

const globalState = new require('node-cache')();

let Logger;
const startup = async (logger) => {
  globalState.set('Logger', logger);
  Logger = logger;
};

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');

  globalState.set('options', options);

  let lookupResults;
  try {
    lookupResults = await getLookupResults(entities);
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');

    return cb({ detail: error.message || 'Lookup Failed', err });
  }

  Logger.trace({ lookupResults }, 'Lookup Results');
  cb(null, lookupResults);
};

module.exports = {
  startup,
  validateOptions,
  doLookup,
  globalState
};
