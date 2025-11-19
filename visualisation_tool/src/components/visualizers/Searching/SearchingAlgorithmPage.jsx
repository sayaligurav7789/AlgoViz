import React from "react";
import TopicCard from "../../TopicCard";
import bubble from "../../../assets/images/bubble.png";
import Linear from "../../../assets/images/linear.jpeg";  
import Binary from "../../../assets/images/binary.png";

export default function SearchingAlgorithmPage() {
  const searchingAlgorithms = [
    {
      title: "Linear Search",
      description: "Simple comparison-based sorting algorithm.",
      link: "/searching/linear",
      imageSrc: Linear,
    },
    {
      title: "Binary Search",
      description: "Efficient divide-and-conquer sorting algorithm.",
      link: "/searching/binary",
      imageSrc: Binary,
    },
    
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-700 mb-12 text-center">
        Searching Algorithms
      </h1>
      <div className="flex justify-center gap-10 flex-wrap">
        {searchingAlgorithms.map(({ title, description, link, imageSrc }, idx) => (
          <TopicCard
            key={idx}
            title={title}
            description={description}
            link={link}
            imageSrc={imageSrc}
          />
        ))}
      </div>
    </div>
  );
}
