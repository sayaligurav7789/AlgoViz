// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-teal-700 text-white py-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 text-center text-sm">
        © 2025 AlgoViz. Built with React & Tailwind CSS.{" "}
        <a
          href="https://github.com/your-github-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-teal-300"
        >
          GitHub Repo
        </a>
      </div>
    </footer>
  );
}
