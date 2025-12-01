import React, { useState, useRef, useEffect } from "react";

export default function StringVisualizer() {
  const [str, setStr] = useState("HELLO");
  const [charVal, setCharVal] = useState("");
  const [index, setIndex] = useState("");
  const [pattern, setPattern] = useState("");

  const [message, setMessage] = useState("Ready.");
  const [mode, setMode] = useState("none");
  const [highlight, setHighlight] = useState(null);

  const [currentIdx, setCurrentIdx] = useState(null);
  const [jIdx, setJIdx] = useState(null);

  // NEW → STORE FULL MATCH RANGE
  const [matchedRange, setMatchedRange] = useState({
    start: null,
    length: 0,
  });

  const cancelRef = useRef(false);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    return () => (cancelRef.current = true);
  }, []);

  const resetAll = (msg = "Ready.") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setHighlight(null);
      setCurrentIdx(null);
      setJIdx(null);
      setMatchedRange({ start: null, length: 0 }); // RESET MATCH
      setMode("none");
      setMessage(msg);
    }, 0);
  };

  // ---------------- CREATE ----------------
  const createString = () => {
    let s = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 6; i++) {
      s += letters[Math.floor(Math.random() * letters.length)];
    }
    setStr(s);
    resetAll("New String Created!");
  };

  // ---------------- SEARCH CHARACTER ----------------
  const handleSearch = async () => {
    if (!charVal) {
      setMessage("Enter a character to search.");
      return;
    }

    const target = charVal.toUpperCase();
    cancelRef.current = false;
    setMode("search");
    setMessage("Searching...");

    for (let i = 0; i < str.length; i++) {
      if (cancelRef.current) return;

      setHighlight(1);
      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      if (str[i] === target) {
        setMessage(`Found '${target}' at index ${i}`);
        return;
      }
      await delay(700);
    }

    setMessage("Character NOT found.");
  };

  // ---------------- INSERT ----------------
  const handleInsert = async () => {
    if (!charVal || index === "") {
      setMessage("Enter character + index.");
      return;
    }

    const pos = Number(index);
    const c = charVal.toUpperCase();

    if (pos < 0 || pos > str.length) {
      setMessage("Invalid index.");
      return;
    }

    cancelRef.current = false;
    setMode("insert");
    setMessage("Inserting...");

    setHighlight(1);

    for (let i = str.length - 1; i >= pos; i--) {
      if (cancelRef.current) return;
      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      await delay(700);
    }

    setHighlight(3);
    const newStr = str.slice(0, pos) + c + str.slice(pos);
    setStr(newStr);

    await delay(700);
    setMessage(`Inserted '${c}' at index ${pos}.`);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (index === "") {
      setMessage("Enter index to delete.");
      return;
    }

    const pos = Number(index);

    if (pos < 0 || pos >= str.length) {
      setMessage("Invalid index.");
      return;
    }

    cancelRef.current = false;
    setMode("delete");
    setMessage("Deleting...");

    setHighlight(1);

    for (let i = pos; i < str.length - 1; i++) {
      if (cancelRef.current) return;

      setCurrentIdx(i);
      await delay(700);

      setHighlight(2);
      await delay(700);
    }

    setHighlight(3);
    const newStr = str.slice(0, pos) + str.slice(pos + 1);
    setStr(newStr);

    await delay(700);
    setMessage(`Deleted index ${pos}.`);
  };

  // ---------------- PATTERN MATCHING ----------------
  const handlePatternMatch = async () => {
    if (!pattern) {
      setMessage("Enter pattern to search.");
      return;
    }

    const pat = pattern.toUpperCase();

    cancelRef.current = false;
    setMode("pattern");
    setMatchedRange({ start: null, length: 0 }); // RESET
    setMessage("Pattern matching...");

    for (let i = 0; i <= str.length - pat.length; i++) {
      if (cancelRef.current) return;

      setHighlight(1);
      setCurrentIdx(i);
      await delay(700);

      let j = 0;
      for (j = 0; j < pat.length; j++) {
        if (cancelRef.current) return;

        setHighlight(2);
        setJIdx(j);
        await delay(700);

        if (str[i + j] !== pat[j]) break;
      }

      if (j === pat.length) {
        // MARK FULL RANGE MATCHED
        setMatchedRange({ start: i, length: pat.length });

        setMessage(`Pattern '${pat}' found at index ${i}`);
        return;
      }
    }

    setMessage("Pattern NOT found.");
  };

  // ---------------- PSEUDOCODE ----------------
  const renderCode = () => {
    const s = (n) => ({
      backgroundColor: highlight === n ? "black" : "#FEA405",
      color: "white",
      padding: "5px 7px",
      borderRadius: 6,
      marginBottom: 5,
      fontFamily: "monospace",
    });

    if (mode === "pattern")
      return (
        <>
          <div style={s(1)}>for i = 0 to n-m:</div>
          <div style={s(2)}>&nbsp;&nbsp;for j = 0 to m-1:</div>
          <div style={s(3)}>&nbsp;&nbsp;if str[i+j] != pat[j] → break</div>
          <div style={s(4)}>if j == m → MATCH FOUND</div>
        </>
      );

    if (mode === "search")
      return (
        <>
          <div style={s(1)}>for i = 0 to n-1:</div>
          <div style={s(2)}>&nbsp;&nbsp;if str[i] == char → FOUND</div>
        </>
      );

    if (mode === "insert")
      return (
        <>
          <div style={s(1)}>for i = n-1 down to index:</div>
          <div style={s(2)}>&nbsp;&nbsp;str[i+1] = str[i]</div>
          <div style={s(3)}>str[index] = char</div>
        </>
      );

    if (mode === "delete")
      return (
        <>
          <div style={s(1)}>for i = index to n-2:</div>
          <div style={s(2)}>&nbsp;&nbsp;str[i] = str[i+1]</div>
          <div style={s(3)}>remove last</div>
        </>
      );

    return <div style={{ color: "white" }}>Choose operation.</div>;
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 px-6">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        String
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start pt-15">

        {/* LEFT PANEL */}
        <div className="w-full md:w-1/5 space-y-3 p-3">
          <button onClick={createString} className="w-full bg-orange-500 text-white py-2 rounded">
            Create
          </button>

          <input
            value={charVal}
            onChange={(e) => setCharVal(e.target.value)}
            maxLength={1}
            placeholder="Character"
            className="w-full border rounded px-3 py-2 uppercase"
          />

          <input
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            type="number"
            placeholder="Index"
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

          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Pattern"
            className="w-full border rounded px-3 py-2 uppercase"
          />

          <button onClick={handlePatternMatch} className="w-full bg-purple-600 text-white py-2 rounded">
            Pattern Match
          </button>

          <button onClick={() => resetAll("Ready.")} className="w-full bg-gray-700 text-white py-2 rounded">
            Reset
          </button>
        </div>

        {/* CENTER — STRING BOXES */}
        <div className="w-full md:w-3/5 flex justify-center">
          <div className="flex gap-4 p-4 bg-white rounded shadow">
            {str.split("").map((ch, i) => {
              const isMatched =
                matchedRange.start !== null &&
                i >= matchedRange.start &&
                i < matchedRange.start + matchedRange.length;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 flex items-center justify-center border-2 text-xl font-bold rounded-lg 
                    ${
                      isMatched
                        ? "bg-green-300 border-green-600"
                        : i === currentIdx
                        ? "bg-yellow-300 border-yellow-600"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    {ch}
                  </div>
                  <div className="text-xs">{i}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/5 p-3">

          <div className="bg-amber-500 text-white p-2 rounded mb-3">{message}</div>

          <div className="text-sm mb-4">
            <strong>i index:</strong> {currentIdx ?? "-"} <br />
            <strong>j index:</strong> {jIdx ?? "-"}
          </div>

          <h3 className="font-bold mb-2">Pseudocode</h3>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderCode()}
          </div>
        </div>

      </div>
    </div>
  );
}
