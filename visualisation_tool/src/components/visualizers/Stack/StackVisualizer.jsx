import React, { useState, useRef, useEffect } from "react";

export default function StackVisualizer() {
  const [stack, setStack] = useState([10, 20, 30]); 
  const [value, setValue] = useState("");
  const [capacity, setCapacity] = useState(""); // NEW
  const [message, setMessage] = useState("Select an operation to begin.");
  const [isBusy, setIsBusy] = useState(false);

  const [mode, setMode] = useState("none"); 
  const [highlightLine, setHighlightLine] = useState(null);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const delay = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const resetState = (msg = "") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setHighlightLine(null);
      setMode("none");
      setIsBusy(false);
      setMessage(msg);
    }, 0);
  };

  // ---------------- PUSH ----------------
  const handlePush = async () => {
    if (isBusy) return;

    if (capacity === "") {
      setMessage("Enter stack capacity first.");
      return;
    }

    if (value === "") {
      setMessage("Enter a value to push.");
      return;
    }

    if (stack.length >= Number(capacity)) {
      setMode("push");
      setHighlightLine(1);
      setMessage("Overflow! Stack is full.");
      return;
    }

    cancelRef.current = false;
    setMode("push");
    setIsBusy(true);
    setMessage("Pushing...");

    // line 1
    setHighlightLine(1);
    await delay(700);

    // line 2
    setHighlightLine(2);
    await delay(700);

    // line 3: perform push
    setHighlightLine(3);
    setStack((prev) => [...prev, Number(value)]);
    await delay(800);

    resetState(`Pushed ${value} onto stack.`);
    setValue("");
  };

  // ---------------- POP ----------------
  const handlePop = async () => {
    if (isBusy) return;

    if (stack.length === 0) {
      setMode("pop");
      setHighlightLine(1);
      setMessage("Underflow! Stack is empty.");
      return;
    }

    cancelRef.current = false;
    setMode("pop");
    setIsBusy(true);
    setMessage("Popping...");

    // line 1
    setHighlightLine(1);
    await delay(700);

    // line 2
    setHighlightLine(2);
    await delay(700);

    // line 3
    setHighlightLine(3);
    await delay(700);

    // perform pop
    setStack((prev) => prev.slice(0, -1));

    await delay(800);
    resetState("Popped top of stack.");
  };

  // ---------------- PSEUDOCODE ----------------
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

    if (mode === "push") {
      return (
        <>
          <div style={style(1)}>if stack is full: overflow</div>
          <div style={style(2)}>top = top + 1</div>
          <div style={style(3)}>stack[top] = value</div>
          <div style={style(4)}>return</div>
        </>
      );
    }

    if (mode === "pop") {
      return (
        <>
          <div style={style(1)}>if top &lt; 0: underflow</div>
          <div style={style(2)}>val = stack[top]</div>
          <div style={style(3)}>top = top - 1</div>
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
        Stack Visualizer
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 space-y-3 mt-20">

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
            placeholder="Value to push"
            className="w-full border rounded px-3 py-2"
          />

          <button onClick={handlePush} className="w-full bg-blue-600 text-white py-2 rounded">
            Push
          </button>

          <button onClick={handlePop} className="w-full bg-red-600 text-white py-2 rounded">
            Pop
          </button>

          <button
            onClick={() => {
              setStack([]);
              resetState("Cleared stack.");
            }}
            className="w-full bg-orange-500 text-white py-2 rounded"
          >
            Clear
          </button>
        </div>

        {/* VISUALIZATION */}
          <div className="w-full md:w-2/5 flex items-center justify-center mt-20">
            <div className="flex flex-col-reverse items-center">
              {stack.length === 0 && <div className="text-gray-500">Stack empty</div>}
              {stack.map((val, idx) => {
                const isTop = idx === stack.length - 1;
                return (
                  <div key={idx} className="w-36 mb-3 flex flex-col items-center">
                    <div
                      className={`w-full border-2 rounded px-3 py-4 flex items-center justify-center font-bold text-lg ${
                        isTop ? "bg-yellow-300 border-yellow-600" : "bg-white border-gray-300"
                      }`}
                    >
                      {val}
                    </div>
                    <div className="text-xs">
                      {isTop && <span className="text-blue-600">top</span>}
                    </div>
                  </div>
                );
              })}
            </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/5 p-3 mt-20">
          <h2 className="font-bold mb-2">Pseudocode</h2>
          <div className="bg-amber-500 text-white p-2 mb-3 rounded">
            {message}
          </div>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderPseudocode()}
          </div>
        </div>

      </div>
    </div>
  );
}
