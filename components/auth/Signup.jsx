"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Signup() {
  const router = useRouter();
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    citizenshipNumber: "",
    licenseNumber: "",
  });
  const [image, setImage] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);
      if (isDoctor)
        documents.forEach((doc) => formData.append("documents", doc));

      const url = isDoctor
        ? "http://localhost:5000/api/users/doctor/signup"
        : "http://localhost:5000/api/users/signup";

      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      toast.success(
        isDoctor
          ? "Doctor request submitted for verification 🎉"
          : "Signup successful 🎉"
      );

      router.push("/login");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg p-6 bg-card rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Signup</h2>

      <div className="flex justify-center mb-4 gap-4">
        <button
          type="button"
          onClick={() => setIsDoctor(false)}
          className={`px-4 py-2 rounded-lg ${
            !isDoctor ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          User
        </button>
        <button
          type="button"
          onClick={() => setIsDoctor(true)}
          className={`px-4 py-2 rounded-lg ${
            isDoctor ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          Doctor
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        {isDoctor && (
          <>
            <input
              name="specialization"
              placeholder="Specialization"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              name="citizenshipNumber"
              placeholder="Citizenship Number"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              name="licenseNumber"
              placeholder="License Number"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="file"
              multiple
              onChange={(e) => setDocuments([...e.target.files])}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/login")}
          className="text-primary cursor-pointer underline"
        >
          Login
        </span>
      </p>
    </div>
  );
}