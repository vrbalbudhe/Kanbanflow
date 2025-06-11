import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState([]);

  const [id, setId] = useState();
  const [boardId, setBoardId] = useState();

  const refreshLoginContext = async () => {
    await fetchUser();
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/isToken`,
        {
          withCredentials: true,
        }
      );

      const userInfo = response?.data?.payload;

      if (userInfo?.userId) {
        const response1 = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/get/id/${userInfo?.userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(response1?.data?.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const fetchUserAccess = async ({ boardId, id }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/participant/getAll/${boardId}`,
        {
          withCredentials: true,
        }
      );

      const participants = response?.data?.members || [];
      const userParticipant = participants.find(
        (participant) => participant?.email === id
      );

      const permission = {
        permission: userParticipant?.permission,
        userAccess: userParticipant?.userAccess,
      };

      setAccess(permission || []);
    } catch (error) {
      console.error("Error fetching user access:", error);
      setAccess(false);
    }
  };

  useEffect(() => {
    fetchUser();
    if (id && boardId) {
      fetchUserAccess({ boardId: boardId, id: id });
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [id, boardId]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center backdrop-blur-md">
        <AiOutlineLoading3Quarters className="animate-spin text-blue-600 text-5xl" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        setLoading,
        access,
        setAccess,
        fetchUserAccess,
        loading,
        refreshLoginContext,
        setId,
        setBoardId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
