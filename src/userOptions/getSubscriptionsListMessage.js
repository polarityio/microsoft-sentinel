const { size, get, flow, map, join } = require('lodash/fp');
const { requestWithDefaults } = require('../request');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/resources/subscriptions/list?tabs=HTTP
const getSubscriptionsListMessage = async (options) => {
  if (size(options.subscriptionIds)) return [];

  const subscriptions = get(
    'body',
    await requestWithDefaults({
      site: 'management',
      route: 'subscriptions?api-version=2020-01-01',
      options
    })
  );

  const message = buildMessageFromSubscriptions(subscriptions);

  return {
    key: 'subscriptionIds',
    message
  };
};

/**
 * Creates String: "Name: subscriptionName, State: subscriptionState, ID: subscriptionId\n" 
 * for each subscription, then outputs onto the end of the string each ID to be copied 
 * and used in the user option
 */
const buildMessageFromSubscriptions = (subscriptions) =>
  flow(
    reduce(
      (agg, subscription) =>
        agg.concat(
          `Name: ${get('displayName', subscription)}, ` +
            `State: ${get('state', subscription)}, ` +
            `ID: ${get('subscriptionId', subscription)}\n`
        ),
      size(subscriptions) ? '* Required - Available Subscriptions: \n' : ''
    ),
    concat(flow(map(get('subscriptionId')), join(', '))(subscriptions))
  )(subscriptions);

module.exports = getSubscriptionsListMessage;