import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
     columnList: [],
     columnOrder: [],
     loading: false,
     error: null,
};

export const addColumn = createAsyncThunk(
     "column/addColumn",
     async ({ name, colorCode, boardId, orderId }, thunkAPI) => {
          try {
               const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/column/add`,
                    { name, colorCode, boardId, orderId },
                    { withCredentials: true }
               );
               return response?.data?.column;
          } catch (err) {
               return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to add column");
          }
     }
);

export const fetchColumns = createAsyncThunk(
     "column/fetchColumns",
     async (boardId, thunkAPI) => {
          if (!boardId) return thunkAPI.rejectWithValue("Board ID is missing");
          try {
               const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/column/getAll/${boardId}`,
                    { withCredentials: true }
               );
               return response?.data?.columns;
          } catch (err) {
               return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch columns");
          }
     }
);

export const deleteColumn = createAsyncThunk(
     "boards/deleteColumn",
     async (id, thunkAPI) => {
          await axios.delete(`${import.meta.env.VITE_API_URL}/api/column/del/${id}`, { withCredentials: true });
          return id;
     }
);

export const reorderColumnsAsync = createAsyncThunk(
     "column/reorderColumnsAsync",
     async ({ boardId, columnOrderData }, thunkAPI) => {
          try {
               const response = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/column/reorder/${boardId}`,
                    { columnOrderData },
                    { withCredentials: true }
               );
               return response?.data?.columns;
          } catch (err) {
               return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to reorder columns");
          }
     }
);

const columnSlice = createSlice({
     name: "column",
     initialState,
     reducers: {
          reorderColumnsLocally: (state, action) => {
               const { sourceIndex, destinationIndex } = action.payload;
               const sortedColumns = [...state.columnList].sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId));
               const [movedColumn] = sortedColumns.splice(sourceIndex, 1);
               sortedColumns.splice(destinationIndex, 0, movedColumn);

               sortedColumns.forEach((column, index) => {
                    column.orderId = index.toString();
               });

               state.columnList = sortedColumns;
               state.columnOrder = sortedColumns.map(col => col.id);
          },

          reorderColumns: (state, action) => {
               const newColumns = action.payload;
               newColumns.forEach((column, index) => {
                    column.order = index + 1;
                    column.orderId = (index + 1).toString();
               });

               state.columnList = newColumns;
               state.columnOrder = newColumns.map(col => col.id);
          }
     },
     extraReducers: (builder) => {
          builder
               .addCase(addColumn.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(addColumn.fulfilled, (state, action) => {
                    state.loading = false;
                    state.columnList.push(action.payload);
                    // Update columnOrder when adding new column
                    state.columnOrder = state.columnList
                         .sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId))
                         .map(col => col.id);
               })
               .addCase(addColumn.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               .addCase(fetchColumns.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(fetchColumns.fulfilled, (state, action) => {
                    state.loading = false;
                    // Sort columns by orderId
                    const sortedColumns = action.payload.sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId));
                    state.columnList = sortedColumns;
                    state.columnOrder = sortedColumns.map(col => col.id);
               })
               .addCase(fetchColumns.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               })
               .addCase(deleteColumn.fulfilled, (state, action) => {
                    const id = action.payload;
                    state.columnList = state.columnList.filter((col) => col.id !== id);
                    // Update columnOrder after deletion and reorder remaining columns
                    const remainingColumns = state.columnList.sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId));
                    remainingColumns.forEach((column, index) => {
                         column.orderId = (index + 1).toString();
                         column.order = index + 1;
                    });
                    state.columnOrder = remainingColumns.map(col => col.id);
               })
               .addCase(reorderColumnsAsync.pending, (state) => {
                    state.loading = true;
                    state.error = null;
               })
               .addCase(reorderColumnsAsync.fulfilled, (state, action) => {
                    state.loading = false;
                    const sortedColumns = action.payload.sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId));
                    state.columnList = sortedColumns;
                    state.columnOrder = sortedColumns.map(col => col.id);
               })
               .addCase(reorderColumnsAsync.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
               });
     },
});

export const { reorderColumnsLocally, reorderColumns } = columnSlice.actions;
export default columnSlice.reducer;