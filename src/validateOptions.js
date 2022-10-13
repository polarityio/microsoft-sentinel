const { isEmpty, get } = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const validateOptions = (options, callback) => {
  const stringOptionsErrorMessages = {
    clientId: '* Required',
    tenantId: '* Required',
    clientSecret: '* Required'
  };

  const stringValidationErrors = _validateStringOptions(
    stringOptionsErrorMessages,
    options
  );

  const errors = stringValidationErrors

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

module.exports = validateOptions;
