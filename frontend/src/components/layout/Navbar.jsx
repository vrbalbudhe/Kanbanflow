import { useState } from "react";
import {
  Menu,
  X,
  Bell,
  Search,
  Plus,
  User,
  Settings,
  LogOut,
  Home,
  Kanban,
  Users,
  Calendar,
  BarChart3,
  LogIn,
  User2,
  PlusIcon,
} from "lucide-react";
import LoginForm from "../auth/LoginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { Profiler } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const handleLogout = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setErrors({});
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/user/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUser(data?.user);

      window.location.reload();
      if (!response.ok) {
        setErrors({ general: data.message || "Logout failed" });
      } else {
        console.log("Login success:", data);
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const Logo = () => (
    <div className="flex-shrink-0 flex items-center">
      <img className=" w-6 h-6" src="/k.svg" alt="" />
      {/* <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-xl shadow-lg"></div> */}
      <span className="ml-2 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        KanbanFlow
      </span>
    </div>
  );

  const SearchBar = () => (
    <div className="hidden lg:block relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search boards, cards..."
        className="block w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
      />
    </div>
  );

  const LoginButton = () =>
    user ? (
      <button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-all duration-200 transform hover:scale-105"
        onClick={() => navigate("/secure/board")}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Create
      </button>
    ) : (
      <button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center transition-all duration-200 transform hover:scale-105"
        onClick={openModal}
      >
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </button>
    );

  const NotificationBell = () => (
    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 relative group">
      <Bell className="h-6 w-6" />
      <span className="absolute top-1.5 right-1.5 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        3 new notifications
      </div>
    </button>
  );

  const ProfileDropdown = () => (
    <div className="relative">
      <button
        onClick={toggleProfile}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
      >
        <div className="h-9 w-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {user?.username}
          </div>
          <div className="text-xs text-gray-500">USER</div>
        </div>
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
          {user && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="font-semibold text-gray-900">
                {user?.username}
              </div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          )}
          <div className="py-1">
            <ProfileMenuItem
              icon={<User className="h-4 w-4" />}
              text="Profile"
              link="/secure/profile"
            />
            <ProfileMenuItem
              icon={<Settings className="h-4 w-4" />}
              text="Settings"
              link="/secure/settings"
            />
            {user && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={async (e) => {
                    await handleLogout(e);
                    setIsProfileOpen(false);
                    navigate("/");
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <span className="mr-3">
                    <LogOut className="h-4 w-4" />
                  </span>
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const ProfileMenuItem = ({ icon, text, danger = false, link }) => (
    <button
      onClick={() => navigate(link)}
      className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50 hover:text-red-700"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </button>
  );

  const MobileMenuButton = () => (
    <button
      onClick={toggleMenu}
      className="md:hidden p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
    >
      {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  );

  const MobileMenu = () => (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <div className="pt-2 pb-3 space-y-1">
        <MobileMenuItem
          icon={<Home className="h-5 w-5" />}
          text="Dashboard"
          active
        />
        <MobileMenuItem icon={<Kanban className="h-5 w-5" />} text="Boards" />
        <MobileMenuItem icon={<Users className="h-5 w-5" />} text="Teams" />
        <MobileMenuItem
          icon={<Calendar className="h-5 w-5" />}
          text="Calendar"
        />
        <MobileMenuItem
          icon={<BarChart3 className="h-5 w-5" />}
          text="Analytics"
        />
      </div>
      <div className="pt-4 pb-3 border-t border-gray-200">
        <div className="px-3">
          <MobileSearchBar />
        </div>
      </div>
    </div>
  );

  const MobileMenuItem = ({ icon, text, active = false }) => (
    <button
      className={`w-full flex items-center pl-4 pr-4 py-3 border-l-4 text-base font-medium transition-all duration-200 ${
        active
          ? "bg-blue-50 border-blue-500 text-blue-700"
          : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {text}
    </button>
  );

  const MobileSearchBar = () => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>
  );

  const LoginModal = () => (
    <div className="fixed inset-0 w-full h-screen z-50 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-transparent rounded-2xl relative w-full h-[80%] max-w-lg mx-4 animate-in zoom-in-95 duration-200">
        <button
          className="absolute top-10 -right-1 z-10 bg-red-400 text-gray-400 hover:text-gray-600 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
          onClick={closeModal}
        >
          <X className="h-6 w-6 text-white" />
        </button>
        <LoginForm setModal={setModal} />
      </div>
    </div>
  );

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center space-x-4">
            {/* <SearchBar /> */}
            <LoginButton />
            {user && <ProfileDropdown />}
            <MobileMenuButton />
          </div>
        </div>
      </div>

      {isMenuOpen && <MobileMenu />}
      {modal && <LoginModal />}
    </nav>
  );
}
