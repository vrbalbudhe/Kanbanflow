import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../lib/firebase";
import { CommandIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTask } from "../../features/chats/chatSlice";
import { AuthContext } from "../../contexts/AuthContext";

function ChatPage() {
  const { user, setId, setBoardId, access } = useContext(AuthContext);
  const params = useParams();
  const boardId = params?.id;
  const taskId = params?.chatId;
  const dispatch = useDispatch();

  const board = useSelector((state) => state.board);
  const [messages, setMessages] = useState([]);
  const currentUserId = user?.username;

  useEffect(() => {
    if (taskId) {
      const q = query(
        collection(db, "chats", taskId, "messages"),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const realtimeMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(realtimeMessages);
      });

      return () => unsubscribe();
    }
  }, [taskId]);

  useEffect(() => {
    if (user?.email && boardId) {
      setBoardId(boardId);
      setId(user?.email);
    }
  }, []);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTask({ taskId }));
    }
  }, [taskId]);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, "chats", taskId, "messages"), {
        message: text,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error sending message to Firebase:", err);
    }
  };

  const renderHeader = () => {
    const currentBoard = board?.currentBoard;
    return (
      <div className="w-full rounded-full select-none mt-1 md:px-2 py-2 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="md:pl-2 md:pr-4">
          <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
            Task Chat Forum
            <span className="text-xs text-blue-700 font-sans font-semibold -tracking-tight">
              {" -"}
              {currentBoard?.title?.toUpperCase()}
            </span>
          </h1>
        </div>
        <p className="text-sm w-full md:w-fit hidden md:flex justify-start md:justify-center items-center gap-1">
          <span className="hidden md:block">
            <CommandIcon className="h-4 w-4" />
          </span>
          {boardId}
        </p>
      </div>
    );
  };

  const highlightMentions = (text) => {
    const parts = text.split(/(\s+)/).map((part, i) => {
      if (part.startsWith("@")) {
        return (
          <span key={i} className="text-blue-500 font-semibold">
            {part}
          </span>
        );
      } else if (part.startsWith("#")) {
        return (
          <span key={i} className="text-pink-600 font-semibold">
            {part}
          </span>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
    return <>{parts}</>;
  };

  const MessageInput = ({ onSend, access }) => {
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

    return access?.permission === "editor" && access.userAccess !== "guest" ? (
      <div className="flex items-center p-3 rounded-2xl border-2 border-gray-300 shadow-md mt-2">
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
    ) : null;
  };

  const MessageForum = ({ messages, currentUserId }) => (
    <div className="w-full min-h-[500px] p-4 overflow-y-auto rounded-xl mb-4">
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
                  ? "border-2 shadow-sm border-blue-500 text-gray-800 font-semibold rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{highlightMentions(msg?.message)}</p>
              <p className="text-[10px] select-none text-right mt-1 opacity-60">
                {msg?.senderId}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-50 via-gray-50 to-white px-6 overflow-hidden">
      {renderHeader()}
      <MessageForum messages={messages} currentUserId={currentUserId} />
      <MessageInput onSend={handleSend} access={access} />
    </div>
  );
}

export default ChatPage;
