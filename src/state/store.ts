import { configureStore } from '@reduxjs/toolkit';
import  taskReducer  from '../state/task/taskSlice';
import  projectReducer  from '../state/project/projectSlice';

export const store = configureStore({
    reducer: {
        task: taskReducer,
        project: projectReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;