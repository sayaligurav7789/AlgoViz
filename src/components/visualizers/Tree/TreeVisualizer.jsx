// src/components/visualizers/Tree/TreeVisualizer.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * Fixed Binary Tree Layout:
 *
 *              1
 *         /         \
 *       2             3
 *    /    \        /    \
 *   4      5      6      7
 */

const TREE = {
  1: { left: 2, right: 3 },
  2: { left: 4, right: 5 },
  3: { left: 6, right: 7 },
  4: { left: null, right: null },
  5: { left: null, right: null },
  6: { left: null, right: null },
  7: { left: null, right: null }
};

// Node coordinates in % (same style as graph)
const NODE_POS = {
  1: { left: "50%", top: "10%" },
  2: { left: "25%", top: "35%" },
  3: { left: "75%", top: "35%" },
  4: { left: "15%", top: "65%" },
  5: { left: "35%", top: "65%" },
  6: { left: "65%", top: "65%" },
  7: { left: "85%", top: "65%" }
};

export default function TreeVisualizer() {
  const [visited, setVisited] = useState([]);
  const [current, setCurrent] = useState(null);
  const [mode, setMode] = useState("none");
  const [highlight, setHighlight] = useState(null);
  const [message, setMessage] = useState("Select an operation to begin.");

  const cancelRef = useRef(false);

  useEffect(() => {
    return () => (cancelRef.current = true);
  }, []);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const resetAll = (msg = "Ready.") => {
    cancelRef.current = true;
    setTimeout(() => {
      cancelRef.current = false;
      setVisited([]);
      setCurrent(null);
      setMode("none");
      setHighlight(null);
      setMessage(msg);
    }, 0);
  };

  // ---------- Traversal Core ----------
  const visitNode = async (node, line) => {
    if (!node) return;
    setHighlight(line);
    setCurrent(node);
    await delay(700);
    setVisited((prev) => [...prev, node]);
  };

  // ---------- PREORDER ----------
  const runPreorder = async () => {
    cancelRef.current = false;
    setMode("preorder");
    setMessage("Running Preorder Traversal...");
    setVisited([]);

    async function dfs(node) {
      if (!node || cancelRef.current) return;

      await visitNode(node, 1); // visit
      await delay(300);

      setHighlight(2); // left
      await dfs(TREE[node].left);

      setHighlight(3); // right
      await dfs(TREE[node].right);
    }

    await dfs(1);
    setHighlight(4);
    setMessage("Preorder Completed.");
  };

  // ---------- INORDER ----------
  const runInorder = async () => {
    cancelRef.current = false;
    setMode("inorder");
    setMessage("Running Inorder Traversal...");
    setVisited([]);

    async function dfs(node) {
      if (!node || cancelRef.current) return;

      setHighlight(1); // left
      await dfs(TREE[node].left);

      await visitNode(node, 2); // visit
      await delay(300);

      setHighlight(3); // right
      await dfs(TREE[node].right);
    }

    await dfs(1);
    setHighlight(4);
    setMessage("Inorder Completed.");
  };

  // ---------- POSTORDER ----------
  const runPostorder = async () => {
    cancelRef.current = false;
    setMode("postorder");
    setMessage("Running Postorder Traversal...");
    setVisited([]);

    async function dfs(node) {
      if (!node || cancelRef.current) return;

      setHighlight(1); // left
      await dfs(TREE[node].left);

      setHighlight(2); // right
      await dfs(TREE[node].right);

      await visitNode(node, 3); // visit
      await delay(300);
    }

    await dfs(1);
    setHighlight(4);
    setMessage("Postorder Completed.");
  };

  // ---------- Render Pseudocode ----------
  const renderCode = () => {
    const style = (n) => ({
      backgroundColor: highlight === n ? "black" : "#FEA405",
      color: "white",
      padding: "6px 8px",
      borderRadius: 6,
      marginBottom: 6,
      fontFamily: "monospace",
      fontSize: 13
    });

    if (mode === "preorder")
      return (
        <>
          <div style={style(1)}>visit(node)</div>
          <div style={style(2)}>preorder(node.left)</div>
          <div style={style(3)}>preorder(node.right)</div>
          <div style={style(4)}>done</div>
        </>
      );

    if (mode === "inorder")
      return (
        <>
          <div style={style(1)}>inorder(node.left)</div>
          <div style={style(2)}>visit(node)</div>
          <div style={style(3)}>inorder(node.right)</div>
          <div style={style(4)}>done</div>
        </>
      );

    if (mode === "postorder")
      return (
        <>
          <div style={style(1)}>post(node.left)</div>
          <div style={style(2)}>post(node.right)</div>
          <div style={style(3)}>visit(node)</div>
          <div style={style(4)}>done</div>
        </>
      );

    return <div style={{ color: "white" }}>Pick a traversal.</div>;
  };

  // ---------- Render Tree Edges ----------
  const renderEdges = () => {
    const edges = [];

    Object.keys(TREE).forEach((k) => {
      const parent = Number(k);
      const left = TREE[parent].left;
      const right = TREE[parent].right;

      if (left) {
        edges.push(
          <line
            key={`L${parent}-${left}`}
            x1={NODE_POS[parent].left}
            y1={NODE_POS[parent].top}
            x2={NODE_POS[left].left}
            y2={NODE_POS[left].top}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        );
      }

      if (right) {
        edges.push(
          <line
            key={`R${parent}-${right}`}
            x1={NODE_POS[parent].left}
            y1={NODE_POS[parent].top}
            x2={NODE_POS[right].left}
            y2={NODE_POS[right].top}
            stroke="#9CA3AF"
            strokeWidth="2"
          />
        );
      }
    });

    return edges;
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20 px-6">
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 text-center">
        Binary Tree Traversal
      </h1>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-start pt-15">

        {/* LEFT controls */}
        <div className="w-full md:w-1/5 p-3 space-y-3">
          <button onClick={() => resetAll("Ready.")} className="w-full bg-orange-500 text-white py-2 rounded">
            Reset
          </button>

          <button onClick={runPreorder} className="w-full bg-teal-600 text-white py-2 rounded">
            Preorder
          </button>

          <button onClick={runInorder} className="w-full bg-indigo-600 text-white py-2 rounded">
            Inorder
          </button>

          <button onClick={runPostorder} className="w-full bg-purple-600 text-white py-2 rounded">
            Postorder
          </button>

          <div className="mt-4 bg-amber-500 text-white p-2 rounded">{message}</div>

          <div className="mt-2 text-sm">
            <div><strong>Visited:</strong> {visited.join(", ") || "-"}</div>
            <div><strong>Current:</strong> {current ?? "-"}</div>
          </div>
        </div>

        {/* TREE VISUAL */}
        <div className="w-full md:w-3/5 flex justify-center">
          <div className="relative w-full max-w-3xl h-96 bg-white rounded shadow p-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderEdges()}
            </svg>

            {Object.keys(NODE_POS).map((n) => {
              const id = Number(n);
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

        {/* RIGHT: pseudocode */}
        <div className="w-full md:w-1/5 p-3">
          <h3 className="font-bold mb-2">Pseudocode</h3>
          <div className="p-3 rounded" style={{ background: "#FEA405" }}>
            {renderCode()}
          </div>
        </div>
      </div>
    </div>
  );
}
