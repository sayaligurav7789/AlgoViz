import React, { useState, useRef, useEffect } from "react";

export default function QueueVisualizer() {
  // queue represented as array: front -> rear (0 .. length-1)
  const [queue, setQueue] = useState([5, 10, 15]);
  const [value, setValue] = useState("");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("Select an operation to begin.");
  const [isBusy, setIsBusy] = useState(false);

  const [mode, setMode] = useState("none"); // "enqueue" | "dequeue" | "none"
  const [highlightLine, setHighlightLine] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(null); // shows which index is focused (optional visual)
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const delay = (ms) =>
    new Promise((resolve) => {
      const t = setTimeout(() => resolve(), ms);
    });

  const resetState = (msg = "") => {
    // cancel any running animation and reset UI flags
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setHighlightLine(null);
      setMode("none");
      setIsBusy(false);
      setCurrentIdx(null);
      setMessage(msg);
    }, 0);
  };

  // ---------------- ENQUEUE ----------------
  // pseudocode lines mapping:
  // 1: if queue is full: overflow
  // 2: rear = rear + 1
  // 3: queue[rear] = value
  // 4: return
  const handleEnqueue = async () => {
    if (isBusy) return;

    if (capacity === "") {
      setMessage("Enter queue capacity first.");
      return;
    }
    if (value === "") {
      setMessage("Enter a value to enqueue.");
      return;
    }

    if (queue.length >= Number(capacity)) {
      setMode("enqueue");
      setHighlightLine(1);
      setMessage("Overflow! Queue is full.");
      return;
    }

    cancelRef.current = false;
    setMode("enqueue");
    setIsBusy(true);
    setMessage("Enqueuing...");

    // line 1 - check full
    setHighlightLine(1);
    await delay(700);
    if (cancelRef.current) return;

    // line 2 - rear = rear + 1 (visual focus to new position)
    setHighlightLine(2);
    // show the (would-be) rear index visually as queue.length (new position)
    setCurrentIdx(queue.length);
    await delay(700);
    if (cancelRef.current) return;

    // line 3 - queue[rear] = value (perform enqueue)
    setHighlightLine(3);
    setQueue((prev) => [...prev, Number(value)]);
    await delay(1000);

    resetState(`Enqueued ${value}.`);
    setValue("");
  };

  // ---------------- DEQUEUE ----------------
  // pseudocode lines mapping:
  // 1: if queue is empty: underflow
  // 2: val = queue[front]
  // 3: front = front + 1
  // 4: return val
  const handleDequeue = async () => {
    if (isBusy) return;

    if (queue.length === 0) {
      setMode("dequeue");
      setHighlightLine(1);
      setMessage("Underflow! Queue is empty.");
      return;
    }

    cancelRef.current = false;
    setMode("dequeue");
    setIsBusy(true);
    setMessage("Dequeuing...");

    // line 1: check empty
    setHighlightLine(1);
    await delay(700);
    if (cancelRef.current) return;

    // line 2: val = queue[front] -> show focus on front (index 0)
    setHighlightLine(2);
    setCurrentIdx(0);
    await delay(700);
    if (cancelRef.current) return;

    // line 3: front = front + 1 (we'll remove head)
    setHighlightLine(3);
    // perform dequeue
    setQueue((prev) => prev.slice(1));
    await delay(1000);

    resetState("Dequeued front element.");
  };

  // ---------------- Pseudocode renderer ----------------
  const renderPseudocode = () => {
    const style = (line) => ({
      backgroundColor: highlightLine === line ? "black" : "#FEA405",
      color: "white",
      padding: "6px 8px",
      borderRadius: 6,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
    });

    if (mode === "enqueue") {
      return (
        <>
          <div style={style(1)}>if queue is full: overflow</div>
          <div style={style(2)}>rear = rear + 1</div>
          <div style={style(3)}>queue[rear] = value</div>
          <div style={style(4)}>return</div>
        </>
      );
    }

    if (mode === "dequeue") {
      return (
        <>
          <div style={style(1)}>if queue is empty: underflow</div>
          <div style={style(2)}>val = queue[front]</div>
          <div style={style(3)}>front = front + 1</div>
          <div style={style(4)}>return val</div>
        </>
      );
    }

    return <div style={{ color: "white" }}>Select an operation.</div>;
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24 px-4">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Queue Visualizer
      </h1>

      {/* main row container - add margin to move whole block down if needed */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start mt-12">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 space-y-3">
          <input
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            type="number"
            placeholder="Capacity"
            className="w-full border rounded px-3 py-2"
          />

          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            placeholder="Value to enqueue"
            className="w-full border rounded px-3 py-2"
          />

          <button
            onClick={handleEnqueue}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Enqueue
          </button>

          <button
            onClick={handleDequeue}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
            Dequeue
          </button>

          <button
            onClick={() => {
              setQueue([]);
              resetState("Cleared queue.");
            }}
            className="w-full bg-orange-500 text-white py-2 rounded"
          >
            Clear
          </button>
        </div>

        {/* VISUALIZATION (center) */}
        <div className="w-full md:w-2/5 flex items-center justify-center">
          <div className="flex flex-col items-center mt-4">
            {/* Boxes left -> right */}
            <div className="flex items-end space-x-3 overflow-x-auto px-2 py-4">
              {queue.length === 0 && (
                <div className="text-gray-500 italic">Queue is empty</div>
              )}

              {queue.map((val, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                const isFocused = currentIdx === idx;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className={`w-20 h-16 flex items-center justify-center border-2 rounded font-bold text-lg ${
                        isFocused ? "bg-yellow-300 border-yellow-600" : "bg-white border-gray-300"
                      }`}
                    >
                      {val}
                    </div>

                    <div className="text-xs mt-1 min-h-4 font-semibold">
                      {isFront && <span className="text-orange-600">front</span>}
                      {isRear && <span className="text-red-600 ml-1">rear</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* indexes row (optional) */}
            <div className="flex items-center space-x-6 mt-1">
              {queue.map((_, idx) => (
                <span key={idx} className="w-20 text-center text-gray-700 font-semibold">
                  {idx}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - pseudocode */}
        <div className="w-full md:w-1/5 p-3">
          <h2 className="font-bold mb-2">Pseudocode</h2>
          <div className="bg-amber-500 text-white p-2 mb-3 rounded">{message}</div>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderPseudocode()}
          </div>
        </div>
      </div>
    </div>
  );
}
