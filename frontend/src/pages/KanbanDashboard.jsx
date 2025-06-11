import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import AddColumnButton from "../components/kanban/AddColumnButton";
import KanbanColumn from "../components/kanban/KanbanColumn";
import TaskCard from "../components/kanban/TaskCard";
import {
  reorderColumns,
  reorderColumnsAsync,
} from "../features/Columns/columnSlice";
import {
  updateTask,
  moveTask,
  fetchAllTasksForBoard,
} from "../features/tasks/taskSlice";
import { CommandIcon, Info } from "lucide-react";
import { fetchColumns } from "../features/Columns/columnSlice";
import { fetchBoardByBoardId } from "../features/boards/boardSlice";
import { useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

const KanbanDashboard = () => {
  const { user, setId, setBoardId, access } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const dispatch = useDispatch();
  const [activeTask, setActiveTask] = useState(null);

  const fullState = useSelector((state) => state);

  const columnState = useSelector((state) => state.column || {});
  const boardState = useSelector((state) => state.boards || {});
  const kanbanState = useSelector((state) => state.kanban || {});
  const taskState = useSelector((state) => state.task || {});

  useEffect(() => {
    if (user?.email && boardId) {
      setBoardId(boardId);
      setId(user?.email);
    }
  }, []);

  const {
    columnList = [],
    loading: columnsLoading = false,
    error: columnsError = null,
  } = columnState;

  const {
    currentBoard = null,
    boardList = [],
    status: boardStatus = "idle",
    error: boardError = null,
  } = boardState;

  const { tasks = {}, columnOrder = [] } = kanbanState;

  const allTasks = useSelector((state) => state.task.tasks || []);

  useEffect(() => {
    if (boardId) {
      dispatch(fetchColumns(boardId));
      dispatch(fetchBoardByBoardId(boardId));
      dispatch(fetchAllTasksForBoard(boardId));
    }
  }, [boardId, dispatch]);

  const handleDragStart = (event) => {
    const { active } = event;

    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Handle task moving between columns
    if (activeType === "task" && overType === "column") {
      const activeTask = active.data.current.task;
      const overColumnId = over.id;

      if (activeTask.columnId !== overColumnId) {
        // Optimistic update first for immediate UI feedback
        dispatch(
          moveTask({
            taskId: activeTask.id,
            newColumnId: overColumnId,
          })
        );

        // Then update on server
        dispatch(
          updateTask({
            taskId: activeTask.id,
            updates: {
              ...activeTask,
              columnId: overColumnId,
            },
          })
        );
      }
    }

    // Handle task moving when dropped on another task
    if (activeType === "task" && overType === "task") {
      const activeTask = active.data.current.task;
      const overTask = over.data.current.task;

      if (activeTask.columnId !== overTask.columnId) {
        // Moving to different column
        dispatch(
          moveTask({
            taskId: activeTask.id,
            newColumnId: overTask.columnId,
          })
        );

        // Update on server
        dispatch(
          updateTask({
            taskId: activeTask.id,
            updates: {
              ...activeTask,
              columnId: overTask.columnId,
            },
          })
        );
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Clear active task
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle column reordering (keep your existing logic)
    if (activeData?.type === "column" && overData?.type === "column") {
      const oldIndex = columnList.findIndex((col) => col.id === active.id);
      const newIndex = columnList.findIndex((col) => col.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColumnOrder = arrayMove(columnList, oldIndex, newIndex);

        // Update the order property for each column based on new positions
        const updatedColumns = newColumnOrder.map((column, index) => ({
          ...column,
          order: index + 1,
          orderId: (index + 1).toString(),
        }));

        dispatch(reorderColumns(updatedColumns));

        const columnOrderData = updatedColumns.map((col, index) => ({
          id: col.id,
          orderId: (index + 1).toString(),
          order: index + 1,
        }));

        dispatch(
          reorderColumnsAsync({
            boardId: boardId,
            columnOrderData: columnOrderData,
          })
        );
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getStats = () => {
    return {
      columnCount: Array.isArray(columnList) ? columnList.length : 0,
      totalTasks: Array.isArray(allTasks) ? allTasks.length : 0,
    };
  };

  const renderHeader = () => (
    <div className="w-full mb-8 select-none flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-medium text-gray-700 tracking-tight mb-2">
          {fullState?.board?.currentBoard?.title}
        </h1>
        <h1 className="text-sm italic flex justify-center items-center gap-1 font-normal text-gray-500 mb-2">
          <span>
            <Info className="h-4 w-4 text-gray-600" />
          </span>
          {fullState?.board?.currentBoard?.description}
        </h1>
      </div>
      <p className="text-gray-400 text-sm flex justify-center items-center gap-1">
        <span>
          <CommandIcon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="text-gray-500 font-semibold">board-</span>
        {boardId}
      </p>
      {currentBoard?.description && (
        <p className="text-gray-600 text-sm mt-1">{currentBoard.description}</p>
      )}
    </div>
  );

  const renderColumns = () => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="overflow-x-auto">
        <SortableContext
          items={columnList.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-6 min-h-[calc(100vh-200px)] w-fit pb-6">
            {Array.isArray(columnList) &&
              columnList.map((column, index) => (
                <KanbanColumn
                  key={column?.id}
                  tasks={column?.tasks}
                  column={column}
                  index={index}
                  isDragHandle={true}
                />
              ))}
            {access.permission === "editor" && (
              <div className="flex-shrink-0">
                <AddColumnButton />
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      {/* Drag Overlay for Tasks */}
      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-90 scale-105">
            <TaskCard
              task={activeTask}
              index={0}
              columnId={activeTask.columnId}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <EmptyStateIcon />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No columns yet
        </h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first column to organize your tasks.
        </p>
        <AddColumnButton />
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-medium text-red-600 mb-2">
          Error Loading Board
        </h3>
        <p className="text-gray-500 mb-6">
          {boardError ||
            columnsError ||
            "Something went wrong. Please try again."}
        </p>
        <button
          onClick={() => {
            if (boardId) {
              dispatch(fetchColumns(boardId));
              dispatch(fetchBoardByBoardId(boardId));
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const EmptyStateIcon = () => (
    <svg
      className="mx-auto h-24 w-24 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z"
      />
    </svg>
  );

  const renderStatsFooter = () => {
    const stats = getStats();
    return (
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex gap-6">
            <span>{stats.columnCount} columns</span>
            <span>{stats.totalTasks} total tasks</span>
          </div>
          <div className="text-xs">
            Drag columns and tasks to reorganize • Double-click to edit
          </div>
        </div>
      </div>
    );
  };

  // Show error state if there are errors
  if (boardError || columnsError) {
    return (
      <div className="min-h-screen min-w-[80%] bg-gradient-to-br absolute from-zinc-50 via-gray-50 to-white p-6 overflow-hidden">
        <div className="max-w-full mx-auto">
          {renderHeader()}
          {renderErrorState()}
        </div>
      </div>
    );
  }

  // Show loading state
  const isLoading = columnsLoading || boardStatus === "loading";

  return (
    <div className="min-h-screen min-w-[80%] bg-gradient-to-br absolute from-zinc-50 via-gray-50 to-white p-6 overflow-hidden">
      <div className="max-w-full mx-auto">
        {renderHeader()}

        {isLoading ? (
          <div className="text-center w-full h-screen flex justify-start items-start text-gray-500 mt-10">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              <span>Loading board data...</span>
            </div>
          </div>
        ) : Array.isArray(columnList) && columnList.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {renderColumns()}
            {renderStatsFooter()}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
};

export default KanbanDashboard;
