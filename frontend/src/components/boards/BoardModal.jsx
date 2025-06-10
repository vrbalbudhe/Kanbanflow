import React from "react";
import { X, FileText, Target, ChevronDown } from "lucide-react";

const BoardModal = ({ formData, onChange, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Board
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <div className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target size={16} />
            Project Type
          </div>
          <div className="relative">
            <select
              name="type"
              value={formData.type}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
            >
              <option value="active">Kanban</option>
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
        <div>
          <div className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FileText size={16} />
            Board Title *
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Enter board title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Describe what this board is for..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          />
        </div>

        <div>
          <div className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Target size={16} />
            Status
          </div>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default BoardModal;
