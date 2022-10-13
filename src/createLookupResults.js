const { flow, map, get, size, find, every, eq } = require('lodash/fp');


const createLookupResults = (
  entitiesPartition,
  channels,
  foundMessagesByEntity,
  options
) =>
  map((entity) => {
    const {
      foundMessagesFromSearch,
      totalNumberOfSearchResultPages,
      currentSearchResultsPage
    } = find(flow(get('entity.value'), eq(entity.value)), foundMessagesByEntity) || {
      foundMessagesFromSearch: [],
      totalNumberOfSearchResultPages: 0,
      currentSearchResultsPage: 0
    };

    const lookupResult = {
      entity,
      data:
        (!options.allowSendingMessages && size(foundMessagesFromSearch)) ||
        (options.allowSendingMessages && every(size, [channels]))
          ? {
              summary: []
                .concat(options.allowSendingMessages ? 'Message Channels' : [])
                .concat(size(foundMessagesFromSearch) ? 'Search Results' : []),
              details: {
                channels,
                foundMessagesFromSearch,
                totalNumberOfSearchResultPages,
                currentSearchResultsPage
              }
            }
          : null
    };

    return lookupResult;
  }, entitiesPartition);

module.exports = createLookupResults;
