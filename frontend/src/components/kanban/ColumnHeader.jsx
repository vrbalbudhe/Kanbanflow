// components/ColumnHeader.jsx
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateColumnTitle } from "../../features/Columns/kanbanSlice";
import { deleteColumn } from "../../features/Columns/columnSlice";
import { AuthContext } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";

const ColumnHeader = ({ column, taskCount }) => {
  const { user, setId, setBoardId, access } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  useEffect(() => {
    if (user?.email && boardId) {
      setBoardId(boardId);
      setId(user?.email);
    }
  }, []);

  const handleSave = () => {
    if (editTitle.trim()) {
      dispatch(
        updateColumnTitle({
          columnId: column?.id,
          title: editTitle.trim(),
        })
      );
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(column?.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${column?.name}" column? ${taskCount > 0 ? "All tasks will be moved to another column." : ""}`
      )
    ) {
      dispatch(deleteColumn(column?.id));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className="group flex items-center justify-between p-4 rounded-t-xl border-b border-blue-100"
      style={{ backgroundColor: "#eaf0fc" }}
    >
      {isEditing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 text-sm font-semibold bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all duration-200"
            title="Save"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="Cancel"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: column?.colorCode || "#6366f1" }}
            />
            <h3
              className="font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors text-sm"
              onClick={() => setIsEditing(true)}
              title="Click to edit column title"
            >
              {column?.name}
            </h3>
            <span className="px-2.5 py-1 text-xs bg-white text-indigo-600 rounded-full font-medium border border-indigo-100 shadow-sm">
              {taskCount}
            </span>
          </div>

          {access?.permission === "editor" && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                title="Add task"
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
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                title="Edit column title"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete column"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ColumnHeader;
