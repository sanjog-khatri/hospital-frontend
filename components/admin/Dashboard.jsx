"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, UserCheck, UserX } from "lucide-react";

// Stat Cards
function StatCards({ stats }) {
  const cardData = [
    { title: "Total Users", value: stats.totalUsers, icon: <Users className="mx-auto h-8 w-8 text-primary" /> },
    { title: "Total Doctors", value: stats.totalDoctors, icon: <UserCheck className="mx-auto h-8 w-8 text-accent" /> },
    { title: "Verified Doctors", value: stats.verifiedDoctors, icon: <UserCheck className="mx-auto h-8 w-8 text-chart-2" /> },
    { title: "Pending Doctors", value: stats.pendingDoctors, icon: <UserX className="mx-auto h-8 w-8 text-destructive" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
      {cardData.map((card) => (
        <div key={card.title} className="p-4 bg-card rounded-xl shadow text-center flex flex-col items-center gap-2">
          {card.icon}
          <h3 className="text-lg font-medium">{card.title}</h3>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

// Doctor Status Pie Chart
function DoctorStatusChart({ stats }) {
  const data = [
    { name: "Verified", value: stats.verifiedDoctors },
    { name: "Pending", value: stats.pendingDoctors },
  ];
  const COLORS = ["var(--chart-1)", "var(--destructive)"];

  return (
    <div className="bg-card p-4 rounded-xl shadow h-80">
      <h3 className="text-lg font-medium mb-4 text-center">Doctor Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Users Table
function UsersTable({ users }) {
  return (
    <div className="bg-card rounded-xl shadow p-4 overflow-x-auto mb-6">
      <h3 className="text-lg font-medium mb-4 text-center">Users</h3>
      <table className="w-full table-auto border-collapse border border-border">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Blocked</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center hover:bg-muted/20">
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">{user.isBlocked ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Doctors Table
function DoctorsTable({ doctors }) {
  return (
    <div className="bg-card rounded-xl shadow p-4 overflow-x-auto mb-6">
      <h3 className="text-lg font-medium mb-4 text-center">Doctors</h3>
      <table className="w-full table-auto border-collapse border border-border">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Specialization</th>
            <th className="p-2 border">Verified</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id} className="text-center hover:bg-muted/20">
              <td className="p-2 border">{doctor.user.name}</td>
              <td className="p-2 border">{doctor.user.email}</td>
              <td className="p-2 border">{doctor.specialization}</td>
              <td className="p-2 border">{doctor.isVerified ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton Loading
function DashboardSkeleton() {
  return (
    <div className="p-6 animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl shadow" />)}
      </div>
      <div className="lg:col-span-1 h-80 bg-muted rounded-xl shadow" />
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="h-48 bg-muted rounded-xl shadow" />
        <div className="h-48 bg-muted rounded-xl shadow" />
      </div>
    </div>
  );
}

// Main Dashboard
export default function Dashboard({ data }) {
  if (!data) return <DashboardSkeleton />;

  const { stats, users, doctors } = data;

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <StatCards stats={stats} />
      </div>

      <div className="lg:col-span-1">
        <DoctorStatusChart stats={stats} />
      </div>

      <div className="lg:col-span-2 flex flex-col gap-6">
        <UsersTable users={users} />
        <DoctorsTable doctors={doctors} />
      </div>
    </div>
  );
}