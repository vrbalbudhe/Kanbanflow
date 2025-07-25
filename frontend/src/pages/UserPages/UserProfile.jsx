import React, { useContext, useState } from "react";
import { Pencil, Lock } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) return null;

  return (
    <div className="min-h-screen select-none bg-gradient-to-br from-gray-50 to-white md:px-4">
      <div className="max-w-full mx-auto bg-white rounded-2xl md:p-8 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <ProfileHeader user={user} />
          {/* <EditProfileButton /> */}
        </div>
        <ProfileDetails user={user} />
        <PasswordChangeForm
          passwordData={passwordData}
          setPasswordData={setPasswordData}
        />
      </div>
    </div>
  );
}

function ProfileHeader({ user }) {
  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-6 mb-6 md:mb-0">
      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
        {initials}
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {user.username}
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}

function ProfileDetails({ user }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
      <DetailItem label="User ID" value={user.id} />
      <DetailItem label="Username" value={user.username} />
      <DetailItem label="Email" value={user.email} />
      <DetailItem label="Created At" value={formatDate(user.createdAt)} />
      <DetailItem label="Updated At" value={formatDate(user.updatedAt)} />
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 uppercase font-medium tracking-wide">
        {label}
      </span>
      <span className="text-sm text-gray-900 mt-1 break-words">{value}</span>
    </div>
  );
}

function EditProfileButton() {
  return (
    <button className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm">
      <Pencil className="h-4 w-4 mr-2" />
      Edit Profile
    </button>
  );
}

function PasswordChangeForm({ passwordData, setPasswordData }) {
  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Change password form submitted:", passwordData);
  };

  return (
    <div className="border-t pt-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Lock className="h-5 w-5 text-gray-500" />
        Change Password
      </h3>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div className="flex flex-col">
          <label htmlFor="oldPassword" className="text-sm text-gray-600 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="newPassword" className="text-sm text-gray-600 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="text-sm text-gray-600 mb-1"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default UserProfile;
