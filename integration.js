'use strict';

const _validateOptions = require('./src/validateOptions');
const createRequestWithDefaults = require('./src/createRequestWithDefaults');

const getLookupResults = require('./src/getLookupResults');
const { parseErrorToReadableJSON } = require('./src/dataTransformations');

const sendMessage = require('./src/sendMessage');
const loadMoreSearchMessages = require('./src/loadMoreSearchMessages');

let Logger;
let requestWithDefaults;
const startup = async (logger) => {
  Logger = logger;

  requestWithDefaults = createRequestWithDefaults(Logger);
};

const doLookup = async (entities, options, cb) => {
  Logger.debug({ entities }, 'Entities');
  options.url = options.url.endsWith('/') ? options.url.slice(0, -1) : options.url;

  let lookupResults;
  try {
    lookupResults = await getLookupResults(
      entities,
      options,
      requestWithDefaults,
      Logger
    );
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error({ error, formattedError: err }, 'Get Lookup Results Failed');

    return cb({ detail: error.message || 'Command Failed', err });
  }

  Logger.trace({ lookupResults }, 'Lookup Results');
  cb(null, lookupResults);
};

const getOnMessage = { sendMessage, loadMoreSearchMessages };

const onMessage = ({ action, data: actionParams }, options, callback) =>
  getOnMessage[action](actionParams, options, requestWithDefaults, callback, Logger);

const validateOptions = (options, callback) =>
  _validateOptions(options, callback, Logger);

module.exports = {
  startup,
  validateOptions,
  doLookup,
  onMessage
};
