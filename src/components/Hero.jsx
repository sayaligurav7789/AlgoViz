// src/components/Hero.jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-teal-50 to-white">
      <h1 className="text-5xl md:text-6xl font-extrabold text-teal-700 max-w-4xl mb-6 leading-tight">
        Algorithm Visualizer & Analyzer
      </h1>
      <p className="text-gray-600 text-lg max-w-2xl mb-10">
        Learn, explore, and master algorithms with interactive animations, real-time complexity insights, and customizable inputs.
      </p>
      <Link
        to="/get-started"
        className="inline-block bg-teal-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-teal-700 transition"
      >
        Get Started
      </Link>

      {/* Placeholder illustration */}
      <div className="mt-16 w-full max-w-4xl h-72 bg-teal-100 rounded-lg flex items-center justify-center text-teal-300 select-none text-2xl font-mono">
        <DotLottieReact
        src="https://lottie.host/70af010c-93d9-493f-bf84-cd0d94c302de/NSX8xPWoT1.lottie"
        loop
        autoplay
        />
      </div>
    </section>
  );
}
