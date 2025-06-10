// components/AddTaskForm.jsx
import React, { useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addTask, fetchTasks } from "../../features/tasks/taskSlice";
import { fetchColumns } from "../../features/Columns/columnSlice";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchBoardByBoardId } from "../../features/boards/boardSlice";

const AddTaskForm = ({ columnId, onClose, assignees = [] }) => {
  console.log(columnId);
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assigneeId, setAssigneeId] = useState(user?.id);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const params = useParams();
  const boardId = params.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      await dispatch(
        addTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          columnId,
          boardId,
          assigneeId: user?.username || null,
          tags: tags.map((tag) => ({ title: tag.title, src: tag.src })),
        })
      );
      await dispatch(fetchTasks(columnId));

      await dispatch(fetchBoardByBoardId(boardId));
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssigneeId("");
      setTags([]);
      setTagInput("");
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssigneeId("");
    setTags([]);
    setTagInput("");
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.some((tag) => tag.title === tagInput.trim())) {
      const newTag = {
        title: tagInput.trim(),
        src: `#${Date.now()}`, 
      };
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag.title !== tagToRemove.title));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-white rounded-lg border-2 border-dashed border-gray-300 mb-2"
    >
      <div className="space-y-3">
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="2"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description..."
          className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
        />

        {/* Assignee Selection */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600 min-w-fit">Assignee:</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
            className="flex-1 text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{user?.username}</option>
          </select>
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Tags:</label>
            <div className="flex-1 flex gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tag..."
                className="flex-1 text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Display Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag.title}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600">Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="text-xs px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTaskForm;
