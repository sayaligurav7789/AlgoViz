import React, { useState, useRef, useEffect } from "react";

/**
 * StackVisualizer.jsx
 * - Vertical stack visualization (top at top)
 * - Push / Pop operations
 * - Pseudocode with animated line highlighting
 * - Delay: 700ms per step, final hold 1000ms
 */

export default function StackVisualizer() {
  const [stack, setStack] = useState([10, 20, 30]); // bottom -> top (last is top)
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Select an operation to begin.");
  const [isBusy, setIsBusy] = useState(false);

  const [mode, setMode] = useState("none"); // "push" | "pop" | "none"
  const [highlightLine, setHighlightLine] = useState(null);
  const [topIndex, setTopIndex] = useState(stack.length - 1);

  const cancelRef = useRef(false);

  useEffect(() => {
    setTopIndex(stack.length - 1);
    return () => {
      cancelRef.current = true;
    };
  }, [stack]);

  const delay = (ms) =>
    new Promise((resolve) => {
      const t = setTimeout(() => resolve(), ms);
    });

  const resetState = (msg = "") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setHighlightLine(null);
      setMode("none");
      setIsBusy(false);
      setMessage(msg);
      setTopIndex(stack.length - 1);
    }, 0);
  };

  // PUSH animation
  const handlePush = async () => {
    if (isBusy) return;
    if (value === "") {
      setMessage("Enter a value to push.");
      return;
    }

    cancelRef.current = false;
    setMode("push");
    setIsBusy(true);
    setMessage("Pushing value...");

    // pseudocode mapping:
    // 1: if stack is full: error (we don't enforce capacity)
    // 2: top = top + 1
    // 3: stack[top] = value
    // 4: return
    setHighlightLine(1);
    await delay(700);
    if (cancelRef.current) return;

    setHighlightLine(2);
    await delay(700);
    if (cancelRef.current) return;

    setHighlightLine(3);
    // perform push (value goes to top -> end of array)
    setStack((prev) => {
      const copy = [...prev, Number(value)];
      return copy;
    });

    // show final state
    await delay(1000);
    resetState(`Pushed ${value} onto stack.`);
    setValue("");
  };

  // POP animation
  const handlePop = async () => {
    if (isBusy) return;
    if (stack.length === 0) {
      setMessage("Stack is empty.");
      return;
    }

    cancelRef.current = false;
    setMode("pop");
    setIsBusy(true);
    setMessage("Popping top...");

    // pseudocode mapping:
    // 1: if top < 0: underflow
    // 2: val = stack[top]
    // 3: top = top - 1
    // 4: return val

    setHighlightLine(1);
    await delay(700);
    if (cancelRef.current) return;

    setHighlightLine(2);
    // show which value will be popped (top)
    setTopIndex(stack.length - 1);
    await delay(700);
    if (cancelRef.current) return;

    setHighlightLine(3);
    // perform pop
    setStack((prev) => {
      const copy = [...prev];
      const popped = copy.pop();
      return copy;
    });

    await delay(1000);
    resetState(`Popped top of stack.`);
  };

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
          <div style={style(1)}>if stack is full: error</div>
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

    return <div style={{ color: "white" }}>Select push or pop to view pseudocode.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24 px-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Stack Visualizer
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start">
        {/* Left controls */}
        <div className="w-full md:w-1/5 space-y-3">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
            placeholder="Value to push"
            className="w-full border rounded px-3 py-2"
          />
          <button
            onClick={handlePush}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Push
          </button>
          <button
            onClick={handlePop}
            className="w-full bg-red-600 text-white py-2 rounded"
          >
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

        {/* Visualization */}
        <div className="w-full md:w-2/5 flex items-center justify-center">
          <div className="flex flex-col-reverse items-center">
            {stack.length === 0 && (
              <div className="text-gray-500 italic">Stack is empty</div>
            )}
            {stack.map((val, idx) => {
              const fromBottomIdx = idx; // 0 is bottom
              const topIdx = stack.length - 1;
              const isTop = idx === topIdx;
              return (
                <div
                  key={idx}
                  className="w-36 mb-3 flex flex-col items-center"
                >
                  <div
                    className={`w-full border-2 rounded px-3 py-4 flex items-center justify-center font-bold text-lg ${
                      isTop ? "bg-yellow-300 border-yellow-600" : "bg-white border-gray-300"
                    }`}
                  >
                    {val}
                  </div>
                  <div className="text-xs mt-1">
                    {isTop && <span className="text-blue-600">top</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pseudocode */}
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
