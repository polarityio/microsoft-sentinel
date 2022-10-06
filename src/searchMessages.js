const {
  get,
  map,
  flow,
  filter,
  negate,
  toInteger,
  uniq,
  reduce,
  __,
  size,
  multiply,
  split,
  find,
  eq,
} = require('lodash/fp');

const NodeCache = require('node-cache');

const profilePictureCache = new NodeCache({
  stdTTL: 6 * 60 * 60 //Cache profile picture for 6 hours
});

const searchMessages = async (
  entities,
  channels,
  options,
  requestWithDefaults,
  Logger,
  currentSearchResultsPage = 1
) =>
  await Promise.all(
    map(async (entity) => {
      const [sort, sort_dir] = flow(get('sortBy.value'), split(','))(options);
      
      const foundMessages = get(
        'body.messages',
        await requestWithDefaults({
          url: `${options.url}/search.messages`,
          method: 'GET',
          qs: {
            query: entity.value,
            count: 50,
            page: currentSearchResultsPage,
            sort,
            sort_dir
          },
          options
        })
      );

      const totalNumberOfSearchResultPages = flow(get('pagination.page_count'))(
        foundMessages
      );

      const foundMessagesInChannels = flow(
        get('matches'),
        filter(get('channel.is_channel'))
      )(foundMessages);

      if (
        size(foundMessages) &&
        !size(foundMessagesInChannels) &&
        currentSearchResultsPage < totalNumberOfSearchResultPages
      ) {
        return searchMessages(
          entities,
          options,
          requestWithDefaults,
          Logger,
          currentSearchResultsPage + 1
        );
      }

      await getAndCacheProfilePictureLinksByTeamAndUserId(
        foundMessagesInChannels,
        options,
        requestWithDefaults,
        Logger
      );

      const foundMessagesFromSearch = flow(
        map(formatMessagesForUi(channels)),
        filter(get('message'))
      )(foundMessagesInChannels);

      return {
        entity,
        foundMessagesFromSearch,
        totalNumberOfSearchResultPages,
        currentSearchResultsPage
      };
    }, entities)
  );

const formatMessagesForUi = (channels) => (message) => ({
  messageLink: get('permalink', message),
  channelName: get('channel.name', message),
  datetime: flow(
    get('ts'),
    toInteger,
    multiply(1000),
    (unixDate) => new Date(unixDate)
  )(message),
  profilePictureSrc: flow(
    get('team'),
    profilePictureCache.get,
    get(get('user', message))
  )(message),
  channelIsPrivate: flow(
    find(flow(get('id'), eq(get('channel.id', message)))),
    get('is_private')
  )(channels),
  username: get('username', message),
  message: get('text', message),
  displayMessage:
    flow(get('text'), (x) => x.slice(0, 120))(message) +
    (flow(get('text'), size)(message) > 120 ? '...' : ''),
  shouldShowMoreMessage: flow(get('text'), size)(message) > 120
});

const getAndCacheProfilePictureLinksByTeamAndUserId = async (
  foundMessagesInChannels,
  options,
  requestWithDefaults,
  Logger
) =>
  await Promise.all(
    flow(
      map(get('team')),
      uniq,
      filter(negate(profilePictureCache.get)),
      map(putProfilePictureLinksForTeamIdInCache(options, requestWithDefaults, Logger))
    )(foundMessagesInChannels)
  );

const putProfilePictureLinksForTeamIdInCache =
  (options, requestWithDefaults, Logger) => async (team_id, nextCursor) => {
    const responseBody = get(
      'body',
      await requestWithDefaults({
        url: `${options.url}/users.list`,
        method: 'GET',
        qs: { ...(nextCursor && { cursor: nextCursor }), limit: 500, team_id },
        options
      })
    );

    const profilePictureLinksByUserId = flow(
      get('members'),
      reduce((agg, user) => ({ ...agg, [user.id]: get('profile.image_72', user) }), {})
    )(responseBody);

    profilePictureCache.set(team_id, profilePictureLinksByUserId);

    const next_cursor = get('response_metadata.next_cursor', responseBody);

    if (next_cursor)
      return await putProfilePictureLinksForTeamIdInCache(team_id, next_cursor);
  };

module.exports = searchMessages;
