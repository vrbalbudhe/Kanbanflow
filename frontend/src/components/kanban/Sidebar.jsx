import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Archive,
  User,
  Calendar,
  MenuIcon,
  Kanban,
  HeartHandshake,
} from "lucide-react";

function Sidebar({ selectedIcon, setSelectedIcon }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getCurrentBoardId = () => {
    if (id) return id;
    const currentPath = location.pathname;
    const boardIdMatch = currentPath.match(/\/kanban\/([^\/]+)/);
    return boardIdMatch ? boardIdMatch[1] : null;
  };

  const currentBoardId = getCurrentBoardId();

  const menuItems = [
    {
      icon: <img className=" w-5 h-5" src="/k.svg" alt="" />,
      label: "home",
      path: currentBoardId ? `/kanban/${currentBoardId}/home` : "/kanban",
      isKanban: true,
    },
    {
      icon: <User size={25} />,
      label: "members",
      path: currentBoardId ? `/kanban/${currentBoardId}/members` : "/kanban",
    },
    {
      icon: <HeartHandshake size={25} />,
      label: "discussion",
      path: `/kanban${currentBoardId ? `/${currentBoardId}/discussion` : ""}`,
    },
    {
      icon: <Calendar size={25} />,
      label: "calender",
      path: `/kanban${currentBoardId ? `/${currentBoardId}/calender` : ""}`,
    },
    {
      icon: <Archive size={25} />,
      label: "archive",
      path: `/kanban${currentBoardId ? `/${currentBoardId}/archive` : ""}`,
    },
  ];

  const handleNavigation = (item) => {
    setSelectedIcon(item.label);

    if (!currentBoardId && !item.isKanban) {
      console.warn("No board selected");
      return;
    }

    navigate(item.path);
  };

  const getActiveItem = () => {
    const currentPath = location.pathname.toLowerCase();

    const labels = ["home", "members", "discussion", "calender", "archive"];
    const matchedLabel = labels.find((label) =>
      currentPath.endsWith(`/${label}`)
    );

    if (matchedLabel) return matchedLabel;

    if (currentPath.match(/^\/kanban\/[^\/]+$/)) {
      return "home";
    }

    return selectedIcon;
  };

  const activeItem = getActiveItem();

  return (
    <div
      className={`min-h-screen bg-white text-gray-800 p-4 shadow-md transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className={`text-gray-800 mb-6 ${
          !isCollapsed ? "" : " ml-3 justify-center items-center w-full"
        } focus:outline-none`}
      >
        {isCollapsed ? <MenuIcon /> : <MenuIcon />}
      </button>

      <ul className="space-y-1">
        {menuItems.map((item, index) => (
          <li
            onClick={() => handleNavigation(item)}
            key={index}
            className={`flex ${
              isCollapsed ? "justify-center" : ""
            } cursor-pointer items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
              activeItem === item.label ? "bg-blue-50" : ""
            } ${!currentBoardId && !item.isKanban ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`flex items-center ${
                activeItem === item.label ? "text-blue-700" : "text-gray-600"
              }`}
            >
              {React.cloneElement(item.icon, {
                color: activeItem === item.label ? "#2563eb" : "#4b5563",
              })}
            </span>
            {!isCollapsed && (
              <span
                className={
                  activeItem === item.label
                    ? "text-blue-700 font-medium"
                    : "text-gray-600"
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Optional: Show current board info */}
      {!isCollapsed && currentBoardId && (
        <div className="mt-4 p-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Current Board:</p>
          <p className="text-sm font-medium text-gray-700 truncate">
            {currentBoardId}
          </p>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
