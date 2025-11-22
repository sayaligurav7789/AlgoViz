import React, { useState, useRef } from "react";

export default function DoublyCircularLinkedList() {
  const [list, setList] = useState([10, 20, 30, 40, 50]);

  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");

  const [currentIdx, setCurrentIdx] = useState(null);
  const [message, setMessage] = useState("Select an operation to begin.");
  const [isBusy, setIsBusy] = useState(false);

  const [mode, setMode] = useState("none");
  const [highlightLine, setHighlightLine] = useState(null);
  const [iValue, setIValue] = useState(null);

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

  // CREATE LIST
  const createList = () => {
    let newList = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setList(newList);
    resetState("New Doubly Circular Linked List created!");
  };

  // SEARCH
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
        setTimeout(() => resetState(`Found at node ${i}!`), 900);
        clearInterval(intervalRef.current);
        return;
      }

      setHighlightLine(4);

      i = (i + 1) % list.length;
      visited++;

      if (visited >= list.length) {
        setTimeout(() => resetState("Value NOT found."), 900);
        clearInterval(intervalRef.current);
      }
    }, 700);
  };

  // INSERT
  const insertAtPosition = () => {
    if (isBusy || value === "" || position === "") return;

    let pos = Number(position),
      val = Number(value);

    if (pos < 0 || pos > list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMode("insert");
    setMessage(`Inserting ${val} at position ${pos}...`);

    let i = 0;
    setHighlightLine(1);

    intervalRef.current = setInterval(() => {
      setIValue(i);
      setCurrentIdx(i);
      setHighlightLine(2);

      if (i === pos) {
        setHighlightLine(3);
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 0, val);
        setList(newList);

        setTimeout(
          () => resetState(`Inserted ${val} at position ${pos}.`),
          900
        );
        return;
      }

      setHighlightLine(4);
      i = (i + 1) % list.length;
    }, 700);
  };

  // DELETE
  const deleteAtPosition = () => {
    if (isBusy || position === "") return;

    let pos = Number(position);

    if (pos < 0 || pos >= list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMode("delete");
    setMessage(`Deleting node at position ${pos}...`);

    let i = 0;
    setHighlightLine(1);

    intervalRef.current = setInterval(() => {
      setIValue(i);
      setCurrentIdx(i);
      setHighlightLine(2);

      if (i === pos) {
        setHighlightLine(3);
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 1);
        setList(newList);

        setTimeout(
          () => resetState(`Deleted node at position ${pos}.`),
          900
        );
        return;
      }

      setHighlightLine(4);
      i = (i + 1) % list.length;
    }, 700);
  };

  // PSEUDOCODE
  const renderPseudocode = () => {
    const style = (line) => ({
      backgroundColor: highlightLine === line ? "black" : "#FEA405",
      color: "white",
      padding: "3px 6px",
      borderRadius: 4,
      marginBottom: 6,
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
          {iValue !== null && (
            <div style={style(1)}>&nbsp;&nbsp;i = {iValue}</div>
          )}
          <div style={style(2)}>if i == position:</div>
          <div style={style(3)}>&nbsp;&nbsp;insert newNode</div>
          <div style={style(4)}>i++</div>
        </>
      );

    if (mode === "delete")
      return (
        <>
          <div style={style(1)}>for i = 0 to position:</div>
          {iValue !== null && (
            <div style={style(1)}>&nbsp;&nbsp;i = {iValue}</div>
          )}
          <div style={style(2)}>if i == position:</div>
          <div style={style(3)}>&nbsp;&nbsp;delete node</div>
          <div style={style(4)}>i++</div>
        </>
      );

    return (
      <div style={{ color: "white" }}>
        Select an operation to view pseudocode.
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-28">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Doubly Circular Linked List
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 p-4 space-y-4">
          <button
            onClick={createList}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded"
          >
            Create(A)
          </button>

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <button
            onClick={startSearch}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded"
          >
            Search
          </button>

          <hr />

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            placeholder="Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />

          <button
            onClick={insertAtPosition}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
          >
            Insert at Position
          </button>

          <button
            onClick={deleteAtPosition}
            className="w-full px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete at Position
          </button>
        </div>

        {/* VISUALISATION */}
        <div className="w-full md:w-3/5 flex flex-col items-center mt-10">
          <div className="flex items-center gap-8">
            {list.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">

                {/* NODE + ARROWS */}
                <div className="flex items-center">

                  {/* PREV ARROW */}
                  {idx > 0 && (
                    <span className="text-2xl text-gray-600 mr-3">⇄</span>
                  )}

                  {/* NODE */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center 
                      text-xl font-bold border-2
                      ${
                        idx === currentIdx
                          ? "bg-yellow-300 border-yellow-600"
                          : "bg-white border-gray-400"
                      }`}
                  >
                    {num}
                  </div>

                  {/* FINAL LOOP ARROW */}
                  {idx === list.length - 1 && (
                    <span className="text-2xl text-orange-600 ml-3">⇄ ↺</span>
                  )}
                </div>

                {/* LABELS */}
                <div className="text-xs mt-1 min-h-5 font-semibold">
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

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/5 p-4">
          <h2 className="font-bold mb-2">Pseudocode</h2>

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
