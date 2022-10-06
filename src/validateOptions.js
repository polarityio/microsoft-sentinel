const { isEmpty, get } = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const validateOptions = (options, callback, Logger) => {
  const stringOptionsErrorMessages = {
    url: 'You must provide a valid Slack URL',
    ...(options.allowSendingMessages.value && {
      userToken: 'You must provide a valid Slack User Token'
    }),
    botToken: 'You must provide a valid Slack Bot Token'
  };

  const stringValidationErrors = _validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const urlValidationErrors = _validateUrlOption(options.url);

  const noChannelNamesError =
    options.allowSendingMessages.value && !options.messagingChannelNames.value
      ? {
          key: 'messagingChannelNames',
          message:
            'If "Allow Sending Slack Messages" is Checked, then you must provide at least one channel name to send messages.'
        }
      : [];

  const integrationDoesNothingError = !(
    options.allowSendingMessages.value || options.allowSearchingMessages.value
  )
    ? [
        {
          key: 'allowSendingMessages',
          message:
            'At least one of these must be check for the integration to do anything.'
        },
        {
          key: 'allowSearchingMessages',
          message:
            'At least one of these must be check for the integration to do anything.'
        }
      ]
    : [];

  const ignoreEntityTypesTrueWithoutCustomTypeOnError =
    get('ignoreEntityTypes.value', options) &&
    !get('enabled', get('_integrationChannels.value', options)['custom.allText'])
      ? {
          key: 'ignoreEntityTypes',
          message:
            'Cannot enable "Ignore Entity Types" without the "custom.allText" entity type enabled'
        }
      : [];

  const errors = stringValidationErrors
    .concat(urlValidationErrors)
    .concat(noChannelNamesError)
    .concat(integrationDoesNothingError)
    .concat(ignoreEntityTypesTrueWithoutCustomTypeOnError);

  callback(null, errors);
};

const _validateStringOptions = (stringOptionsErrorMessages, options, otherErrors = []) =>
  reduce((agg, message, optionName) => {
    const isString = typeof options[optionName].value === 'string';
    const isEmptyString = isString && isEmpty(options[optionName].value);

    return !isString || isEmptyString
      ? agg.concat({
          key: optionName,
          message
        })
      : agg;
  }, otherErrors)(stringOptionsErrorMessages);

const _validateUrlOption = ({ value: url }, otherErrors = []) => {
  const endWithError =
    url && url.endsWith('//')
      ? otherErrors.concat({
          key: 'url',
          message: 'Your Url must not end with a //'
        })
      : otherErrors;
  if (endWithError.length) return endWithError;

  if (url) {
    try {
      new URL(url);
    } catch (_) {
      return otherErrors.concat({
        key: 'url',
        message:
          'What is currently provided is not a valid URL. You must provide a valid Instance URL.'
      });
    }
  }

  return otherErrors;
};

module.exports = validateOptions;
