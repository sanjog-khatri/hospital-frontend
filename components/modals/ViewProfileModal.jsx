"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Clock, ChevronLeft, ChevronRight, MapPin, Briefcase } from "lucide-react";

export default function ViewProfileModal({ doctor, schedules = [], onClose, onBookNow }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingReason, setBookingReason] = useState("");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [monthDates, setMonthDates] = useState([]);

  // Initialize month and selected date
  useEffect(() => {
    if (schedules.length > 0) {
      const firstDate = schedules[0].date.split("T")[0];
      const [year, month] = firstDate.split("-");
      setCurrentMonth(`${year}-${month}`);
      setSelectedDate(firstDate);
    }
  }, [schedules]);

  // Generate dates for current month
  useEffect(() => {
    if (!currentMonth) return;
    const [year, month] = currentMonth.split("-").map(Number);
    const dateObj = new Date(year, month - 1, 1);
    const dates = [];
    while (dateObj.getMonth() === month - 1) {
      dates.push(new Date(dateObj));
      dateObj.setDate(dateObj.getDate() + 1);
    }
    setMonthDates(dates);
  }, [currentMonth]);

  const hasSchedule = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return schedules.some((s) => s.date.split("T")[0] === dateStr);
  };

  const slotsForSelectedDate = schedules.filter(
    (s) => s.date.split("T")[0] === selectedDate
  );

  const handleConfirm = () => {
    if (!selectedSlot || !selectedDate) return;
    onBookNow(selectedDate, selectedSlot, bookingReason); // time string
  };

  const handleMonthChange = (dir) => {
    if (!currentMonth) return;
    let [year, month] = currentMonth.split("-").map(Number);
    month += dir;
    if (month > 12) { month = 1; year += 1; }
    if (month < 1) { month = 12; year -= 1; }
    setCurrentMonth(`${year}-${month.toString().padStart(2, "0")}`);
  };

  const monthName = monthDates.length
    ? monthDates[0].toLocaleString("default", { month: "long" })
    : "";

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="relative w-full max-w-5xl bg-background dark:bg-background rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 shadow-md transition"
        >
          <X className="w-5 h-5 text-foreground dark:text-white" />
        </button>

        <div className="p-8 grid lg:grid-cols-12 gap-10">
          {/* LEFT: Doctor Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-48 flex-shrink-0">
                <img
                  src={doctor.user?.profileImage ? `http://localhost:5000${doctor.user.profileImage}` : "/default-avatar.png"}
                  alt={doctor.user?.name}
                  className="w-full aspect-square rounded-3xl object-cover shadow-md"
                />
              </div>

              <div className="flex-1 space-y-2">
                <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{doctor.user?.name}</h1>
                <p className="text-xl text-primary">{doctor.specialization}</p>

                {doctor.experience && (
                  <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-1.5 rounded-2xl text-sm">
                    <Briefcase className="w-4 h-4" /> {doctor.experience}+ Years Experience
                  </div>
                )}

                {doctor.hospital && (
                  <p className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground">
                    <MapPin className="w-4 h-4" /> {doctor.hospital}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Journey */}
            {doctor.journey && (
              <div>
                <h3 className="font-semibold mb-2">Professional Journey</h3>
                <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">{doctor.journey}</p>
              </div>
            )}

            {/* Qualifications */}
            {doctor.qualification && (
              <div>
                <h3 className="font-semibold mb-2">Qualifications</h3>
                <p className="text-muted-foreground dark:text-muted-foreground">{doctor.qualification}</p>
              </div>
            )}

            {/* Certifications */}
            {doctor.certifications?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Certifications</h3>
                <ul className="list-disc list-inside text-muted-foreground dark:text-muted-foreground space-y-1">
                  {doctor.certifications.map((cert, i) => (
                    <li key={i}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* About */}
            {doctor.description && (
              <div>
                <h3 className="font-semibold mb-2">About Doctor</h3>
                <p className="text-muted-foreground dark:text-muted-foreground leading-relaxed">{doctor.description}</p>
              </div>
            )}
          </div>

          {/* RIGHT: Booking Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-6 space-y-6">
              {/* Booking Header */}
              <div className="bg-primary text-primary-foreground rounded-3xl p-6 space-y-1">
                <h2 className="text-2xl font-semibold">Book Appointment</h2>
                <p className="text-sm opacity-90">Consultation fee: ₹{doctor.consultationFee || 0}</p>
              </div>

              {/* Calendar */}
              <div className="bg-card text-card-foreground border border-border rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleMonthChange(-1)} 
                    className="p-2 rounded-xl hover:bg-muted transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h3 className="font-semibold text-lg">{monthName} {currentMonth?.split("-")[0]}</h3>
                  <button 
                    onClick={() => handleMonthChange(1)} 
                    className="p-2 rounded-xl hover:bg-muted transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                  {["SU","MO","TU","WE","TH","FR","SA"].map(d => <div key={d}>{d}</div>)}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-7 gap-2 text-center">
                  {monthDates.map(date => {
                    const day = date.getDate();
                    const dateStr = date.toISOString().split("T")[0];
                    const isSelected = dateStr === selectedDate;
                    const available = hasSchedule(date);
                    return (
                      <button
                        key={dateStr}
                        disabled={!available}
                        onClick={() => available && setSelectedDate(dateStr)}
                        className={`aspect-square flex items-center justify-center rounded-2xl text-sm font-medium transition-all
                          ${!available ? "text-gray-300 cursor-not-allowed"
                            : isSelected ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-primary/10 text-foreground dark:text-foreground dark:hover:bg-primary/20"
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Available Slots */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <p className="font-semibold text-muted-foreground">Available Slots</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map(slot => (
                      <button
                        key={slot._id}
                        onClick={() => setSelectedSlot(slot.startTime)}
                        className={`py-3 px-2 rounded-2xl border text-sm font-medium transition
                          ${selectedSlot === slot.startTime
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border hover:bg-primary/10 hover:border-primary dark:hover:bg-primary/20"
                          }`}
                      >
                        {slot.startTime}
                      </button>
                    )) : (
                      <div className="col-span-2 py-6 text-center text-muted-foreground">No slots available</div>
                    )}
                  </div>
                </div>

                {/* Reason */}
                <input
                  type="text"
                  placeholder="Reason for appointment (optional)"
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-2xl text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!selectedSlot || !selectedDate}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-4 rounded-3xl hover:bg-primary-foreground hover:text-primary transition disabled:bg-muted disabled:cursor-not-allowed"
              >
                Confirm Booking <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}