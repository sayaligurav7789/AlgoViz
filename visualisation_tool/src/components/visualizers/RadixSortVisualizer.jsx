import React, { useState, useRef, useEffect } from "react";

export default function RadixSortVisualizer() {
  const [array, setArray] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [countArray, setCountArray] = useState([]);
  const [outputArray, setOutputArray] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);       
  const [currentDigit, setCurrentDigit] = useState(null);
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Click Sort to start Radix Sort...");
  const [isSorting, setIsSorting] = useState(false);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Create random array
  const createArray = () => {
    if (isSorting) return;
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 1000));
    setArray(arr);
    setCountArray([]);
    setOutputArray([]);
    setActiveIndex(null);
    setCurrentDigit(null);
    setHighlightLine(null);
    setMessage("New array created! Click Sort to begin.");
  };

  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  // Counting sort for a specific digit
  const countingSortDigit = async (arr, exp) => {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    // Count occurrences of digits
    setHighlightLine(1);
    setMessage(`Counting occurrences of digit at exp=${exp}`);
    for (let i = 0; i < n; i++) {
      const digit = Math.floor((arr[i] / exp) % 10);
      setActiveIndex(i);
      setCurrentDigit(digit);
      await sleep(400);
      count[digit]++;
      setCountArray([...count]);
      setMessage(`Increment count[${digit}] → ${count[digit]}`);
      await sleep(400);
      if (cancelRef.current) return arr;
    }

    // Cumulative sum
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    setCountArray([...count]);
    await sleep(500);

    // Build output array (traverse from end for stability)
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor((arr[i] / exp) % 10);
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      setOutputArray([...output]);
      setCountArray([...count]);
      setMessage(`Place ${arr[i]} at output[${count[digit]}]`);
      await sleep(400);
      if (cancelRef.current) return arr;
    }

    return output;
  };

  // Radix Sort animation
  const startSort = async () => {
    if (isSorting || array.length === 0) return;
    setIsSorting(true);
    cancelRef.current = false;

    let A = [...array];
    const max = Math.max(...A);

    let exp = 1;
    while (Math.floor(max / exp) > 0) {
      setHighlightLine(0);
      setMessage(`Sorting by digit at exp=${exp}`);
      await sleep(500);
      A = await countingSortDigit(A, exp);
      setArray([...A]);
      exp *= 10;
      if (cancelRef.current) break;
    }

    setActiveIndex(null);
    setCurrentDigit(null);
    setHighlightLine(null);
    setMessage("Radix Sort Completed! ✅");
    setIsSorting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Radix Sort
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

        {/* Center: Visualization */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-center px-4">
          <div className="mb-6 text-sm text-gray-700 font-semibold">Array (A)</div>
          <div className="flex items-end space-x-2 sm:space-x-4 mb-8 flex-wrap justify-center">
            {array.map((value, idx) => (
              <div key={`A-${idx}`} className="flex flex-col items-center">
                <span className="mb-1 font-bold text-sm">{value}</span>
                <div
                  className={`w-8 rounded transition-all duration-300 ${
                    idx === activeIndex ? "bg-red-500" : "bg-blue-300"
                  }`}
                  style={{ height: `${(value + 1) / 2}px` }}
                  title={`A[${idx}] = ${value}`}
                />
                <span className="mt-1 text-xs text-black">{idx}</span>
              </div>
            ))}
          </div>

          {/* Count Array */}
          {countArray.length > 0 && (
            <>
              <div className="mb-2 text-sm text-gray-700 font-semibold">
                Frequency / Count (0-9)
              </div>
              <div className="flex items-end space-x-2 sm:space-x-3 mb-8 flex-wrap justify-center">
                {countArray.map((cnt, i) => (
                  <div key={`C-${i}`} className="flex flex-col items-center">
                    <span className="mb-1 text-xs text-black">i={i}</span>
                    <div
                      className={`min-w-[2rem] sm:min-w-[2.2rem] px-2 py-2 text-center rounded border transition-all duration-200 ${
                        i === currentDigit
                          ? "bg-yellow-400 border-yellow-600"
                          : "bg-yellow-300 border-yellow-500"
                      }`}
                      title={`count[${i}] = ${cnt}`}
                    >
                      <span className="font-bold">{cnt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Output Array */}
          <div className="mb-2 text-sm text-gray-700 font-semibold">Output (sorted so far)</div>
          <div className="flex items-end space-x-2 sm:space-x-3 flex-wrap justify-center">
            {outputArray.length === 0 ? (
              <div className="text-xs text-gray-500">— building —</div>
            ) : (
              outputArray.map((v, idx) => (
                <div key={`O-${idx}`} className="flex flex-col items-center">
                  <div
                    className="min-w-[2rem] sm:min-w-[2.2rem] px-2 py-2 text-center rounded bg-green-500 text-white font-bold shadow"
                    title={`output[${idx}] = ${v}`}
                  >
                    {v}
                  </div>
                  <span className="mt-1 text-xs text-black">{idx}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Pseudocode + message */}
        <div className="w-full md:w-1/4 flex flex-col justify-end items-start p-4">
          <h2 className="font-bold text-lg mb-2">Radix Sort</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(0)}>for exp = 1, 10, 100... until max/exp&gt;0:</p>
            <p style={lineStyle(1)}>   Counting sort on digit at exp</p>
            <p style={lineStyle(2)}>   count[digit]++ for each element</p>
            <p style={lineStyle(3)}>   cumulative count</p>
            <p style={lineStyle(4)}>   build output array stable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
