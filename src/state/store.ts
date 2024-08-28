import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../state/task/taskSlice';
import projectReducer from '../state/project/projectSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Create persisted reducers
const persistedTaskReducer = persistReducer(persistConfig, taskReducer);
const persistedProjectReducer = persistReducer(persistConfig, projectReducer);

export const store = configureStore({
    reducer: {
        task: persistedTaskReducer,
        project: persistedProjectReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
