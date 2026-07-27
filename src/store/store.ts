import { combineSlices, configureStore, type EnhancedStore } from '@reduxjs/toolkit';

const rootReducer = combineSlices();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = EnhancedStore<RootState>;

export const makeStore = (): AppStore => configureStore({ reducer: rootReducer });

export type AppDispatch = AppStore['dispatch'];
