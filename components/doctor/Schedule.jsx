"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/doctors/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch schedules");
      setSchedules(data.schedules || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.startTime || !form.endTime) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `http://localhost:5000/api/doctors/schedule/${editingId}`
        : "http://localhost:5000/api/doctors/schedule";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Operation failed");

      toast.success(editingId ? "Schedule updated successfully" : "Schedule created successfully");
      
      // Reset form
      setForm({ date: "", startTime: "", endTime: "" });
      setEditingId(null);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleEdit = (schedule) => {
    setForm({
      date: schedule.date ? schedule.date.split("T")[0] : "", // Convert to YYYY-MM-DD
      startTime: schedule.startTime || "",
      endTime: schedule.endTime || "",
    });
    setEditingId(schedule._id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/doctors/schedule/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Schedule deleted");
      fetchSchedules();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelEdit = () => {
    setForm({ date: "", startTime: "", endTime: "" });
    setEditingId(null);
  };

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Calendar className="w-8 h-8" />
        My Availability Schedule
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section - My Schedules (2/3) */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                My Schedules
              </h2>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <p className="text-muted-foreground py-10 text-center">
                  No schedules added yet. Add your availability on the right.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 font-medium">Date</th>
                        <th className="p-4 font-medium">Start Time</th>
                        <th className="p-4 font-medium">End Time</th>
                        <th className="p-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.map((s) => (
                        <tr key={s._id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            {new Date(s.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="p-4">{s.startTime}</td>
                          <td className="p-4">{s.endTime}</td>
                          <td className="p-4 text-right flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(s)}
                            >
                              <Edit2 className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(s._id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Add/Edit Schedule (1/3) */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                {editingId ? "Edit Schedule" : "Add New Schedule"}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Schedule" : "Add Schedule"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}