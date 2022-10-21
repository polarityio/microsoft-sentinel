const { stubString } = require('lodash');
const { size, get, flow, map, join, split, trim, __, values } = require('lodash/fp');
const { requestWithDefaults } = require('../request');

const getWorkspaceListMessage = async (options) => {
  if (size(options.workspaceNamesAndIds)) return [];

  const subscriptionIds = flow(get(''), split(','), map(trim))(options);

  const workspaceListMessages = await Promise.all(
    map(getWorkspaceMessage(options), subscriptionIds)
  );

  return workspaceListMessages;
};

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/loganalytics/workspaces/list?tabs=HTTP
const getWorkspaceMessage = (options) => async (subscriptionId) => {
  const workspaces = get(
    'body',
    await requestWithDefaults({
      site: 'management',
      route: `subscriptions/${subscriptionId}/providers/Microsoft.OperationalInsights/workspaces?api-version=2021-12-01-preview`,
      options
    })
  );

  const message = flow(
    map(flow(pick(['name', 'properties.customerId']), values, join(': '))),
    join(', '),
    size(workspaces)
      ? concat(`* Required - Available Workspaces for "${subscriptionId}": \n`, __)
      : stubString
  )(workspaces);

  return {
    key: 'workspaceNamesAndIds',
    message
  };
};

module.exports = getWorkspaceListMessage;
