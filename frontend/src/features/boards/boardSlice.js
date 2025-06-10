import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
     boardList: [],
     status: "idle",
     currentBoard: null,
     allBoards: []
};

export const addBoard = createAsyncThunk(
     "boards/addBoard",
     async ({ title, description, owner, status, userId }, thunkAPI) => {
          const createdAt = new Date().toISOString().split("T")[0];
          const response = await axios.post("http://localhost:8000/api/board/add", {
               title,
               description,
               owner,
               status,
               userId,
               createdAt,
          }, { withCredentials: true });
          return response?.data?.Board;
     }
);

export const deleteBoard = createAsyncThunk(
     "boards/deleteBoard",
     async (id, thunkAPI) => {
          await axios.delete(`http://localhost:8000/api/board/del/${id}`, { withCredentials: true });
          return id;
     }
);

export const fetchAllBoards = createAsyncThunk(
     "boards/fetchAllBoards",
     async (thunkAPI) => {
          const response = await axios.get(`http://localhost:8000/api/board/getAll`, { withCredentials: true });
          return response?.data?.boards;
     }
);

export const fetchBoards = createAsyncThunk(
     "boards/fetchBoards",
     async (id, thunkAPI) => {
          if (!id) return thunkAPI.rejectWithValue("User ID is missing");
          const response = await axios.get(`http://localhost:8000/api/board/get/${id}`, { withCredentials: true });
          return response.data;
     }
);

export const fetchBoardByBoardId = createAsyncThunk(
     "boards/fetchBoardByBoardId",
     async (id, thunkAPI) => {
          try {
               if (!id) return thunkAPI.rejectWithValue("Board ID is missing");
               const response = await axios.get(`http://localhost:8000/api/board/getBoard/${id}`, { withCredentials: true });
               return response?.data?.board;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
          }
     }
);

const boardSlice = createSlice({
     name: "boards",
     initialState,
     reducers: {
          updateBoardMetaData(state, action) {
               const { id, newTitle, newDescription, newStatus } = action.payload;
               const board = state.boardList.find((b) => b.id === id);
               if (board) {
                    board.title = newTitle;
                    board.description = newDescription;
                    board.status = newStatus;
               }
          },
     },
     extraReducers: (builder) => {
          builder
               .addCase(fetchBoards.pending, (state) => {
                    state.status = "loading";
               })
               .addCase(fetchBoards.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.boardList = action.payload;
               })
               .addCase(addBoard.fulfilled, (state, action) => {
                    state.boardList.boards.push(action.payload);
               })
               .addCase(deleteBoard.fulfilled, (state, action) => {
                    state.boardList.boards = state.boardList.boards.filter(
                         (board) => board.id !== action.payload
                    );
               })
               .addCase(fetchBoardByBoardId.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(fetchBoardByBoardId.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.currentBoard = action.payload; // Store single board separately
                    state.error = null;
               })
               .addCase(fetchBoardByBoardId.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
               })
               .addCase(fetchAllBoards.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(fetchAllBoards.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.allBoards = action.payload;
                    state.error = null;
               })
               .addCase(fetchAllBoards.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
               });
     },
});

export const { updateBoardMetaData } = boardSlice.actions;
export default boardSlice.reducer;
