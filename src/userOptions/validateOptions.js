const { size } = require('lodash/fp');

const { flattenOptions, validateStringOptions } = require('./utils');
const getSubscriptionsListMessage = require('./getSubscriptionsListMessage');
const getResourceGroupListMessage = require('./getResourceGroupListMessage');
const getWorkspaceListMessage = require('./getWorkspaceListMessage');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    clientId: '* Required',
    tenantId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const flattenedOptions = flattenOptions(options);

  const subscriptionsListMessage = !size(stringValidationErrors)
    ? await getSubscriptionsListMessage(flattenedOptions)
    : [];

  const [resourceGroupListMessage, workspaceListMessage] = !(size(subscriptionsListMessage) || size(stringValidationErrors))
    ? await Promise.all([
        getResourceGroupListMessage(flattenedOptions),
        getWorkspaceListMessage(flattenedOptions)
      ])
    : [[], []];

  const errors = stringValidationErrors
    .concat(subscriptionsListMessage)
    .concat(resourceGroupListMessage)
    .concat(workspaceListMessage);

  callback(null, errors);
};

module.exports = validateOptions;
