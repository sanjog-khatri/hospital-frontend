"use client";

import { useState } from "react";
import DoctorSidebar from "./DoctorSidebar";
import DoctorNavbar from "./DoctorNavbar";

import Dashboard from "./Dashboard";
import Appointments from "./Appointments";
import Schedule from "./Schedule";
import Patients from "./Patients";
import Profile from "./Profile";

export default function DoctorLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "appointments":
        return <Appointments />;
      case "schedule":
        return <Schedule />;
      case "patients":
        return <Patients />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--background)" }}>
      <DoctorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <DoctorNavbar />

        <div
          className="p-6 overflow-y-auto flex-1"
          style={{ color: "var(--foreground)" }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}