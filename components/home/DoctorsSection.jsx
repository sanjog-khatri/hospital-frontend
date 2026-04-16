"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";   // ← Added this

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  const router = useRouter();   // ← For redirection

  // Check token and fetch doctors
  const fetchDoctors = async () => {
    const token = localStorage.getItem("token");

    // If no token → redirect to login
    if (!token) {
      toast.error("Please login to view doctors");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users/doctors", {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // If token is invalid/expired
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          toast.error("Session expired. Please login again.");
          router.push("/login");
          return;
        }
        throw new Error(data.message || "Failed to fetch doctors");
      }

      setDoctors(data.doctors || []);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Slideshow every 6 seconds
  useEffect(() => {
    if (doctors.length === 0) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % doctors.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [doctors]);

  const getVisibleDoctors = () => {
    if (doctors.length <= 4) return doctors;

    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(doctors[(startIndex + i) % doctors.length]);
    }
    return visible;
  };

  const visibleDoctors = getVisibleDoctors();

  return (
    <section id="doctors" className="px-8 py-16 max-w-7xl mx-auto flex flex-col items-center mt-10 md:mt-16">
      {/* Heading */}
      <div className="text-center mb-16">
        <h3 className="text-xl font-medium text-primary">Meet Our</h3>
        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
          Expert Specialists
        </h2>
      </div>

      {loading ? (
        <p className="text-center">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-center">No doctors found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {visibleDoctors.map((doc) => {
            const profileUrl = doc.user.profileImage
              ? `http://localhost:5000${doc.user.profileImage}`
              : null;

            return (
              <div
                key={doc._id}
                className="bg-card text-card-foreground p-6 md:p-8 rounded-2xl shadow flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 group"
              >
                {/* Profile Image */}
                {profileUrl ? (
                  <img
                    src={profileUrl}
                    alt={doc.user.name}
                    className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover mb-4 border border-border"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-muted flex items-center justify-center text-xl font-bold mb-4">
                    {doc.user.name?.[0] || "D"}
                  </div>
                )}

                {/* Name */}
                <h3 className="font-semibold text-lg md:text-xl mb-1 text-secondary-foreground">
                  {doc.user.name}
                </h3>

                {/* Specialization */}
                <p className="text-sm md:text-base mb-1 text-primary">{doc.specialization}</p>

                {/* Hospital */}
                <p className="text-sm md:text-base mb-2 text-muted-foreground">
                  "{doc.hospital}"
                </p>

                {/* Description */}
                <p className="text-sm md:text-base mb-4 text-muted-foreground line-clamp-3">
                  {doc.description}
                </p>

                {/* Hover Social Icons */}
                <div className="flex flex-row items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href="#" className="w-10 h-10 flex items-center justify-center hover:text-primary transition">
                    <img src="/logos/facebook.svg" alt="Facebook" className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center hover:text-primary transition">
                    <img src="/logos/whatsapp.svg" alt="WhatsApp" className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center hover:text-primary transition">
                    <img src="/logos/instagram.svg" alt="Instagram" className="w-6 h-6" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}