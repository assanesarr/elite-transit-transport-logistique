import { CreateFeedForUserData, CreateFeedForUserVariables, ListFeedsForUserData, ListFeedsForUserVariables, MarkArticleAsReadData, MarkArticleAsReadVariables, ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateFeedForUser(options?: useDataConnectMutationOptions<CreateFeedForUserData, FirebaseError, CreateFeedForUserVariables>): UseDataConnectMutationResult<CreateFeedForUserData, CreateFeedForUserVariables>;
export function useCreateFeedForUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFeedForUserData, FirebaseError, CreateFeedForUserVariables>): UseDataConnectMutationResult<CreateFeedForUserData, CreateFeedForUserVariables>;

export function useListFeedsForUser(vars: ListFeedsForUserVariables, options?: useDataConnectQueryOptions<ListFeedsForUserData>): UseDataConnectQueryResult<ListFeedsForUserData, ListFeedsForUserVariables>;
export function useListFeedsForUser(dc: DataConnect, vars: ListFeedsForUserVariables, options?: useDataConnectQueryOptions<ListFeedsForUserData>): UseDataConnectQueryResult<ListFeedsForUserData, ListFeedsForUserVariables>;

export function useMarkArticleAsRead(options?: useDataConnectMutationOptions<MarkArticleAsReadData, FirebaseError, MarkArticleAsReadVariables>): UseDataConnectMutationResult<MarkArticleAsReadData, MarkArticleAsReadVariables>;
export function useMarkArticleAsRead(dc: DataConnect, options?: useDataConnectMutationOptions<MarkArticleAsReadData, FirebaseError, MarkArticleAsReadVariables>): UseDataConnectMutationResult<MarkArticleAsReadData, MarkArticleAsReadVariables>;

export function useListFavoriteArticlesForUser(vars: ListFavoriteArticlesForUserVariables, options?: useDataConnectQueryOptions<ListFavoriteArticlesForUserData>): UseDataConnectQueryResult<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
export function useListFavoriteArticlesForUser(dc: DataConnect, vars: ListFavoriteArticlesForUserVariables, options?: useDataConnectQueryOptions<ListFavoriteArticlesForUserData>): UseDataConnectQueryResult<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
