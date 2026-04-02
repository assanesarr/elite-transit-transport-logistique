import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'diobass',
  location: 'us-east4'
};

export const createFeedForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFeedForUser', inputVars);
}
createFeedForUserRef.operationName = 'CreateFeedForUser';

export function createFeedForUser(dcOrVars, vars) {
  return executeMutation(createFeedForUserRef(dcOrVars, vars));
}

export const listFeedsForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFeedsForUser', inputVars);
}
listFeedsForUserRef.operationName = 'ListFeedsForUser';

export function listFeedsForUser(dcOrVars, vars) {
  return executeQuery(listFeedsForUserRef(dcOrVars, vars));
}

export const markArticleAsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkArticleAsRead', inputVars);
}
markArticleAsReadRef.operationName = 'MarkArticleAsRead';

export function markArticleAsRead(dcOrVars, vars) {
  return executeMutation(markArticleAsReadRef(dcOrVars, vars));
}

export const listFavoriteArticlesForUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFavoriteArticlesForUser', inputVars);
}
listFavoriteArticlesForUserRef.operationName = 'ListFavoriteArticlesForUser';

export function listFavoriteArticlesForUser(dcOrVars, vars) {
  return executeQuery(listFavoriteArticlesForUserRef(dcOrVars, vars));
}

