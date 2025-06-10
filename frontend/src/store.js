import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './features/boards/boardSlice';
import kanbanReducer from './features/Columns/kanbanSlice';
import columnReducer from './features/Columns/columnSlice';
import taskReducer from './features/tasks/taskSlice';
import chatReducer from './features/chats/chatSlice';
import participantReducer from './features/participants/participantSlice';

const store = configureStore({
     reducer: {
          board: boardReducer,
          kanban: kanbanReducer,
          column: columnReducer,
          task: taskReducer,
          participant: participantReducer,
          chat: chatReducer
     },
});

export { store };
