const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'diobass',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createFeedForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFeedForUser', inputVars);
}
createFeedForUserRef.operationName = 'CreateFeedForUser';
exports.createFeedForUserRef = createFeedForUserRef;

exports.createFeedForUser = function createFeedForUser(dcOrVars, vars) {
  return executeMutation(createFeedForUserRef(dcOrVars, vars));
};

const listFeedsForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFeedsForUser', inputVars);
}
listFeedsForUserRef.operationName = 'ListFeedsForUser';
exports.listFeedsForUserRef = listFeedsForUserRef;

exports.listFeedsForUser = function listFeedsForUser(dcOrVars, vars) {
  return executeQuery(listFeedsForUserRef(dcOrVars, vars));
};

const markArticleAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkArticleAsRead', inputVars);
}
markArticleAsReadRef.operationName = 'MarkArticleAsRead';
exports.markArticleAsReadRef = markArticleAsReadRef;

exports.markArticleAsRead = function markArticleAsRead(dcOrVars, vars) {
  return executeMutation(markArticleAsReadRef(dcOrVars, vars));
};

const listFavoriteArticlesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFavoriteArticlesForUser', inputVars);
}
listFavoriteArticlesForUserRef.operationName = 'ListFavoriteArticlesForUser';
exports.listFavoriteArticlesForUserRef = listFavoriteArticlesForUserRef;

exports.listFavoriteArticlesForUser = function listFavoriteArticlesForUser(dcOrVars, vars) {
  return executeQuery(listFavoriteArticlesForUserRef(dcOrVars, vars));
};
