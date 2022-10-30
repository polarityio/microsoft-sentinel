const {
  size,
  get,
  flow,
  map,
  join,
  split,
  trim,
  values,
  pick,
  flatten,
  concat,
  __,
  pickBy
} = require('lodash/fp');
const { requestWithDefaults } = require('../request');

const getWorkspaceListMessage = async (options) => {
  if (size(options.workspaceNamesAndIds)) return [];

  const subscriptionIds = flow(get('subscriptionIds'), split(','), map(trim))(options);

  const workspaceListMessages = await Promise.all(
    map(getWorkspaceMessage(options), subscriptionIds)
  );

  const allWorkspaces = flow(map(get('names')), join(', '), (allWorkspacesNames) => [
    {
      key: 'workspaceNamesAndIds',
      message: `******** All Workspaces ********:`
    },
    {
      key: 'workspaceNamesAndIds',
      message: allWorkspacesNames
    }
  ])(workspaceListMessages);
  
  return flow(
    map(get('messages')),
    concat({ key: 'workspaceNamesAndIds', message: '* Required ->' }),
    flatten,
    concat(__, allWorkspaces)
  )(workspaceListMessages);
};

// Request Documentation: https://learn.microsoft.com/en-us/rest/api/loganalytics/workspaces/list?tabs=HTTP
const getWorkspaceMessage = (options) => async (subscriptionId) => {
  const workspaces = get(
    'body.value',
    await requestWithDefaults({
      site: 'management',
      route: `subscriptions/${subscriptionId}/providers/Microsoft.OperationalInsights/workspaces?api-version=2021-12-01-preview`,
      options
    })
  );

  const names = flow(
    map(
      flow(
        (workspace) => [get('name', workspace), get('properties.customerId', workspace)],
        values,
        join(': ')
      )
    ),
    join(', ')
  )(workspaces);

  const messages = size(workspaces)
    ? [
        {
          key: 'workspaceNamesAndIds',
          message: `*** Subscription "${subscriptionId}" Workspaces ***:`
        },
        {
          key: 'workspaceNamesAndIds',
          message: names
        }
      ]
    : [];

  return { messages, names };
};

module.exports = getWorkspaceListMessage;
