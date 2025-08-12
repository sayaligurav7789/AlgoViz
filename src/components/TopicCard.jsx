import React from "react";
import { Link } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function TopicCard({ title, description, lottieSrc, imageSrc, link }) {
  return (
    <Link
      to={link}
      className="flex flex-col rounded-lg shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden bg-teal-50"
    >
      {/* Top: Either Lottie animation or fallback image */}
      <div className="bg-white p-4 flex justify-center items-center" style={{ height: 160 }}>
        {lottieSrc ? (
          <DotLottieReact
            src={lottieSrc}
            loop
            autoplay
            style={{ maxHeight: "140px", maxWidth: "100%" }}
          />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={title}
            style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
          />
        ) : (
          // Optional fallback content if no lottieSrc or imageSrc
          <div style={{ color: "#999" }}>No preview available</div>
        )}
      </div>

      {/* Bottom: Text section */}
      <div className="p-4 bg-teal-100 flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-teal-900 mb-1">{title}</h2>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </Link>
  );
}
