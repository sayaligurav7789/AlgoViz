import React, { useState, useRef, useEffect } from "react";

export default function CountSortVisualizer() {
  const [array, setArray] = useState([3, 1, 4, 1, 2, 0, 5, 2]);
  const [countArray, setCountArray] = useState([]);
  const [outputArray, setOutputArray] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);       // current index in A while counting
  const [currentCountIndex, setCurrentCountIndex] = useState(null); // current i in count[i]
  const [highlightLine, setHighlightLine] = useState(null);
  const [message, setMessage] = useState("Click Sort to start Counting Sort...");
  const [isSorting, setIsSorting] = useState(false);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => { cancelRef.current = true; };
  }, []);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  //  Create random array (values 0..9)
  const createArray = () => {
    if (isSorting) return;
    const arr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    setArray(arr);
    setCountArray([]);
    setOutputArray([]);
    setActiveIndex(null);
    setCurrentCountIndex(null);
    setHighlightLine(null);
    setMessage("New array created! Click Sort to begin.");
  };

  //  Line style (same as Selection Sort)
  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  //  Counting Sort animation
  const startSort = async () => {
    if (isSorting || array.length === 0) return;
    setIsSorting(true);
    cancelRef.current = false;

    const A = [...array];
    const k = Math.max(...A);

    // Step 1–2: find max & init count[]
    setHighlightLine(1);
    setMessage(`k = max(A) = ${k}`);
    setCountArray(new Array(k + 1).fill(0));
    await sleep(700);
    if (cancelRef.current) return;

    setHighlightLine(2);
    setMessage(`Initialize count[0..${k}] = 0`);
    await sleep(500);
    if (cancelRef.current) return;

    // Step 3: count frequencies
    setHighlightLine(3);
    for (let idx = 0; idx < A.length; idx++) {
      setActiveIndex(idx);
      const val = A[idx];
      setCurrentCountIndex(val);
      setMessage(`Counting value ${val}: count[${val}]++`);
      await sleep(500);
      if (cancelRef.current) return;

      setCountArray((prev) => {
        const next = [...prev];
        next[val] = (next[val] || 0) + 1;
        return next;
      });

      await sleep(400);
      if (cancelRef.current) return;
    }
    setActiveIndex(null);
    setCurrentCountIndex(null);

    // Step 4: build output from counts
    setHighlightLine(4);
    const out = [];
    for (let v = 0; v <= k; v++) {
      setCurrentCountIndex(v);
      setMessage(`Placing value ${v} from count[${v}]`);
      await sleep(400);
      if (cancelRef.current) return;

      let placed = 0;
      setCountArray((prev) => [...prev]); // ensure UI updates currentCountIndex highlight

      // Repeatedly place v while count[v] > 0
      while ((countArray[v] ?? 0) > 0) {
        // Read latest count safely
        let latest = countArray;
        if (!latest.length) latest = new Array(k + 1).fill(0);
        if (latest[v] <= 0) break;

        // decrement and push
        const nextCount = [...latest];
        nextCount[v] = nextCount[v] - 1;
        setCountArray(nextCount);

        out.push(v);
        setOutputArray([...out]);

        setMessage(`Put ${v} → output (remaining count[${v}] = ${nextCount[v]})`);
        placed++;
        await sleep(400);
        if (cancelRef.current) return;
      }
    }

    // Finalize
    setArray(out);
    setCurrentCountIndex(null);
    setHighlightLine(null);
    setMessage("Counting Sort Completed! ✅");
    setIsSorting(false);
  };

  // Keep countArray in sync inside the placement loop
  // (React state is async; this keeps the while condition responsive)
  useEffect(() => {
    // no-op; the effect exists just to refresh closures
  }, [countArray]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Counting Sort
      </h1>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left: Buttons pinned at bottom-left */}
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
          {/* Main Array */}
          <div className="mb-6 text-sm text-gray-700 font-semibold">Array (A)</div>
          <div className="flex items-end space-x-2 sm:space-x-4 mb-8 flex-wrap justify-center">
            {array.map((value, idx) => (
              <div key={`A-${idx}`} className="flex flex-col items-center">
                <span className="mb-1 font-bold text-sm">{value}</span>
                <div
                  className={`w-6 sm:w-8 rounded transition-all duration-300 ${
                    idx === activeIndex ? "bg-red-500" : "bg-blue-300"
                  }`}
                  style={{ height: `${(value + 1) * 14}px` }}
                  title={`A[${idx}] = ${value}`}
                />
                <span className="mt-1 text-xs text-black">{idx}</span>
              </div>
            ))}
          </div>

          {/* Frequency Array */}
          {countArray.length > 0 && (
            <>
              <div className="mb-2 text-sm text-gray-700 font-semibold">
                Frequency / Count (count[i])
              </div>
              <div className="flex items-end space-x-2 sm:space-x-3 mb-8 flex-wrap justify-center">
                {countArray.map((cnt, i) => (
                  <div key={`C-${i}`} className="flex flex-col items-center">
                    <span className="mb-1 text-xs text-black">i={i}</span>
                    <div
                      className={`min-w-[2rem] sm:min-w-[2.2rem] px-2 py-2 text-center rounded border transition-all duration-200 ${
                        i === currentCountIndex ? "bg-yellow-400 border-yellow-600" : "bg-yellow-300 border-yellow-500"
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

          {/* Output Array (builds gradually) */}
          <div className="mb-2 text-sm text-gray-700 font-semibold">Output (sorted)</div>
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

        {/* Right: Pseudocode + message (bottom-right) */}
        <div className="w-full md:w-1/4 flex flex-col justify-end items-start p-4">
          <h2 className="font-bold text-lg mb-2">Counting Sort</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(1)}>k = max(A)</p>
            <p style={lineStyle(2)}>count[0..k] = 0</p>
            <p style={lineStyle(3)}>for each x in A: count[x]++</p>
            <p style={lineStyle(4)}>
              output = [] ; for v in 0..k: while count[v] &gt; 0: append v to output ; count[v]--
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
