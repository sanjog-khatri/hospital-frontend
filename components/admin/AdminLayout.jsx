"use client";

import { useState } from "react";

export default function AdminLayout({ children, active, setActive }) {
  const menu = ["dashboard", "users", "doctors", "appointments"];

  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Navbar */}
      <div className="h-14 flex items-center justify-between px-6 border-b bg-card shadow">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-sm px-3 py-1 bg-destructive text-white rounded-lg"
        >
          Logout
        </button>
      </div>

      {/* Body */}
      <div className="flex">
        
        {/* Sidebar */}
        <div className="w-64 min-h-[calc(100vh-56px)] border-r bg-card p-4 space-y-2">
          {menu.map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`w-full text-left px-4 py-2 rounded-lg capitalize ${
                active === item
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}