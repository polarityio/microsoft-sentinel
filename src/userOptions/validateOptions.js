const { size } = require('lodash/fp');

const { flattenOptions, validateStringOptions, validateUrlOption } = require('./utils');
const getSubscriptionsListMessage = require('./getSubscriptionsListMessage');
const getResourceGroupListMessage = require('./getResourceGroupListMessage');
const getWorkspaceListMessage = require('./getWorkspaceListMessage');

const validateOptions = async (options, callback) => {
  const stringOptionsErrorMessages = {
    managementApiUrl: '* Required',
    logAnalyticsApiUrl: '* Required',
    clientId: '* Required',
    tenantId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const urlOptionsErrors = validateUrlOption(options, 'managementApiUrl').concat(
    validateUrlOption(options, 'logAnalyticsApiUrl')
  );

  const flattenedOptions = flattenOptions(options);

  const subscriptionsListMessage = !size(stringValidationErrors)
    ? await getSubscriptionsListMessage(flattenedOptions)
    : [];

  const [resourceGroupListMessage, workspaceListMessage] = !(
    size(subscriptionsListMessage) || size(stringValidationErrors)
  )
    ? await Promise.all([
        getResourceGroupListMessage(flattenedOptions),
        getWorkspaceListMessage(flattenedOptions)
      ])
    : [[], []];

  const errors = stringValidationErrors
    .concat(urlOptionsErrors)
    .concat(subscriptionsListMessage)
    .concat(resourceGroupListMessage)
    .concat(workspaceListMessage);

  callback(null, errors);
};

module.exports = validateOptions;
