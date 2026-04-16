"use client";

import { Home, Calendar, Users, User } from "lucide-react";

const ICONS = {
  dashboard: <Home className="w-6 h-6" />,
  appointments: <Calendar className="w-6 h-6" />,
  schedule: <Calendar className="w-6 h-6" />,
  patients: <Users className="w-6 h-6" />,
  profile: <User className="w-6 h-6" />,
};

export default function DoctorSidebar({ activeTab, setActiveTab }) {
  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "appointments", label: "Appointments" },
    { key: "schedule", label: "Schedule" },
    { key: "patients", label: "Patients" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <div
      className="w-64 p-4 flex flex-col h-full shadow-lg"
      style={{ backgroundColor: "var(--sidebar)", color: "var(--sidebar-foreground)" }}
    >
      <h2 className="text-2xl font-bold mb-6">Doctor Panel</h2>

      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative`}
              style={{
                backgroundColor: isActive ? "var(--sidebar-primary)" : "transparent",
                color: isActive ? "var(--sidebar-primary-foreground)" : "var(--sidebar-foreground)",
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r-lg"
                  style={{ backgroundColor: "var(--primary)" }}
                ></span>
              )}
              {ICONS[item.key]}
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}