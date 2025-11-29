import React, { useEffect, useRef, useState } from "react";

const ADJ = {
  0: [1, 2, 3],
  1: [0, 2, 4],
  2: [0, 1, 5],
  3: [0, 5, 6],
  4: [1, 5],
  5: [2, 3, 4, 6],
  6: [3, 5],
};

// node layout
const NODE_POS = {
  0: { left: "50%", top: "8%" },
  1: { left: "22%", top: "28%" },
  2: { left: "50%", top: "28%" },
  3: { left: "78%", top: "28%" },
  4: { left: "10%", top: "62%" },
  5: { left: "50%", top: "62%" },
  6: { left: "90%", top: "62%" },
};

export default function GeneralGraphVisualizer() {
  const [visited, setVisited] = useState([]);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("none");
  const [message, setMessage] = useState("Select an operation to begin.");
  const [highlightLine, setHighlightLine] = useState(null);
  const [target, setTarget] = useState("");
  const [auxStructure, setAuxStructure] = useState([]);

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const resetAll = (msg = "Ready.") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setVisited([]);
      setCurrent(null);
      setMode("none");
      setHighlightLine(null);
      setTarget("");
      setAuxStructure([]);
      setMessage(msg);
    }, 0);
  };

  // ---------------- BFS ----------------
  const runBFS = async (stopOnFind = false) => {
    cancelRef.current = false;
    setMode(stopOnFind ? "search-bfs" : "bfs");
    setVisited([]);
    setCurrent(null);
    setAuxStructure([]);
    setMessage(stopOnFind ? "Searching with BFS..." : "Running BFS...");

    const queue = [];
    const seen = new Set();

    queue.push(0);
    seen.add(0);
    setAuxStructure([...queue]);
    setHighlightLine(1);
    await delay(700);

    while (queue.length > 0 && !cancelRef.current) {
      setHighlightLine(2);
      const node = queue.shift();
      setAuxStructure([...queue]);
      setCurrent(node);
      await delay(700);

      setVisited((p) => [...p, node]);
      setHighlightLine(3);

      if (stopOnFind && String(node) === target) {
        setMessage(`Found node ${node} via BFS!`);
        setHighlightLine(3);
        return; //stop but DO NOT auto-reset
      }

      await delay(700);

      setHighlightLine(4);
      for (const nei of ADJ[node] || []) {
        if (!seen.has(nei)) {
          seen.add(nei);
          queue.push(nei);
          setAuxStructure([...queue]);
          setHighlightLine(5);
          await delay(700);
        }
      }
    }

    setHighlightLine(6);
    setMessage("BFS Completed.");
    // removed auto-reset
  };

  // ---------------- DFS ----------------
  const runDFS = async (stopOnFind = false) => {
    cancelRef.current = false;
    setMode(stopOnFind ? "search-dfs" : "dfs");
    setVisited([]);
    setCurrent(null);
    setAuxStructure([]);
    setMessage(stopOnFind ? "Searching with DFS..." : "Running DFS...");

    const stack = [];
    const seen = new Set();

    stack.push(0);
    setAuxStructure([...stack]);
    setHighlightLine(1);
    await delay(700);

    while (stack.length > 0 && !cancelRef.current) {
      setHighlightLine(2);
      const node = stack.pop();
      setAuxStructure([...stack]);
      setCurrent(node);
      await delay(700);

      if (seen.has(node)) {
        setHighlightLine(7);
        await delay(400);
        continue;
      }

      seen.add(node);
      setVisited((p) => [...p, node]);
      setHighlightLine(3);

      if (stopOnFind && String(node) === target) {
        setMessage(`Found node ${node} via DFS!`);
        return; //stop but DO NOT auto-reset
      }

      await delay(700);

      setHighlightLine(4);
      const neighbors = [...(ADJ[node] || [])].reverse();
      for (const nei of neighbors) {
        if (!seen.has(nei)) {
          stack.push(nei);
          setAuxStructure([...stack]);
          setHighlightLine(5);
          await delay(700);
        }
      }
    }

    setHighlightLine(6);
    setMessage("DFS Completed.");
    // removed auto-reset
  };

  const handleSearchBFS = () => {
    if (target === "") {
      setMessage("Enter target node id (0..6).");
      return;
    }
    runBFS(true);
  };

  const handleSearchDFS = () => {
    if (target === "") {
      setMessage("Enter target node id (0..6).");
      return;
    }
    runDFS(true);
  };

  const renderPseudocode = () => {
    const s = (n) => ({
      backgroundColor: highlightLine === n ? "black" : "#FEA405",
      color: "white",
      padding: "6px 8px",
      borderRadius: 6,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13,
    });

    if (mode === "bfs" || mode === "search-bfs")
      return (
        <>
          <div style={s(1)}>enqueue(start)</div>
          <div style={s(2)}>while queue not empty:</div>
          <div style={s(3)}>&nbsp;&nbsp;node = dequeue()</div>
          <div style={s(4)}>&nbsp;&nbsp;visit(node)</div>
          <div style={s(5)}>&nbsp;&nbsp;for neighbor in adj[node]: enqueue(n)</div>
          <div style={s(6)}>done</div>
        </>
      );

    if (mode === "dfs" || mode === "search-dfs")
      return (
        <>
          <div style={s(1)}>push(start)</div>
          <div style={s(2)}>while stack not empty:</div>
          <div style={s(3)}>&nbsp;&nbsp;node = pop()</div>
          <div style={s(4)}>&nbsp;&nbsp;if not seen: visit(node)</div>
          <div style={s(5)}>&nbsp;&nbsp;push neighbors reversed</div>
          <div style={s(6)}>done</div>
          <div style={s(7)}>if seen: continue</div>
        </>
      );

    return <div style={{ color: "white" }}>Pick BFS or DFS.</div>;
  };

  const renderEdges = () => {
    const drawn = new Set();
    const lines = [];
    Object.keys(ADJ).forEach((fromStr) => {
      const from = Number(fromStr);
      ADJ[from].forEach((to) => {
        const key = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (drawn.has(key)) return;
        drawn.add(key);
        const p1 = NODE_POS[from];
        const p2 = NODE_POS[to];
        lines.push(
          <line
            key={key}
            x1={p1.left}
            y1={p1.top}
            x2={p2.left}
            y2={p2.top}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        );
      });
    });
    return lines;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 px-6">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        General Graph Visualizer — BFS & DFS
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start pt-15">
        {/* LEFT controls */}
        <div className="w-full md:w-1/5 p-3 space-y-3">
          <button onClick={() => resetAll("Ready.")} className="w-full bg-orange-500 text-white py-2 rounded">
            Reset
          </button>

          <button onClick={() => runBFS(false)} className="w-full bg-teal-600 text-white py-2 rounded">
            Run BFS
          </button>

          <button onClick={() => runDFS(false)} className="w-full bg-indigo-600 text-white py-2 rounded">
            Run DFS
          </button>

          <hr />

          <input
            type="text"
            value={target}
            placeholder="Target node (0..6)"
            onChange={(e) => setTarget(e.target.value.replace(/[^0-6]/g, ""))}
            className="w-full border rounded px-3 py-2"
          />

          <button onClick={handleSearchBFS} className="w-full bg-teal-500 text-white py-2 rounded">
            Search BFS
          </button>

          <button onClick={handleSearchDFS} className="w-full bg-indigo-500 text-white py-2 rounded">
            Search DFS
          </button>

          <div className="mt-4 bg-amber-500 text-white p-2 rounded">{message}</div>

          <div className="mt-2 text-sm">
            <div><strong>Visited:</strong> {visited.join(", ") || "-"}</div>
            <div><strong>Current:</strong> {current ?? "-"}</div>
            <div><strong>Aux:</strong> [{auxStructure.join(", ")}]</div>
          </div>
        </div>

        {/* GRAPH */}
        <div className="w-full md:w-3/5 flex justify-center">
          <div className="relative w-full max-w-3xl h-96 bg-white rounded shadow p-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderEdges()}
            </svg>

            {Object.keys(NODE_POS).map((k) => {
              const id = Number(k);
              const pos = NODE_POS[id];
              const isVisited = visited.includes(id);
              const isCurrent = current === id;
              return (
                <div
                  key={id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pos.left, top: pos.top }}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 ${
                      isCurrent
                        ? "bg-yellow-300 border-yellow-600"
                        : isVisited
                        ? "bg-green-200 border-green-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT pseudocode */}
        <div className="w-full md:w-1/5 p-3">
          <h3 className="font-bold mb-2">Pseudocode</h3>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderPseudocode()}
          </div>
        </div>
      </div>
    </div>
  );
}
