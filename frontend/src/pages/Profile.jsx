import { useContext, useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiEdit2,
  FiLock,
  FiSave,
  FiX,
  FiLogOut,
  FiAward,
  FiFileText,
  FiMic,
  FiAlertCircle,
} from "react-icons/fi";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { user, login, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/auth/profile");

      setProfile(res.data);

      setName(res.data.name || "");
      setEmail(res.data.email || "");
    } catch (err) {
      console.error(err);

      if (user) {
        setProfile(user);
        setName(user.name || "");
        setEmail(user.email || "");
      }

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await API.put("/auth/profile", {
        name: name.trim(),
        email: email.trim(),
      });

      setProfile(res.data);

      const token = localStorage.getItem("token");

      if (token) {
        login(token, res.data);
      }

      setEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setShowPasswordForm(false);

      setSuccess("Password changed successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 text-lg">
          Loading profile...
        </p>
      </div>
    );
  }

  const displayUser = profile || user;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            My Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account and view your interview performance.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4">
            <FiAlertCircle />

            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-4">
            <span>✓</span>

            <span>{success}</span>
          </div>
        )}

        {/* Profile Layout */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <div className="glass rounded-2xl p-6">

            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-4xl font-bold">
                {displayUser?.name
                  ? displayUser.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <h2 className="text-2xl font-bold mt-5">
                {displayUser?.name || "User"}
              </h2>

              <p className="text-slate-400 mt-1">
                {displayUser?.email || "No email available"}
              </p>

              <div className="mt-6 w-full space-y-3">

                <button
                  onClick={() => {
                    setEditing(true);
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition"
                >
                  <FiLock />
                  Change Password
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                >
                  <FiLogOut />
                  Logout
                </button>

              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Account Information */}
            <div className="glass rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-xl font-semibold">
                    Account Information
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Your basic account details
                  </p>
                </div>

                {editing && (
                  <button
                    onClick={() => {
                      setEditing(false);
                      setName(displayUser?.name || "");
                      setEmail(displayUser?.email || "");
                      setError("");
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700"
                  >
                    <FiX />
                  </button>
                )}

              </div>

              <div className="space-y-5">

                {/* Name */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Full Name
                  </label>

                  {editing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
                      <FiUser className="text-cyan-400" />

                      <span>
                        {displayUser?.name || "Not available"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Email Address
                  </label>

                  <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3">
                    <FiMail className="text-cyan-400" />

                    {editing ? (
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-transparent text-white outline-none"
                      />
                    ) : (
                      <span>
                        {displayUser?.email || "Not available"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Save */}
                {editing && (
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    <FiSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                )}

              </div>
            </div>

            {/* Performance */}
            <div className="glass rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Performance Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                Your current InterviewAI performance
              </p>

              <div className="grid sm:grid-cols-3 gap-4">

                {/* ATS */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <FiFileText className="text-cyan-400" />

                    <span className="text-2xl font-bold">
                      {displayUser?.resumeScore || 0}%
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mt-3">
                    ATS / Resume Score
                  </p>
                </div>

                {/* Interviews */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <FiMic className="text-purple-400" />

                    <span className="text-2xl font-bold">
                      {displayUser?.interviewsTaken || 0}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mt-3">
                    Interviews Taken
                  </p>
                </div>

                {/* Resume Score */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <FiAward className="text-yellow-400" />

                    <span className="text-2xl font-bold">
                      {displayUser?.resumeScore || 0}%
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mt-3">
                    Resume Score
                  </p>
                </div>

              </div>
            </div>

            {/* Change Password */}
            {showPasswordForm && (
              <div className="glass rounded-2xl p-6">

                <h2 className="text-xl font-semibold mb-6">
                  Change Password
                </h2>

                <div className="space-y-5">

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Current Password
                    </label>

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) =>
                        setCurrentPassword(e.target.value)
                      }
                      placeholder="Enter current password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition disabled:opacity-50"
                  >
                    <FiLock />

                    {changingPassword
                      ? "Changing..."
                      : "Change Password"}
                  </button>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}