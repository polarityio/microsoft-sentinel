const { parseErrorToReadableJSON } = require('./dataTransformations');
const searchMessages = require('./searchMessages');

const loadMoreSearchMessages = async (
  { entity, channels, currentSearchResultsPage },
  options,
  requestWithDefaults,
  callback,
  Logger
) => {
  try {
    const [
      {
        foundMessagesFromSearch,
        totalNumberOfSearchResultPages,
        currentSearchResultsPage: _currentSearchResultsPage
      }
    ] = await searchMessages(
      [entity],
      channels,
      options,
      requestWithDefaults,
      Logger,
      currentSearchResultsPage + 1
    );

    return callback(null, {
      foundMessagesFromSearch,
      currentSearchResultsPage: _currentSearchResultsPage,
      totalNumberOfSearchResultPages
    })
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error(
      {
        detail: 'Failed to Load More Messages',
        options,
        formattedError: err
      },
      'Load More Messages Failed'
    );

    const { message, detail, status } = err;

    return callback({
      errors: [
        {
          err,
          detail: `${message}${detail ? ` - ${detail}` : ''}${
            status ? `, Code: ${status}` : ''
          }`
        }
      ]
    });
  }
};

module.exports = loadMoreSearchMessages;
