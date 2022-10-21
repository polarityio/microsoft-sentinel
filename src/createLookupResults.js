const { flow, get, size, find, eq, flatMap } = require('lodash/fp');
const map = require('lodash/fp/map').convert({ cap: false });

const createLookupResults = (
  indicators,
  incidents,
  domainWhois,
  ipGeodata,
  kustoQueryResults,
  entities,
  options
) =>
  map((entity) => {
    const resultsForThisEntity = getResultsForThisEntity(
      entity,
      indicators,
      incidents,
      domainWhois,
      ipGeodata,
      kustoQueryResults
    );

    const lookupResult = {
      entity,
      data: size(resultsForThisEntity)
        ? {
            summary: [],
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);


const getResultsForThisEntity = (
  entity,
  indicators,
  incidents,
  domainWhois,
  ipGeodata,
  kustoQueryResults
) => {
  const getResultForThisEntityResult = (results) =>
    flow(find(flow(get('entity.value'), eq(entity.value))), get('result'))(results);

  const indicatorsForThisEntity = getResultForThisEntityResult(indicators);
  const incidentsForThisEntity = getResultForThisEntityResult(incidents);
  const domainWhoisForThisEntity = getResultForThisEntityResult(domainWhois);
  const ipGeodataForThisEntity = getResultForThisEntityResult(ipGeodata);

  const kustoQueryResultsForThisEntity = getFormattedKustoQueryResultForThisEntity(
    entity,
    kustoQueryResults
  );

  return {
    indicators: indicatorsForThisEntity,
    incidents: incidentsForThisEntity,
    domainWhois: domainWhoisForThisEntity,
    ipGeodata: ipGeodataForThisEntity,
    kustoQueryResults: kustoQueryResultsForThisEntity
  };
}

const getFormattedKustoQueryResultForThisEntity = (entity, kustoQueryResults) => {
  const kustoQueryResultForThisEntity = flow(
    find(flow(get('id'), eq(entity.value))),
    get('body.tables')
  )(kustoQueryResults);

  const formattedResultsTable = map(
    (table) => ({
      tableName: table.name,
      tableFields: flatMap(
        (row) =>
          map((column, index) => ({ ...column, value: get(index, row) }), columns).concat(
            { type: 'endOfRow' }
          ),
        table.rows
      )
    }),
    kustoQueryResultForThisEntity
  );

  return formattedResultsTable;
};
module.exports = createLookupResults;
