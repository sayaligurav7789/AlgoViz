import React from "react";
import TopicCard from "../../TopicCard";
import insertion from "../../../assets/images/insertion.png";
import bubble from "../../../assets/images/bubble.png";
import quick from "../../../assets/images/quick.png";


export default function SortingAlgorithmsPage() {
  const sortingAlgorithms = [
    {
      title: "Bubble Sort",
      description: "Simple comparison-based sorting algorithm.",
      link: "/sorting/bubble",
      imageSrc: bubble,
    },
    {
      title: "Selection Sort",
      description: "Efficient divide-and-conquer sorting algorithm.",
      link: "/sorting/selection",
      imageSrc: "https://www.programiz.com/sites/tutorial2program/files/Selection-sort-0.png",
    },
    {
      title: "Merge Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/merge",
      imageSrc: "https://www.programiz.com/sites/tutorial2program/files/merge-sort-example_0.png",
    },
    {
      title: "Insertion Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/insertion",
      imageSrc: insertion,
    },
    {
      title: "Quick Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/quick",
      imageSrc: quick,
    },
    {
      title: "Count Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/count",
      imageSrc: "https://www.programiz.com/sites/tutorial2program/files/Counting-sort-4_1.png",
    },
    {
      title: "Radix Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/radix",
      imageSrc: "https://www.programiz.com/sites/tutorial2program/files/Radix-sort-one.png",
    },
    {
      title: "Heap Sort",
      description: "Divide and conquer algorithm with stable sort.",
      link: "/sorting/heap",
      imageSrc: "https://www.programiz.com/sites/tutorial2program/files/heapfy-root-element-when-subtrees-are-max-heaps.png",
    },
    // Add more sorting algorithms as needed
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-700 mb-12 text-center">
        Sorting Algorithms
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sortingAlgorithms.map(({ title, description, link, imageSrc }, idx) => (
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
