"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Doctors from "@/components/home/DoctorsSection";
import Subscribe from "@/components/home/Subscribe";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("home");

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
    else router.push("/profile");
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "doctors"];
      let current = "home";

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          // If the scroll position is inside this section, mark it active
          if (window.scrollY >= top - height / 3) {
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial active section

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center justify-start bg-zinc-50 dark:bg-black scroll-smooth snap-y snap-mandatory h-screen overflow-y-scroll">

      {/* Navbar */}
      <Navbar />

      {/* Sections */}
      <section id="home" className="snap-start w-full h-screen flex items-center justify-center pt-16 md:pt-20 lg:pt-24">
        <Hero />
      </section>

      <section id="about" className="snap-start w-full flex items-center justify-center">
        <About />
      </section>

      <section id="doctors" className="snap-start w-full flex items-center justify-center">
        <Doctors />
      </section>

      <section className="snap-start w-full flex items-center justify-center">
        <Subscribe />
      </section>

      <section className="snap-start w-full">
        <Footer />
      </section>
    </div>
  );
}