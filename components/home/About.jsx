"use client";

export default function About() {
  return (
    <section id="about" className="w-full py-16 px-6 md:px-12 mt-16 md:mt-24 flex flex-col items-center">
      
      {/* Top Flex Row: Left Image + Right Content */}
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-10 items-center mb-12">
        
        {/* LEFT - Image (1/3) */}
        <div className="w-full md:w-1/3">
          <img
            src="/hospital.jpg" 
            alt="Hospital"
            className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
          />
        </div>

        {/* RIGHT - Content (2/3) */}
        <div className="w-full md:w-2/3">
          
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black dark:text-white">
            About Our Healthcare Platform
          </h2>

          {/* Paragraph */}
          <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
            We connect patients with trusted and verified doctors, making healthcare
            simpler and more accessible. Our platform ensures seamless appointment
            booking, real-time availability, and complete health management — all
            in one place.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-primary dark:bg-zinc-900 rounded-2xl shadow-md p-6 text-center">
              <h3 className="text-4xl font-bold text-white">500+</h3>
              <p className="text-lg text-secondary mt-2">Verified Doctors<br></br>we have selected doctors</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 text-center">
              <h3 className="text-4xl font-bold text-black">10K+</h3>
              <p className="text-lg text-zinc-500 mt-2">Happy Patients<br></br>we have happy patients</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 text-center">
              <h3 className="text-4xl font-bold text-black">24/7</h3>
              <p className="text-lg text-zinc-500 mt-2">Support Available<br></br>we have 24/7 support available</p>
            </div>

          </div>
        </div>
      </div>

      {/* Logos Row - Full Width */}
      <div className="w-full flex flex-wrap justify-center items-center gap-20 mt-5">
        <img src="/logos/hospital.png" alt="Hospital" className="h-24 md:h-24" />
        <img src="/logos/ambulance.png" alt="Ambulance" className="h-24 md:h-24" />
        <img src="/logos/heart.png" alt="Heart" className="h-24 md:h-24" />
        <img src="/logos/medical-kit.png" alt="Medical Kit" className="h-24 md:h-24" />
        <img src="/logos/stethoscope.png" alt="Stethoscope" className="h-24 md:h-24" />
      </div>

    </section>
  );
}