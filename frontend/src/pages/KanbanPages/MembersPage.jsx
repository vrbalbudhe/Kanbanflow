import { CommandIcon, Info } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserShowcase } from "../../components/members/UserShowcase";

function MembersPage() {
  const { id: boardId } = useParams();

  const {
    currentBoard = null,
    status: boardStatus = "idle",
    error: boardError = null,
  } = useSelector((state) => state.board || {});

  const renderHeader = () => (
    <div className="w-full mb-8 select-none flex justify-between items-center flex-wrap">
      <div>
        <h1 className="text-3xl font-medium text-gray-700 tracking-tight mb-2">
          Members Forum
          {currentBoard?.title && (
            <span className="text-xs text-blue-700 font-sans font-semibold -tracking-tight">
              {" -"}
              {currentBoard.title.toUpperCase()}
            </span>
          )}
        </h1>
        {currentBoard?.description && (
          <h1 className="text-sm italic flex justify-start items-center gap-1 font-normal text-gray-500 mb-2">
            <span>
              <Info className="h-4 w-4 hidden md:block text-gray-600" />
            </span>
            {currentBoard.description}
          </h1>
        )}
      </div>
      <p className="text-gray-400 text-sm flex justify-center items-center gap-1">
        <span>
          <CommandIcon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="text-gray-500 font-semibold">board-</span>
        {boardId}
      </p>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-zinc-50 via-gray-50 to-white p-6 overflow-auto">
      <div className="w-full max-w-full mx-auto">
        {renderHeader()}
        <UserShowcase boardId={boardId} />
      </div>
    </div>
  );
}

export default MembersPage;
