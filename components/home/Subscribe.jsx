// components/Subscribe.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function Subscribe() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    toast.success(`Subscribed with ${email}!`);
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center text-center px-8 mb-16">
      <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Subscribe to Our Newsletter</h2>
      <p className="text-zinc-600 dark:text-zinc-300 mb-4 max-w-xl">
        Get updates about new doctors, health tips, and platform news directly to your inbox.
      </p>
      <form className="flex gap-2" onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email"
          className="px-4 py-2 border rounded-l-lg w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-r-lg hover:opacity-90 transition"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}