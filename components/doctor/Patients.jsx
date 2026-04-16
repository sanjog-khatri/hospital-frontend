"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const backendURL = "http://localhost:5000";

  // Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${backendURL}/api/doctors/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPatients(data.patients || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );
  if (patients.length === 0) return <div className="text-center py-10">No patients found.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Patients</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div
            key={patient._id}
            className="bg-card p-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 flex items-center gap-4 cursor-pointer"
          >
            {patient.profileImage ? (
              <img
                src={`${backendURL}${patient.profileImage}`}
                alt={patient.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                {patient.name[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-lg">{patient.name}</p>
              <p className="text-sm text-muted-foreground">{patient.email}</p>
              {/* Optional: last appointment or status */}
              {/* <p className="text-xs text-gray-500 mt-1">Last Appointment: 25 Mar 2026</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}