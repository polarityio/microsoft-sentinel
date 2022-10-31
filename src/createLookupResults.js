const { uniq } = require('lodash');
const {
  flow,
  get,
  size,
  find,
  eq,
  flatMap,
  map,
  includes,
  values,
  some,
  keys,
  filter,
  __,
  compact
} = require('lodash/fp');
const reduce = require('lodash/fp/reduce').convert({ cap: false });

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
      options,
      indicators,
      incidents,
      domainWhois,
      ipGeodata,
      kustoQueryResults
    );

    const lookupResult = {
      entity,
      data: flow(values, some(flow(keys, size)))(resultsForThisEntity)
        ? {
            summary: createSummaryTags(resultsForThisEntity, options),
            details: resultsForThisEntity
          }
        : null
    };

    return lookupResult;
  }, entities);

const getResultsForThisEntity = (
  entity,
  options,
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
    options,
    kustoQueryResults
  );

  return {
    ...(!!size(indicatorsForThisEntity) && { indicators: indicatorsForThisEntity }),
    ...(!!size(incidentsForThisEntity) && { incidents: incidentsForThisEntity }),
    ...(!!size(kustoQueryResultsForThisEntity) && {
      kustoQueryResults: kustoQueryResultsForThisEntity
    }),
    domainWhois: domainWhoisForThisEntity,
    ipGeodata: ipGeodataForThisEntity
  };
};

const getFormattedKustoQueryResultForThisEntity = (
  entity,
  options,
  kustoQueryResults
) => {
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
              tableFields: getTableFields(table, options)
            }
          ]
        : agg,
    [],
    kustoQueryResultForThisEntity
  );

  return formattedResultsTable;
};

const getTableFields = (table, options) =>
  flatMap(
    (row) =>
      reduce(
        (agg, column, index) => {
          const columnIsIncludedInIgnoreFields = flow(
            get('parsedKustoQueryIgnoreFields'),
            includes(get('name', column))
          )(options);

          return columnIsIncludedInIgnoreFields
            ? agg
            : [...agg, { ...column, value: get(index, row) }];
        },
        [],
        table.columns
      ).concat({ type: 'endOfRow' }),
    table.rows
  );

const createSummaryTags = (
  { indicators, incidents, domainWhois, ipGeodata, kustoQueryResults },
  options
) => {
  const indicatorsTags = size(indicators) ? [`Indicators: ${size(indicators)}`] : [];
  const incidentsTags = size(incidents) ? [`Incidents: ${size(incidents)}`] : [];

  const totalKustoQueryResultsRows = flow(
    flatMap(flow(get('tableFields'), filter(flow(get('type'), eq('endOfRow'))))),
    size
  )(kustoQueryResults);

  const customKustoTagsFromOptions = flow(
    flatMap(
      flow(
        get('tableFields'),
        reduce(
          (agg, field) =>
            flow(get('name'), includes(__, options.parsedKustoQuerySummaryFields))(field)
              ? [...agg, `${field.name}: ${field.value}`]
              : agg,
          []
        )
      )
    ),
    compact,
    uniq
  )(kustoQueryResults);

  const kustoQueryResultsTags = (
    totalKustoQueryResultsRows ? [`Logs: ${totalKustoQueryResultsRows}`] : []
  ).concat(size(customKustoTagsFromOptions) ? customKustoTagsFromOptions : []);

  //TODO add ignore geo and whois here
  const ipGeodataTags = flow(keys, size)(ipGeodata) ? [`Geodata`] : [];
  const domainWhoisTags = flow(keys, size)(domainWhois) ? [`WHOIS`] : [];

  return []
    .concat(indicatorsTags)
    .concat(incidentsTags)
    .concat(kustoQueryResultsTags)
    .concat(ipGeodataTags)
    .concat(domainWhoisTags);
};

const asdf = (options) => {}
module.exports = createLookupResults;
