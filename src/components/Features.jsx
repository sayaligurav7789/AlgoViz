// src/components/Features.jsx
import { FaPlay, FaCode, FaProjectDiagram, FaChartLine } from "react-icons/fa";

const features = [
  {
    icon: <FaPlay size={32} className="text-teal-600" />,
    title: "Step-by-step Animations",
    description: "Visualize sorting, graph traversal, dynamic programming, and more.",
  },
  {
    icon: <FaCode size={32} className="text-teal-600" />,
    title: "Real-time Complexity",
    description: "Understand time and space complexity dynamically as algorithms run.",
  },
  {
    icon: <FaProjectDiagram size={32} className="text-teal-600" />,
    title: "Multiple Algorithms",
    description: "Explore a wide range of popular algorithms in one tool.",
  },
  {
    icon: <FaChartLine size={32} className="text-teal-600" />,
    title: "Custom Inputs",
    description: "Test algorithms with your own data and graph structures.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-teal-700">
          Why AlgoViz?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map(({ icon, title, description }, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-6 bg-teal-50 rounded-lg shadow-md hover:shadow-lg transition"
            >
              {icon}
              <h3 className="text-xl font-semibold mt-4 mb-2 text-teal-800">
                {title}
              </h3>
              <p className="text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
