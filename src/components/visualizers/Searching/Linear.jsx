import React, { useState, useRef } from "react";

export default function Linear() {
  const [array, setArray] = useState([15, 8, 23, 4, 42, 16, 9]);
  const [target, setTarget] = useState("");
  const [currentIdx, setCurrentIdx] = useState(null);
  const [foundIdx, setFoundIdx] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Enter a number and click Search.");
  const [isSearching, setIsSearching] = useState(false);
  const intervalRef = useRef(null);

  const createArray = () => {
    clearInterval(intervalRef.current);

    let newArr = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 50) + 1
    );

    setArray(newArr);
    setCurrentIdx(null);
    setFoundIdx(null);
    setTarget("");
    setHighlightLine(null);
    setMessage("New array created!");
    setIsSearching(false);
  };

  const startSearch = () => {
    if (isSearching || target === "") return;

    setIsSearching(true);
    setMessage("Searching...");

    let i = 0;

    intervalRef.current = setInterval(() => {
      if (i >= array.length) {
        setMessage("Target NOT found.");
        setCurrentIdx(null);
        setIsSearching(false);
        clearInterval(intervalRef.current);
        return;
      }

      setCurrentIdx(i);
      setHighlightLine(2);

      if (array[i] === Number(target)) {
        setFoundIdx(i);
        setMessage(`Found at index ${i}!`);
        setHighlightLine(3);
        setIsSearching(false);
        clearInterval(intervalRef.current);
        return;
      }

      setHighlightLine(4);
      i++;
    }, 700);
  };

  const lineStyle = (line) => ({
    backgroundColor: highlightLine === line ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Linear Search
      </h1>

      <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-center">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/6 flex flex-col items-start p-4 space-y-4">
          <button
            onClick={createArray}
            className="px-5 py-2 bg-orange-500 text-white rounded shadow font-bold hover:bg-orange-600 w-32"
          >
            Create(A)
          </button>

          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target"
            className="px-3 py-2 border rounded w-32"
          />

          <button
            onClick={startSearch}
            className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-900 w-32"
          >
            Search
          </button>
        </div>

        {/* MIDDLE: BOX VISUALIZATION */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center">

          {/* ARRAY BOXES */}
          <div className="flex space-x-3 mb-3">
            {array.map((num, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 flex items-center justify-center border-2 text-lg font-bold rounded 
                  ${
                    idx === foundIdx
                      ? "bg-green-400 border-green-600"
                      : idx === currentIdx
                      ? "bg-yellow-300 border-yellow-600"
                      : "bg-white border-gray-400"
                  }
                `}
              >
                {num}
              </div>
            ))}
          </div>

          {/* INDEXES */}
          <div className="flex space-x-3">
            {array.map((_, idx) => (
              <span key={idx} className="w-16 text-center text-gray-700 font-semibold">
                {idx}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — PSEUDOCODE */}
        <div className="w-full md:w-1/4 flex flex-col items-start p-4">
          <h2 className="font-bold text-lg mb-2">Pseudocode</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>

          <div
            className="font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(1)}>for i = 0 to n-1:</p>
            <p style={lineStyle(2)}>&nbsp;&nbsp;if arr[i] == target:</p>
            <p style={lineStyle(3)}>&nbsp;&nbsp;&nbsp;&nbsp;return i</p>
            <p style={lineStyle(4)}>&nbsp;&nbsp;else continue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
