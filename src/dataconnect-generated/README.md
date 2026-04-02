# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListFeedsForUser*](#listfeedsforuser)
  - [*ListFavoriteArticlesForUser*](#listfavoritearticlesforuser)
- [**Mutations**](#mutations)
  - [*CreateFeedForUser*](#createfeedforuser)
  - [*MarkArticleAsRead*](#markarticleasread)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListFeedsForUser
You can execute the `ListFeedsForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFeedsForUser(vars: ListFeedsForUserVariables): QueryPromise<ListFeedsForUserData, ListFeedsForUserVariables>;

interface ListFeedsForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFeedsForUserVariables): QueryRef<ListFeedsForUserData, ListFeedsForUserVariables>;
}
export const listFeedsForUserRef: ListFeedsForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFeedsForUser(dc: DataConnect, vars: ListFeedsForUserVariables): QueryPromise<ListFeedsForUserData, ListFeedsForUserVariables>;

interface ListFeedsForUserRef {
  ...
  (dc: DataConnect, vars: ListFeedsForUserVariables): QueryRef<ListFeedsForUserData, ListFeedsForUserVariables>;
}
export const listFeedsForUserRef: ListFeedsForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFeedsForUserRef:
```typescript
const name = listFeedsForUserRef.operationName;
console.log(name);
```

### Variables
The `ListFeedsForUser` query requires an argument of type `ListFeedsForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFeedsForUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListFeedsForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFeedsForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListFeedsForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFeedsForUser, ListFeedsForUserVariables } from '@dataconnect/generated';

// The `ListFeedsForUser` query requires an argument of type `ListFeedsForUserVariables`:
const listFeedsForUserVars: ListFeedsForUserVariables = {
  userId: ..., 
};

// Call the `listFeedsForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFeedsForUser(listFeedsForUserVars);
// Variables can be defined inline as well.
const { data } = await listFeedsForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFeedsForUser(dataConnect, listFeedsForUserVars);

console.log(data.feeds);

// Or, you can use the `Promise` API.
listFeedsForUser(listFeedsForUserVars).then((response) => {
  const data = response.data;
  console.log(data.feeds);
});
```

### Using `ListFeedsForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFeedsForUserRef, ListFeedsForUserVariables } from '@dataconnect/generated';

// The `ListFeedsForUser` query requires an argument of type `ListFeedsForUserVariables`:
const listFeedsForUserVars: ListFeedsForUserVariables = {
  userId: ..., 
};

// Call the `listFeedsForUserRef()` function to get a reference to the query.
const ref = listFeedsForUserRef(listFeedsForUserVars);
// Variables can be defined inline as well.
const ref = listFeedsForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFeedsForUserRef(dataConnect, listFeedsForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.feeds);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.feeds);
});
```

## ListFavoriteArticlesForUser
You can execute the `ListFavoriteArticlesForUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFavoriteArticlesForUser(vars: ListFavoriteArticlesForUserVariables): QueryPromise<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;

interface ListFavoriteArticlesForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFavoriteArticlesForUserVariables): QueryRef<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
}
export const listFavoriteArticlesForUserRef: ListFavoriteArticlesForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFavoriteArticlesForUser(dc: DataConnect, vars: ListFavoriteArticlesForUserVariables): QueryPromise<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;

interface ListFavoriteArticlesForUserRef {
  ...
  (dc: DataConnect, vars: ListFavoriteArticlesForUserVariables): QueryRef<ListFavoriteArticlesForUserData, ListFavoriteArticlesForUserVariables>;
}
export const listFavoriteArticlesForUserRef: ListFavoriteArticlesForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFavoriteArticlesForUserRef:
```typescript
const name = listFavoriteArticlesForUserRef.operationName;
console.log(name);
```

### Variables
The `ListFavoriteArticlesForUser` query requires an argument of type `ListFavoriteArticlesForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFavoriteArticlesForUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListFavoriteArticlesForUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFavoriteArticlesForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListFavoriteArticlesForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFavoriteArticlesForUser, ListFavoriteArticlesForUserVariables } from '@dataconnect/generated';

// The `ListFavoriteArticlesForUser` query requires an argument of type `ListFavoriteArticlesForUserVariables`:
const listFavoriteArticlesForUserVars: ListFavoriteArticlesForUserVariables = {
  userId: ..., 
};

// Call the `listFavoriteArticlesForUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFavoriteArticlesForUser(listFavoriteArticlesForUserVars);
// Variables can be defined inline as well.
const { data } = await listFavoriteArticlesForUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFavoriteArticlesForUser(dataConnect, listFavoriteArticlesForUserVars);

console.log(data.favoriteArticles);

// Or, you can use the `Promise` API.
listFavoriteArticlesForUser(listFavoriteArticlesForUserVars).then((response) => {
  const data = response.data;
  console.log(data.favoriteArticles);
});
```

### Using `ListFavoriteArticlesForUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFavoriteArticlesForUserRef, ListFavoriteArticlesForUserVariables } from '@dataconnect/generated';

// The `ListFavoriteArticlesForUser` query requires an argument of type `ListFavoriteArticlesForUserVariables`:
const listFavoriteArticlesForUserVars: ListFavoriteArticlesForUserVariables = {
  userId: ..., 
};

// Call the `listFavoriteArticlesForUserRef()` function to get a reference to the query.
const ref = listFavoriteArticlesForUserRef(listFavoriteArticlesForUserVars);
// Variables can be defined inline as well.
const ref = listFavoriteArticlesForUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFavoriteArticlesForUserRef(dataConnect, listFavoriteArticlesForUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.favoriteArticles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.favoriteArticles);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateFeedForUser
You can execute the `CreateFeedForUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFeedForUser(vars: CreateFeedForUserVariables): MutationPromise<CreateFeedForUserData, CreateFeedForUserVariables>;

interface CreateFeedForUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFeedForUserVariables): MutationRef<CreateFeedForUserData, CreateFeedForUserVariables>;
}
export const createFeedForUserRef: CreateFeedForUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFeedForUser(dc: DataConnect, vars: CreateFeedForUserVariables): MutationPromise<CreateFeedForUserData, CreateFeedForUserVariables>;

interface CreateFeedForUserRef {
  ...
  (dc: DataConnect, vars: CreateFeedForUserVariables): MutationRef<CreateFeedForUserData, CreateFeedForUserVariables>;
}
export const createFeedForUserRef: CreateFeedForUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFeedForUserRef:
```typescript
const name = createFeedForUserRef.operationName;
console.log(name);
```

### Variables
The `CreateFeedForUser` mutation requires an argument of type `CreateFeedForUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFeedForUserVariables {
  userId: UUIDString;
  name: string;
  url: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateFeedForUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFeedForUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFeedForUserData {
  feed_insert: Feed_Key;
}
```
### Using `CreateFeedForUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFeedForUser, CreateFeedForUserVariables } from '@dataconnect/generated';

// The `CreateFeedForUser` mutation requires an argument of type `CreateFeedForUserVariables`:
const createFeedForUserVars: CreateFeedForUserVariables = {
  userId: ..., 
  name: ..., 
  url: ..., 
  description: ..., // optional
};

// Call the `createFeedForUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFeedForUser(createFeedForUserVars);
// Variables can be defined inline as well.
const { data } = await createFeedForUser({ userId: ..., name: ..., url: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFeedForUser(dataConnect, createFeedForUserVars);

console.log(data.feed_insert);

// Or, you can use the `Promise` API.
createFeedForUser(createFeedForUserVars).then((response) => {
  const data = response.data;
  console.log(data.feed_insert);
});
```

### Using `CreateFeedForUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFeedForUserRef, CreateFeedForUserVariables } from '@dataconnect/generated';

// The `CreateFeedForUser` mutation requires an argument of type `CreateFeedForUserVariables`:
const createFeedForUserVars: CreateFeedForUserVariables = {
  userId: ..., 
  name: ..., 
  url: ..., 
  description: ..., // optional
};

// Call the `createFeedForUserRef()` function to get a reference to the mutation.
const ref = createFeedForUserRef(createFeedForUserVars);
// Variables can be defined inline as well.
const ref = createFeedForUserRef({ userId: ..., name: ..., url: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFeedForUserRef(dataConnect, createFeedForUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.feed_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.feed_insert);
});
```

## MarkArticleAsRead
You can execute the `MarkArticleAsRead` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
markArticleAsRead(vars: MarkArticleAsReadVariables): MutationPromise<MarkArticleAsReadData, MarkArticleAsReadVariables>;

interface MarkArticleAsReadRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkArticleAsReadVariables): MutationRef<MarkArticleAsReadData, MarkArticleAsReadVariables>;
}
export const markArticleAsReadRef: MarkArticleAsReadRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markArticleAsRead(dc: DataConnect, vars: MarkArticleAsReadVariables): MutationPromise<MarkArticleAsReadData, MarkArticleAsReadVariables>;

interface MarkArticleAsReadRef {
  ...
  (dc: DataConnect, vars: MarkArticleAsReadVariables): MutationRef<MarkArticleAsReadData, MarkArticleAsReadVariables>;
}
export const markArticleAsReadRef: MarkArticleAsReadRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markArticleAsReadRef:
```typescript
const name = markArticleAsReadRef.operationName;
console.log(name);
```

### Variables
The `MarkArticleAsRead` mutation requires an argument of type `MarkArticleAsReadVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkArticleAsReadVariables {
  userId: UUIDString;
  articleId: UUIDString;
}
```
### Return Type
Recall that executing the `MarkArticleAsRead` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkArticleAsReadData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkArticleAsReadData {
  readArticle_upsert: ReadArticle_Key;
}
```
### Using `MarkArticleAsRead`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markArticleAsRead, MarkArticleAsReadVariables } from '@dataconnect/generated';

// The `MarkArticleAsRead` mutation requires an argument of type `MarkArticleAsReadVariables`:
const markArticleAsReadVars: MarkArticleAsReadVariables = {
  userId: ..., 
  articleId: ..., 
};

// Call the `markArticleAsRead()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markArticleAsRead(markArticleAsReadVars);
// Variables can be defined inline as well.
const { data } = await markArticleAsRead({ userId: ..., articleId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markArticleAsRead(dataConnect, markArticleAsReadVars);

console.log(data.readArticle_upsert);

// Or, you can use the `Promise` API.
markArticleAsRead(markArticleAsReadVars).then((response) => {
  const data = response.data;
  console.log(data.readArticle_upsert);
});
```

### Using `MarkArticleAsRead`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markArticleAsReadRef, MarkArticleAsReadVariables } from '@dataconnect/generated';

// The `MarkArticleAsRead` mutation requires an argument of type `MarkArticleAsReadVariables`:
const markArticleAsReadVars: MarkArticleAsReadVariables = {
  userId: ..., 
  articleId: ..., 
};

// Call the `markArticleAsReadRef()` function to get a reference to the mutation.
const ref = markArticleAsReadRef(markArticleAsReadVars);
// Variables can be defined inline as well.
const ref = markArticleAsReadRef({ userId: ..., articleId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markArticleAsReadRef(dataConnect, markArticleAsReadVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.readArticle_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.readArticle_upsert);
});
```

