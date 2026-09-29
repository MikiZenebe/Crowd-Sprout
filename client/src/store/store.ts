import { configureStore } from '@reduxjs/toolkit';
import { etherscanApi } from '../utils/api';

export const store = configureStore({
  reducer: {
    [etherscanApi.reducerPath]: etherscanApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(etherscanApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
