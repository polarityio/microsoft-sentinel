const { keys, values } = require('lodash/fp');
const { allCombinations } = require('../dataTransformations');
const {
  splitCommaSeparatedUserOption,
  splitKeyValueCommaSeparatedUserOption
} = require('./utils');

const parseUserOptionLists = (options) => {
  const parsedSubscriptionIds = splitCommaSeparatedUserOption('subscriptionIds', options);

  const parsedResourceGroupNames = splitCommaSeparatedUserOption(
    'resourceGroupNames',
    options
  );
  
  const parsedKustoQueryIgnoreFields = splitCommaSeparatedUserOption(
    'kustoQueryIgnoreFields',
    options
  );

  const parsedKustoQuerySummaryFields = splitCommaSeparatedUserOption(
    'kustoQuerySummaryFields',
    options
  );

  const parsedWorkspaceNamesAndIds = splitKeyValueCommaSeparatedUserOption(
    'workspaceNamesAndIds',
    options
  );

  const allSubscriptionAndResourceCombinations = allCombinations(
    ['subscriptionId', 'resourceGroupName'],
    [parsedSubscriptionIds, parsedResourceGroupNames]
  );

  const allSubscriptionResourceAndWorkspaceCombinations = allCombinations(
    ['subscriptionId', 'resourceGroupName', 'workspaceName'],
    [parsedSubscriptionIds, parsedResourceGroupNames, keys(parsedWorkspaceNamesAndIds)]
  );

  const updatedOptions = {
    ...options,
    parsedSubscriptionIds,
    parsedResourceGroupNames,
    parsedWorkspaceNamesAndIds,
    parsedKustoQueryIgnoreFields,
    parsedKustoQuerySummaryFields,
    workspaceIds: values(parsedWorkspaceNamesAndIds),
    allSubscriptionAndResourceCombinations,
    allSubscriptionResourceAndWorkspaceCombinations
  };

  return updatedOptions;
};

module.exports = parseUserOptionLists;
