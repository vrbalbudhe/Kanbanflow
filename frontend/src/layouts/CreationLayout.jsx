import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/kanban/Sidebar";
import { Navigate, Outlet, useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export const CreationLayout = () => {
  const { user } = useContext(AuthContext);
  const [selectedIcon, setSelectedIcon] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const userEmail = user?.email;

  if (!user) return <Navigate to="/" />;

  const handleParticipantAuthorization = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/participant/check`, {
        userEmail,
        boardId: params
      }, { withCredentials: true })

      if (response?.data?.success) {
        toast.info(response?.data?.toastMessage ? response?.data?.toastMessage : response?.data?.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
        });
      } else {
        navigate("/secure/board");
        toast.error(response?.data?.toastMessage ? response?.data?.toastMessage : response?.data?.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
        });
      }
    } catch (error) {
      toast.error(response?.data?.toastMessage ? response?.data?.toastMessage : response?.data?.message);
    }
  }

  useEffect(() => {
    handleParticipantAuthorization();
  }, [userEmail, params?.id])

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
