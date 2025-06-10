import React, { useContext } from "react";
import { Calendar, X } from "lucide-react";
import { statusColors } from "./constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const BoardCard = ({ board, index, backgroundImages, onDelete }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div
        className="h-20 relative"
        style={{
          background: backgroundImages[index % backgroundImages.length],
        }}
      >
        {board?.owner === user?.email && (
          <button
            onClick={() => onDelete(board.id)}
            className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={16} className="text-white" />
          </button>
        )}
      </div>
      <div className="p-6 pt-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">
            {board.title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[board.status]}`}
          >
            {board.status.charAt(0).toUpperCase() + board.status.slice(1)}
          </span>
        </div>
        {board.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {board.description}
          </p>
        )}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar size={14} className="mr-1" />
          Created {new Date(board.createdAt).toLocaleDateString()}
        </div>
        <button
          onClick={() => navigate(`/kanban/${board?.id}/home`)}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Open Board
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
