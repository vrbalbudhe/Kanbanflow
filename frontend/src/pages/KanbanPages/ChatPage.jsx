import { CommandIcon, Info } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTask, addChat, fetchChats } from "../../features/chats/chatSlice";
import { AuthContext } from "../../contexts/AuthContext";

function ChatPage() {
  const { user } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const taskId = params?.chatId;
  const dispatch = useDispatch();

  const chat = useSelector((state) => state.chat);
  const board = useSelector((state) => state.board);

  const [messages, setMessages] = useState([]);

  const currentUserId = user?.username;

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTask({ taskId }));
      dispatch(fetchChats({ taskId }));
    }
  }, [taskId]);
  const task = chat?.currentTask;
  const chats = chat?.chatList;
  console.log(messages);

  useEffect(() => {
    if (chat?.chatList) {
      setMessages(chat?.chatList);
    }
  }, [chat?.chatList]);

  const handleSend = (text) => {
    const messageObj = {
      message: text,
      senderId: currentUserId,
      taskId,
    };

    dispatch(addChat(messageObj)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setMessages((prev) => [
          ...prev,
          {
            text,
            senderId: currentUserId,
          },
        ]);
      }
    });
    dispatch(fetchChats({ taskId }));
  };

  const taskInfo = (task) => (
    <div className="w-full p-4 h-fit rounded-2xl border mb-5 border-gray-500 bg-white shadow-sm">
      <div className="mb-2">
        <h2 className="text-xl text-orange-400 font-semibold">
          {task[0]?.title}
        </h2>
        <p className="text-sm text-gray-600">{task[0]?.description}</p>
      </div>
      <div className="flex flex-wrap justify-between text-xs text-gray-500">
        <p>
          <span className="font-medium">Priority:</span> {task[0]?.priority}
        </p>
        <p>
          <span className="font-medium">Assignee:</span> {task[0]?.assigneeId}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(task[0]?.createdAt).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {new Date(task[0]?.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );

  const renderHeader = () => {
    const currentBoard = board?.currentBoard;
    return (
      <div className="w-full mb-8 select-none flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-medium text-gray-700 tracking-tight mb-2">
            Task Chat Forum
            <span className="text-xs text-blue-700 font-sans font-semibold -tracking-tight">
              {" -"}
              {currentBoard?.title?.toUpperCase()}
            </span>
          </h1>
          <h1 className="text-sm italic flex justify-start items-center gap-1 font-normal text-gray-500 mb-2">
            <span>
              <Info className="h-4 w-4 text-gray-600" />
            </span>
            {currentBoard?.description}
          </h1>
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
  };

  const MessageInput = ({ onSend }) => {
    const [message, setMessage] = useState("");

    const handleSend = () => {
      if (!message.trim()) return;
      onSend(message.trim());
      setMessage("");
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div className="flex items-center p-3 border-t border-gray-300 bg-white">
        <textarea
          className="flex-grow resize-none border rounded-xl px-4 py-2 mr-2 text-sm h-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    );
  };

  const MessageForum = ({ messages, currentUserId }) => (
    <div className="w-full h-96 p-4 overflow-y-auto rounded-xl mb-4">
      {messages.map((msg, index) => {
        const isSender = msg.senderId === currentUserId;
        return (
          <div
            key={index}
            className={`flex ${isSender ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`max-w-xs p-3 rounded-2xl shadow-md ${
                isSender
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg?.message || msg?.text}</p>
              <p className="text-[10px] text-right mt-1 opacity-60">
                {msg?.senderId}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen min-w-[80%] bg-gradient-to-br absolute from-zinc-50 via-gray-50 to-white p-6 overflow-hidden">
      <div className="max-w-full mx-auto">{renderHeader()}</div>
      {task ? (
        taskInfo(task)
      ) : (
        <div className="mb-5 p-4 rounded-2xl border border-gray-300 bg-white text-gray-400">
          Loading task info...
        </div>
      )}
      <MessageForum messages={messages} currentUserId={currentUserId} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default ChatPage;
