"use client";

import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useState, useEffect } from "react";

export default function Users({ users, refresh }) {
  const [loading, setLoading] = useState(false);

  const toggleBlock = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/user/block/${userId}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      toast.success(data.message);
      await refresh(); // refresh user list after toggle
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error blocking/unblocking user");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  if (!users || users.length === 0)
    return (
      <p className="text-center text-muted-foreground">
        No users available.
      </p>
    );

  return (
    <div className="bg-card p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="p-2 border-b">User</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              className="hover:bg-muted/20 transition-colors duration-150"
            >
              {/* User Image + Name */}
              <td className="p-2 border-b flex items-center gap-2">
                <img
                  src={
                    u.profileImage
                      ? `http://localhost:5000${u.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <span>{u.name}</span>
              </td>

              <td className="p-2 border-b">{u.email}</td>

              {/* Status badge */}
              <td className="p-2 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.isBlocked
                      ? "bg-destructive text-white"
                      : "bg-accent text-foreground"
                  }`}
                >
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>

              {/* Action Button */}
              <td className="p-2 border-b">
                <button
                  onClick={() => toggleBlock(u._id)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors duration-150 ${
                    u.isBlocked
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-destructive text-white hover:bg-destructive/90"
                  }`}
                >
                  {u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}