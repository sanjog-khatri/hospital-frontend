"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/admin/Dashboard";
import Users from "@/components/admin/Users";
import Doctors from "@/components/admin/Doctors";
import Appointments from "@/components/admin/Appointments";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "sonner";

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch");
      setData(json);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout active={active} setActive={setActive}>
      {loading && <p className="text-center mt-10">Loading dashboard...</p>}

      {!loading && active === "dashboard" && <Dashboard data={data} />}
      {!loading && active === "users" && <Users users={data.users} refresh={fetchDashboardData} />}
      {!loading && active === "doctors" && <Doctors doctors={data.doctors} refresh={fetchDashboardData} />}
      {!loading && active === "appointments" && <Appointments refresh={fetchDashboardData} />}
    </AdminLayout>
  );
}