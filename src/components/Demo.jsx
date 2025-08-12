import { useState, useEffect } from "react";

export default function Demo() {
  const [array, setArray] = useState([3, 7, 1, 9, 5, 2, 8]);
  const [target, setTarget] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [foundIndex, setFoundIndex] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Reset search states when array or target changes
  useEffect(() => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setIsSearching(false);
  }, [array, target]);

  // Function to start linear search visualization
  const startSearch = () => {
    if (isSearching) return;
    const t = Number(target);
    if (isNaN(t)) {
      alert("Please enter a valid number to search for.");
      return;
    }

    setIsSearching(true);
    setFoundIndex(null);
    setCurrentIndex(0);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= array.length) {
        setCurrentIndex(null);
        setIsSearching(false);
        clearInterval(interval);
        alert("Target not found in the array.");
        return;
      }
      setCurrentIndex(i);
      if (array[i] === t) {
        setFoundIndex(i);
        setIsSearching(false);
        clearInterval(interval);
        return;
      }
      i++;
    }, 700);
  };

  // Function to generate a new random array
  const generateArray = () => {
    if (isSearching) return;
    const newArray = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 20) + 1
    );
    setArray(newArray);
    setTarget("");
  };

  return (
    <section id="demo" className="py-20 bg-teal-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-teal-700 mb-8">Live Demo: Linear Search</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-10">
          Enter a number to search in the array below. Watch as the algorithm checks each element step-by-step.
        </p>

        {/* Input and controls */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="number"
            placeholder="Enter target number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            disabled={isSearching}
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={startSearch}
            disabled={isSearching || target === ""}
            className={`px-6 py-2 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition disabled:opacity-50`}
          >
            Start Search
          </button>
          <button
            onClick={generateArray}
            disabled={isSearching}
            className="px-6 py-2 rounded border border-teal-600 text-teal-600 font-semibold hover:bg-teal-100 transition disabled:opacity-50"
          >
            Generate New Array
          </button>
        </div>

        {/* Array Visualization */}
        <div className="flex justify-center flex-wrap gap-4 max-w-xl mx-auto">
          {array.map((num, idx) => {
            const isCurrent = idx === currentIndex;
            const isFound = idx === foundIndex;
            return (
              <div
                key={idx}
                className={`w-12 h-12 flex items-center justify-center rounded shadow-md text-lg font-semibold cursor-default
                  ${
                    isFound
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-yellow-400 text-black"
                      : "bg-white text-gray-800"
                  }
                  transition-colors duration-300
                `}
              >
                {num}
              </div>
            );
          })}
        </div>

        {/* Result message */}
        {foundIndex !== null && (
          <p className="mt-8 text-green-700 font-semibold text-lg">
            Target found at index {foundIndex}!
          </p>
        )}
      </div>
    </section>
  );
}
