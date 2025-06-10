// store/kanbanSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
     kanbanList: [],
     tasks: {}, // tasks storage
     columnOrder: [] // order of columns
};

const kanbanSlice = createSlice({
     name: 'kanban',
     initialState,
     reducers: {
          /**
           * @description - Creating the Column
           * @parameters - title, boardId, createdAt
           * @returns - Add new Column
           */
          createColumn: {
               reducer(state, action) {
                    state.kanbanList.push(action.payload);
                    state.columnOrder.push(action.payload.columnId);
               },
               prepare(boardId, title, createdAt) {
                    return {
                         payload: {
                              columnId: nanoid(),
                              title,
                              boardId,
                              createdAt,
                              taskIds: [] // Initialize empty task array
                         }
                    }
               }
          },

          /**
           * @description - Add new column (simplified version for UI)
           * @parameters - title
           * @returns - Add new Column
           */
          addColumn: (state, action) => {
               const newColumnId = nanoid();
               const newColumn = {
                    columnId: newColumnId,
                    title: action.payload.title || 'New Column',
                    boardId: action.payload.boardId || 'default',
                    createdAt: new Date().toISOString(),
                    taskIds: []
               };
               state.kanbanList.push(newColumn);
               state.columnOrder.push(newColumnId);
          },

          /**
           * @description - deleting the Column
           * @parameters - id, bid
           * @returns - list (excluding the deleted item)
           */
          deleteColumn(state, action) {
               const { id, bid } = action.payload;
               const columnIndex = state.kanbanList.findIndex(
                    kl => kl.columnId === id && kl.boardId === bid
               );

               if (columnIndex !== -1) {
                    // Move all tasks from this column to the first available column (if exists)
                    const tasksToMove = state.kanbanList[columnIndex].taskIds || [];
                    if (state.kanbanList.length > 1 && tasksToMove.length > 0) {
                         const targetColumn = state.kanbanList.find(col =>
                              col.columnId !== id && col.boardId === bid
                         );
                         if (targetColumn) {
                              targetColumn.taskIds = [...(targetColumn.taskIds || []), ...tasksToMove];
                         }
                    } else {
                         // Delete tasks if this is the only column
                         tasksToMove.forEach(taskId => {
                              delete state.tasks[taskId];
                         });
                    }

                    // Remove column
                    state.kanbanList.splice(columnIndex, 1);
                    state.columnOrder = state.columnOrder.filter(colId => colId !== id);
               }
          },

          /**
           * @description - Updating the Column
           * @parameters - id, bid, title
           * @returns - list (updating the item)
           */
          updateColumn(state, action) {
               const { id, bid, title } = action.payload;
               const findColumn = state.kanbanList.find(
                    kl => kl.columnId === id && kl.boardId === bid
               );
               if (findColumn) {
                    findColumn.title = title;
               }
          },

          /**
           * @description - Update column title (simplified version)
           * @parameters - columnId, title
           */
          updateColumnTitle: (state, action) => {
               const { columnId, title } = action.payload;
               const column = state.kanbanList.find(col => col.columnId === columnId);
               if (column) {
                    column.title = title;
               }
          },

          /**
           * @description - Add new task
           * @parameters - columnId, content, priority, boardId
           */
          addTask: (state, action) => {
               const { columnId, content, priority = 'medium', boardId = 'default' } = action.payload;
               const newTaskId = nanoid();

               state.tasks[newTaskId] = {
                    id: newTaskId,
                    content,
                    priority,
                    boardId,
                    createdAt: new Date().toISOString()
               };

               const column = state.kanbanList.find(col => col.columnId === columnId);
               if (column) {
                    if (!column.taskIds) column.taskIds = [];
                    column.taskIds.push(newTaskId);
               }
          },

          /**
           * @description - Update task
           * @parameters - taskId, content, priority
           */
          updateTask: (state, action) => {
               const { taskId, content, priority } = action.payload;
               if (state.tasks[taskId]) {
                    if (content !== undefined) state.tasks[taskId].content = content;
                    if (priority !== undefined) state.tasks[taskId].priority = priority;
                    state.tasks[taskId].updatedAt = new Date().toISOString();
               }
          },

          /**
           * @description - Delete task
           * @parameters - taskId
           */
          deleteTask: (state, action) => {
               const taskId = action.payload;

               // Remove task from tasks object
               delete state.tasks[taskId];

               // Remove task from all columns
               state.kanbanList.forEach(column => {
                    if (column.taskIds) {
                         column.taskIds = column.taskIds.filter(id => id !== taskId);
                    }
               });
          },

          /**
           * @description - Move task between columns (drag and drop)
           * @parameters - taskId, sourceColumnId, destinationColumnId, sourceIndex, destinationIndex
           */
          moveTask: (state, action) => {
               const {
                    taskId,
                    sourceColumnId,
                    destinationColumnId,
                    sourceIndex,
                    destinationIndex
               } = action.payload;

               const sourceColumn = state.kanbanList.find(col => col.columnId === sourceColumnId);
               const destinationColumn = state.kanbanList.find(col => col.columnId === destinationColumnId);

               if (!sourceColumn || !destinationColumn) return;

               // Ensure taskIds arrays exist
               if (!sourceColumn.taskIds) sourceColumn.taskIds = [];
               if (!destinationColumn.taskIds) destinationColumn.taskIds = [];

               // Remove task from source column
               sourceColumn.taskIds.splice(sourceIndex, 1);

               // Add task to destination column
               destinationColumn.taskIds.splice(destinationIndex, 0, taskId);
          },

          /**
           * @description - Reorder columns
           * @parameters - new column order array
           */
          reorderColumns: (state, action) => {
               state.columnOrder = action.payload;
          },

          /**
           * @description - Reorder tasks within a column
           * @parameters - columnId, startIndex, endIndex
           */
          reorderTasks: (state, action) => {
               const { columnId, startIndex, endIndex } = action.payload;
               const column = state.kanbanList.find(col => col.columnId === columnId);

               if (column && column.taskIds) {
                    const [removed] = column.taskIds.splice(startIndex, 1);
                    column.taskIds.splice(endIndex, 0, removed);
               }
          },

          /**
           * @description - Get columns by board ID
           * @parameters - boardId
           */
          getColumnsByBoard: (state, action) => {
               const boardId = action.payload;
               return state.kanbanList.filter(col => col.boardId === boardId);
          }
     }
});

export const {
     createColumn,
     addColumn,
     updateColumn,
     updateColumnTitle,
     deleteColumn,
     addTask,
     updateTask,
     deleteTask,
     moveTask,
     reorderColumns,
     reorderTasks,
     getColumnsByBoard
} = kanbanSlice.actions;

// Selectors
export const selectColumnsByBoard = (state, boardId) =>
     state.kanban.kanbanList.filter(col => col.boardId === boardId);

export const selectTasksByColumn = (state, columnId) => {
     const column = state.kanban.kanbanList.find(col => col.columnId === columnId);
     if (!column || !column.taskIds) return [];
     return column.taskIds.map(taskId => state.kanban.tasks[taskId]).filter(Boolean);
};

export const selectAllTasks = (state) => state.kanban.tasks;

export default kanbanSlice.reducer;