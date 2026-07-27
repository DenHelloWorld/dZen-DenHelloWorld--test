import { combineSlices, configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from './api';

const rootReducer = combineSlices(api);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = EnhancedStore<RootState>;

export const makeStore = (): AppStore => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppDispatch = AppStore['dispatch'];
