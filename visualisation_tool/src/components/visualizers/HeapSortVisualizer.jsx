import React, { useState, useRef, useEffect } from "react";

export default function HeapSortVisualizer() {
  const [array, setArray] = useState([4, 10, 3, 5, 1, 2, 8]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [swapIndex, setSwapIndex] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Click Sort to start Heap Sort...");
  const [isSorting, setIsSorting] = useState(false);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const createArray = () => {
    if (isSorting) return;
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 50));
    setArray(arr);
    setActiveIndex(null);
    setSwapIndex(null);
    setHighlightLine(null);
    setMessage("New array created! Click Sort to begin.");
  };

  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  // Heapify function
  const heapify = async (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    setHighlightLine(1);
    setActiveIndex(i);
    setMessage(`Heapifying at index ${i}`);
    await sleep(500);
    if (cancelRef.current) return;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest !== i) {
      setSwapIndex(largest);
      setMessage(`Swap ${arr[i]} with ${arr[largest]}`);
      await sleep(500);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(500);
      if (cancelRef.current) return;
      await heapify(arr, n, largest);
    }
  };

  const startSort = async () => {
    if (isSorting || array.length === 0) return;
    setIsSorting(true);
    cancelRef.current = false;

    const n = array.length;
    const arr = [...array];

    // Build max heap
    setHighlightLine(0);
    setMessage("Building max heap...");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
      if (cancelRef.current) break;
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      if (cancelRef.current) break;
      setSwapIndex(i);
      setActiveIndex(0);
      setMessage(`Swap ${arr[0]} with ${arr[i]}`);
      await sleep(500);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      await sleep(500);
      await heapify(arr, i, 0);
    }

    setActiveIndex(null);
    setSwapIndex(null);
    setHighlightLine(null);
    setMessage("Heap Sort Completed! ✅");
    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Heap Sort
      </h1>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Left: Buttons */}
        <div className="w-full md:w-1/6 flex flex-col justify-end items-start p-4 space-y-4">
          <button
            onClick={createArray}
            disabled={isSorting}
            className="px-5 py-2 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 disabled:opacity-50 w-32"
          >
            Create(A)
          </button>
          <button
            onClick={startSort}
            disabled={isSorting}
            className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-900 disabled:opacity-50 w-32"
          >
            Sort
          </button>
        </div>

        {/* Center: Array Visualization */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center px-4">
          <div className="mb-6 text-sm text-gray-700 font-semibold">Array (A)</div>
          <div className="flex items-end space-x-2 sm:space-x-4 mb-8 flex-wrap justify-center">
            {array.map((value, idx) => (
              <div key={`A-${idx}`} className="flex flex-col items-center">
                <span className="mb-1 font-bold text-sm">{value}</span>
                <div
                  className={`w-8 rounded transition-all duration-300 ${
                    idx === activeIndex
                      ? "bg-red-500"
                      : idx === swapIndex
                      ? "bg-yellow-400"
                      : "bg-blue-300"
                  }`}
                  style={{ height: `${value * 10}px` }}
                  title={`A[${idx}] = ${value}`}
                />
                <span className="mt-1 text-xs text-black">{idx}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pseudocode + message */}
        <div className="w-full md:w-1/4 flex flex-col justify-end items-start p-4">
          <h2 className="font-bold text-lg mb-2">Heap Sort</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(0)}>Build max heap from array</p>
            <p style={lineStyle(1)}>for i = n/2 -1 down to 0: heapify(arr, n, i)</p>
            <p style={lineStyle(1)}>for i = n-1 down to 1: swap arr[0] with arr[i]; heapify(arr, i, 0)</p>
            <p style={lineStyle(1)}>Repeat until sorted</p>
          </div>
        </div>
      </div>
    </div>
  );
}
