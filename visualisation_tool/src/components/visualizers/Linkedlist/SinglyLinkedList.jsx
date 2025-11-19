import React, { useState, useRef } from "react";

export default function SinglyLinkedList() {
  const [list, setList] = useState([22, 2, 77, 6, 43, 76, 89]);

  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");
  const [position, setPosition] = useState("");

  const [currentIdx, setCurrentIdx] = useState(null);
  const [message, setMessage] = useState("Ready.");
  const [highlightLine, setHighlightLine] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const intervalRef = useRef(null);

  const resetState = (msg = "") => {
    setCurrentIdx(null);
    setHighlightLine(null);
    setIsBusy(false);
    setMessage(msg);
  };

  // CREATE -------------------------------------------------
  const createList = () => {
    clearInterval(intervalRef.current);
    let newList = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setList(newList);
    resetState("New Linked List created!");
  };

  // SEARCH -------------------------------------------------
  const startSearch = () => {
    if (isBusy || searchValue === "") return;

    setIsBusy(true);
    setMessage("Searching...");

    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= list.length) {
        resetState("Value NOT found.");
        clearInterval(intervalRef.current);
        return;
      }

      setCurrentIdx(i);

      if (list[i] === Number(searchValue)) {
        clearInterval(intervalRef.current);
        resetState(`Found at node ${i}!`);
        return;
      }

      i++;
    }, 700);
  };

  // INSERT AT POSITION ------------------------------------
  const insertAtPosition = () => {
    if (isBusy || value === "" || position === "") return;

    let pos = Number(position);
    let val = Number(value);

    if (pos < 0 || pos > list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMessage(`Traversing to insert at position ${pos}...`);

    let i = 0;
    intervalRef.current = setInterval(() => {
      setCurrentIdx(i);

      if (i === pos) {
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 0, val);

        setList(newList);
        resetState(`Inserted ${val} at position ${pos}.`);
        return;
      }

      i++;
    }, 700);
  };

  // DELETE AT POSITION ------------------------------------
  const deleteAtPosition = () => {
    if (isBusy || position === "") return;

    let pos = Number(position);

    if (pos < 0 || pos >= list.length) {
      setMessage("Invalid position.");
      return;
    }

    setIsBusy(true);
    setMessage(`Traversing to delete at position ${pos}...`);

    let i = 0;
    intervalRef.current = setInterval(() => {
      setCurrentIdx(i);

      if (i === pos) {
        clearInterval(intervalRef.current);

        let newList = [...list];
        newList.splice(pos, 1);

        setList(newList);
        resetState(`Deleted node at position ${pos}.`);
        return;
      }

      i++;
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-24">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Singly Linked List Visualization
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
        <div className="w-full md:w-3/5 flex flex-col items-center mt-10">
          <div className="flex space-x-6">

            {list.map((num, idx) => (
              <div key={idx} className="flex flex-col items-center">

                <div className="flex items-center">

                  <div
                  //node size
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

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/5 p-4">
          <h2 className="font-bold text-lg mb-2">Status</h2>

          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded">
            {message}
          </div>
        </div>

      </div>
    </div>
  );
}
