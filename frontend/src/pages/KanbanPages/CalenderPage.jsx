import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  User,
  Tag,
  X,
  Edit3,
  Trash2,
} from "lucide-react";
import { useParams } from "react-router-dom";

function CalendarPage() {
  const { id } = useParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    time: "",
    priority: "medium",
    assignee: "",
    tags: [],
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/task/board/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.tasks)) {
          const formattedTasks = data?.tasks.map((task) => ({
            id: task.id || task._id || Date.now(), // adjust depending on API response
            title: task.title,
            description: task.description || "",
            time: new Date(task.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            priority: task.priority || "medium",
            assignee: task.assignee || "",
            tags: task.tags || [],
            date: task.createdAt.split("T")[0], // "2025-06-05"
            createdAt: task.createdAt,
          }));
          setTasks(formattedTasks);
        }
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  }, []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate: new Date(prevDate),
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: new Date(year, month, day),
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: new Date(nextDate),
      });
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getTasksForDate = (date) => {
    const dateStr = formatDate(date);
    return tasks.filter((task) => task.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.fullDate);
    setShowTaskModal(true);
    setEditingTask(null);
    setTaskForm({
      title: "",
      description: "",
      time: "",
      priority: "medium",
      assignee: "",
      tags: [],
    });
  };

  const handleTaskSubmit = () => {
    if (!taskForm.title.trim()) return;
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      ...taskForm,
      date: formatDate(selectedDate),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
    };

    if (editingTask) {
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? newTask : task))
      );
    } else {
      setTasks([...tasks, newTask]);
    }

    setShowTaskModal(false);
    setEditingTask(null);
    setTaskForm({
      title: "",
      description: "",
      time: "",
      priority: "medium",
      assignee: "",
      tags: [],
    });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm(task);
    setSelectedDate(new Date(task.date));
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const addTag = (tag) => {
    if (tag && !taskForm.tags.includes(tag)) {
      setTaskForm({
        ...taskForm,
        tags: [...taskForm.tags, tag],
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setTaskForm({
      ...taskForm,
      tags: taskForm.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen ">
      <div className="min-w-7xl mx-auto p-3">
        <div className="bg-white rounded-md shadow-md overflow-hidden">
          <div className="bg-gradient-to-r text-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-medium">Calendar</h1>
                <p className="text-gray-600 mt-1">
                  Manage your tasks and schedule
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold min-w-[200px] text-center">
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="text-center font-semibold text-gray-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-2">
              {days.map((day, index) => {
                const dayTasks = getTasksForDate(day.fullDate);
                const isCurrentMonth = day.isCurrentMonth;

                const todayClass = isToday(day.fullDate)
                  ? "ring-4 ring-white-500"
                  : "";

                return (
                  <div
                    key={index}
                    className={`
                      min-h-[150px] p-2 border rounded-lg cursor-pointer transition-all duration-200
                      ${
                        isCurrentMonth
                          ? "bg-white hover:bg-indigo-50 border-gray-200"
                          : "bg-gray-50 hover:bg-gray-100 border-gray-100 text-gray-400"
                      }
                      ${todayClass}
                      hover:shadow-md
                    `}
                    onClick={() => isCurrentMonth && handleDateClick(day)}
                  >
                    <div
                      className={`
                      text-sm font-medium mb-2 flex items-center justify-between
                      ${isToday(day.fullDate) ? "text-indigo-600" : ""}
                    `}
                    >
                      <span>{day.date}</span>
                      {isCurrentMonth && (
                        <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>

                    <div className="space-y-1">
                      {dayTasks.slice(0, 5).map((task) => (
                        <div
                          key={task.id}
                          className={`
                            text-xs p-1 rounded border cursor-pointer
                            ${priorityColors[task.priority]}
                            hover:shadow-sm transition-shadow
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                        >
                          <div className="font-medium truncate">
                            {task.title}
                          </div>
                          {task.time && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              <span>{task.time}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {dayTasks.length > 5 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {showTaskModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingTask ? "Edit Task" : "Create New Task"}
                  </h3>
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-gray-600 mt-1">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Task description..."
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={taskForm.time}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, time: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, priority: e.target.value })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  <input
                    type="text"
                    value={taskForm.assignee}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, assignee: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Assign to..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {taskForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add tag and press Enter..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(e.target.value.trim());
                        e.target.value = "";
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleTaskSubmit}
                    className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                  {editingTask && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(editingTask.id)}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;
