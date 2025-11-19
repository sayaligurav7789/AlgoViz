import React from "react";
import TopicCard from "../../TopicCard";

// You will replace these with your real images:
import singlyImg from "../../../assets/images/singlyImg.webp";
import doublyImg from "../../../assets/images/doublyImg.webp";
import circularImg from "../../../assets/images/circularImg.webp";
import doublyCircularImg from "../../../assets/images/doublyCircularImg.webp";

export default function LinkedListAlgorithmPage() {
  const linkedListAlgorithms = [
    {
      title: "Singly Linked List",
      description: "Nodes connected in one direction with a next pointer.",
      link: "/linkedlist/singly",
      imageSrc: singlyImg,
    },
    {
      title: "Doubly Linked List",
      description: "Each node has next and previous pointers.",
      link: "/linkedlist/doubly",
      imageSrc: doublyImg,
    },
    {
      title: "Circular Linked List",
      description: "Last node points back to the head.",
      link: "/linkedlist/circular",
      imageSrc: circularImg,
    },
    {
      title: "Doubly Circular Linked List",
      description: "Circular structure with both next & previous pointers.",
      link: "/linkedlist/doubly-circular",
      imageSrc: doublyCircularImg,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-700 mb-12 text-center">
        Linked List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
        {linkedListAlgorithms.map(({ title, description, link, imageSrc }, idx) => (
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
