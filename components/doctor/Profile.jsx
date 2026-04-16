"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "../ui/spinner";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    position: "",
    specialization: "",
    experience: "",
    qualification: "",
    hospital: "",
    consultationFee: "",
    description: "",
    journey: "",
    certifications: [], // Stored as array internally
    citizenshipNumber: "",
    licenseNumber: "",
  });

  // Temporary input for certifications (string with commas)
  const [certInput, setCertInput] = useState("");

  const token = localStorage.getItem("token");

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/doctors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

      const doctor = data.doctor;
      setProfile(doctor);

      setForm({
        position: doctor.position || "",
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        qualification: doctor.qualification || "",
        hospital: doctor.hospital || "",
        consultationFee: doctor.consultationFee || "",
        description: doctor.description || "",
        journey: doctor.journey || "",
        certifications: doctor.certifications || [],
        citizenshipNumber: doctor.citizenshipNumber || "",
        licenseNumber: doctor.licenseNumber || "",
      });

      // Set certifications input string
      setCertInput((doctor.certifications || []).join(", "));
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle text/number input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle certifications input (string, not array)
  const handleCertInputChange = (e) => {
    setCertInput(e.target.value);
  };

  // Update profile
  const handleUpdate = async () => {
    try {
      setUpdating(true);

      // Convert certifications string to array before sending
      const updatedForm = {
        ...form,
        certifications: certInput
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== ""),
      };

      const res = await fetch("http://localhost:5000/api/doctors/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Profile updated successfully!");
      fetchProfile(); // Refresh data
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );
  if (!profile) return <div className="text-center py-10">No profile data found.</div>;

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center">Doctor Profile</h2>

      <Card>
        <CardContent className="pt-6">
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <img
              src={
                profile.user?.profileImage
                  ? `http://localhost:5000${profile.user.profileImage}`
                  : "/default-avatar.png"
              }
              alt={profile.user?.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Non-editable */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile.user?.name || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-muted"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="text"
                value={profile.user?.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-muted"
              />
            </div>

            {/* Editable Fields */}
            <div>
              <label className="block font-medium mb-1">Position / Title</label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="e.g. Senior Consultant Cardiologist"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="e.g. MBBS, MD"
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Hospital / Clinic</label>
              <input
                type="text"
                name="hospital"
                value={form.hospital}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Consultation Fee (₹)</label>
              <input
                type="number"
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Certifications */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">
                Certifications (comma separated)
              </label>
              <input
                type="text"
                value={certInput}
                onChange={handleCertInputChange}
                placeholder="MBBS, MD Internal Medicine, DM Cardiology, FESC"
                className="w-full p-3 border rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter certifications separated by commas
              </p>
            </div>

            {/* Journey / Professional Bio */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Professional Journey / Bio</label>
              <textarea
                name="journey"
                value={form.journey}
                onChange={handleChange}
                rows={6}
                placeholder="Write about your professional journey, achievements, and experience..."
                className="w-full p-3 border rounded-lg resize-y"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 border rounded-lg resize-y"
              />
            </div>

            {/* Sensitive Fields */}
            <div>
              <label className="block font-medium mb-1">Citizenship Number</label>
              <input
                type="text"
                name="citizenshipNumber"
                value={form.citizenshipNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-70"
            >
              {updating ? "Updating Profile..." : "Save Changes"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}