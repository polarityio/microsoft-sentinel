const { flow, get, concat, __, compact } = require('lodash/fp');
const NodeCache = require('node-cache');

const channelsCache = new NodeCache({
  stdTTL: 30 * 60
});

const getSlackChannels = async (
  options,
  requestWithDefaults,
  Logger,
  aggChannels,
  cursor
) => {
  const cachedChannels = channelsCache.get('channels');
  if(cachedChannels) return cachedChannels;
  
  const response = await requestWithDefaults({
    method: 'GET',
    url: `${options.url}/conversations.list`,
    qs: {
      exclude_archived: true,
      types: 'public_channel, private_channel',
      limit: 1000,
      ...(cursor && { cursor })
    },
    options
  });
  const channels = flow(get('body.channels'), concat(aggChannels, __), compact)(response);
  const nextCursor = get('body.response_metadata.next_cursor', response);

  if(!nextCursor) channelsCache.set('channels', channels);

  return nextCursor
    ? await getSlackChannels(options, requestWithDefaults, Logger, channels, nextCursor)
    : channels;
};

module.exports = getSlackChannels;
