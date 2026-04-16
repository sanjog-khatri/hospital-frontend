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
  const [imagePreview, setImagePreview] = useState(null);

  const [documents, setDocuments] = useState([]);
  const [docPreviews, setDocPreviews] = useState([]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Profile Image Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 🔹 Documents Handler
  const handleDocumentsChange = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setDocPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      if (image) formData.append("image", image);
      if (isDoctor) {
        documents.forEach((doc) => formData.append("documents", doc));
      }

      const url = isDoctor
        ? "http://localhost:5000/api/users/doctor/signup"
        : "http://localhost:5000/api/users/signup";

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });

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

      {/* Toggle */}
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
        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          name="email"
          placeholder="Email Address"
          type="email"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          name="password"
          placeholder="Password"
          type="password"
          className="w-full p-3 border rounded-lg"
          onChange={handleChange}
          required
        />

        {/* Profile Image */}
        <div>
          <label className="text-sm font-medium">
            Profile Image (optional)
          </label>
          <input type="file" onChange={handleImageChange} />

          {image && (
            <p className="text-xs mt-1 text-muted-foreground">
              {image.name}
            </p>
          )}

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>

        {/* Doctor Fields */}
        {isDoctor && (
          <>
            <input
              name="specialization"
              placeholder="Specialization (e.g. Cardiologist)"
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
              placeholder="Medical License Number"
              className="w-full p-3 border rounded-lg"
              onChange={handleChange}
              required
            />

            {/* Documents Upload */}
            <div>
              <label className="text-sm font-medium">
                Upload Verification Documents
              </label>

              <p className="text-xs text-muted-foreground mb-1">
                Required for doctor verification choose multiple:
                <br />• Citizenship card  
                <br />• Medical license  
                <br />• Certificates (if any)
              </p>

              <input type="file" multiple onChange={handleDocumentsChange} />

              {/* File Names */}
              {documents.length > 0 && (
                <ul className="text-xs mt-1 text-muted-foreground">
                  {documents.map((doc, i) => (
                    <li key={i}>{doc.name}</li>
                  ))}
                </ul>
              )}

              {/* Preview */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {docPreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="doc preview"
                    className="w-20 h-20 object-cover border rounded"
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>

      {/* Login */}
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