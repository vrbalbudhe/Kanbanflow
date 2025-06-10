import React, { useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
} from "lucide-react";

export default function KanbanSection() {
  const [boards, setBoards] = useState([
    {
      id: "todo",
      title: "To Do",
      color: "bg-slate-100 border-slate-200",
      headerColor: "bg-slate-50",
      tasks: [
        {
          id: "1",
          title: "Design user interface mockups",
          description:
            "Create wireframes and high-fidelity designs for the new dashboard",
          priority: "high",
          assignee: "Sarah Chen",
          dueDate: "2025-06-05",
          tags: ["Design", "UI/UX"],
        },
        {
          id: "2",
          title: "Research competitor analysis",
          description: "Study market competitors and identify key features",
          priority: "medium",
          assignee: "Mike Johnson",
          dueDate: "2025-06-08",
          tags: ["Research", "Analysis"],
        },
      ],
    },
    {
      id: "progress",
      title: "In Progress",
      color: "bg-blue-50 border-blue-200",
      headerColor: "bg-blue-100",
      tasks: [
        {
          id: "3",
          title: "Implement authentication system",
          description: "Build secure login and registration functionality",
          priority: "high",
          assignee: "Alex Rodriguez",
          dueDate: "2025-06-10",
          tags: ["Backend", "Security"],
        },
        {
          id: "4",
          title: "Database schema optimization",
          description: "Improve query performance and data structure",
          priority: "medium",
          assignee: "Emma Wilson",
          dueDate: "2025-06-12",
          tags: ["Database", "Performance"],
        },
      ],
    },
    {
      id: "review",
      title: "Under Review",
      color: "bg-amber-50 border-amber-200",
      headerColor: "bg-amber-100",
      tasks: [
        {
          id: "5",
          title: "API documentation",
          description:
            "Complete comprehensive API documentation for developers",
          priority: "low",
          assignee: "David Kim",
          dueDate: "2025-06-15",
          tags: ["Documentation", "API"],
        },
      ],
    },
    {
      id: "done",
      title: "Completed",
      color: "bg-emerald-50 border-emerald-200",
      headerColor: "bg-emerald-100",
      tasks: [
        {
          id: "6",
          title: "Project setup and configuration",
          description:
            "Initialize project structure and development environment",
          priority: "high",
          assignee: "Sarah Chen",
          dueDate: "2025-05-28",
          tags: ["Setup", "Configuration"],
        },
        {
          id: "7",
          title: "Team onboarding documentation",
          description: "Create guides for new team members",
          priority: "medium",
          assignee: "Mike Johnson",
          dueDate: "2025-05-30",
          tags: ["Documentation", "Onboarding"],
        },
      ],
    },
  ]);

  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignee: "",
    dueDate: "",
    tags: [],
  });

  const handleDragStart = (e, task, boardId) => {
    setDraggedTask(task);
    setDraggedFrom(boardId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetBoardId) => {
    e.preventDefault();
    if (!draggedTask || draggedFrom === targetBoardId) return;

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === draggedFrom) {
          return {
            ...board,
            tasks: board.tasks.filter((task) => task.id !== draggedTask.id),
          };
        }
        if (board.id === targetBoardId) {
          return {
            ...board,
            tasks: [...board.tasks, draggedTask],
          };
        }
        return board;
      })
    );

    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const addNewTask = (boardId) => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now().toString(),
      ...newTask,
      tags: newTask.tags.filter((tag) => tag.trim()),
    };

    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? { ...board, tasks: [...board.tasks, task] }
          : board
      )
    );

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      assignee: "",
      dueDate: "",
      tags: [],
    });
    setShowNewTaskForm(null);
  };

  const deleteTask = (boardId, taskId) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.filter((task) => task.id !== taskId),
            }
          : board
      )
    );
  };

  const updateTask = (boardId, taskId, updatedTask) => {
    setBoards((prev) =>
      prev.map((board) =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
              ),
            }
          : board
      )
    );
    setEditingTask(null);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "medium":
        return <Circle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const TaskCard = ({ task, boardId }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task, boardId)}
      className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">
          {task.title}
        </h3>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={() => setEditingTask({ ...task, boardId })}
            className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteTask(boardId, task.id)}
            className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        {getPriorityIcon(task.priority)}
        <span
          className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{task.assignee}</span>
        </div>
        {task.dueDate && (
          <div
            className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? "text-red-500" : ""}`}
          >
            <Clock className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );

  const TaskForm = ({ boardId, task = null, isEditing = false }) => {
    const [formData, setFormData] = useState(task || newTask);
    const [tagInput, setTagInput] = useState("");

    const handleSubmit = () => {
      if (!formData.title.trim()) return;

      if (isEditing) {
        updateTask(boardId, task.id, formData);
      } else {
        setNewTask(formData);
        addNewTask(boardId);
      }
    };

    const addTag = (e) => {
      if (e.key === "Enter" && tagInput.trim()) {
        e.preventDefault();
        if (!formData.tags.includes(tagInput.trim())) {
          setFormData((prev) => ({
            ...prev,
            tags: [...prev.tags, tagInput.trim()],
          }));
        }
        setTagInput("");
      }
    };

    const removeTag = (tagToRemove) => {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }));
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="2"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            placeholder="Assignee"
            value={formData.assignee}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, assignee: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {isEditing ? "Update Task" : "Add Task"}
            </button>
            <button
              onClick={() => {
                setShowNewTaskForm(null);
                setEditingTask(null);
                setNewTask({
                  title: "",
                  description: "",
                  priority: "medium",
                  assignee: "",
                  dueDate: "",
                  tags: [],
                });
              }}
              className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pb-20 pt-20 from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-medium text-gray-800 mb-2">
            Experience The Kanban
          </h1>
          <p className="text-gray-600 text-2xl text-left w-full md:max-w-6xl break-words">
            Manage your tasks and track progress across different stages on the
            kanban dashboard, add the diffrent members, chat with them, assign
            them tasks and many more..
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div
              key={board.id}
              className={`${board.color} rounded-xl border-2 border-dashed transition-all duration-200 min-h-[600px]`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, board.id)}
            >
              <div
                className={`${board.headerColor} rounded-t-xl px-4 py-3 border-b border-opacity-20`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-800">
                      {board.title}
                    </h2>
                    <span className="bg-white bg-opacity-70 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                      {board.tasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNewTaskForm(board.id)}
                    className="p-1 hover:bg-white hover:bg-opacity-50 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                {showNewTaskForm === board.id && (
                  <TaskForm boardId={board.id} />
                )}

                {editingTask && editingTask.boardId === board.id && (
                  <TaskForm
                    boardId={board.id}
                    task={editingTask}
                    isEditing={true}
                  />
                )}

                {board.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} boardId={board.id} />
                ))}

                {board.tasks.length === 0 && showNewTaskForm !== board.id && (
                  <div className="text-center py-8 text-gray-500">
                    <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No tasks yet</p>
                    <button
                      onClick={() => setShowNewTaskForm(board.id)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                    >
                      Add first task
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
