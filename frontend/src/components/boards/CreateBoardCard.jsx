import React from "react";
import { Plus } from "lucide-react";

const CreateBoardCard = ({ onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center min-h-[240px] cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 group"
  >
    <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-colors">
      <Plus size={24} className="text-gray-400 group-hover:text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Board</h3>
    <p className="text-gray-500 text-center text-sm">Start organizing your project with a new board</p>
  </div>
);

export default CreateBoardCard;
