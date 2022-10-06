const {
  map,
  flow,
  first,
  split,
  last,
  trim,
  filter,
  get,
  getOr,
  size,
  negate,
  isEqual,
  some,
  toLower,
  eq,
  uniqBy
} = require('lodash/fp');

const { splitOutIgnoredIps } = require('./dataTransformations');
const createLookupResults = require('./createLookupResults');
const getSlackChannels = require('./getSlackChannels');
const searchMessages = require('./searchMessages');

const getLookupResults = async (entities, options, requestWithDefaults, Logger) => {
  const entitiesWithCustomTypesSpecified = map(
    ({ type, types, ...entity }) => ({
      ...entity,
      type: type === 'custom' ? flow(first, split('.'), last)(types) : type
    }),
    entities
  );

  const { entitiesPartition, ignoredIpLookupResults } = splitOutIgnoredIps(
    entitiesWithCustomTypesSpecified
  );

  const filteredEntities = filterOutInvalidEntities(entitiesPartition, options, Logger);
  const channels = await getSlackChannels(options, requestWithDefaults, Logger);

  const foundMessagesByEntity = options.allowSearchingMessages
    ? await searchMessages(
        filteredEntities,
        channels,
        options,
        requestWithDefaults,
        Logger
      )
    : [];

  const lookupResults = createLookupResults(
    filteredEntities,
    channels,
    foundMessagesByEntity,
    options,
    Logger
  );

  return lookupResults.concat(ignoredIpLookupResults);
};

const filterOutInvalidEntities = (entities, options, Logger) =>
  flow(
    filter((entity) => {
      const trimmedEntityValue = flow(get('value'), trim)(entity);

      const isNotWhitespace = size(trimmedEntityValue);

      const noDuplicateEntityValue = !flow(
        filter(negate(isEqual(entity))),
        some(
          flow(
            get('rawValue'),
            trim,
            toLower,
            eq(flow(get('rawValue'), trim, toLower)(entity))
          )
        )
      )(entities);

      const isCorrectType =
        !options.ignoreEntityTypes ||
        ((entity.type === 'custom' || entity.type === 'allText') &&
          (!entity.types || size(entity.types) === 1) &&
          !(
            entity.isIP ||
            entity.hashType ||
            entity.isGeo ||
            entity.isEmail ||
            entity.isURL ||
            entity.isDomain
          ) &&
          noDuplicateEntityValue);

      const entityLength = size(trimmedEntityValue);
      
      return (
        isNotWhitespace &&
        isCorrectType &&
        entityLength >= getOr(entityLength, 'minLength', options) &&
        entityLength <= getOr(entityLength, 'maxLength', options)
      );
    }),
    uniqBy(flow(get('value'), trim))
  )(entities);

module.exports = getLookupResults;
