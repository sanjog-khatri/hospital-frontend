"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import { Calendar, Clock, ArrowRight, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => setToken(localStorage.getItem("token")), []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchAppointments();
  }, [token]);

  const handleReschedule = (id) => toast.info("Reschedule coming soon");

  // Open modal on cancel click
  const handleCancelClick = (appt) => {
    setSelectedAppt(appt);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppt) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/appointments/${selectedAppt._id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      } else toast.error("Failed to cancel appointment");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setCancelModalOpen(false);
      setSelectedAppt(null);
    }
  };

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  // Separate upcoming and completed
  const upcoming = appointments.filter((a) =>
    ["pending", "confirmed"].includes(a.status?.toLowerCase())
  );
  const completed = appointments.filter(
    (a) => a.status?.toLowerCase() === "completed"
  );

  const renderCard = (appt, showActions = true) => {
    const doctor = appt.doctor || {};
    const user = doctor.user || {};
    const isConfirmed = appt.status?.toLowerCase() === "confirmed";

    return (
      <div
        key={appt._id}
        className="flex items-center justify-between p-4 rounded-3xl border shadow-sm"
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
        }}
      >
        {/* Doctor info */}
        <div className="flex items-center gap-4">
          <img
            src={
              user.profileImage
                ? `http://localhost:5000${user.profileImage}`
                : "/default-avatar.png"
            }
            alt={user.name || "Doctor"}
            className="w-20 h-20 rounded-2xl object-cover border"
            style={{ borderColor: "var(--border)" }}
          />
          <div>
            <h3 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
              {user.name || "Unknown Doctor"}
            </h3>
            <p className="text-sm" style={{ color: "var(--secondary-foreground)" }}>
              {doctor.specialization || "General"}
            </p>
            <div className="flex gap-4 mt-1 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(appt.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {appt.time}
              </span>
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isConfirmed ? "var(--accent)" : "var(--muted)",
                  color: isConfirmed ? "var(--accent-foreground)" : "var(--muted-foreground)",
                }}
              >
                {appt.status?.toUpperCase() || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleReschedule(appt._id)}
              className="px-4 py-2 rounded-2xl text-sm font-medium"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Reschedule
            </button>

            <button
              onClick={() => handleCancelClick(appt)}
              disabled={["confirmed", "completed"].includes(
                appt.status?.toLowerCase()
              )}
              className={`px-4 py-2 rounded-2xl text-sm font-medium border ${
                ["confirmed", "completed"].includes(appt.status?.toLowerCase())
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              style={{
                borderColor: "var(--border)",
                color: ["confirmed", "completed"].includes(
                  appt.status?.toLowerCase()
                )
                  ? "var(--muted-foreground)"
                  : "var(--foreground)",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-20 px-6 pb-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Appointments</h1>
        <p className="text-muted-foreground mb-8">
          Manage your upcoming visits and review your medical history.
        </p>

        {/* Upcoming */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
            <a
              href="/doctors"
              className="text-primary hover:text-black flex items-center gap-2 group"
            >
              Book New Appointment{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">{upcoming.map((appt) => renderCard(appt, true))}</div>
          )}
        </div>

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Sessions</h2>
            <div className="space-y-4">{completed.map((appt) => renderCard(appt, false))}</div>
          </div>
        )}

        {/* Cancel Modal */}
        {cancelModalOpen && selectedAppt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-background rounded-3xl shadow-2xl max-w-sm w-full p-6 relative">
              {/* Close Button */}
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
                  {selectedAppt?.doctor?.user?.name || "the doctor"}
                </span>{" "}
                on{" "}
                <span className="font-medium">
                  {new Date(selectedAppt?.date).toLocaleDateString()}
                </span>{" "}
                at{" "}
                <span className="font-medium">{selectedAppt?.time}</span>?
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
                  className="px-4 py-2 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}