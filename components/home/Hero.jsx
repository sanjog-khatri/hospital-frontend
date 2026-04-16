"use client";

import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <div className={styles.heroContainer}>
      {/* Clipped Shape Background */}
      <div className={styles.heroShape}></div>
      
      <div className="flex flex-col md:flex-row items-center w-full max-w-7xl gap-12 px-10 py-10">
        
        {/* Left side */}
        <div className="flex-1 relative z-10 min-h-[400px]">

          {/* Glassmorphism Request Card (STATIC) */}
          <div className="p-6 bg-white/20 backdrop-blur-md rounded-xl shadow-lg max-w-sm flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-white">
              Request a Call
            </h3>

            <input
              type="email"
              placeholder="Your Email"
              className="p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="tel"
              placeholder="Contact Number"
              className="p-3 rounded-md border border-white/30 bg-white/10 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button className="mt-2 px-4 py-2 bg-secondary text-primary font-semibold rounded-lg hover:opacity-90 transition">
              Submit
            </button>
          </div>

          {/* Independent Heading Layer */}
          <div className="absolute inset-0 pointer-events-none">
            <h2 className="absolute top-[320px] left-[-40] text-3xl md:text-5xl font-bold text-black leading-tight">
              Best Medical &
            </h2>
            <h2 className="absolute top-[400px] left-[-40] text-3xl md:text-5xl font-bold text-black leading-tight">
              Treatment Center For You
            </h2>
          </div>

        </div>

        {/* Right side: Doctor PNG */}
        <div className="flex-1 relative w-full h-180 z-40">
          <Image
            src="/docter.png"
            alt="Doctor"
            fill
            className="object-contain"
          />
        </div>

      </div>
    </div>
  );
}