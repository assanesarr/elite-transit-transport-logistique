import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface Article_Key {
  id: UUIDString;
  __typename?: 'Article_Key';
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateFeedForUserData {
  feed_insert: Feed_Key;
}

export interface CreateFeedForUserVariables {
  userId: UUIDString;
  name: string;
  url: string;
  description?: string | null;
}

export interface FavoriteArticle_Key {
  userId: UUIDString;
  articleId: UUIDString;
  __typename?: 'FavoriteArticle_Key';
}

export interface FeedCategory_Key {
  feedId: UUIDString;
  categoryId: UUIDString;
  __typename?: 'FeedCategory_Key';
}

export interface Feed_Key {
  id: UUIDString;
  __typename?: 'Feed_Key';
}

export interface ListFavoriteArticlesForUserData {
  favoriteArticles: ({
    article: {
      id: UUIDString;
      title: string;
      url: string;
      author?: string | null;
      imageUrl?: string | null;
      publishedAt: TimestampString;
    } & Article_Key;
      favoritedAt: TimestampString;
  })[];
}

export interface ListFavoriteArticlesForUserVariables {
  userId: UUIDString;
}

export interface ListFeedsForUserData {
  feeds: ({
    id: UUIDString;
    name: string;
    url: string;
    description?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Feed_Key)[];
}

export interface ListFeedsForUserVariables {
  userId: UUIDString;
}

export interface MarkArticleAsReadData {
  readArticle_upsert: ReadArticle_Key;
}

export interface MarkArticleAsReadVariables {
  userId: UUIDString;
  articleId: UUIDString;
}

export interface ReadArticle_Key {
  userId: UUIDString;
  articleId: UUIDString;
  __typename?: 'ReadArticle_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'CreateFeedForUser' Mutation. Allow users to execute without passing in DataConnect. */
export function createFeedForUser(dc: DataConnect, vars: CreateFeedForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateFeedForUserData>>;
/** Generated Node Admin SDK operation action function for the 'CreateFeedForUser' Mutation. Allow users to pass in custom DataConnect instances. */
export function createFeedForUser(vars: CreateFeedForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateFeedForUserData>>;

/** Generated Node Admin SDK operation action function for the 'ListFeedsForUser' Query. Allow users to execute without passing in DataConnect. */
export function listFeedsForUser(dc: DataConnect, vars: ListFeedsForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListFeedsForUserData>>;
/** Generated Node Admin SDK operation action function for the 'ListFeedsForUser' Query. Allow users to pass in custom DataConnect instances. */
export function listFeedsForUser(vars: ListFeedsForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListFeedsForUserData>>;

/** Generated Node Admin SDK operation action function for the 'MarkArticleAsRead' Mutation. Allow users to execute without passing in DataConnect. */
export function markArticleAsRead(dc: DataConnect, vars: MarkArticleAsReadVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MarkArticleAsReadData>>;
/** Generated Node Admin SDK operation action function for the 'MarkArticleAsRead' Mutation. Allow users to pass in custom DataConnect instances. */
export function markArticleAsRead(vars: MarkArticleAsReadVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<MarkArticleAsReadData>>;

/** Generated Node Admin SDK operation action function for the 'ListFavoriteArticlesForUser' Query. Allow users to execute without passing in DataConnect. */
export function listFavoriteArticlesForUser(dc: DataConnect, vars: ListFavoriteArticlesForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListFavoriteArticlesForUserData>>;
/** Generated Node Admin SDK operation action function for the 'ListFavoriteArticlesForUser' Query. Allow users to pass in custom DataConnect instances. */
export function listFavoriteArticlesForUser(vars: ListFavoriteArticlesForUserVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListFavoriteArticlesForUserData>>;

