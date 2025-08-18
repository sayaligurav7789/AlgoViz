export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-teal-700 mb-10">About AlgoViz</h2>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
          AlgoViz is a project designed to help students, developers, and coding enthusiasts learn algorithms through interactive visualization and real-time complexity analysis. 
          Our goal is to make understanding complex algorithms simple and engaging by providing intuitive step-by-step animations and customizable inputs.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Built with React and Tailwind CSS, AlgoViz is open source and continually evolving with contributions from the community.
        </p>
      </div>
    </section>
  );
}
