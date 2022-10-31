const { keys, values } = require('lodash/fp');
const { allCombinations } = require('../dataTransformations');
const {
  splitCommaSeparatedUserOption,
  splitCommaSeparatedUserOptionThenFirst,
  splitKeyValueCommaSeparatedUserOptionThenFirst
} = require('./utils');

const parseUserOptionLists = (options) => {
  const parsedSubscriptionIds = splitCommaSeparatedUserOptionThenFirst(
    'subscriptionIds',
    options
  );

  const parsedResourceGroupNames = splitCommaSeparatedUserOptionThenFirst(
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

  const parsedWorkspaceNamesAndIds = splitKeyValueCommaSeparatedUserOptionThenFirst(
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
