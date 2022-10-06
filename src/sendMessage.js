const { parseErrorToReadableJSON } = require('./dataTransformations');

const sendMessage = async (
  { text, channel },
  options,
  requestWithDefaults,
  callback,
  Logger
) => {
  try {
    await requestWithDefaults({
      method: 'POST',
      url: `${options.url}/chat.postMessage`,
      body: {
        channel,
        text,
        username: `Polarity${
          options.messagingDisplayName ? `: ${options.messagingDisplayName}` : ''
        }`
      },
      options
    });

    callback(null, {});
  } catch (error) {
    const err = parseErrorToReadableJSON(error);
    Logger.error(
      {
        detail: 'Failed to Message Channel',
        options,
        formattedError: err
      },
      'Message Channel Failed'
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

module.exports = sendMessage;
