import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateTask, deleteTask } from "../../features/tasks/taskSlice";
import { AiOutlineComment, AiOutlineUser } from "react-icons/ai";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const TaskCard = ({ task, index, columnId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const boardId = params?.id;
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(
    task.content || task.description || ""
  );
  const [editTitle, setEditTitle] = useState(task?.title || "");
  const [editPriority, setEditPriority] = useState(task?.priority || "medium");
  const [editAssigneeId, setEditAssigneeId] = useState(
    task.assigneeId || user?.username || ""
  );
  const [editTags, setEditTags] = useState(task?.tags || []);
  const [editTagInput, setEditTagInput] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddTag = () => {
    const trimmedTag = editTagInput.trim();
    if (trimmedTag && !editTags.some((tag) => tag.title === trimmedTag)) {
      setEditTags([...editTags, { title: trimmedTag }]);
      setEditTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter((tag) => tag.title !== tagToRemove.title));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (editTitle.trim() || editContent.trim()) {
      const tagsForUpdate = editTags.map((tag) => ({
        title: tag.title,
        src: tag.src || `#${Date.now()}`,
      }));
      try {
        await dispatch(
          updateTask({
            taskId: task?.id,
            updates: {
              title: editTitle.trim(),
              description: editContent.trim(),
              priority: editPriority,
              assigneeId: editAssigneeId,
              tags: tagsForUpdate,
              boardId: boardId || task?.boardId,
              columnId: columnId || task?.columnId,
            },
          })
        ).unwrap();
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title || "");
    setEditContent(task.content || task.description || "");
    setEditPriority(task.priority || "medium");
    setEditAssigneeId(task.assigneeId || user?.username || "");
    setEditTags(task.tags || []);
    setEditTagInput("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await dispatch(deleteTask(task?.id)).unwrap();
        console.log("Task deleted successfully");
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return {
          card: "bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-sm",
          dot: "bg-red-500",
          text: "text-red-700",
          accent: "border-red-300",
          heading: "text-red-600",
        };
      case "medium":
        return {
          card: "bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-sm",
          dot: "bg-yellow-400",
          text: "text-yellow-700",
          accent: "border-yellow-300",
          heading: "text-yellow-600",
        };
      case "low":
        return {
          card: "bg-gradient-to-br from-white to-gray-100 border border-gray-200 shadow-sm",
          dot: "bg-green-500",
          text: "text-green-700",
          accent: "border-green-300",
          heading: "text-green-600",
        };
      default:
        return {
          card: "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200 shadow-gray-100",
          dot: "bg-gray-400",
          text: "text-gray-600",
          accent: "border-gray-300",
          heading: "text-gray-700",
        };
    }
  };

  const priorityStyles = getPriorityStyles(task.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative overflow-visible rounded-xl border-2 transition-all duration-300 ease-out
        cursor-pointer select-none
        ${priorityStyles.card}
        ${priorityStyles.accent}
        ${
          isDragging
            ? "shadow-2xl rotate-2 z-50 ring-4 ring-blue-200 ring-opacity-50"
            : "shadow-lg hover:shadow-xl"
        }
        ${isDragging ? "opacity-90" : ""}
        ${isEditing ? "z-10 min-h-fit" : ""}
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-white/30"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      <div className={`p-4 ${isEditing ? "pb-6" : ""}`}>
        {isEditing ? (
          <div className="space-y-4">
            {/* Edit Title */}
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full p-2 text-sm font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              autoFocus
            />

            {/* Edit Description */}
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Task description..."
              className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              rows="3"
            />

            {/* Priority and Assignee Row */}
            <div className="flex flex-col items-start gap-2">
              {/* Priority Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-600">
                  Priority:
                </label>
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              {/* Assignee Selector */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 whitespace-nowrap">
                  Assignee:
                </label>
                <select
                  value={editAssigneeId}
                  onChange={(e) => setEditAssigneeId(e.target.value)}
                  className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                >
                  <option value="low">{user?.username}</option>
                </select>
              </div>
            </div>

            {/* Tags Section */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Tags:</label>

              {/* Display Current Tags (both existing and newly added) */}
              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-md border">
                  {editTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      #{tag.title}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-red-600 font-bold ml-1 hover:bg-white rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add New Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add new tag..."
                  className="flex-1 text-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!editTagInput.trim()}
                  className="px-3 py-2 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Add Tag
                </button>
              </div>

              {editTags.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No tags added yet. Add some tags to organize your task.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors duration-200 shadow-sm"
              >
                Save
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="px-3 py-1.5 text-xs font-medium bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Task Content */}
            <div className="space-y-2">
              {task?.title && (
                <h3
                  className={`font-semibold text-lg ${priorityStyles.heading} leading-snug line-clamp-2`}
                >
                  {task.title}
                </h3>
              )}

              {task?.description && (
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {task.description}
                </p>
              )}
            </div>

            {/* Tags Display */}
            {task?.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700 font-medium"
                  >
                    #{tag?.title}
                  </span>
                ))}
              </div>
            )}

            {/* Assignee Display */}
            {task?.assigneeId && (
              <div className="flex justify-start items-center gap-1 bg-gray-600 text-white w-fit px-2 py-1 rounded-lg">
                <AiOutlineUser size={12} />
                <p className="text-xs font-medium">{task.assigneeId}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              {/* Priority Badge */}
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-50 border">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${priorityStyles.dot}`}
                ></div>
                <span
                  className={`text-xs font-medium capitalize ${priorityStyles.text}`}
                >
                  {task?.priority || "medium"}
                </span>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                <button
                  onClick={() =>
                    navigate(`/kanban/${boardId}/chat/${task?.id}`)
                  }
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-all duration-200"
                >
                  <AiOutlineComment />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-all duration-200"
                  title="Edit task"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md transition-all duration-200"
                  title="Delete task"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dragging Overlay Effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none rounded-xl" />
      )}
    </div>
  );
};

export default TaskCard;
