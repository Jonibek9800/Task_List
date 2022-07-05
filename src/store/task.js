import { createSlice } from "@reduxjs/toolkit";
import todosService from "../services/todos.service";
import { setError } from "./errors";

const initialState = {entities: [], isLoading: true };

const taskSlice = createSlice({name: "task", initialState, reducers: {
    recived(state, action) {
        state.entities = action.payload
        state.isLoading = false;
    },
    update(state, action) {
        const elementIndex = state.entities.findIndex(el => el.id === action.payload.id);
        state.entities[elementIndex] = {...state.entities[elementIndex], ...action.payload}
    },
    remove(state, action) {
        state.entities = state.entities.filter(el => el.id !== action.payload.id);
    },
    taskRequested(state) {
        state.isLoading = true;
    },
    taskReaquestFailed(state, action) {
        state.isLoading = false;
    },
    create(state, action) {
        state.entities.push(action.payload)
    },
}})
const {actions, reducer: taskReducer} = taskSlice;
const {update, remove, recived, taskRequested, taskReaquestFailed, create} = actions;

export const loadTasks = () => async (dispatch) => {
    dispatch(taskRequested())
    try {
        const data = await todosService.fetch();
        dispatch(recived(data));
    } catch (error) {
        dispatch(taskReaquestFailed())
        dispatch(setError(error.message))
    }
};

export const completeTask = (id) => (dispatch) => {
    dispatch(update({ id, completed: true}))    
}

export function titleChanged(id) {
    return update({ id, title: `New title for ${id}`})
};
export const taskCreated = (newTask) => async (dispatch) => {
    try {
        const data = await todosService.create(newTask)
        dispatch(create(data))
    } catch (error) {
        dispatch(taskReaquestFailed())
        dispatch(setError(error.message))
    } 
}
export function taskRemove(id) {
    return remove({ id })
};

export const getTasks = () => (state) => state.tasks.entities;
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading;

export default taskReducer;