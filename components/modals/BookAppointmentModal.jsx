"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Clock, ArrowRight } from "lucide-react";

export default function BookAppointmentModal({ doctor, schedules = [], onClose, onConfirm }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingReason, setBookingReason] = useState("");
  const [currentMonth, setCurrentMonth] = useState(null);
  const [monthDates, setMonthDates] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);

  // Apply interval scheduling (greedy) whenever schedules change
  useEffect(() => {
    if (!schedules.length) return;

    const getNonOverlappingSchedules = (schedules) => {
      if (schedules.length === 1) return schedules; // keep single slot

      // Sort by end time (classic greedy algorithm)
      const sorted = [...schedules].sort(
        (a, b) => new Date(`${a.date}T${a.endTime}`) - new Date(`${b.date}T${b.endTime}`)
      );

      const result = [];
      let lastEndTime = null;

      for (let s of sorted) {
        const start = new Date(`${s.date}T${s.startTime}`);
        if (!lastEndTime || start >= lastEndTime) {
          result.push(s);
          lastEndTime = new Date(`${s.date}T${s.endTime}`);
        }
      }

      return result;
    };

    const filtered = getNonOverlappingSchedules(schedules);
    setAvailableSchedules(filtered);

    // Preselect first available date/slot
    if (filtered.length > 0) {
      const firstDate = filtered[0].date.split("T")[0];
      setSelectedDate(firstDate);
      setSelectedSlot(filtered[0].startTime);
    }
  }, [schedules]);

  // Initialize current month
  useEffect(() => {
    if (availableSchedules.length > 0) {
      const firstDate = availableSchedules[0].date.split("T")[0];
      const [year, month] = firstDate.split("-");
      setCurrentMonth(`${year}-${month}`);
    }
  }, [availableSchedules]);

  // Generate all dates for current month
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

  const handleConfirm = () => {
    if (!selectedSlot || !selectedDate) return;
    onConfirm({
      selectedSchedule: selectedSlot,
      bookingDate: selectedDate,
      bookingReason,
    });
  };

  const handleMonthChange = (dir) => {
    if (!currentMonth) return;
    let [year, month] = currentMonth.split("-").map(Number);
    month += dir;
    if (month > 12) { month = 1; year += 1; }
    if (month < 1) { month = 12; year -= 1; }
    setCurrentMonth(`${year}-${month.toString().padStart(2, "0")}`);
  };

  const monthName = monthDates.length ? monthDates[0].toLocaleString("default", { month: "long" }) : "";

  if (!doctor) return null;

  // Check if a date has any available slots
  const hasSchedule = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return availableSchedules.some(s => s.date.split("T")[0] === dateStr);
  };

  // Get all slots for the selected date
  const slotsForSelectedDate = availableSchedules.filter(
    s => s.date.split("T")[0] === selectedDate
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 bg-black/60">
      <div className="relative w-full max-w-sm bg-background dark:bg-zinc-900 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-muted dark:bg-zinc-800 hover:bg-muted/80 dark:hover:bg-zinc-700 transition z-10"
        >
          <X className="w-5 h-5 text-foreground dark:text-white" />
        </button>

        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-3xl">
          <h2 className="text-lg font-semibold">Book Appointment</h2>
          <p className="text-primary/80 mt-1 text-xs">Consultation fee: ₹{doctor.consultationFee || 0}</p>
        </div>

        <div className="p-4 space-y-4">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => handleMonthChange(-1)} className="p-1 rounded-full hover:bg-muted transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold">{monthName} {currentMonth?.split("-")[0]}</h3>
            <button onClick={() => handleMonthChange(1)} className="p-1 rounded-full hover:bg-muted transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 text-center font-medium text-muted-foreground text-xs">
            {["SU","MO","TU","WE","TH","FR","SA"].map(d => <div key={d}>{d}</div>)}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7 gap-1 text-center">
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
                  className={`py-1 rounded-xl text-[11px] font-medium transition
                    ${!available ? "text-zinc-300 cursor-not-allowed" : ""}
                    ${isSelected ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-primary/10 text-foreground dark:text-foreground dark:hover:bg-primary/20"}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Available Slots */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              <Clock className="w-4 h-4" /> Available Slots
            </div>
            <div className="grid grid-cols-2 gap-2">
              {slotsForSelectedDate.length > 0 ? slotsForSelectedDate.map(slot => (
                <button
                  key={slot._id}
                  onClick={() => setSelectedSlot(slot.startTime)}
                  className={`py-2 px-1 rounded-2xl border text-sm font-medium transition
                    ${selectedSlot === slot.startTime
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:bg-primary/10 hover:border-primary dark:hover:bg-primary/20"
                    }`}
                >
                  {slot.startTime}
                </button>
              )) : (
                <div className="col-span-2 py-4 text-center text-muted-foreground text-xs">No slots available</div>
              )}
            </div>
          </div>

          {/* Reason */}
          <input
            type="text"
            placeholder="Reason for appointment (optional)"
            value={bookingReason}
            onChange={(e) => setBookingReason(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-2xl text-sm focus:outline-none focus:border-primary"
          />

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            disabled={!selectedSlot || !selectedDate}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-2xl hover:bg-primary-foreground hover:text-primary transition disabled:bg-muted disabled:cursor-not-allowed"
          >
            Confirm Booking <ArrowRight className="w-4 h-4" />
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full py-1 text-center text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}



// Algorithm we used: Greedy Interval Scheduling

// Type: Greedy algorithm
// Problem it solves: Given a bunch of time slots (start & end times), select the maximum number of non-overlapping appointments.

// Steps we implemented:

// Sort slots by end time

// schedules.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
// Sorting by end time ensures that we always pick the slot that finishes earliest, leaving room for more slots afterward.
// Select non-overlapping slots greedily
// Initialize lastEndTime = null.
// For each slot:
// If the slot’s startTime ≥ lastEndTime, include it.
// Update lastEndTime = slot.endTime.
// This ensures we never pick overlapping slots.

// Why greedy works here:

// Choosing the earliest finishing slot guarantees that the remaining time can fit as many slots as possible.
// It’s a classic solution to the “Activity Selection Problem” in algorithms.
// 2️⃣ How it works in your modal
// On page load, the modal:
// Receives all schedules from the doctor.
// Filters them using interval scheduling → produces availableSchedules.
// Preselects the first available date & slot.
// Only non-overlapping slots are displayed for each date.
// If there’s only one slot, it still shows because our algorithm doesn’t remove single slots.
// 3️⃣ Outcome
// Before Algorithm	After Algorithm (Greedy)
// All slots shown, even overlapping ones	Only non-overlapping slots shown
// User could accidentally book overlapping slots	User cannot select overlapping slots
// Confusing UI with conflicts	Clean UI, valid slots only

// In short: ✅ This ensures maximum safe appointments per day and no overlapping bookings, keeping your calendar neat.