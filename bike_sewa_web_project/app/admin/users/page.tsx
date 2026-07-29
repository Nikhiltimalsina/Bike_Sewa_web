"use client";

import { useEffect, useState, useCallback } from "react";
import {
  adminGetUsersApi,
  adminUpdateUserRoleApi,
  adminDeleteUserApi,
  adminCreateUserApi,
  adminUpdateUserApi,
  AdminUser,
} from "@/api/admin.api";

type UserFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
};

const emptyForm: UserFormState = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modal state: null = closed, "create" = create modal, or an AdminUser being edited
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminGetUsersApi();
      setUsers(data.users || []);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleToggle = async (user: AdminUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      await adminUpdateUserRoleApi(user._id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
      );
    } catch {
      setError("Failed to update role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    setDeletingId(userId);
    try {
      await adminDeleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch {
      setError("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setFormError("");
    setEditingUser(null);
    setModalMode("create");
  };

  const openEditModal = (user: AdminUser) => {
    setForm({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role: user.role,
    });
    setFormError("");
    setEditingUser(user);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingUser(null);
    setFormError("");
  };

  const handleFormChange = (field: keyof UserFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (form.fullName.trim().length < 2) {
      setFormError("Full name must be at least 2 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError("Please provide a valid email address");
      return;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      setFormError("Phone number must be exactly 10 digits");
      return;
    }
    if (modalMode === "create" && form.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    try {
      if (modalMode === "create") {
        const { user } = await adminCreateUserApi({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
        });
        setUsers((prev) => [user, ...prev]);
      } else if (modalMode === "edit" && editingUser) {
        const payload: Record<string, string> = {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          role: form.role,
        };
        if (form.password) payload.password = form.password;

        const { user } = await adminUpdateUserApi(editingUser._id, payload);
        setUsers((prev) => prev.map((u) => (u._id === user._id ? user : u)));
      }
      closeModal();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black">Users</h1>
          <p className="text-white/40 text-sm mt-1">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/30">{users.length} total</span>
          <button
            onClick={openCreateModal}
            className="text-sm font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            + Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
          <button onClick={() => setError("")} className="ml-3 underline">Dismiss</button>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-white/5 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500/50 placeholder:text-slate-500"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#0f172a] border border-slate-700/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 w-48 bg-slate-700/50 rounded mb-2" />
              <div className="h-3 w-32 bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          {search ? "No users match your search" : "No users found"}
        </div>
      ) : (
        <div className="bg-[#0f172a] border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Phone</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-white/40">Role</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                          {user.fullName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <span className="font-semibold text-sm">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-white/60">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-white/60">{user.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {user.role === "admin" ? "👑" : "👤"} {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                          title="Edit user"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRoleToggle(user)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                          title="Toggle role"
                        >
                          {user.role === "admin" ? "→ User" : "→ Admin"}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {deletingId === user._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-[#161b27] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">
                {modalMode === "create" ? "Add New User" : `Edit ${editingUser?.fullName ?? "User"}`}
              </h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white text-xl leading-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleFormChange("fullName", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5">Phone (10 digits)</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5">
                  {modalMode === "create" ? "Password" : "New Password (optional)"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleFormChange("password", e.target.value)}
                  placeholder={modalMode === "edit" ? "Leave blank to keep current password" : ""}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50 placeholder:text-white/30"
                  required={modalMode === "create"}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => handleFormChange("role", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500/50"
                >
                  <option value="user" className="bg-[#161b27]">user</option>
                  <option value="admin" className="bg-[#161b27]">admin</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : modalMode === "create" ? "Create User" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}