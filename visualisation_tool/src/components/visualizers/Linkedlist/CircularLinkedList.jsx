import React, { useState, useRef } from "react";

export default function CircularLinkedList() {
  const [list, setList] = useState([22, 5, 77, 6, 43, 90]);

  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");

  const [currentIdx, setCurrentIdx] = useState(null);
  const [message, setMessage] = useState("Ready.");
  const [isBusy, setIsBusy] = useState(false);

  const [mode, setMode] = useState("none"); // search | insert | delete
  const [highlightLine, setHighlightLine] = useState(null);
  const [iValue, setIValue] = useState(null); // dry-run "i ="

  const intervalRef = useRef(null);

  const resetState = (msg = "") => {
    clearInterval(intervalRef.current);
    setCurrentIdx(null);
    setHighlightLine(null);
    setIValue(null);
    setIsBusy(false);
    setMessage(msg);
    setMode("none");
  };

  // ---------------- CREATE ----------------
  const createList = () => {
    clearInterval(intervalRef.current);
    let newList = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 90) + 10
    );

    setList(newList);
    resetState("New Circular Linked List created!");
  };

  // ---------------- SEARCH ----------------
  const startSearch = () => {
    if (isBusy || searchValue === "") return;

    setIsBusy(true);
    setMode("search");
    setMessage("Searching...");

    let i = 0;
    let visited = 0;

    setHighlightLine(1);

    intervalRef.current = setInterval(() => {
      setIValue(i);
      setCurrentIdx(i);

      setHighlightLine(2);

      if (list[i] === Number(searchValue)) {
        setHighlightLine(3);
        clearInterval(intervalRef.current);
        setTimeout(() => resetState(`Found at node ${i}!`), 1000);
        return;
      }

      setHighlightLine(4);

      i = (i + 1) % list.length;
      visited++;

      if (visited >= list.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => resetState("Value NOT found."), 1000);
      }
    }, 700);
  };

  // ---------------- INSERT ----------------
  const insertAtPosition = () => {
    if (isBusy || value === "" || position === "") return;

    let pos = Number(position);
    let val = Number(value);

    if (pos < 0 || pos > list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMode("insert");
    setMessage(`Traversing to insert at position ${pos}...`);

    let i = 0;

    setHighlightLine(1);

    intervalRef.current = setInterval(() => {
      setIValue(i);
      setCurrentIdx(i);

      setHighlightLine(2);

      if (i === pos) {
        setHighlightLine(7);
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 0, val);

        setList(newList);
        setTimeout(() => resetState(`Inserted ${val} at position ${pos}.`), 1000);
        return;
      }

      setHighlightLine(6);

      i = (i + 1) % list.length;
    }, 700);
  };

  // ---------------- DELETE ----------------
  const deleteAtPosition = () => {
    if (isBusy || position === "") return;

    let pos = Number(position);

    if (pos < 0 || pos >= list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMode("delete");
    setMessage(`Traversing to delete at position ${pos}...`);

    let i = 0;

    setHighlightLine(1);

    intervalRef.current = setInterval(() => {
      setIValue(i);
      setCurrentIdx(i);

      setHighlightLine(2);

      if (i === pos) {
        setHighlightLine(6);
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 1);

        setList(newList);
        setTimeout(() => resetState(`Deleted node at position ${pos}.`), 1000);
        return;
      }

      setHighlightLine(5);

      i = (i + 1) % list.length;
    }, 700);
  };

  // ---------------- PSEUDOCODE RENDER ----------------
  const renderPseudocode = () => {
    const style = (line) => ({
      backgroundColor: highlightLine === line ? "black" : "#FEA405",
      color: "white",
      padding: "3px 6px",
      borderRadius: 4,
      marginBottom: 5,
      fontFamily: "monospace",
    });

    if (mode === "search")
      return (
        <>
          <div style={style(1)}>for i = 0 to n-1:</div>
          {iValue !== null && (
            <div style={style(1)}>&nbsp;&nbsp;i = {iValue}</div>
          )}
          <div style={style(2)}>&nbsp;&nbsp;if list[i] == value:</div>
          <div style={style(3)}>&nbsp;&nbsp;&nbsp;&nbsp;return i</div>
          <div style={style(4)}>&nbsp;&nbsp;i++</div>
        </>
      );

    if (mode === "insert")
      return (
        <>
          <div style={style(1)}>newNode.value = value</div>
          <div style={style(2)}>if i == position:</div>
          {iValue !== null && <div style={style(5)}>&nbsp;&nbsp;i = {iValue}</div>}
          <div style={style(7)}>&nbsp;&nbsp;insert node</div>
          <div style={style(6)}>i++</div>
        </>
      );

    if (mode === "delete")
      return (
        <>
          <div style={style(1)}>if i == position:</div>
          {iValue !== null && <div style={style(5)}>&nbsp;&nbsp;i = {iValue}</div>}
          <div style={style(6)}>&nbsp;&nbsp;delete node</div>
          <div style={style(5)}>i++</div>
        </>
      );

    return <div className="text-white">Select an operation.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Circular Linked List
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 p-4 space-y-4">
          <button
            onClick={createList}
            className="px-5 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 w-full"
          >
            Create(A)
          </button>

          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="px-3 py-2 border rounded w-full"
          />
          <button
            onClick={startSearch}
            className="px-4 py-2 bg-gray-800 text-white rounded font-bold hover:bg-gray-900 w-full"
          >
            Search
          </button>

          <hr />

          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Value"
            className="px-3 py-2 border rounded w-full"
          />

          <input
            type="number"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
            className="px-3 py-2 border rounded w-full"
          />

          <button
            onClick={insertAtPosition}
            className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 w-full"
          >
            Insert at Position
          </button>

          <button
            onClick={deleteAtPosition}
            className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 w-full"
          >
            Delete at Position
          </button>
        </div>

        {/* VISUALIZATION */}
        <div className="w-full md:w-3/5 flex flex-col items-center mt-10">
          <div className="flex space-x-6">
            {list.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center 
                    text-xl font-bold border-2 
                    ${idx === 0 ? "border-orange-500" : ""}
                    ${idx === list.length - 1 ? "border-red-500" : ""}
                    ${
                      idx === currentIdx
                        ? "bg-yellow-300 border-yellow-600"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    {num}
                  </div>

                  {idx !== list.length - 1 && (
                    <span className="text-2xl m-0 p-0 leading-none">→</span>
                  )}

                  {idx === list.length - 1 && (
                    <span className="text-2xl ml-2 text-orange-600">↺</span>
                  )}
                </div>

                <div className="text-xs mt-1 min-h-6 font-semibold">
                  {idx === 0 && <span className="text-orange-600">head/{idx}</span>}
                  {idx === list.length - 1 && (
                    <span className="text-red-600">tail/{idx}</span>
                  )}
                  {idx === currentIdx && (
                    <span className="text-blue-600">temp/{idx}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL — Pseudocode */}
        <div className="w-full md:w-1/5 p-4">
          <h2 className="font-bold text-lg mb-2">Pseudocode</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded">
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
