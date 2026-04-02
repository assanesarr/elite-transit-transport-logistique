const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'diobass',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function createFeedForUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateFeedForUser', inputVars, inputOpts);
}
exports.createFeedForUser = createFeedForUser;

function listFeedsForUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListFeedsForUser', inputVars, inputOpts);
}
exports.listFeedsForUser = listFeedsForUser;

function markArticleAsRead(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('MarkArticleAsRead', inputVars, inputOpts);
}
exports.markArticleAsRead = markArticleAsRead;

function listFavoriteArticlesForUser(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListFavoriteArticlesForUser', inputVars, inputOpts);
}
exports.listFavoriteArticlesForUser = listFavoriteArticlesForUser;

