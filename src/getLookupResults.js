const createLookupResults = require('./createLookupResults');
const {
  getIndicators,
  getIncidents,
  getDomainWhois,
  getIpGeodata,
  getKustoQueryResults
} = require('./queries');

const getLookupResults = async (entities, options) => {
  const [indicators, incidents, domainWhois, ipGeodata, kustoQueryResults] =
    await Promise.all([
      getIndicators(entities, options),
      getIncidents(entities, options),
      getDomainWhois(entities, options),
      getIpGeodata(entities, options),
      getKustoQueryResults(entities, options)
    ]);

  const lookupResults = createLookupResults(
    entities,
    options,
    indicators,
    incidents,
    domainWhois,
    ipGeodata,
    kustoQueryResults
  );

  return lookupResults
};

module.exports = getLookupResults;
