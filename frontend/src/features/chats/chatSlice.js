import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
     chatList: [],
     status: "idle",
     currentTask: null,
     AllChats: []
};

export const fetchTask = createAsyncThunk("chat/fetchTask", async ({ taskId }, thunkAPI) => {
     if (!taskId) return thunkAPI.rejectWithValue("Task ID is missing");
     const response = await axios.get(`http://localhost:8000/api/task/get/${taskId}`, {
          withCredentials: true,
     });
     return response?.data?.task;
});

export const fetchChats = createAsyncThunk("chat/fetchChat", async ({ taskId }, thunkAPI) => {
     if (!taskId) return thunkAPI.rejectWithValue("Task ID is missing");
     const response = await axios.get(`http://localhost:8000/api/chat/getAll/${taskId}`, {
          withCredentials: true,
     });
     return response?.data?.chats;
});

export const fetchAllChatsByBoardId = createAsyncThunk("chat/fetchAllChatsByTaskId", async ({ boardId }, thunkAPI) => {
     if (!boardId) return thunkAPI.rejectWithValue("BoardId is missing");
     const response = await axios.get(`http://localhost:8000/api/chat/getAllByBoardId/${boardId}`, {
          withCredentials: true,
     });
     return response?.data?.chats;
});

export const addChat = createAsyncThunk("chat/addChat", async ({ message, senderId, taskId }, thunkAPI) => {
     const createdAt = new Date().toISOString();
     const response = await axios.post(
          `http://localhost:8000/api/chat/add/${taskId}`,
          { message, senderId, createdAt },
          { withCredentials: true }
     );
     return response?.data;
});

const chatSlice = createSlice({
     name: "chats",
     initialState,
     reducers: {},
     extraReducers: (builder) => {
          builder
               .addCase(fetchTask.pending, (state) => {
                    state.status = "loading";
               })
               .addCase(fetchTask.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.currentTask = action.payload;
               })
               .addCase(fetchTask.rejected, (state) => {
                    state.status = "failed";
                    state.chatList = null;
               })
               .addCase(fetchChats.pending, (state) => {
                    state.status = "loading";
               })
               .addCase(fetchChats.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.chatList = action.payload;
               })
               .addCase(fetchChats.rejected, (state) => {
                    state.status = "failed";
                    state.currentTask = null;
               })

               .addCase(fetchAllChatsByBoardId.pending, (state) => {
                    state.status = "loading";
               })
               .addCase(fetchAllChatsByBoardId.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.AllChats = action.payload;
               })
               .addCase(fetchAllChatsByBoardId.rejected, (state) => {
                    state.status = "failed";
                    state.AllChats = null;
               })
               .addCase(addChat.fulfilled, (state, action) => {
                    const message = {
                         text: action.meta.arg.message,
                         senderId: action.meta.arg.senderId,
                         timestamp: new Date().toISOString(),
                    };
                    if (state.currentTask?.messages) {
                         state.currentTask.messages.push(message);
                    }
               });
     },
});

export default chatSlice.reducer;
