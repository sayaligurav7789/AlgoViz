import React, { useState, useRef, useEffect } from "react";

export default function SinglyLinkedList() {
  const [list, setList] = useState([22, 2, 77, 6, 43, 76, 89]);

  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");

  const [currentIdx, setCurrentIdx] = useState(null);
  const [message, setMessage] = useState("Select an operation to begin.");
  const [highlightLine, setHighlightLine] = useState(null);
  const [mode, setMode] = useState("none");
  const [isBusy, setIsBusy] = useState(false);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const delay = (ms) =>
    new Promise((resolve) => {
      const t = setTimeout(() => {
        clearTimeout(t);
        resolve();
      }, ms);
    });

  const resetState = (msg = "") => {
    cancelRef.current = true;

    setTimeout(() => {
      cancelRef.current = false;
      setCurrentIdx(null);
      setHighlightLine(null);
      setIsBusy(false);
      setMessage(msg);
      setMode("none");
    }, 0);
  };

  const createList = () => {
    if (isBusy) return;
    const newList = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setList(newList);
    resetState("New Linked List created!");
  };

  // ============================================================
  // ======================== SEARCH =============================
  // ============================================================
  const startSearch = async () => {
    if (isBusy) return;
    if (searchValue === "") {
      setMessage("Enter a value to search.");
      return;
    }

    cancelRef.current = false;
    setMode("search");
    setIsBusy(true);
    setMessage("Searching...");
    setCurrentIdx(null);
    setHighlightLine(null);

    for (let i = 0; i < list.length; i++) {
      if (cancelRef.current) return;

      setHighlightLine(1);
      await delay(700);

      if (cancelRef.current) return;

      setCurrentIdx(i);

      setHighlightLine(2);
      await delay(700);

      if (list[i] === Number(searchValue)) {
        setHighlightLine(3);
        setMessage(`Found at node ${i}!`);
        await delay(1000);
        resetState(`Found at node ${i}!`);
        return;
      }

      setHighlightLine(4);
      await delay(700);
    }

    setMessage("Value NOT found.");
    await delay(1000);
    resetState("Value NOT found.");
  };

  // ============================================================
  // ======================== INSERT =============================
  // ============================================================
  const insertAtPosition = async () => {
    if (isBusy) return;
    if (value === "" || position === "") {
      setMessage("Provide both value and position to insert.");
      return;
    }

    const pos = Number(position);
    const val = Number(value);

    if (!Number.isInteger(pos) || pos < 0 || pos > list.length) {
      setMessage("Invalid position.");
      return;
    }

    cancelRef.current = false;
    setMode("insert");
    setIsBusy(true);
    setMessage(`Traversing to insert at position ${pos}...`);
    setHighlightLine(null);
    setCurrentIdx(null);

    setHighlightLine(1);
    await delay(700);

    setHighlightLine(2);
    await delay(700);

    if (pos === 0) {
      setHighlightLine(3);
      await delay(700);

      setHighlightLine(4);
      setList((prev) => [val, ...prev]);
      await delay(1000);

      resetState(`Inserted ${val} at position ${pos}.`);
      return;
    }

    setHighlightLine(5);
    await delay(700);

    setHighlightLine(6);
    setCurrentIdx(0);
    await delay(700);

    for (let i = 0; i < pos; i++) {
      setHighlightLine(7);
      await delay(700);

      setHighlightLine(8);
      setCurrentIdx((prev) => prev + 1);
      await delay(700);

      if (i + 1 === pos) break;
    }

    setHighlightLine(9);
    await delay(700);

    setList((prev) => {
      const copy = [...prev];
      copy.splice(pos, 0, val);
      return copy;
    });

    setHighlightLine(10);
    await delay(1000);

    resetState(`Inserted ${val} at position ${pos}.`);
  };

  // ============================================================
  // ======================== DELETE =============================
  // ============================================================
  const deleteAtPosition = async () => {
    if (isBusy) return;
    if (position === "") {
      setMessage("Provide position to delete.");
      return;
    }

    const pos = Number(position);

    if (!Number.isInteger(pos) || pos < 0 || pos >= list.length) {
      setMessage("Invalid position.");
      return;
    }

    cancelRef.current = false;
    setMode("delete");
    setIsBusy(true);
    setMessage(`Traversing to delete at position ${pos}...`);
    setHighlightLine(null);
    setCurrentIdx(null);

    setHighlightLine(1);
    await delay(700);

    if (pos === 0) {
      setHighlightLine(2);
      setList((prev) => {
        const copy = [...prev];
        copy.shift();
        return copy;
      });
      await delay(1000);
      resetState(`Deleted node at position ${pos}.`);
      return;
    }

    setHighlightLine(3);
    await delay(700);

    setHighlightLine(4);
    setCurrentIdx(0);
    await delay(700);

    for (let i = 0; i < pos - 1; i++) {
      setHighlightLine(5);
      await delay(700);

      setHighlightLine(6);
      setCurrentIdx((prev) => prev + 1);
      await delay(700);
    }

    setHighlightLine(7);
    await delay(700);

    setList((prev) => {
      const copy = [...prev];
      copy.splice(pos, 1);
      return copy;
    });

    await delay(1000);
    resetState(`Deleted node at position ${pos}.`);
  };

  // ============================================================
  // =============== PSEUDOCODE RENDER WITH i ===================
  // ============================================================
  const renderPseudocode = () => {
    const style = (line) => ({
      backgroundColor: highlightLine === line ? "black" : "#FEA405",
      color: "white",
      padding: "3px 6px",
      borderRadius: 4,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
    });

    const dryRun = currentIdx !== null ? (
      <div style={style("i")}>&nbsp;&nbsp;i = {currentIdx}</div>
    ) : (
      <div style={style("i")}>&nbsp;&nbsp;i = _</div>
    );

    if (mode === "none") {
      return <div className="text-white">Select an operation to view pseudocode.</div>;
    }

    if (mode === "search") {
      return (
        <>
          <div style={style(1)}>for i = 0 to n-1:</div>
          {dryRun}
          <div style={style(2)}>&nbsp;&nbsp;if list[i] == value:</div>
          <div style={style(3)}>&nbsp;&nbsp;&nbsp;&nbsp;return i</div>
          <div style={style(4)}>&nbsp;&nbsp;i++</div>
        </>
      );
    }

    if (mode === "insert") {
      return (
        <>
          <div style={style(1)}>newNode.value = value</div>
          <div style={style(2)}>if position == 0:</div>
          <div style={style(3)}>&nbsp;&nbsp;newNode.next = head</div>
          <div style={style(4)}>&nbsp;&nbsp;head = newNode</div>
          <div style={style(5)}>else:</div>
          <div style={style(6)}>&nbsp;&nbsp;temp = head</div>
          {dryRun}
          <div style={style(7)}>&nbsp;&nbsp;for i = 0 to position-1:</div>
          <div style={style(8)}>&nbsp;&nbsp;&nbsp;&nbsp;temp = temp.next</div>
          <div style={style(9)}>newNode.next = temp.next</div>
          <div style={style(10)}>temp.next = newNode</div>
        </>
      );
    }

    if (mode === "delete") {
      return (
        <>
          <div style={style(1)}>if position == 0:</div>
          <div style={style(2)}>&nbsp;&nbsp;head = head.next</div>
          <div style={style(3)}>else:</div>
          <div style={style(4)}>&nbsp;&nbsp;temp = head</div>
          {dryRun}
          <div style={style(5)}>&nbsp;&nbsp;for i = 0 to position-1:</div>
          <div style={style(6)}>&nbsp;&nbsp;&nbsp;&nbsp;temp = temp.next</div>
          <div style={style(7)}>temp.next = temp.next.next</div>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Singly Linked List Visualization
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-4 px-4">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 p-4 space-y-4">
          <button
            onClick={createList}
            className="px-5 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 w-full"
          >
            Create(A)
          </button>

          {/* SEARCH */}
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

          {/* INSERT / DELETE */}
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
        <div className="w-full md:w-3/5 flex flex-col items-center mt-6">
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {list.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center
                      text-lg font-bold border-2
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
                    <span className="text-xl m-0 p-0 leading-none ml-1 mr-1">→</span>
                  )}
                </div>

                <div className="text-xs mt-1 min-h-4 font-semibold">
                  {idx === 0 && <span className="text-orange-600">head/{idx}</span>}
                  {idx === list.length - 1 && <span className="text-red-600">tail/{idx}</span>}
                  {idx === currentIdx && <span className="text-blue-600">temp/{idx}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PSEUDOCODE PANEL */}
        <div className="w-full md:w-1/5 p-4">
          <h2 className="font-bold text-lg mb-2">Pseudocode</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-3 rounded">
            {message}
          </div>

          <div className="font-mono text-sm rounded w-full p-3" style={{ backgroundColor: "#FEA405" }}>
            {renderPseudocode()}
          </div>
        </div>
      </div>
    </div>
  );
}
