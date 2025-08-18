import React, { useState, useRef } from "react";

export default function QuickSortVisualizer() {
  const [array, setArray] = useState([50, 30, 70, 10, 90, 40]);
  const [highlight, setHighlight] = useState({ pivot: null, left: null, right: null });
  const [message, setMessage] = useState("Click Create(A) to generate a new array");
  const [sorting, setSorting] = useState(false);
  const [highlightLine, setHighlightLine] = useState(null);
  const steps = useRef([]);

  // 🔹 Create Random Array
  const createArray = () => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 10);
    setArray(arr);
    setMessage("New Array Created! Click Sort to start QuickSort.");
    setHighlight({ pivot: null, left: null, right: null });
    steps.current = [];
    setHighlightLine(null);
  };

  // 🔹 QuickSort Recursive Function (stores steps for animation)
  const quickSortSteps = (arr, low, high) => {
    if (low < high) {
      setHighlightLine(2);
      let pivotIndex = partition(arr, low, high);
      quickSortSteps(arr, low, pivotIndex - 1);
      quickSortSteps(arr, pivotIndex + 1, high);
    }
  };

  const partition = (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;
    steps.current.push({
      array: [...arr],
      pivotIndex: high,
      message: `Choosing pivot ${pivot} at index ${high}`,
      line: 5,
    });

    for (let j = low; j < high; j++) {
      steps.current.push({
        array: [...arr],
        pivotIndex: high,
        left: j,
        right: i,
        message: `Comparing ${arr[j]} with pivot ${pivot}`,
        line: 8,
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.current.push({
          array: [...arr],
          pivotIndex: high,
          left: j,
          right: i,
          message: `Swapped ${arr[i]} and ${arr[j]}`,
          line: 10,
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.current.push({
      array: [...arr],
      pivotIndex: i + 1,
      message: `Placed pivot ${pivot} at correct position`,
      line: 12,
    });

    return i + 1;
  };

  // 🔹 Animate Steps
  const startSort = () => {
    if (sorting) return;
    setSorting(true);
    let arrCopy = [...array];
    quickSortSteps(arrCopy, 0, arrCopy.length - 1);

    let i = 0;
    const interval = setInterval(() => {
      if (i >= steps.current.length) {
        clearInterval(interval);
        setSorting(false);
        setMessage("Sorting Completed!");
        setHighlight({ pivot: null, left: null, right: null });
        setHighlightLine(null);
        return;
      }
      const step = steps.current[i];
      setArray(step.array);
      setHighlight({ pivot: step.pivotIndex, left: step.left, right: step.right });
      setMessage(step.message);
      setHighlightLine(step.line);
      i++;
    }, 1000);
  };

  // 🔹 Line Style for Pseudocode Highlight
  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      {/* 🔹 Heading */}
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Quick Sort
      </h1>

      {/* 🔹 Responsive Main Layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left: Buttons pinned at bottom */}
        <div className="w-full md:w-1/6 flex flex-col justify-end items-start p-4 space-y-4">
          <button
            onClick={createArray}
            disabled={sorting}
            className="px-5 py-2 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 w-32"
          >
            Create(A)
          </button>
          <button
            onClick={startSort}
            disabled={sorting}
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
                    highlight.pivot === idx
                      ? "bg-red-500"
                      : highlight.left === idx
                      ? "bg-yellow-500"
                      : highlight.right === idx
                      ? "bg-blue-500"
                      : "bg-green-600"
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
          <h2 className="font-bold text-lg mb-2">Quick Sort (Tree Partition)</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(1)}>procedure quickSort(A, low, high)</p>
            <p style={lineStyle(2)}>&nbsp;&nbsp;if low &lt; high</p>
            <p style={lineStyle(3)}>
              &nbsp;&nbsp;&nbsp;&nbsp;pivotIndex = partition(A, low, high)
            </p>
            <p style={lineStyle(4)}>&nbsp;&nbsp;&nbsp;&nbsp;quickSort(A, low, pivotIndex - 1)</p>
            <p style={lineStyle(5)}>&nbsp;&nbsp;&nbsp;&nbsp;quickSort(A, pivotIndex + 1, high)</p>
            <br />
            <p style={lineStyle(6)}>procedure partition(A, low, high)</p>
            <p style={lineStyle(7)}>&nbsp;&nbsp;pivot = A[high]</p>
            <p style={lineStyle(8)}>&nbsp;&nbsp;for j = low to high - 1</p>
            <p style={lineStyle(9)}>&nbsp;&nbsp;&nbsp;&nbsp;if A[j] &lt; pivot</p>
            <p style={lineStyle(10)}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swap A[i], A[j]</p>
            <p style={lineStyle(11)}>&nbsp;&nbsp;swap A[i+1], A[high]</p>
            <p style={lineStyle(12)}>&nbsp;&nbsp;return i + 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
