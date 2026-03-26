"use client";

import { toast } from "sonner";
import { Check, X, ShieldOff } from "lucide-react"; // icons
import { Spinner } from "../ui/spinner";
import { useState } from "react";

export default function Doctors({ doctors, refresh }) {
  const [loadingId, setLoadingId] = useState(null); // loading for single action

  const approveDoctor = async (id) => {
    setLoadingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/doctor/approve/${id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Doctor approved");
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const rejectDoctor = async (id) => {
    setLoadingId(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/doctor/reject/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Doctor rejected");
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const toggleBlock = async (userId) => {
    setLoadingId(userId);
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
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  if (!doctors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-xl shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Doctors</h2>
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr>
            <th className="p-2 border-b">Profile</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Specialization</th>
            <th className="p-2 border-b">Verified</th>
            <th className="p-2 border-b">Blocked</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((d) => (
            <tr key={d._id} className="hover:bg-muted/10 transition">
              <td className="p-2 border-b">
                <img
                  src={
                    d.user.profileImage
                      ? `http://localhost:5000${d.user.profileImage}`
                      : "/default-avatar.png"
                  }
                  alt={d.user.name}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
              </td>
              <td className="p-2 border-b">{d.user.name}</td>
              <td className="p-2 border-b">{d.specialization}</td>
              <td className="p-2 border-b">{d.isVerified ? "Yes" : "No"}</td>
              <td className="p-2 border-b">{d.user.isBlocked ? "Yes" : "No"}</td>
              <td className="p-2 border-b flex gap-2">
                {!d.isVerified && (
                  <>
                    <button
                      onClick={() => approveDoctor(d._id)}
                      className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
                      title="Approve Doctor"
                      disabled={loadingId === d._id}
                    >
                      {loadingId === d._id ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <Check size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => rejectDoctor(d._id)}
                      className="p-2 rounded-lg bg-destructive text-destructive-foreground hover:opacity-90"
                      title="Reject Doctor"
                      disabled={loadingId === d._id}
                    >
                      {loadingId === d._id ? (
                        <Spinner className="w-4 h-4" />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={() => toggleBlock(d.user._id)}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90"
                  title={d.user.isBlocked ? "Unblock Doctor" : "Block Doctor"}
                  disabled={loadingId === d.user._id}
                >
                  {loadingId === d.user._id ? (
                    <Spinner className="w-4 h-4" />
                  ) : (
                    <ShieldOff size={16} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}