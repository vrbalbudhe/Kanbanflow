import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ColumnHeader from "./ColumnHeader";
import TaskCard from "./TaskCard";
import AddTaskForm from "./AddTaskForm";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

const KanbanColumn = ({ column, index, isDragHandle }) => {
  const { user, setId, setBoardId, access } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const dispatch = useDispatch();
  const allTasks = useSelector((state) => state.task.tasks);
  const tasksLoading = useSelector((state) => state.task.loading);

  useEffect(() => {
    if (user?.email && boardId) {
      setBoardId(boardId);
      setId(user?.email);
    }
  }, []);

  const {
    attributes,
    listeners,
    setNodeRef: setColumnRef,
    transform,
    transition,
    isDragging: isColumnDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  // Column droppable for task drops
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      accepts: ["task"],
    },
  });

  const columnStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isColumnDragging ? 0.5 : 1,
  };

  const [showAddTask, setShowAddTask] = useState(false);

  // Filter tasks for this specific column from the task slice
  const columnTasks = allTasks.filter((task) => task.columnId === column.id);

  const getColumnBackground = () => {
    return `ffffff`;
  };

  return (
    <div
      ref={setColumnRef}
      className={`
        flex flex-col w-80 rounded-2xl shadow-sm 
        ${isColumnDragging ? "shadow-lg rotate-1 scale-105" : ""}
        transition-all duration-200
        ${column?.colorCode ? "" : "bg-white border-1 border-dotted border-blue-500"}
      `}
      style={{
        ...columnStyle,
        background: getColumnBackground(),
        border: column?.colorCode
          ? `1px dashed ${column?.colorCode}`
          : undefined,
      }}
    >
      {/* Column Header - Draggable for column reordering */}
      <div
        {...attributes}
        {...listeners}
        className="group cursor-grab active:cursor-grabbing"
      >
        <ColumnHeader column={column} taskCount={columnTasks.length} />
      </div>

      {/* Task Drop Zone */}
      <div
        ref={setDropRef}
        className={`
          flex-1 p-3 min-h-[200px] space-y-3 transition-all duration-200
          ${isOver ? "bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg" : ""}
        `}
      >
        {showAddTask && (
          <div className="mb-3">
            <AddTaskForm
              columnId={column?.id}
              onClose={() => setShowAddTask(false)}
            />
          </div>
        )}

        <SortableContext
          items={columnTasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task, taskIndex) => (
            <TaskCard
              key={task.id}
              task={task}
              index={taskIndex}
              columnId={column.id}
            />
          ))}
        </SortableContext>

        {columnTasks.length === 0 && !tasksLoading && (
          <div
            className={`
            flex items-center justify-center h-32 text-gray-500 select-none text-sm
            transition-all duration-200 rounded-lg
            ${isOver ? "bg-blue-100 text-blue-600 font-medium" : ""}
          `}
          >
            {isOver ? "Drop task here" : "No tasks"}
          </div>
        )}

        {tasksLoading && columnTasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 select-none text-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
              Loading tasks...
            </div>
          </div>
        )}
      </div>

      {access?.permission === "editor" && (
        <div className="p-3">
          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full p-2 text-sm text-gray-600 bg-transparent border-2 border-dashed border-gray-300 rounded hover:border-blue-300 hover:text-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add a task
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
