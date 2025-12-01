import React, { useState, useRef, useEffect } from "react";

export default function ArrayVisualizer() {
  const [arr, setArr] = useState([10, 20, 30, 40, 50]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");
  const [message, setMessage] = useState("Select an operation.");
  const [mode, setMode] = useState("none");
  const [highlight, setHighlight] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(null);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => (cancelRef.current = true);
  }, []);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const resetAll = (msg = "Ready.") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setHighlight(null);
      setCurrentIdx(null);
      setMode("none");
      setMessage(msg);
    }, 0);
  };

  // ---------------- CREATE ARRAY ----------------
  const createArray = () => {
    const newArr = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArr(newArr);
    resetAll("New array created.");
  };

  // ---------------- SEARCH ----------------
  const handleSearch = async () => {
    if (value === "") {
      setMessage("Enter search value.");
      return;
    }

    cancelRef.current = false;
    setMode("search");
    setHighlight(null);
    setMessage("Searching...");

    let target = Number(value);

    for (let i = 0; i < arr.length; i++) {
      if (cancelRef.current) return;

      setHighlight(1);
      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      if (arr[i] === target) {
        setMessage(`Found at index ${i}.`);
        return;
      }
      await delay(700);
    }

    setMessage("Value not found.");
  };

  // ---------------- INSERT ----------------
  const handleInsert = async () => {
    if (value === "" || index === "") {
      setMessage("Enter value AND index.");
      return;
    }

    let idx = Number(index);
    let val = Number(value);

    if (idx < 0 || idx > arr.length) {
      setMessage("Invalid index.");
      return;
    }

    cancelRef.current = false;
    setMode("insert");
    setMessage("Inserting...");

    setHighlight(1);
    for (let i = arr.length - 1; i >= idx; i--) {
      if (cancelRef.current) return;

      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      await delay(700);
    }

    setHighlight(3);
    const newArr = [...arr];
    newArr.splice(idx, 0, val);
    setArr(newArr);

    await delay(800);
    setMessage(`Inserted ${val} at index ${idx}.`);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (index === "") {
      setMessage("Enter index.");
      return;
    }

    let idx = Number(index);

    if (idx < 0 || idx >= arr.length) {
      setMessage("Invalid index.");
      return;
    }

    cancelRef.current = false;
    setMode("delete");
    setMessage("Deleting...");

    setHighlight(1);
    for (let i = idx; i < arr.length - 1; i++) {
      if (cancelRef.current) return;

      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      await delay(700);
    }

    setHighlight(3);
    const newArr = [...arr];
    newArr.splice(idx, 1);
    setArr(newArr);

    await delay(800);
    setMessage(`Deleted index ${idx}.`);
  };

  // ---------------- PSEUDOCODE ----------------
  const renderCode = () => {
    const s = (n) => ({
      backgroundColor: highlight === n ? "black" : "#FEA405",
      color: "white",
      padding: "5px 8px",
      borderRadius: 6,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
    });

    if (mode === "search")
      return (
        <>
          <div style={s(1)}>for i = 0 to n-1:</div>
          <div style={s(2)}>&nbsp;&nbsp;if A[i] == value → found</div>
        </>
      );

    if (mode === "insert")
      return (
        <>
          <div style={s(1)}>for i = n-1 down to index:</div>
          <div style={s(2)}>&nbsp;&nbsp;A[i+1] = A[i]</div>
          <div style={s(3)}>A[index] = value</div>
        </>
      );

    if (mode === "delete")
      return (
        <>
          <div style={s(1)}>for i = index to n-2:</div>
          <div style={s(2)}>&nbsp;&nbsp;A[i] = A[i+1]</div>
          <div style={s(3)}>remove last</div>
        </>
      );

    return <div style={{ color: "white" }}>Pick operation.</div>;
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 px-6">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Array
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start pt-15">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 p-3 space-y-3">

          <button onClick={createArray} className="w-full bg-orange-500 text-white py-2 rounded">
            Create
          </button>

          <input
            type="number"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            placeholder="Index"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />

          <button onClick={handleSearch} className="w-full bg-blue-600 text-white py-2 rounded">
            Search
          </button>

          <button onClick={handleInsert} className="w-full bg-green-600 text-white py-2 rounded">
            Insert
          </button>

          <button onClick={handleDelete} className="w-full bg-red-600 text-white py-2 rounded">
            Delete
          </button>

          <button
            onClick={() => resetAll("Ready.")}
            className="w-full bg-gray-600 text-white py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* CENTER — ARRAY VISUAL */}
        <div className="w-full md:w-3/5 flex justify-center">
          <div className="flex gap-4 p-4 bg-white rounded shadow">

            {arr.map((num, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg border-2 ${
                    i === currentIdx
                      ? "bg-yellow-300 border-yellow-600"
                      : "bg-white border-gray-400"
                  }`}
                >
                  {num}
                </div>
                <div className="text-xs mt-1">{i}</div>
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT PANEL — Updated like Tree/Graph */}
        <div className="w-full md:w-1/5 p-3">

          {/* MESSAGE BOX */}
          <div className="bg-amber-500 text-white p-2 rounded mb-3">
            {message}
          </div>

          {/* STATUS */}
          <div className="text-sm mb-4">
            <strong>Current Index:</strong> {currentIdx ?? "-"}
          </div>

          {/* PSEUDOCODE */}
          <h3 className="font-bold mb-2">Pseudocode</h3>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderCode()}
          </div>
        </div>

      </div>
    </div>
  );
}
