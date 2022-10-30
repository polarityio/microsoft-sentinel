const { isEmpty, get, curry, flow, split, map, zipObject, trim, uniq, compact } = require('lodash/fp');
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



const splitCommaSeparatedUserOption = curry((key, options) =>
  flow(get(key), split(','), map(trim), compact, uniq)(options)
);

const splitKeyValueCommaSeparatedUserOption = (key, options) =>
  flow(
    splitCommaSeparatedUserOption(key),
    map(flow(split(':'), map(trim))),
    transpose2DArray,
    ([keys, values]) => zipObject(keys, values)
  )(options);


module.exports = {
  flattenOptions,
  validateStringOptions,
  splitCommaSeparatedUserOption,
  splitKeyValueCommaSeparatedUserOption
};
