'use strict';

const { validateOptions } = require('./src/userOptions');

const getLookupResults = require('./src/getLookupResults');
const { parseErrorToReadableJSON } = require('./src/dataTransformations');

const NodeCache = require('node-cache');
const globalState = new NodeCache(); //TODO: make user specific abstraction

let Logger;
const startup = async (logger) => {
  globalState.set('Logger', logger);
  Logger = logger;
};

const doLookup = async (entities, options, cb) => {
  try {
    Logger.debug({ entities }, 'Entities');

    const entitiesWithCustomTypesSpecified = standardizeEntityTypes(entities);

    const optionsWithUpdatedLists = parseUserOptionLists(options);

    const lookupResults = await getLookupResults(
      entitiesWithCustomTypesSpecified,
      optionsWithUpdatedLists
    );

    Logger.trace({ lookupResults }, 'Lookup Results');
    cb(null, lookupResults);
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');

    cb({ detail: error.message || 'Lookup Failed', err });
  }
};

module.exports = {
  startup,
  validateOptions,
  doLookup,
  globalState
};
