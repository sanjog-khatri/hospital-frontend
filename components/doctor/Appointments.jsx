"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, X, Clock, FolderCheck } from "lucide-react";
import { Spinner } from "../ui/spinner";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // "date" or "status"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const token = localStorage.getItem("token");
  const backendURL = "http://localhost:5000";

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendURL}/api/doctors/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${backendURL}/api/doctors/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Appointment status updated");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleCancelClick = (appt) => {
    setSelectedAppt(appt);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedAppt) return;
    updateStatus(selectedAppt._id, "cancelled");
    setCancelModalOpen(false);
    setSelectedAppt(null);
  };

  const statusColors = {
    confirmed: "bg-blue-500 text-white",
    pending: "bg-yellow-400 text-black",
    completed: "bg-green-600 text-white",
    cancelled: "bg-red-500 text-white",
  };

  const sortedAppointments = [...appointments].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "status") {
      return sortOrder === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  if (appointments.length === 0)
    return <div className="text-center py-10">No appointments found.</div>;

  return (
    <div className="p-4 overflow-x-auto relative">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>

      <table className="w-full min-w-[600px] table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Patient</th>
            <th className="p-3">Email</th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => {
                setSortBy("date");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Date
            </th>
            <th className="p-3">Time</th>
            <th
              className="p-3 cursor-pointer"
              onClick={() => {
                setSortBy("status");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Status
            </th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedAppointments.map((appt) => (
            <tr key={appt._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 flex items-center gap-2">
                {appt.user?.profileImage && (
                  <img
                    src={`${backendURL}${appt.user.profileImage}`}
                    alt={appt.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                {appt.user?.name}
              </td>
              <td className="p-3">{appt.user?.email}</td>
              <td className="p-3">{new Date(appt.date).toLocaleDateString()}</td>
              <td className="p-3">{appt.time}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[appt.status]}`}
                >
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
              </td>
              <td className="p-3 flex justify-center gap-2">
  {["cancelled", "completed"].includes(appt.status) ? (
    <span className="text-gray-400 italic">No actions available</span>
  ) : (
    <>
      {appt.status !== "confirmed" && (
        <Check
          className="w-5 h-5 text-blue-500 cursor-pointer hover:scale-110 transition"
          title="Confirm"
          onClick={() => updateStatus(appt._id, "confirmed")}
        />
      )}
      {appt.status !== "completed" && (
        <FolderCheck
          className="w-5 h-5 text-green-600 cursor-pointer hover:scale-110 transition"
          title="Complete"
          onClick={() => updateStatus(appt._id, "completed")}
        />
      )}
      {appt.status !== "cancelled" && (
        <X
          className="w-5 h-5 text-red-500 cursor-pointer hover:scale-110 transition"
          title="Cancel"
          onClick={() => handleCancelClick(appt)}
        />
      )}
    </>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-lg font-semibold mb-2">Cancel Appointment</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to cancel your appointment with{" "}
              <span className="font-medium">
                {selectedAppt.user?.name || "the patient"}
              </span>{" "}
              on{" "}
              <span className="font-medium">
                {new Date(selectedAppt.date).toLocaleDateString()}
              </span>{" "}
              at <span className="font-medium">{selectedAppt.time}</span>?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-2xl border border-border text-sm font-medium hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-2xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}