const { splitOutIgnoredIps, standardizeEntityTypes } = require('./dataTransformations');
const createLookupResults = require('./createLookupResults');
const {
  getIndicators,
  getIncidents,
  getDomainWhois,
  getIpGeodata,
  getKustoQueryResults
} = require('./queries');

const getLookupResults = async (entities, options) => {
  const { entitiesPartition, ignoredIpLookupResults } = splitOutIgnoredIps(entities);

  const indicators = await getIndicators(entitiesPartition, options);
  const incidents = await getIncidents(entitiesPartition, options);
  const domainWhois = await getDomainWhois(entitiesPartition, options);
  const ipGeodata = await getIpGeodata(entitiesPartition, options);
  const kustoQueryResults = await getKustoQueryResults(entitiesPartition, options);

  const lookupResults = createLookupResults(
    indicators,
    incidents,
    domainWhois,
    ipGeodata,
    kustoQueryResults,
    entitiesPartition,
    options
  );

  return lookupResults.concat(ignoredIpLookupResults);
};

module.exports = getLookupResults;
