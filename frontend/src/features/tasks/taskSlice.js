// features/tasks/taskSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const initialState = {
     tasks: [],
     loading: false,
     error: null,
};

export const addTask = createAsyncThunk(
     "task/addTask",
     async ({ title, description, priority, columnId, boardId, assigneeId, tags }, thunkAPI) => {
          try {
               const response = await axios.post(`http://localhost:8000/api/task/add`, {
                    title,
                    description,
                    priority: priority.toLowerCase(),
                    columnId,
                    boardId,
                    assigneeId,
                    tags,
               }, { withCredentials: true });
               console.log(response)
               return response.data.task;
          } catch (error) {
               const errorMessage = error.response?.data?.message || error.message || "Failed to add task";
               return thunkAPI.rejectWithValue(errorMessage);
          }
     }
);

export const fetchTasks = createAsyncThunk(
     "task/fetchTasks",
     async (columnId, thunkAPI) => {
          try {
               const response = await axios.get(`http://localhost:8000/api/task/getAll/${columnId}`, { withCredentials: true });
               return { columnId, tasks: response.data.tasks };
          } catch (error) {
               const errorMessage = error.response?.data?.message || error.message || "Failed to fetch tasks";
               return thunkAPI.rejectWithValue(errorMessage);
          }
     }
);

// New thunk to fetch all tasks for a board
export const fetchAllTasksForBoard = createAsyncThunk(
     "task/fetchAllTasksForBoard",
     async (boardId, thunkAPI) => {
          try {
               const response = await axios.get(`http://localhost:8000/api/task/board/${boardId}`, { withCredentials: true });
               return response.data.tasks;
          } catch (error) {
               const errorMessage = error.response?.data?.message || error.message || "Failed to fetch board tasks";
               return thunkAPI.rejectWithValue(errorMessage);
          }
     }
);

// Async thunk for updating a task
export const updateTask = createAsyncThunk(
     "task/updateTask",
     async ({ taskId, updates }, thunkAPI) => {
          try {
               const response = await axios.post(`http://localhost:8000/api/task/update/${taskId}`, updates, { withCredentials: true });
               return response.data.task;
          } catch (error) {
               const errorMessage = error.response?.data?.message || error.message || "Failed to update task";
               return thunkAPI.rejectWithValue(errorMessage);
          }
     }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk(
     "task/deleteTask",
     async (taskId, thunkAPI) => {
          try {
               await axios.delete(`http://localhost:8000/api/task/del/${taskId}`, { withCredentials: true });
               return taskId;
          } catch (error) {
               const errorMessage = error.response?.data?.message || error.message || "Failed to delete task";
               return thunkAPI.rejectWithValue(errorMessage);
          }
     }
);

const taskSlice = createSlice({
     name: "task",
     initialState,
     reducers: {
          clearError: (state) => {
               state.error = null;
          },
          // Optimistic update for drag and drop
          moveTask: (state, action) => {
               const { taskId, newColumnId } = action.payload;
               const taskIndex = state.tasks.findIndex(task => task.id === taskId);
               if (taskIndex !== -1) {
                    state.tasks[taskIndex].columnId = newColumnId;
               }
          },
     },
     extraReducers: (builder) => {
          builder
               // Add Task
               .addCase(addTask.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(addTask.fulfilled, (state, action) => {
                    state.loading = false;
                    // Check if task already exists to avoid duplicates
                    const existingTaskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
                    if (existingTaskIndex === -1) {
                         state.tasks.push(action.payload);
                    }
               })
               .addCase(addTask.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               // Fetch Tasks for specific column
               .addCase(fetchTasks.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchTasks.fulfilled, (state, action) => {
                    state.loading = false;
                    const { columnId, tasks } = action.payload;

                    // Remove existing tasks for this column
                    state.tasks = state.tasks.filter(task => task.columnId !== columnId);

                    // Add the new tasks for this column
                    state.tasks.push(...tasks);
               })
               .addCase(fetchTasks.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               // Fetch all tasks for board
               .addCase(fetchAllTasksForBoard.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchAllTasksForBoard.fulfilled, (state, action) => {
                    state.loading = false;
                    state.tasks = action.payload;
               })
               .addCase(fetchAllTasksForBoard.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               // Update Task
               .addCase(updateTask.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(updateTask.fulfilled, (state, action) => {
                    state.loading = false;
                    const index = state.tasks.findIndex(task => task.id === action.payload.id);
                    if (index !== -1) {
                         state.tasks[index] = action.payload;
                    }
               })
               .addCase(updateTask.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               // Delete Task
               .addCase(deleteTask.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(deleteTask.fulfilled, (state, action) => {
                    state.loading = false;
                    state.tasks = state.tasks.filter(task => task.id !== action.payload);
               })
               .addCase(deleteTask.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               });
     },
});

export const { clearError, moveTask } = taskSlice.actions;
export default taskSlice.reducer;