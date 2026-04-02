# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateFeedForUser, useListFeedsForUser, useMarkArticleAsRead, useListFavoriteArticlesForUser } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateFeedForUser(createFeedForUserVars);

const { data, isPending, isSuccess, isError, error } = useListFeedsForUser(listFeedsForUserVars);

const { data, isPending, isSuccess, isError, error } = useMarkArticleAsRead(markArticleAsReadVars);

const { data, isPending, isSuccess, isError, error } = useListFavoriteArticlesForUser(listFavoriteArticlesForUserVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createFeedForUser, listFeedsForUser, markArticleAsRead, listFavoriteArticlesForUser } from '@dataconnect/generated';


// Operation CreateFeedForUser:  For variables, look at type CreateFeedForUserVars in ../index.d.ts
const { data } = await CreateFeedForUser(dataConnect, createFeedForUserVars);

// Operation ListFeedsForUser:  For variables, look at type ListFeedsForUserVars in ../index.d.ts
const { data } = await ListFeedsForUser(dataConnect, listFeedsForUserVars);

// Operation MarkArticleAsRead:  For variables, look at type MarkArticleAsReadVars in ../index.d.ts
const { data } = await MarkArticleAsRead(dataConnect, markArticleAsReadVars);

// Operation ListFavoriteArticlesForUser:  For variables, look at type ListFavoriteArticlesForUserVars in ../index.d.ts
const { data } = await ListFavoriteArticlesForUser(dataConnect, listFavoriteArticlesForUserVars);


```