const { size, get, flow, map, join, reduce, compact } = require('lodash/fp');
const { requestWithDefaults } = require('../request');

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/resources/subscriptions/list?tabs=HTTP
const getSubscriptionsListMessage = async (options) => {
  try {
    if (size(options.subscriptionIds)) return [];

    const subscriptions = get(
      'body.value',
      await requestWithDefaults({
        site: 'management',
        route: 'subscriptions?api-version=2020-01-01',
        options
      })
    );

    return buildMessageFromSubscriptions(subscriptions);
  } catch (error) {
    const errorMessagesToReturn = createErrorMessage(error);
    if (errorMessagesToReturn) return errorMessagesToReturn;

    throw error;
  }
};

/**
 * Creates String: "Name: "subscriptionName", ID: "subscriptionId""
 * for each subscription, then outputs onto the end of the string each ID to be copied
 * and used in the user option
 */
const buildMessageFromSubscriptions = (subscriptions) => {
  const subscriptionMessageTitle = size(subscriptions)
    ? [
        {
          key: 'subscriptionIds',
          message: '* Required ->'
        },
        {
          key: 'subscriptionIds',
          message: '***** Available Subscriptions *****:'
        }
      ]
    : [];

  const eachSubscriptionMessages = reduce(
    (agg, subscription) =>
      get('state', subscription) !== 'Enabled'
        ? agg
        : agg.concat({
            key: 'subscriptionIds',
            message:
              `Name: "${get('displayName', subscription)}" | ` +
              `ID: "${get('subscriptionId', subscription)}"`
          }),
    subscriptionMessageTitle,
    subscriptions
  );

  const subscriptionMessageWithAllAtEnd = size(eachSubscriptionMessages)
    ? eachSubscriptionMessages.concat(
        flow(map(get('subscriptionId')), compact, join(', '), (subIds) => [
          {
            key: 'subscriptionIds',
            message: '******* All Subscription IDs *******:'
          },
          {
            key: 'subscriptionIds',
            message: subIds
          }
        ])(subscriptions)
      )
    : [];

  return subscriptionMessageWithAllAtEnd;
};

const createErrorMessage = (
  error,
  message = 'Authentication Failed.  Please verify these credentials and their permissions.'
) =>
  error.message.includes('ClientAuthError')
    ? [
        { key: 'clientId', message },
        { key: 'tenantId', message },
        { key: 'clientSecret', message }
      ]
    : error.message.includes('Invalid client secret provided')
    ? {
        key: 'clientSecret',
        message: 'Authentication Failed.  Client Secret is Invalid.'
      }
    : error.message.includes('Application with identifier')
    ? {
        key: 'clientId',
        message: 'Authentication Failed.  Client ID is Invalid.'
      }
    : false;

module.exports = getSubscriptionsListMessage;
