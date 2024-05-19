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









