import { CommandIcon, Info } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserShowcase } from "../../components/members/UserShowcase";

function MembersPage() {
  const params = useParams();
  const boardId = params?.id;
  const dispatch = useDispatch();
  const fullState = useSelector((state) => state);

  const columnState = useSelector((state) => state.column || {});
  const boardState = useSelector((state) => state.boards || {});
  const kanbanState = useSelector((state) => state.kanban || {});
  const taskState = useSelector((state) => state.task || {});

  const {
    columnList = [],
    loading: columnsLoading = false,
    error: columnsError = null,
  } = columnState;

  const {
    currentBoard = null,
    boardList = [],
    status: boardStatus = "idle",
    error: boardError = null,
  } = boardState;

  const renderHeader = () => (
    <div className="w-full mb-8 select-none flex justify-between items-center flex-wrap">
      <div>
        <h1 className="text-3xl font-medium text-gray-700 tracking-tight mb-2">
          Members Forum
          <span className="text-xs text-blue-700 font-sans font-semibold -tracking-tight">
            {" -"}
            {fullState?.board?.currentBoard?.title?.toUpperCase()}
          </span>
        </h1>
        <h1 className="text-sm italic flex justify-start items-center gap-1 font-normal text-gray-500 mb-2">
          <span>
            <Info className="h-4 w-4 text-gray-600" />
          </span>
          {fullState?.board?.currentBoard?.description}
        </h1>
      </div>
      <p className="text-gray-400 text-sm flex justify-center items-center gap-1">
        <span>
          <CommandIcon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="text-gray-500 font-semibold">board-</span>
        {boardId}
      </p>
      {currentBoard?.description && (
        <p className="text-gray-600 text-sm mt-1 w-full">
          {currentBoard.description}
        </p>
      )}
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
