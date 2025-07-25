import React, { useContext, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import Sidebar from "../components/kanban/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
export const CreationLayout = () => {
  const { user } = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="sticky top-0 z-40 w-full">
        <Navbar />
      </div>
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden md:block fixed">
          <Sidebar
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
            isexp={setIsExpanded}
          />
        </div>

        <div
          className={`flex-1 overflow-x-auto ${!isExpanded ? "md:ml-56" : "md:ml-16"} overflow-y-auto h-full`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
