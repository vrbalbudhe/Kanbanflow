import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshLoginContext = async () => {
    await fetchUser();
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/isToken",
        {
          withCredentials: true,
        }
      );

      const userInfo = response?.data?.payload;

      if (userInfo?.userId) {
        const response1 = await axios.get(
          `http://localhost:8000/api/user/get/id/${userInfo?.userId}`,
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

  useEffect(() => {
    fetchUser();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
        loading,
        refreshLoginContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
