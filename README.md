# Redux Thunk

Thunk [middleware](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware) for Redux. It allows writing functions with logic inside that can interact with a Redux store's `dispatch` and `getState` methods.

For complete usage instructions and useful patterns, see the [Redux docs **Writing Logic with Thunks** page](https://redux.js.org/usage/writing-logic-thunks).

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/reduxjs/redux-thunk/test.yml?branch=master)
[![npm version](https://img.shields.io/npm/v/redux-thunk.svg?style=flat-square)](https://www.npmjs.com/package/redux-thunk)
[![npm downloads](https://img.shields.io/npm/dm/redux-thunk.svg?style=flat-square)](https://www.npmjs.com/package/redux-thunk)

## Installation and Setup

### Redux Toolkit

If you're using [our official Redux Toolkit package](https://redux-toolkit.js.org) as recommended, there's nothing to install - RTK's `configureStore` API already adds the thunk middleware by default:

```js
import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
    reducer: {
        tasksKey:taskReducer
    }
})

// The thunk middleware was automatically added
```

### Manual Setup

If you're using the basic Redux `createStore` API and need to set this up manually, first add the `redux-thunk` package:

```sh
npm install redux-thunk

yarn add redux-thunk
``

## Why Do I Need This?

With a plain basic Redux store, you can only do simple synchronous updates by
dispatching an action. Middleware extends the store's abilities, and lets you
write async logic that interacts with the store.

Thunks are the recommended middleware for basic Redux side effects logic,
including complex synchronous logic that needs access to the store, and simple
async logic like AJAX requests.

For more details on why thunks are useful, see:

- **Redux docs: Writing Logic with Thunks**  
  https://redux.js.org/usage/writing-logic-thunks  
  The official usage guide page on thunks. Covers why they exist, how the thunk middleware works, and useful patterns for using thunks.

- **Stack Overflow: Dispatching Redux Actions with a Timeout**  
  http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559  
  Dan Abramov explains the basics of managing async behavior in Redux, walking
  through a progressive series of approaches (inline async calls, async action
  creators, thunk middleware).

- **Stack Overflow: Why do we need middleware for async flow in Redux?**  
  http://stackoverflow.com/questions/34570758/why-do-we-need-middleware-for-async-flow-in-redux/34599594#34599594  
  Dan Abramov gives reasons for using thunks and async middleware, and some
  useful patterns for using thunks.

- **What the heck is a "thunk"?**  
  https://daveceddia.com/what-is-a-thunk/  
  A quick explanation for what the word "thunk" means in general, and for Redux
  specifically.

- **Thunks in Redux: The Basics**  
  https://medium.com/fullstack-academy/thunks-in-redux-the-basics-85e538a3fe60  
  A detailed look at what thunks are, what they solve, and how to use them.

You may also want to read the
**[Redux FAQ entry on choosing which async middleware to use](https://redux.js.org/faq/actions#what-async-middleware-should-i-use-how-do-you-decide-between-thunks-sagas-observables-or-something-else)**.

While the thunk middleware is not directly included with the Redux core library,
it is used by default in our
**[`@reduxjs/toolkit` package](https://github.com/reduxjs/redux-toolkit)**.

## Motivation

Redux Thunk [middleware](https://redux.js.org/tutorials/fundamentals/part-4-store#middleware)
allows you to write action creators that return a function instead of an action.
The thunk can be used to delay the dispatch of an action, or to dispatch only if
a certain condition is met. The inner function receives the store methods
`dispatch` and `getState` as parameters.

An action creator that returns a function to perform asynchronous dispatch:

```js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    taskList:[],
    selectedTask:{},
    isLoading:false,
    error:''
}

const BASE_URL = 'http://localhost:8002/tasks';

//GET
export const getTasksFromServer = createAsyncThunk(
    "tasks/getTasksFromServer",
    async (_,{rejectWithValue}) => {
        const response = await fetch(BASE_URL)
        if(response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse;
        } else {
            return rejectWithValue({error:'No Tasks Found'})
        }
    }
)

//POST
export const addTasksToServer = createAsyncThunk(
    "tasks/addTasksToServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:'POST',
            body: JSON.stringify(task),
            headers: {
               "Content-type":"application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL,options)
        if(response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse;
        } else {
            return rejectWithValue({error:'Task Not Added'})
        }
    }
)

//PATCH
export const updateTaskInServer = createAsyncThunk(
    "tasks/updateTaskInServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:'PATCH',
            body: JSON.stringify(task),
            headers: {
               "Content-type":"application/json; charset=UTF-8"
            }
        }
        const response = await fetch(BASE_URL + '/' + task.id,options)
        if(response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse;
        } else {
            return rejectWithValue({error:'Task Not Updated'})
        }
    }
)

//DELETE
export const deleteTaskFromServer = createAsyncThunk(
    "tasks/deleteTaskFromServer",
    async (task,{rejectWithValue}) => {
        const options = {
            method:'DELETE',
        }
        const response = await fetch(BASE_URL + '/' + task.id,options)
        if(response.ok) {
            const jsonResponse = await response.json()
            return jsonResponse;
        } else {
            return rejectWithValue({error:'Task Not Deleted'})
        }
    }
)
 
const taskSlice = createSlice({
    name:'taskSlice',
    initialState,
    reducers: {
        // addTaskToList:(state,action) => {
        //     const id = parseInt(Math.random() * 100);
        //     let task = {...action.payload,id}
        //     state.taskList.push(task);
        // },
        removeTaskFromList:(state,action) => {
            state.taskList = state.taskList.filter((task) => task.id !== action.payload.id)
        },
        // updateTaskInList:(state,action) => {
        //     state.taskList = state.taskList.map((task) => task.id === action.payload.id ? action.payload : task);
        // },
        setselectedTask:(state,action) => {
            state.selectedTask = action.payload;
        },
        
    }, 
    extraReducers:(builder) => {
        builder 
            .addCase(getTasksFromServer.pending,(state) => {
                state.isLoading = true;
            })
            .addCase(getTasksFromServer.fulfilled,(state,action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = action.payload
            })
            .addCase(getTasksFromServer.rejected,(state,action) => {
                state.isLoading = false;
                state.error = action.payload.error;
                state.taskList = [];
            })
            .addCase(addTasksToServer.pending,(state) => {
                state.isLoading = true;
            })
            .addCase(addTasksToServer.fulfilled,(state,action) => {
                state.isLoading = false;
                state.error = '';
                const id = parseInt(Math.random() * 100);
                let task = {...action.payload,id}
                state.taskList.push(task);
            })
            .addCase(addTasksToServer.rejected,(state,action) => {
                state.isLoading = false;
                state.error = action.payload.error;
            })
            .addCase(updateTaskInServer.pending,(state) => {
                state.isLoading = true;
            })
            .addCase(updateTaskInServer.fulfilled,(state,action) => {
                state.isLoading = false;
                state.error = '';
                state.taskList = state.taskList.map((task) => task.id === action.payload.id ? action.payload : task);
            })
            .addCase(updateTaskInServer.rejected,(state,action) => {
                state.isLoading = false;
                state.error = action.payload.error;
            })
            .addCase(deleteTaskFromServer.pending,(state) => {
                state.isLoading = true;
            })
            .addCase(deleteTaskFromServer.fulfilled,(state,action) => {
                state.isLoading = false;
                state.error = '';
            })
            .addCase(deleteTaskFromServer.rejected,(state,action) => {
                state.isLoading = false;
                state.error = action.payload.error;
            })

    }
})

export const {addTaskToList,removeTaskFromList,updateTaskInList,setselectedTask} = taskSlice.actions

export default taskSlice.reducer











## License

MIT
