import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import Sidebar from "../components/kanban/Sidebar";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="sticky top-0 z-40 w-full">
        <Navbar />
      </div>
      <div className="flex-grow w-full min-h-screen flex justify-center items-start">
        <div className="w-[100%] flex h-full">
          <Outlet />
        </div>
      </div>
      <div className="w-full bg-white">
        <Footer />
      </div>
    </div>
  );
};
