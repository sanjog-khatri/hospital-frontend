"use client";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import ViewProfileModal from "@/components/modals/ViewProfileModal";
import BookAppointmentModal from "@/components/modals/BookAppointmentModal";
import { Search, Phone, ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [viewProfileModal, setViewProfileModal] = useState(null);
  const [bookModal, setBookModal] = useState(null);
  const [doctorSchedules, setDoctorSchedules] = useState([]);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState(["Cardiology"]);
  const [sortBy, setSortBy] = useState("Highly Recommended");

  useEffect(() => setToken(localStorage.getItem("token")), []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/doctors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchDoctors().finally(() => setLoading(false));
  }, [token]);

  // Modal handlers
  const openDoctorModal = async (doctor, type = "profile") => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/doctors/${doctor._id}/schedule`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setDoctorSchedules(data.schedules || []);
      type === "profile"
        ? (setViewProfileModal(doctor), setBookModal(null))
        : (setBookModal(doctor), setViewProfileModal(null));
    } catch (err) {
      toast.error(err.message || "Failed to fetch schedules");
    }
  };

  const handleBookingConfirm = async ({ selectedSchedule, bookingDate, bookingReason }) => {
    if (!bookModal || !selectedSchedule || !bookingDate) {
      return toast.error("Please select date and time slot");
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/doctors/${bookModal._id}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: bookingDate,
            time: selectedSchedule,
            reason: bookingReason,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      toast.success("Appointment booked successfully!");
      setBookModal(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle specialty filter toggle
  const toggleSpecialty = (spec) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  // Filter + sort doctors
  const filteredDoctors = useMemo(() => {
    let result = doctors;

    // Filter by specialty
    if (selectedSpecialties.length > 0) {
      result = result.filter((d) => selectedSpecialties.includes(d.specialization));
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.user?.name?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.hospital?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "Experience") {
      result = result.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    }
    // Add other sort options here if needed

    return result;
  }, [doctors, selectedSpecialties, searchQuery, sortBy]);

  if (loading || !token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Spinner className="w-10 h-10" />
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-20 px-6 pb-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-foreground">Our Specialists</h1>
          <p className="text-muted-foreground mt-2">
            Connect with world-class medical professionals in a curated environment designed for your wellness and peace of mind.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or hospital"
              className="w-full pl-12 py-3 bg-popover border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <button
            onClick={() => { }}
            className="px-8 bg-primary hover:bg-primary-foreground text-primary-foreground font-medium rounded-2xl flex items-center gap-2 transition"
          >
            <Search className="w-4 h-4" /> Search Experts
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col gap-6">
              <h3 className="font-semibold text-lg">SPECIALTY</h3>
              <div className="space-y-3">
                {["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry"].map((spec) => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-primary"
                      checked={selectedSpecialties.includes(spec)}
                      onChange={() => toggleSpecialty(spec)}
                    />
                    <span className="text-foreground">{spec}</span>
                  </label>
                ))}
              </div>


              <div className="mt-10 bg-primary text-primary-foreground p-6 rounded-3xl flex flex-col gap-2">
                <p className="font-semibold text-lg">Need urgent help?</p>
                <p className="text-primary-foreground/80 text-sm">On-Call Support</p>
                <button className="w-full bg-primary-foreground text-primary font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-foreground/90 transition">
                  <Phone className="w-4 h-4" /> Call Now
                </button>
              </div>
            </div>
          </aside>

          {/* Doctor Cards */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">Showing {filteredDoctors.length} specialists</p>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center justify-between bg-popover border border-border rounded-xl px-4 py-2 text-foreground w-64">
                  {sortBy} <ChevronDown className="ml-2 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Highly Recommended", "Experience"].map((option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={sortBy === option ? "font-semibold" : ""}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDoctors.map((d) => (
                <div key={d._id} className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg transition-all">
                  <div className="p-6">
                    <div className="flex gap-5">
                      <img
                        src={d.user?.profileImage ? `http://localhost:5000${d.user.profileImage}` : "/default-avatar.png"}
                        alt={d.user?.name}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-primary">{d.user?.name}</h3>
                        <p className="text-secondary-foreground text-sm">{d.specialization}</p>
                        <p className="text-xs text-muted-foreground mt-2">{d.experience || "15"}+ Years Exp</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border px-6 py-4 flex gap-3 bg-popover">
                    <button
                      onClick={() => openDoctorModal(d, "profile")}
                      className="flex-1 py-3 text-sm font-semibold border border-border rounded-2xl hover:bg-muted hover:text-muted-foreground transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => openDoctorModal(d, "book")}
                      className="flex-1 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-2xl hover:bg-primary-foreground hover:text-primary transition"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
              {filteredDoctors.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center">No doctors match your filters</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewProfileModal
        doctor={viewProfileModal}
        schedules={doctorSchedules}
        onClose={() => setViewProfileModal(null)}
        onBookNow={() => {
          setViewProfileModal(null);
          openDoctorModal(viewProfileModal, "book");
        }}
      />

      <BookAppointmentModal
        doctor={bookModal}
        schedules={doctorSchedules}
        onClose={() => setBookModal(null)}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
}