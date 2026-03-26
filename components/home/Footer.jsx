// components/Footer.jsx
"use client";

export default function Footer() {
  return (
    <div className="w-full bg-zinc-200 dark:bg-zinc-900 p-6 text-center">
      <p className="text-sm text-zinc-700 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} Health Platform. All rights reserved.
      </p>
    </div>
  );
}