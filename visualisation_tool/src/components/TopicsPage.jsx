import React from "react";
import TopicCard from "../components/TopicCard";

export default function TopicsPage() {
const topics = [
  {
    title: "Sorting Algorithms",
    description: "Visualize popular sorting methods like Bubble Sort, Quick Sort, Merge Sort, and more.",
    link: "/topics/sorting",
    lottieSrc: "https://lottie.host/17e01b9d-29cc-42f5-8daf-6f32a0588c1b/FQbOsJ4h9b.lottie",
  },
  {
    title: "Search Algorithms",
    description: "Explore graph traversal algorithms such as BFS, DFS, Dijkstra’s, A*, and others.",
    link: "/topics/searching",
    lottieSrc: "https://lottie.host/9f175512-2305-4ea7-918f-35f8add2900a/rnrIE0Sz09.lottie"
  },
  {
    title: "Linked Lists",
    description: "Understand linked lists — singly, doubly, and circular — and their operations.",
    link: "/topics/linked-lists",
    imageSrc: "https://visualgo.net/img/gif/list.gif",
  },
  {
    title: "Stack",
    description: "",
    link: "/topics/stack",
    imageSrc: ""
  },
  {
    title: "Queue",
    description: "",
    link: "/topics/queue",
    imageSrc: ""
  },
  {
    title: "Binary Trees",
    description: "Learn about binary trees, binary search trees, traversal methods, and more.",
    link: "/topics/binary-trees",
    imageSrc: "https://visualgo.net/img/gif/bst.gif"
  },
  {
    title: "Graph Traversals",
    description: "Dive deep into graph traversal techniques such as Depth-First Search (DFS) and Breadth-First Search (BFS).",
    link: "/topics/graph-traversals",
    imageSrc: "https://visualgo.net/img/gif/dfsbfs.gif"
  },
  {
    title: "Hash Tables",
    description: "Explore hash tables, hashing functions, collision resolution, and their applications.",
    link: "/topics/hash-tables",
    imageSrc: "https://visualgo.net/img/gif/hashtable.gif"
  },
    // Add more topics as you want...
  ];

  return (
    <div className="min-h-screen bg-white py-20 px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-teal-700 mb-12 text-center">
        Choose a Topic to Start Learning
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {topics.map(({ title, description, link, lottieSrc, imageSrc}, idx) => (
          <TopicCard
            key={idx}
            title={title}
            description={description}
            link={link}
            lottieSrc={lottieSrc}
            imageSrc={imageSrc}
          />
        ))}
      </div>
    </div>
  );
}
