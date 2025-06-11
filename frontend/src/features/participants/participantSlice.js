import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
     status: "idle", // Add status to initial state
     currentBoard: null,
     participantList: [],
     loading: false,
     error: null
}

export const addParticipants = createAsyncThunk("/participant/addParticipants", async ({ email, permission, userAccess, boardId }, thunkAPI) => {
     const createdAt = new Date().toISOString().split("T")[0];
     const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/participant/add/${boardId}`, { email, permission, userAccess, createdAt }, { withCredentials: true })
     return response?.data?.member;
})

export const getParticipants = createAsyncThunk("/participant/getParticipants", async ({ boardId }, thunkAPI) => {
     if (!boardId) return thunkAPI.rejectWithValue("Board ID is missing");
     const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/participant/getAll/${boardId}`, { withCredentials: true })
     return response?.data?.members;
})

export const updParticipants = createAsyncThunk("/participant/updParticipants", async ({ participantId, permission, userAccess }, thunkAPI) => {
     if (!participantId) return thunkAPI.rejectWithValue("Participant ID is missing");

     const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/participant/update/${participantId}`, {
          permission,
          userAccess
     }, { withCredentials: true })
     return response?.data?.participant;
})

export const fetchBoardByBoardId = createAsyncThunk(
     "participant/fetchBoardByBoardId",
     async (id, thunkAPI) => {
          try {
               if (!id) return thunkAPI.rejectWithValue("Board ID is missing");
               const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/board/getBoard/${id}`, { withCredentials: true });
               return response?.data?.board;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
          }
     }
);

const participantSlice = createSlice({
     name: "participant",
     initialState,
     reducers: {
          clearError: (state) => {
               state.error = null;
          },
          resetStatus: (state) => {
               state.status = "idle";
          }
     },
     extraReducers: (builder) => {
          builder
               .addCase(fetchBoardByBoardId.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(fetchBoardByBoardId.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.currentBoard = action.payload;
                    state.error = null;
               })
               .addCase(fetchBoardByBoardId.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
               })

               .addCase(addParticipants.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(addParticipants.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.participantList.push(action.payload);
                    state.error = null;
               })
               .addCase(addParticipants.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
               })

               .addCase(getParticipants.pending, (state) => {
                    state.status = "loading";
                    state.error = null;
               })
               .addCase(getParticipants.fulfilled, (state, action) => {
                    state.status = "succeeded";
                    state.participantList = action.payload;
                    state.error = null;
               })
               .addCase(getParticipants.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.payload;
               })

               .addCase(updParticipants.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(updParticipants.fulfilled, (state, action) => {
                    state.loading = false;
                    state.status = "succeeded";
                    const index = state.participantList.findIndex(participant =>
                         participant.id === action.payload.id || participant._id === action.payload._id
                    );
                    if (index !== -1) {
                         state.participantList[index] = action.payload;
                    }
                    state.error = null;
               })
               .addCase(updParticipants.rejected, (state, action) => {
                    state.loading = false;
                    state.status = "failed";
                    state.error = action.payload;
               })
     }
})

export const { clearError, resetStatus } = participantSlice.actions;
export default participantSlice.reducer;