const {
  isEmpty,
  get,
  curry,
  flow,
  split,
  map,
  zipObject,
  trim,
  uniq,
  compact,
  first
} = require('lodash/fp');
const { transpose2DArray } = require('../dataTransformations');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

const flattenOptions = (options) =>
  reduce(
    (agg, optionObj, optionKey) => ({ ...agg, [optionKey]: get('value', optionObj) }),
    {},
    options
  );

const validateStringOptions = (stringOptionsErrorMessages, options, otherErrors = []) =>
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

const validateUrlOption = (options, urlKey = 'url') => {
  let allValidationErrors = [];

  const urlValue = get([urlKey, 'value'], options);

  if (urlValue.endsWith('/')) {
    allValidationErrors = allValidationErrors.concat({
      key: urlKey,
      message: 'Your Url must not end with a /'
    });
  }

  if (urlValue) {
    try {
      new URL(urlValue);
    } catch (_) {
      allValidationErrors = allValidationErrors.concat({
        key: urlKey,
        message:
          'What is currently provided is not a valid URL. You must provide a valid Instance URL.'
      });
    }
  }

  return allValidationErrors;
};

const splitCommaSeparatedUserOption = curry((key, options) =>
  flow(get(key), split(','), map(trim), compact, uniq)(options)
);

const splitCommaSeparatedUserOptionThenFirst = curry((key, options) => [
  first(splitCommaSeparatedUserOption(key, options))
]);

const splitKeyValueCommaSeparatedUserOption = (key, options) =>
  flow(
    splitCommaSeparatedUserOption(key),
    map(flow(split(':'), map(trim))),
    transpose2DArray,
    ([keys, values]) => zipObject(keys, values)
  )(options);

const splitKeyValueCommaSeparatedUserOptionThenFirst = (key, options) =>
  flow(
    splitCommaSeparatedUserOption(key),
    map(flow(split(':'), map(trim))),
    ([first]) => [first],
    transpose2DArray,
    ([keys, values]) => zipObject(keys, values)
  )(options);

module.exports = {
  flattenOptions,
  validateStringOptions,
  validateUrlOption,
  splitCommaSeparatedUserOption,
  splitKeyValueCommaSeparatedUserOption,
  splitCommaSeparatedUserOptionThenFirst,
  splitKeyValueCommaSeparatedUserOptionThenFirst
};
