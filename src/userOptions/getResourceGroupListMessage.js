const {
  size,
  get,
  flow,
  map,
  join,
  split,
  trim,
  flatten,
  concat,
  __
} = require('lodash/fp');
const { requestWithDefaults } = require('../request');

const getResourceGroupListMessage = async (options) => {
  if (size(options.resourceGroupNames)) return [];

  const subscriptionIds = flow(get('subscriptionIds'), split(','), map(trim))(options);
  const { Logger } = require('../../integration.js');
  const resourceGroupNamesMessages = await Promise.all(
    map(getResourceGroupNameMessage(options), subscriptionIds)
  );

  const allResourceGroupNames = flow(
    map(get('names')),
    join(', '),
    (allResourceGroupNames) => [
      {
        key: 'resourceGroupNames',
        message: `******** All Resource Groups ********:`
      },
      {
        key: 'resourceGroupNames',
        message: allResourceGroupNames
      }
    ]
  )(resourceGroupNamesMessages);

  return flow(
    map(get('messages')),
    concat({ key: 'resourceGroupNames', message: '* Required ->' }),
    flatten,
    concat(__, allResourceGroupNames)
  )(resourceGroupNamesMessages);
};

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/resources/resource-groups/list#code-try-0
const getResourceGroupNameMessage = (options) => async (subscriptionId) => {
  const resourceGroups = get(
    'body.value',
    await requestWithDefaults({
      site: 'management',
      route: `subscriptions/${subscriptionId}/resourcegroups?api-version=2021-04-01`,
      options
    })
  );

  const names = flow(map(get('name')), join(', '))(resourceGroups);

  const messages = [
    {
      key: 'resourceGroupNames',
      message: `*** Subscription "${subscriptionId}" Groups ***:`
    },
    {
      key: 'resourceGroupNames',
      message: names
    }
  ];

  return { messages, names };
};

module.exports = getResourceGroupListMessage;
