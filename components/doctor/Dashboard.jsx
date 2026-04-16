"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "../ui/spinner";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/doctors/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDashboard(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );
  if (!dashboard)
    return (
      <div className="text-center py-10" style={{ color: "var(--foreground)" }}>
        No data available
      </div>
    );

  const { doctor, schedules, appointments, patients, stats } = dashboard;

  const statCards = [
    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, color: "var(--primary)" },
    { label: "Pending", value: stats.pendingAppointments, icon: Clock, color: "var(--accent)" },
    { label: "Completed", value: stats.completedAppointments, icon: CheckCircle, color: "var(--secondary)" },
    { label: "Cancelled", value: stats.cancelledAppointments, icon: XCircle, color: "var(--destructive)" },
  ];

  const backendURL = "http://localhost:5000"; // for images

  return (
    <div className="space-y-6 p-4">
      {/* 👤 Profile */}
      {/* You can add a profile card here if needed */}

      {/* 📊 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((s, idx) => (
          <Card key={idx} style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }} className="text-center p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <span className="font-semibold">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {/* 📅 Schedules */}
      <Card style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
        <CardHeader className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Schedules</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b">Day</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Start Time</th>
                <th className="p-2 border-b">End Time</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => {
                const dateObj = new Date(s.date);
                const day = dateObj.toLocaleDateString(undefined, { weekday: "long" });
                const dateStr = dateObj.toLocaleDateString();
                return (
                  <tr key={s._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-2 border-b">{day}</td>
                    <td className="p-2 border-b">{dateStr}</td>
                    <td className="p-2 border-b">{s.startTime || "-"}</td>
                    <td className="p-2 border-b">{s.endTime || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 📌 Appointments */}
      <Card style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
        <CardHeader className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Appointments</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b">Patient</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Time</th>
                <th className="p-2 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-2 border-b flex items-center gap-2">
                    {a.user.profileImage && (
                      <img src={`${backendURL}${a.user.profileImage}`} alt={a.user.name} className="w-6 h-6 rounded-full object-cover" />
                    )}
                    {a.user.name}
                  </td>
                  <td className="p-2 border-b">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="p-2 border-b">{a.time}</td>
                  <td className="p-2 border-b">
                    <Badge style={{ backgroundColor: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 🧑‍⚕️ Patients */}
      <Card style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}>
        <CardHeader className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Patients</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {patients.map((p) => (
              <div key={p._id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/10">
                {p.profileImage && (
                  <img src={`${backendURL}${p.profileImage}`} alt={p.name} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}