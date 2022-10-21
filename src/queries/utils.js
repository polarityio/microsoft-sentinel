const m = require('moment');
const { split, flow, get, replace } = require('lodash/fp');

const getIdMetaData = (records) =>
  map((record) => {
    /* NOTE: The id for incidents and indicators etc contains a path with metadata that would 
      be nice for the front end to display. The ids for these currently are in this structure:
      "/subscriptions/{{subscriptionId}}/resourceGroups/{{resourceGroupName}}/providers/Microsoft.OperationalInsights/workspaces/{{workspaceName}}/.../"
    */
    const splitPath = flow(get('id'), split('/'))(record);
    const subscriptionId = get(2, splitPath);
    const resourceGroupName = get(4, splitPath);
    const workspaceName = get(8, splitPath);

    return {
      ...record,
      subscriptionId,
      resourceGroupName,
      workspaceName
    };
  }, records);

const getDaysBackFormattedDate = (daysBack) =>
  (daysBack
    ? m().subtract(daysBack, 'days').format('YYYY-MM-DDTHH:mm:ss.SSS')
    : m().format('YYYY-MM-DDTHH:mm:ss.SSS')) + 'Z';

const escapeQuotes = flow(
  replace(/(\r\n|\n|\r)/gm, ''),
  replace(/"/g, '')
);

module.exports = {
  getIdMetaData,
  getDaysBackFormattedDate,
  escapeQuotes
};
