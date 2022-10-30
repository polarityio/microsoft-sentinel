const { flow, get, size, find, eq, flatMap, reduce } = require('lodash/fp');
const map = require('lodash/fp/map').convert({ cap: false });

const createLookupResults = (
  entities,
  options,
  indicators,
  incidents,
  domainWhois,
  ipGeodata,
  kustoQueryResults
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
};

const getFormattedKustoQueryResultForThisEntity = (entity, kustoQueryResults) => {
  const kustoQueryResultForThisEntity = flow(
    find(flow(get('id'), eq(entity.value))),
    get('body.tables')
  )(kustoQueryResults);

  const formattedResultsTable = reduce(
    (agg, table) =>
      size(table.rows)
        ? [
            ...agg,
            {
              tableName: table.name,
              tableFields: flatMap(
                (row) =>
                  map(
                    (column, index) => ({ ...column, value: get(index, row) }),
                    table.columns
                  ).concat({ type: 'endOfRow' }),
                table.rows
              )
            }
          ]
        : agg,
    [],
    kustoQueryResultForThisEntity
  );
  const { Logger } = require('../integration');
  Logger({ test: 616161616161661, kustoQueryResultForThisEntity, formattedResultsTable });

  return formattedResultsTable;
};

module.exports = createLookupResults;
