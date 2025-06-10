import React, { useState, useEffect, useContext } from "react";
import {
  Command,
  Info,
  Users,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  Shield,
  Eye,
  UserCheck,
  Clock,
  Mail,
  Crown,
  User,
  UserX,
  Settings,
  ChevronDown,
  Calendar,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addParticipants,
  getParticipants,
  fetchBoardByBoardId,
  updParticipants,
} from "../../features/participants/participantSlice";
import { AuthContext } from "../../contexts/AuthContext";

export const UserShowcase = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const dispatch = useDispatch();
  const fullState = useSelector((state) => state);
  // const participantList = fullState?.participant?.participantList;
  const participantList = useSelector(
    (state) => state?.participant?.participantList
  );
  const status = useSelector((state) => state?.participant?.status);
  // const status = fullState?.participant?.status;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPermission, setFilterPermission] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    permission: "viewer",
    userAccess: "guest",
  });
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    permission: "viewer",
    userAccess: "guest",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchAllUsers();
    if (id) {
      dispatch(getParticipants({ boardId: id }));
      dispatch(fetchBoardByBoardId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (newUser.email && newUser.email.length > 0) {
      const filtered = allUsers.filter(
        (usr) =>
          usr.email.toLowerCase().includes(newUser.email.toLowerCase()) &&
          !participantList.some(
            (participant) => participant.email === usr.email
          )
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [newUser.email, allUsers, participantList]);

  const getPermissionIcon = (permission) => {
    switch (permission) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case "editor":
        return <Edit3 className="w-4 h-4 text-blue-600" />;
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "worker":
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case "guest":
        return <UserX className="w-4 h-4 text-gray-600" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getUserTypeColor = (userType) => {
    switch (userType) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "worker":
        return "bg-green-100 text-green-800 border-green-200";
      case "guest":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPermissionColor = (permission) => {
    switch (permission) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getOnlineStatus = (lastOnline) => {
    const now = new Date();
    const lastOnlineDate = new Date(lastOnline);
    const diff = now - lastOnlineDate;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 5) return "online";
    if (minutes < 30) return "away";
    return "offline";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getFilteredParticipants = () => {
    return participantList.filter((participant) => {
      const matchesSearch =
        participant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" || participant.userAccess === filterType;
      const matchesPermission =
        filterPermission === "all" ||
        participant.permission === filterPermission;
      return matchesSearch && matchesType && matchesPermission;
    });
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/user/all", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data?.user || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = (userId) => {
    setShowDropdown(null);
  };

  const handleEditUser = (participant) => {
    setEditUser({
      id: participant.id || participant._id,
      name: participant.name || "",
      email: participant.email || "",
      permission: participant.permission || "viewer",
      userAccess: participant.userAccess || "guest",
    });
    setShowEditModal(true);
    setShowDropdown(null);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editUser.email) {
      alert("Email is required");
      return;
    }

    try {
      await dispatch(
        updParticipants({
          boardId: id,
          participantId: editUser?.id,
          permission: editUser?.permission,
          userAccess: editUser?.userAccess,
        })
      ).unwrap();

      setShowEditModal(false);
      setEditUser({
        id: "",
        name: "",
        email: "",
        permission: "viewer",
        userAccess: "guest",
      });

      // Refresh participants list
      dispatch(getParticipants({ boardId: id }));
    } catch (error) {
      console.error("Error updating participant:", error);
      alert("Failed to update participant. Please try again.");
    }
  };

  const handleEmailChange = (value) => {
    setNewUser((prev) => ({ ...prev, email: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUser.email || newUser.email === "None") {
      alert("Please select a user");
      return;
    }

    try {
      await dispatch(
        addParticipants({
          email: newUser?.email,
          permission: newUser?.permission,
          userAccess: newUser?.userAccess,
          boardId: id,
        })
      ).unwrap();

      setShowAddModal(false);
      setNewUser({
        name: "",
        email: "",
        permission: "viewer",
        userAccess: "guest",
      });

      setShowUserSuggestions(false);
      dispatch(getParticipants({ boardId: id }));
    } catch (error) {
      console.error("Error adding participant:", error);
      alert("Failed to add participant. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditInputChange = (field, value) => {
    setEditUser((prev) => ({ ...prev, [field]: value }));
  };

  const getStatsData = () => {
    const totalMembers = participantList.length;
    const onlineMembers = participantList.filter(
      (p) => getOnlineStatus(p.lastOnline || p.createdAt) === "online"
    ).length;
    const admins = participantList.filter(
      (p) => p.userAccess === "admin"
    ).length;
    const workers = participantList.filter(
      (p) => p.userAccess === "worker"
    ).length;

    return { totalMembers, onlineMembers, admins, workers };
  };

  const renderStatsCards = () => {
    const { totalMembers, onlineMembers, admins, workers } = getStatsData();

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-red-600">{admins}</p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Workers</p>
              <p className="text-2xl font-bold text-green-600">{workers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
    );
  };

  const renderSearchAndFilters = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="admin">Admin</option>
              <option value="worker">Worker</option>
              <option value="guest">Guest</option>
            </select>
            <select
              value={filterPermission}
              onChange={(e) => setFilterPermission(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Permissions</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMemberCard = (participant) => {
    const status = getOnlineStatus(
      participant.lastOnline || participant.createdAt
    );
    const createdDate = new Date(participant.createdAt);

    return (
      <div
        key={participant.id || participant._id}
        className="w-full flex items-center justify-between gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative">
            <img
              src={
                participant.avatar ||
                `https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png`
              }
              alt={participant.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                status
              )}`}
            ></div>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {participant.name || participant.email?.split("@")[0]}
            </h3>
            <p className="text-sm text-gray-600 flex items-center gap-1 truncate">
              <Mail className="w-3 h-3" />
              {participant.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-xs text-gray-500 text-center">
            <div className="mb-1 font-medium text-gray-700">User Type</div>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getUserTypeColor(
                participant.userAccess
              )}`}
            >
              {getUserTypeIcon(participant.userAccess)}
              {participant.userAccess}
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <div className="mb-1 font-medium text-gray-700">Permission</div>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPermissionColor(
                participant.permission
              )}`}
            >
              {getPermissionIcon(participant.permission)}
              {participant.permission}
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            <div className="mb-1 font-medium text-gray-700">Joined</div>
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="w-3 h-3" />
              {createdDate.toLocaleDateString()}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() =>
                setShowDropdown(
                  showDropdown === participant.id ? null : participant.id
                )
              }
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showDropdown === participant.id && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-32">
                <button
                  onClick={() => handleEditUser(participant)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(participant.id)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderMembersGrid = () => {
    const filteredParticipants = getFilteredParticipants();

    if (filteredParticipants.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No members found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      );
    }

    return (
      <div className=" w-full gap-1 flex flex-col">
        {filteredParticipants.map((participant) =>
          renderMemberCard(participant)
        )}
      </div>
    );
  };

  const renderAddUserModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add New Member</h3>
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowUserSuggestions(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <select
                required
                value={newUser.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select User</option>
                {allUsers
                  .filter(
                    (usr) =>
                      usr.email !== user?.email &&
                      !participantList.some(
                        (participant) => participant.email === usr.email
                      )
                  )
                  .map((usr, index) => (
                    <option key={usr._id || usr.id || index} value={usr?.email}>
                      {usr?.username || usr?.name || usr?.email}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={newUser?.userAccess}
                onChange={(e) =>
                  handleInputChange("userAccess", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="guest">Guest</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission
              </label>
              <select
                value={newUser.permission}
                onChange={(e) =>
                  handleInputChange("permission", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Adding..." : "Add Member"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowUserSuggestions(false);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEditUserModal = () => {
    if (!showEditModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Member</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editUser.email}
                disabled
                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <select
                value={editUser?.userAccess}
                onChange={(e) =>
                  handleEditInputChange("userAccess", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="guest">Guest</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Permission
              </label>
              <select
                value={editUser.permission}
                onChange={(e) =>
                  handleEditInputChange("permission", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Updating..." : "Update Member"}
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (status === "loading" && participantList.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderStatsCards()}
      {renderSearchAndFilters()}
      {renderMembersGrid()}
      {renderAddUserModal()}
      {renderEditUserModal()}
    </div>
  );
};
