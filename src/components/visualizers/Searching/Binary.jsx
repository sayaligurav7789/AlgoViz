import React, { useState, useRef } from "react";

export default function Binary() {
  const [array, setArray] = useState([5, 12, 23, 34, 45, 56, 67, 78]);
  const [target, setTarget] = useState("");
  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);
  const [mid, setMid] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Enter a number & click Search.");
  const [isSearching, setIsSearching] = useState(false);

  const intervalRef = useRef(null);

  const createArray = () => {
    clearInterval(intervalRef.current);
    let newArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 100) + 1
    ).sort((a, b) => a - b);

    setArray(newArr);
    setTarget("");
    setLow(null);
    setHigh(null);
    setMid(null);
    setHighlightLine(null);
    setMessage("New sorted array created!");
    setIsSearching(false);
  };

  const startSearch = () => {
    if (isSearching || target === "") return;
    setIsSearching(true);

    let lo = 0;
    let hi = array.length - 1;
    const t = Number(target);

    setMessage("Searching...");

    intervalRef.current = setInterval(() => {
      if (lo > hi) {
        setMessage("Target NOT found.");
        clearInterval(intervalRef.current);
        setIsSearching(false);
        return;
      }

      setLow(lo);
      setHigh(hi);

      let m = Math.floor((lo + hi) / 2);
      setMid(m);
      setHighlightLine(2);

      if (array[m] === t) {
        setMessage(`Found at index ${m}!`);
        setHighlightLine(3);
        clearInterval(intervalRef.current);
        setIsSearching(false);
        return;
      }

      if (array[m] < t) {
        setMessage("Searching right half...");
        setHighlightLine(4);
        lo = m + 1;
      } else {
        setMessage("Searching left half...");
        setHighlightLine(5);
        hi = m - 1;
      }
    }, 900);
  };

  const lineStyle = (num) => ({
    backgroundColor: highlightLine === num ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-8">
        Binary Search
      </h1>

      <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-center mt-10">

        {/* LEFT CONTROLS */}
        <div className="w-full md:w-1/6 flex flex-col items-start p-4 space-y-4">
          <button
            onClick={createArray}
            className="px-5 py-2 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 w-32"
          >
            Create(A)
          </button>

          <input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter target"
            type="number"
            className="px-3 py-2 border rounded w-32"
          />

          <button
            onClick={startSearch}
            className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-900 w-32"
          >
            Search
          </button>
        </div>

        {/* MIDDLE VISUALIZATION */}
        <div className="w-full md:w-2/3 flex flex-col justify-center items-center">

          {/* BOXES */}
          <div className="flex space-x-3 mb-3">
            {array.map((num, idx) => (
              <div
                key={idx}
                className={`w-16 h-16 flex items-center justify-center border-2 text-lg font-bold rounded
                ${
                  idx === mid
                    ? "bg-purple-400 border-purple-700"
                    : idx === low
                    ? "bg-blue-300 border-blue-700"
                    : idx === high
                    ? "bg-red-300 border-red-700"
                    : "bg-white border-gray-400"
                }`}
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

        {/* RIGHT PSEUDOCODE */}
        <div className="w-full md:w-1/4 flex flex-col items-start p-4">
          <h2 className="font-bold text-lg mb-2">Pseudocode</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>

          <div className="font-mono text-sm rounded w-full" style={{ backgroundColor: "#FEA405" }}>
            <p style={lineStyle(1)}>lo = 0 , hi = n-1</p>
            <p style={lineStyle(2)}>mid = (lo + hi) / 2</p>
            <p style={lineStyle(3)}>if arr[mid] == target → found</p>
            <p style={lineStyle(4)}>if arr[mid] &lt; target → search right</p>
            <p style={lineStyle(5)}>else search left</p>
          </div>
        </div>

      </div>
    </div>
  );
}
