import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import Sidebar from "../components/kanban/Sidebar";
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedLayout = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen w-full flex bg-white">
      <div className=" w-full flex flex-col">
        <div className="sticky top-0 z-40 w-full">
          <Navbar />
        </div>
        <div className="flex-grow w-full min-h-screen flex justify-center items-start">
          <div className="w-[100%] h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
