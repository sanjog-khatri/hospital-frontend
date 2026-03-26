"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Detect active route
  useEffect(() => {
    if (pathname === "/") setActive("home");
    else if (pathname === "/appointments") setActive("appointments");
  }, [pathname]);

  // Get profile image from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profileImage) {
      // prepend backend URL
      setProfileImage(`http://localhost:5000${user.profileImage}`);
    } else {
      setProfileImage("/profile-icon.svg"); // fallback
    }
  }, []);

  const handleNavClick = (section) => {
    if (pathname === "/") {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${section}`);
    }
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else router.push("/profile");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white dark:bg-black shadow-md px-8 md:px-32 h-16">

      {/* Logo */}
      <div
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => handleNavClick("home")}
      >
        Hospital
      </div>

      {/* Nav Items */}
      <ul className="flex gap-6 items-center">
        <li className="cursor-pointer hover:text-primary" onClick={() => handleNavClick("home")}>
          Home
        </li>
        <li className="cursor-pointer hover:text-primary" onClick={() => handleNavClick("about")}>
          About
        </li>
        <li className="cursor-pointer hover:text-primary" onClick={() => handleNavClick("doctors")}>
          Meet
        </li>
        <li
          className={`cursor-pointer pb-1 ${pathname === "/doctors" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => router.push("/doctors")}
        >
          Doctors
        </li>
        <li
          className={`cursor-pointer pb-1 ${pathname === "/appointments" ? "text-primary border-b-2 border-primary" : ""}`}
          onClick={() => router.push("/appointments")}
        >
          Appointments
        </li>
      </ul>

      {/* Profile */}
      <div className="cursor-pointer">
        <img
          src={profileImage || "/profile-icon.svg"}
          alt="Profile"
          width={30}
          height={30}
          className="rounded-full object-cover"
          onClick={handleProfileClick}
        />
      </div>
    </nav>
  );
}