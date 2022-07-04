import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {
    completeTask,
    titleChanged,
    taskRemove,
    loadTasks,
    getTasks,
    getTasksLoadingStatus,
    taskCreated
} from './store/task';
import configureStore from './store/store';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { getError } from './store/errors';

const store = configureStore()

const App = () => {
  const state = useSelector(getTasks());
  const error = useSelector(getError());
  const isLoading = useSelector(getTasksLoadingStatus())
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTasks())
  }, [])
const changeTitle = (taskId) => {
    dispatch(titleChanged(taskId));
  }
  const handleDelete = (id) => {
    dispatch(taskRemove(id))
  }
  const createTask = () => {
    dispatch(taskCreated())
  }

if (isLoading) {
    return <h1>Loading...</h1>
} 
if (error) {
  return <p>{error}</p>
}
return (<>
    <h1>App</h1>
    <button onClick={createTask}>добавить задачу</button>
    <ul>
        {state.map(s => <li key={s.id}>
            <p>{s.title}</p>
            <p>{`Completed ${s.completed}`}</p>
            <button onClick={() => dispatch(completeTask(s.id))}>Completed</button>
            <button onClick={() => changeTitle(s.id)}>ChangeTitle</button>
            <button onClick={() => handleDelete(s.id)}>Delete</button>
            <hr />
          </li>)}
    </ul>
    </>
  )  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
