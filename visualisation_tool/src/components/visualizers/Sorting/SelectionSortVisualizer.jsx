import React, { useState, useEffect, useRef } from "react";

export default function SelectionSortVisualizer() {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 40]);
  const [currentIdx, setCurrentIdx] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Click Sort to start Selection Sort...");
  const [isSorting, setIsSorting] = useState(false);
  const [sortedIdx, setSortedIdx] = useState([]);
  const intervalRef = useRef(null);

  const createArray = () => {
    clearInterval(intervalRef.current);
    let newArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArr);
    setMessage("New array created! Click Sort to start.");
    setCurrentIdx(null);
    setHighlightLine(null);
    setSortedIdx([]); // removed extra "s"
    setIsSorting(false);
  };

  const startSort = () => {
    if (isSorting) return;
    setIsSorting(true);

    let arr = [...array];
    let i = 0;
    let j = i + 1;
    let minIdx = i;

    intervalRef.current = setInterval(() => {
      if (i < arr.length - 1) {
        if (j < arr.length) {
          setCurrentIdx(j);
          setHighlightLine(3);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            setMessage(`New minimum found: ${arr[j]} at index ${j}`);
            setHighlightLine(4);
          }
          j++;
        } else {
          if (minIdx !== i) {
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            setMessage(
              `Swapped minimum ${arr[i]} at index ${i} with ${arr[minIdx]}`
            );
          }
          setArray([...arr]);
          setHighlightLine(6);
          setSortedIdx((prev) => [...prev, i]);

          i++;
          j = i + 1;
          minIdx = i;
        }
      } else {
        clearInterval(intervalRef.current);
        setCurrentIdx(null);
        setMessage(" Selection Sort Completed!");
        setSortedIdx([...Array(arr.length).keys()]);
        setIsSorting(false);
      }
    }, 1000);
  };

  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      {/* 🔹 Heading */}
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Selection Sort
      </h1>

{/* 🔹 Responsive Main Layout */}
<div className="flex flex-col md:flex-row flex-1">
  {/* Left: Buttons pinned at bottom */}
  <div className="w-full md:w-1/6 flex flex-col justify-end items-start p-4 space-y-4">
    <button
      onClick={createArray}
      className="px-5 py-2 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 w-32"
    >
      Create(A)
    </button>
    <button
      onClick={startSort}
      className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-900 w-32"
    >
      Sort
    </button>
  </div>


        {/* Middle: Visualization */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center px-4">
          <div className="flex items-end space-x-2 sm:space-x-4 mb-4 flex-wrap justify-center">
            {array.map((value, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="mb-1 font-bold text-sm">{value}</span>
                <div
                  className={`w-6 sm:w-8 rounded ${
                    sortedIdx.includes(idx)
                      ? "bg-yellow-400"
                      : idx === currentIdx
                      ? "bg-red-500"
                      : "bg-blue-300"
                  }`}
                  style={{ height: `${value * 3}px` }}
                ></div>
                <span className="mt-1 text-xs text-black">{idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pseudocode */}
        <div className="w-full md:w-1/4 flex flex-col justify-center items-start p-4">
          <h2 className="font-bold text-lg mb-2">Selection Sort</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(1)}>repeat (numOfElements - 1) times</p>
            <p style={lineStyle(2)}>
              &nbsp;&nbsp;set the first unsorted element as the minimum
            </p>
            <p style={lineStyle(3)}>
              &nbsp;&nbsp;for each of the unsorted elements
            </p>
            <p style={lineStyle(4)}>
              &nbsp;&nbsp;&nbsp;&nbsp;if element &lt; currentMinimum
            </p>
            <p style={lineStyle(5)}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;set element as new minimum
            </p>
            <p style={lineStyle(6)}>
              &nbsp;&nbsp;swap minimum with first unsorted position
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
