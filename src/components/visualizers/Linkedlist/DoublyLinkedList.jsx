import React, { useState, useRef, useEffect } from "react";

export default function DoublyLinkedList() {
  const [list, setList] = useState([22, 55, 77, 34, 90]);

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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const resetState = (msg) => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setCurrentIdx(null);
      setHighlightLine(null);
      setMessage(msg);
      setIsBusy(false);
      setMode("none"); 
    }, 0);
  };

  const createList = () => {
    if (isBusy) return;
    const newList = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setList(newList);
    resetState("New Doubly Linked List created!");
  };

  // ---------------- SEARCH ----------------
  const startSearch = async () => {
    if (isBusy) return;
    if (!searchValue) return setMessage("Enter value to search.");

    cancelRef.current = false;
    setMode("search");
    setIsBusy(true);
    setMessage("Searching...");
    setCurrentIdx(null);
    setHighlightLine(null);

    for (let i = 0; i < list.length; i++) {
      if (cancelRef.current) return;

      // highlight the for-loop line
      setHighlightLine(1);
      await delay(700);

      // set current pointer / i value
      setCurrentIdx(i);

      // highlight the if line (we show it after the loop-line)
      setHighlightLine(2);
      await delay(700);

      if (list[i] === Number(searchValue)) {
        setHighlightLine(3);
        setMessage(`Found at node ${i}!`);
        await delay(1000);
        resetState(`Found at node ${i}!`);
        return;
      }

      // highlight i++ line
      setHighlightLine(4);
      await delay(700);
    }

    await delay(700);
    resetState("Value NOT found.");
  };

  // ---------------- INSERT ----------------
  const insertAtPosition = async () => {
    if (isBusy) return;
    if (!value || !position) return setMessage("Provide value & position.");

    const pos = Number(position);
    const val = Number(value);
    if (pos < 0 || pos > list.length) return setMessage("Invalid position.");

    cancelRef.current = false;
    setMode("insert");
    setIsBusy(true);
    setMessage(`Inserting ${val} at position ${pos}...`);
    setCurrentIdx(null);
    setHighlightLine(null);

    // line 1: newNode.value = value
    setHighlightLine(1);
    await delay(700);

    if (pos === 0) {
      setHighlightLine(2);
      await delay(700);

      setList([val, ...list]);

      setHighlightLine(3);
      await delay(1000);

      resetState(`Inserted ${val} at position ${pos}.`);
      return;
    }

    // else: traverse to pos-1
    let i = 0;
    setCurrentIdx(0);
    setHighlightLine(4); // temp = head
    await delay(700);

    while (i < pos - 1) {
      if (cancelRef.current) return;

      // highlight for loop line
      setHighlightLine(5);
      await delay(700);

      // temp = temp.next (we visually move currentIdx)
      setHighlightLine(6);
      setCurrentIdx(i + 1);
      await delay(700);

      i++;
    }

    // insertion actions
    setHighlightLine(7);
    await delay(700);

    setList((prev) => {
      const copy = [...prev];
      copy.splice(pos, 0, val);
      return copy;
    });

    setHighlightLine(8);
    await delay(1000);

    resetState(`Inserted ${val} at position ${pos}.`);
  };

  // ---------------- DELETE ----------------
  const deleteAtPosition = async () => {
    if (isBusy) return;
    if (!position) return setMessage("Provide position to delete.");

    const pos = Number(position);
    if (pos < 0 || pos >= list.length) return setMessage("Invalid position.");

    cancelRef.current = false;
    setMode("delete");
    setIsBusy(true);
    setMessage(`Deleting at position ${pos}...`);
    setCurrentIdx(null);
    setHighlightLine(null);

    // check head
    setHighlightLine(1);
    await delay(700);

    if (pos === 0) {
      setHighlightLine(2);
      await delay(700);

      setList((prev) => prev.slice(1));
      await delay(1000);
      resetState(`Deleted node at position ${pos}.`);
      return;
    }

    // traverse to pos-1
    let i = 0;
    setCurrentIdx(0);
    setHighlightLine(3);
    await delay(700);

    while (i < pos - 1) {
      if (cancelRef.current) return;

      setHighlightLine(4); // for i = ...
      await delay(700);

      setHighlightLine(5); // temp = temp.next
      setCurrentIdx(i + 1);
      await delay(700);

      i++;
    }

    setHighlightLine(6);
    await delay(700);

    setList((prev) => {
      const copy = [...prev];
      copy.splice(pos, 1);
      return copy;
    });

    await delay(1000);
    resetState(`Deleted node at position ${pos}.`);
  };

  // ---------------- PSEUDOCODE ----------------
  // We add an extra indented line AFTER the loop line that shows `i = <currentIdx>`
  // and this indented line is highlighted when the loop line is active.
  const renderPseudocode = () => {
    const style = (lineActive) => ({
      backgroundColor: lineActive ? "black" : "#FEA405",
      color: "white",
      padding: "4px 6px",
      borderRadius: 4,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
    });

    const indentStyle = (lineActive) => ({
      backgroundColor: lineActive ? "black" : "#FEA405",
      color: "white",
      padding: "4px 10px",
      borderRadius: 4,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
      marginLeft: 8,
    });

    // SEARCH pseudocode
    if (mode === "search") {
      const loopActive = highlightLine === 1;
      return (
        <>
          <div style={style(loopActive)}>for i = 0 to n-1:</div>
          {/* indented i value line (highlighted when loopActive) */}
          <div style={indentStyle(loopActive)}>{`i = ${currentIdx !== null ? currentIdx : 0}`}</div>
          <div style={style(highlightLine === 2)}>&nbsp;&nbsp;if list[i] == value:</div>
          <div style={style(highlightLine === 3)}>&nbsp;&nbsp;&nbsp;&nbsp;return i</div>
          <div style={style(highlightLine === 4)}>&nbsp;&nbsp;i++</div>
        </>
      );
    }

    // INSERT pseudocode
    if (mode === "insert") {
      const loopActive = highlightLine === 5; // we used 5 for "for i = 0 to position-1" in insert
      return (
        <>
          <div style={style(highlightLine === 1)}>newNode.value = value</div>
          <div style={style(highlightLine === 2)}>if position == 0:</div>
          <div style={style(highlightLine === 3)}>&nbsp;&nbsp;head = newNode</div>
          <div style={style(highlightLine === 4)}>temp = head</div>
          <div style={style(loopActive)}>for i = 0 to position-1:</div>
          {/* indented i value line for insert loop */}
          <div style={indentStyle(loopActive)}>{`i = ${currentIdx !== null ? currentIdx : 0}`}</div>
          <div style={style(highlightLine === 6)}>&nbsp;&nbsp;temp = temp.next</div>
          <div style={style(highlightLine === 7)}>newNode.next = temp.next</div>
          <div style={style(highlightLine === 8)}>temp.next = newNode</div>
        </>
      );
    }

    // DELETE pseudocode
    if (mode === "delete") {
      const loopActive = highlightLine === 4; // we used 4 for "for i = 0 to position-1" in delete
      return (
        <>
          <div style={style(highlightLine === 1)}>if position == 0:</div>
          <div style={style(highlightLine === 2)}>&nbsp;&nbsp;head = head.next</div>
          <div style={style(highlightLine === 3)}>temp = head</div>
          <div style={style(loopActive)}>for i = 0 to position-1:</div>
          {/* indented i value line for delete loop */}
          <div style={indentStyle(loopActive)}>{`i = ${currentIdx !== null ? currentIdx : 0}`}</div>
          <div style={style(highlightLine === 5)}>&nbsp;&nbsp;temp = temp.next</div>
          <div style={style(highlightLine === 6)}>temp.next = temp.next.next</div>
        </>
      );
    }

    return <div className="text-white">Select an operation.</div>;
  };

  // ---------------- NODE + ARROWS (updated!) ----------------
  const renderNode = (num, idx) => {
    return (
      <div key={idx} className="flex flex-col items-center">
        <div className="flex items-center">
          {/* NODE */}
          <div
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold
              ${
                idx === currentIdx
                  ? "bg-yellow-300 border-yellow-600"
                  : "bg-white border-gray-400"
              }`}
          >
            {num}
          </div>

          {/* BETWEEN NODES — stacked arrows centered between nodes */}
          {idx < list.length - 1 && (
            <div className="flex flex-col items-center mx-2 select-none">
              <span className="text-2xl leading-none">→</span>
              <span className="text-2xl leading-none mt-1">←</span>
            </div>
          )}
        </div>

        <div className="text-xs mt-1 h-4 font-semibold">
          {idx === 0 && <span className="text-orange-600">head</span>}
          {idx === list.length - 1 && <span className="text-red-600">tail</span>}
          {idx === currentIdx && <span className="text-blue-600">temp/{idx}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Doubly Linked List
      </h1>

      <div className="flex flex-col md:flex-row items-start justify-center gap-6 px-4">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 space-y-4 p-2">

          <button
            onClick={createList}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded font-semibold"
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
            className="w-full px-4 py-2 bg-gray-800 text-white rounded font-semibold"
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
            className="w-full px-4 py-2 bg-blue-600 text-white rounded font-semibold"
          >
            Insert at Position
          </button>

          <button
            onClick={deleteAtPosition}
            className="w-full px-4 py-2 bg-red-600 text-white rounded font-semibold"
          >
            Delete at Position
          </button>
        </div>

        {/* VISUALIZATION */}
        <div className="w-full md:w-3/5 flex flex-col items-center mt-6">
          <div className="flex items-center flex-wrap gap-4 justify-center">
            {list.map((num, idx) => renderNode(num, idx))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/5 p-4">
          <h2 className="font-bold mb-2">Pseudocode</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-3 rounded">
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
