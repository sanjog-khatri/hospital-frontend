"use client";

import { Button } from "@/components/ui/button";

export default function DoctorNavbar() {
  return (
    <div
      className="flex justify-between items-center px-6 py-4 shadow"
      style={{ backgroundColor: "var(--card)", color: "var(--card-foreground)" }}
    >
      <h1 className="text-lg font-semibold">Welcome, Doctor</h1>

      <div className="flex items-center gap-4">
        <Button variant="destructive">Logout</Button>
      </div>
    </div>
  );
}