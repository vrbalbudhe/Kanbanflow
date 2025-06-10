import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllChatsByBoardId } from "../../features/chats/chatSlice";
import { CommandIcon, Info } from "lucide-react";

// Import your async thunk

function DiscussionPage() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id;
  const dispatch = useDispatch();

  const { AllChats, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (id) {
      dispatch(fetchAllChatsByBoardId({ boardId: id }));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Discussion Board {id}</h1>
        <div className="flex items-center justify-center">
          <div className="text-lg">Loading chats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Discussion Board {id}</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  const renderHeader = () => (
    <div className="w-full mb-8 select-none flex justify-between items-center flex-wrap">
      <div className="flex flex-col">
        <div className="flex gap-2">
          <h1 className="text-3xl font-medium text-gray-700 tracking-tight">
            Discussions
          </h1>
          <h2 className="text-3xl font-semibold text-emerald-500">
            ({AllChats.length})
          </h2>
        </div>
        <p className="text-gray-600 mt-1">
          Get Engage Into Working Discussions For The Specific Tasks.
        </p>
      </div>
      <p className="text-gray-400 text-sm flex justify-center items-center gap-1">
        <span>
          <CommandIcon className="h-4 w-4 text-gray-600" />
        </span>
        <span className="text-gray-500 font-semibold">board-</span>
        {id}
      </p>
    </div>
  );

  return (
    <div className="p-4 w-full">
      {renderHeader()}

      {AllChats && AllChats.length > 0 ? (
        <div className="w-full flex flex-wrap gap-3">
          {AllChats.map((chat, index) => (
            <div
              onClick={() => navigate(`/kanban/${id}/chat/${chat?.Task?.id}`)}
              key={index}
              className="bg-white w-fit px-5 cursor-pointer border border-gray-300 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-600 text-xl mb-2">
                    {chat?.Task?.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-2">
                    {chat?.Task?.description || "No message content"}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>By: {chat?.Task?.assigneeId || "Unknown"}</span>
                    <span>
                      {chat?.Task?.createdAt
                        ? new Date(chat?.Task?.createdAt).toLocaleDateString()
                        : "No date"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-2 h-screen w-full flex justify-start items-start">
          <p className="text-gray-500">No chats found for this board.</p>
        </div>
      )}
    </div>
  );
}

export default DiscussionPage;
