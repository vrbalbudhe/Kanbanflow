import React, { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import Sidebar from "../components/kanban/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
export const CreationLayout = () => {
  const { user } = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState();

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="sticky top-0 z-40 w-full">
        <Navbar />
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Sidebar
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
        />

        <div className="flex-1 overflow-x-auto overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
