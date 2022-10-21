const { size, get, flow, map, join, split, trim, __ } = require('lodash/fp');
const { requestWithDefaults } = require('../request');

const getResourceGroupListMessage = async (options) => {
  if (size(options.resourceGroupNames)) return [];

  const subscriptionIds = flow(get(''), split(','), map(trim))(options);

  const resourceGroupNamesMessages = await Promise.all(
    map(getResourceGroupNameMessage(options), subscriptionIds)
  );

  return resourceGroupNamesMessages;
};

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/resources/resource-groups/list#code-try-0
const getResourceGroupNameMessage = (options) => async (subscriptionId) => {
  const resourceGroups = get(
    'body',
    await requestWithDefaults({
      site: 'management',
      route: `subscriptions/${subscriptionId}/resourcegroups?api-version=2021-04-01`,
      options
    })
  );

  const message = flow(
    map(get('name')),
    join(', '),
    concat(`* Required - Available Resource Group Names for "${subscriptionId}": \n`, __)
  )(resourceGroups);

  return {
    key: 'resourceGroupNames',
    message
  };
};

module.exports = getResourceGroupListMessage;
