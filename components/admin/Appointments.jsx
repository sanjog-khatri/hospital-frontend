"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "../ui/spinner";

export default function Appointments({ refresh }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null); // tracks which appointment is updating

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch appointments");
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refresh]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoadingId(id);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/admin/appointments/status/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons = {
    pending: <Clock className="w-3.5 h-3.5" />,
    confirmed: <Check className="w-3.5 h-3.5" />,
    completed: <Check className="w-3.5 h-3.5" />,
    cancelled: <X className="w-3.5 h-3.5" />,
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-3 text-foreground">
          <Calendar className="w-6 h-6 text-primary" />
          Appointments
        </h2>
        <p className="text-sm text-muted-foreground">
          {appointments.length} total appointments
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Patient</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Doctor</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Date</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Time</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {appointments.map((a) => (
              <tr
                key={a._id}
                className="hover:bg-muted/50 transition-all duration-200 group"
              >
                {/* Patient */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {a.user?.profileImage && (
                      <img
                        src={`http://localhost:5000${a.user.profileImage}`}
                        alt={a.user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{a.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        {a.user?.email}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Doctor */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {a.doctor?.user?.profileImage && (
                      <img
                        src={`http://localhost:5000${a.doctor.user.profileImage}`}
                        alt={a.doctor.user.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-border"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{a.doctor?.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.doctor?.specialization}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-foreground">
                  {new Date(a.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                {/* Time */}
                <td className="px-6 py-4 font-medium text-foreground">{a.time}</td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Badge
                    className={`${statusColors[a.status]} flex items-center gap-1.5 px-3 py-1 text-xs font-medium`}
                  >
                    {statusIcons[a.status]}
                    <span className="capitalize">{a.status}</span>
                  </Badge>
                </td>
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  {a.status === "cancelled" ? (
                    <span className="text-sm text-muted-foreground">No actions available</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      {["confirmed", "completed", "cancelled"].map((s) => {
                        if (s === a.status) return null;

                        const isDanger = s === "cancelled";
                        const Icon = s === "cancelled" ? X : Check;

                        return (
                          <button
                            key={s}
                            onClick={() => updateStatus(a._id, s)}
                            className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95
                              ${isDanger
                                ? "bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950 dark:text-red-400"
                                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              }`}
                            title={`Mark as ${s.charAt(0).toUpperCase() + s.slice(1)}`}
                            disabled={actionLoadingId === a._id}
                          >
                            {actionLoadingId === a._id ? (
                              <Spinner className="w-4 h-4" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && !loading && (
        <div className="text-center py-12 text-muted-foreground">
          No appointments found.
        </div>
      )}
    </div>
  );
}