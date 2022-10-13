const { splitOutIgnoredIps, standardizeEntityTypes } = require('./dataTransformations');
const createLookupResults = require('./createLookupResults');

const getLookupResults = async (entities) => {
  const entitiesWithCustomTypesSpecified = standardizeEntityTypes(entities);

  const { entitiesPartition, ignoredIpLookupResults } = splitOutIgnoredIps(
    entitiesWithCustomTypesSpecified
  );

  const lookupResults = createLookupResults();

  return lookupResults.concat(ignoredIpLookupResults);
};

module.exports = getLookupResults;
