// components/AddColumnButton.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addColumn } from "../../features/Columns/columnSlice";
import { useParams } from "react-router-dom";

const AddColumnButton = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [columnTitle, setColumnTitle] = useState("");
  const [colorCode, setColorCode] = useState("#ffffff");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = columnTitle?.trim();
    if (!trimmedTitle) return;

    const boardId = id;
    const orderId = 1;

    dispatch(
      addColumn({
        name: trimmedTitle,
        colorCode,
        boardId,
        orderId: orderId.toString(),
      })
    );

    setColumnTitle("");
    setColorCode("#ffffff");
    setShowForm(false);
  };

  const handleCancel = () => {
    setColumnTitle("");
    setColorCode("#ffffff");
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="w-80 p-4 bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            placeholder="Enter column title..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />

          <input
            type="color"
            value={colorCode}
            onChange={(e) => setColorCode(e.target.value)}
            className="w-full h-10 rounded border p-1"
            title="Pick column color"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!columnTitle.trim()}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              Add Column
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-80 h-24 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 flex flex-col items-center justify-center gap-2 bg-white/50 backdrop-blur-sm"
    >
      <svg
        className="w-8 h-8"
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
      <span className="text-sm font-medium">Add Column</span>
    </button>
  );
};

export default AddColumnButton;
