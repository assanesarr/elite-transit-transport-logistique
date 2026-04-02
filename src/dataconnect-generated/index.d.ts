import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface CreateFeedForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFeedForUserVariables): MutationRef<CreateFeedForUserData, CreateFeedForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFeedForUserVariables): MutationRef<CreateFeedForUserData, CreateFeedForUserVariables>;
  operationName: string;
}
export const createFeedForUserRef: CreateFeedForUserRef;

export function createFeedForUser(vars: CreateFeedForUserVariables): MutationPromise<CreateFeedForUserData, CreateFeedForUserVariables>;
export function createFeedForUser(dc: DataConnect, vars: CreateFeedForUserVariables): MutationPromise<CreateFeedForUserData, CreateFeedForUserVariables>;

interface ListFeedsForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFeedsForUserVariables): QueryRef<ListFeedsForUserData, ListFeedsForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFeedsForUserVariables): QueryRef<ListFeedsForUserData, ListFeedsForUserVariables>;
  operationName: string;
}
export const listFeedsForUserRef: ListFeedsForUserRef;

export function listFeedsForUser(vars: ListFeedsForUserVariables): QueryPromise<ListFeedsForUserData, ListFeedsForUserVariables>;
export function listFeedsForUser(dc: DataConnect, vars: ListFeedsForUserVariables): QueryPromise<ListFeedsForUserData, ListFeedsForUserVariables>;

interface MarkArticleAsReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkArticleAsReadVariables): MutationRef<MarkArticleAsReadData, MarkArticleAsReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkArticleAsReadVariables): MutationRef<MarkArticleAsReadData, MarkArticleAsReadVariables>;
  operationName: string;
}
export const markArticleAsReadRef: MarkArticleAsReadRef;

export function markArticleAsRead(vars: MarkArticleAsReadVariables): MutationPromise<MarkArticleAsReadData, MarkArticleAsReadVariables>;
export function markArticleAsRead(dc: DataConnect, vars: MarkArticleAsReadVariables): MutationPromise<MarkArticleAsReadData, MarkArticleAsReadVariables>;

interface ListFavoriteArticlesForUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFavoriteArticlesForUserVariables): QueryRef<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFavoriteArticlesForUserVariables): QueryRef<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
  operationName: string;
}
export const listFavoriteArticlesForUserRef: ListFavoriteArticlesForUserRef;

export function listFavoriteArticlesForUser(vars: ListFavoriteArticlesForUserVariables): QueryPromise<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
export function listFavoriteArticlesForUser(dc: DataConnect, vars: ListFavoriteArticlesForUserVariables): QueryPromise<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;

