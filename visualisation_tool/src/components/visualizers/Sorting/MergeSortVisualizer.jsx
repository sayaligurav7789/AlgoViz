import React, { useEffect, useRef, useState } from "react";

export default function MergeSortVisualizer() {
  // Top "current array" (bars) snapshot for each frame
  const [array, setArray] = useState([50, 30, 70, 10, 90, 40]);

  // Tree nodes snapshot for each frame (every frame keeps all upper nodes visible)
  const [nodes, setNodes] = useState([]);

  // Animation frames + control
  const [frames, setFrames] = useState([]);
  const [step, setStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const intervalRef = useRef(null);

  // UI state (same theme as your selection sort)
  const [message, setMessage] = useState("Click Sort to start Merge Sort...");
  const [highlightLine, setHighlightLine] = useState(null);

  // -------------------------------
  // Build frames (depth-first) and keep all nodes
  // -------------------------------
  const buildFrames = (initialArr) => {
    let idCounter = 0;
    let allNodes = []; // master list of nodes (grows as we split)
    let resultFrames = [];
    let global = [...initialArr];

    const createNode = (l, r, depth) => {
      const node = {
        id: idCounter++,
        l,
        r,
        depth,
        values: initialArr.slice(l, r + 1),
        status: "pending", // 'pending' | 'active' | 'leaf' | 'merging' | 'merged'
      };
      allNodes.push(node);
      return node;
    };

    const findNode = (l, r) => allNodes.find((n) => n.l === l && n.r === r);

    const cloneNodes = () =>
      allNodes.map((n) => ({
        ...n,
        values: [...n.values],
      }));

    const pushFrame = (msg, line, activeId = null) => {
      resultFrames.push({
        globalArray: [...global],
        nodes: cloneNodes(),
        activeId,
        line,
        msg,
      });
    };

    const mergeWithSnapshots = (node, leftNode, rightNode) => {
      // Merge using already-sorted children arrays (values)
      const L = [...leftNode.values];
      const R = [...rightNode.values];
      let i = 0,
        j = 0;
      const merged = [];

      while (i < L.length && j < R.length) {
        if (L[i] <= R[j]) merged.push(L[i++]);
        else merged.push(R[j++]);

        node.values = [
          ...merged,
          ...L.slice(i),
          ...R.slice(j),
        ];
        node.status = "merging";

        // Update the global array slice [l..r] to reflect partial merge
        for (let t = 0; t < node.values.length; t++) {
          global[node.l + t] = node.values[t];
        }
        pushFrame(
          `Merging [${node.l}-${node.r}]: ${merged.join(", ")}`,
          6, // merge line in pseudo
          node.id
        );
      }
      while (i < L.length) {
        merged.push(L[i++]);
        node.values = [
          ...merged,
          ...L.slice(i),
          ...R.slice(j),
        ];
        for (let t = 0; t < node.values.length; t++) {
          global[node.l + t] = node.values[t];
        }
        node.status = "merging";
        pushFrame(`Appending left into [${node.l}-${node.r}]`, 6, node.id);
      }
      while (j < R.length) {
        merged.push(R[j++]);
        node.values = [
          ...merged,
          ...L.slice(i),
          ...R.slice(j),
        ];
        for (let t = 0; t < node.values.length; t++) {
          global[node.l + t] = node.values[t];
        }
        node.status = "merging";
        pushFrame(`Appending right into [${node.l}-${node.r}]`, 6, node.id);
      }

      node.values = merged;
      node.status = "merged";
      for (let t = 0; t < merged.length; t++) {
        global[node.l + t] = merged[t];
      }
      pushFrame(`Merged [${node.l}-${node.r}] ✅`, 6, node.id);
    };

    const dfs = (l, r, depth) => {
      const node = findNode(l, r) || createNode(l, r, depth);
      node.status = "active";
      pushFrame(`Focus on [${l}-${r}]`, 2, node.id);

      if (l === r) {
        node.status = "leaf";
        pushFrame(`Base case at [${l}]`, 1, node.id);
        return;
      }

      const m = Math.floor((l + r) / 2);

      // Create children (keep parent visible)
      const left = findNode(l, m) || createNode(l, m, depth + 1);
      const right = findNode(m + 1, r) || createNode(m + 1, r, depth + 1);
      pushFrame(
        `Split [${l}-${r}] → [${l}-${m}] & [${m + 1}-${r}]`,
        3,
        node.id
      );

      // Go in depth (left first), then right
      dfs(l, m, depth + 1);
      dfs(m + 1, r, depth + 1);

      // Merge and snapshot each placement
      mergeWithSnapshots(node, left, right);
    };

    dfs(0, initialArr.length - 1, 0);
    return resultFrames;
  };

  // ---------------------------------
  // Controls
  // ---------------------------------
  const createArray = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const newArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 90) + 10
    );
    setArray(newArr);
    setMessage("New array created! Click Sort to start.");
    setHighlightLine(null);
    setNodes([]);
    setFrames([]);
    setStep(0);
  };

  const startSort = () => {
    if (isSorting) return;
    setIsSorting(true);

    const f = buildFrames(array);
    setFrames(f);

    // Kick off animation
    let i = 0;
    intervalRef.current = setInterval(() => {
      if (i >= f.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsSorting(false);
        setMessage("Merge Sort Completed!!");
        setHighlightLine(null);
        return;
      }
      // Apply frame i
      const frame = f[i];
      setArray(frame.globalArray);
      setNodes(frame.nodes);
      setHighlightLine(frame.line);
      setMessage(frame.msg);
      setStep(i);
      i++;
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ---------------------------------
  // Rendering helpers
  // ---------------------------------
  const lineStyle = (lineNumber) => ({
    backgroundColor: highlightLine === lineNumber ? "black" : "#FEA405",
    color: "white",
    padding: "2px 4px",
  });

  // Group nodes by depth and order by left index so the tree row is stable
  const rowsByDepth = React.useMemo(() => {
    const byDepth = {};
    nodes.forEach((n) => {
      if (!byDepth[n.depth]) byDepth[n.depth] = [];
      byDepth[n.depth].push(n);
    });
    Object.keys(byDepth).forEach((d) =>
      byDepth[d].sort((a, b) => a.l - b.l)
    );
    return byDepth;
  }, [nodes]);

  const colorForNode = (n) => {
    if (n.status === "merged") return "bg-yellow-400"; // like "sorted" yellow
    if (n.status === "merging") return "bg-purple-500";
    if (n.status === "leaf") return "bg-teal-500";
    if (n.status === "active") return "bg-red-500";
    return "bg-blue-400";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-10">
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-teal-700 mb-6 tracking-wide pt-8 text-center">
        Merge Sort
      </h1>

      {/* Responsive layout */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Left: Buttons pinned at bottom of the left column */}
        <div className="w-full md:w-1/6 flex flex-col justify-end items-start p-4 space-y-4">
          <button
            onClick={createArray}
            disabled={isSorting}
            className="px-5 py-2 bg-orange-500 text-white font-bold rounded shadow hover:bg-orange-600 w-32 disabled:opacity-60"
          >
            Create(A)
          </button>
          <button
            onClick={startSort}
            disabled={isSorting}
            className="px-4 py-2 bg-gray-800 text-white font-bold rounded shadow hover:bg-gray-900 w-32 disabled:opacity-60"
          >
            Sort
          </button>
        </div>

        {/* Middle: Visualization */}
        <div className="w-full md:w-2/3 flex flex-col items-center justify-start px-4 pb-6">
          {/* Current array bars (top) */}
          <div className="flex items-end space-x-2 sm:space-x-4 mb-6 flex-wrap justify-center">
            {array.map((value, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="mb-1 font-bold text-sm">{value}</span>
                <div
                  className="w-6 sm:w-8 rounded bg-blue-300"
                  style={{ height: `${value * 3}px` }}
                ></div>
                <span className="mt-1 text-xs text-black">{idx}</span>
              </div>
            ))}
          </div>

          {/* Tree rows (keep upper nodes visible) */}
          <div className="w-full overflow-auto">
            {Object.keys(rowsByDepth)
              .sort((a, b) => Number(a) - Number(b))
              .map((depth) => (
                <div
                  key={depth}
                  className="w-full flex flex-row items-start justify-center gap-6 mb-6"
                >
                  {rowsByDepth[depth].map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-xl p-2 shadow ${colorForNode(
                        n
                      )} transition-all`}
                    >
                      <div className="text-xs text-white font-bold mb-1 text-center">
                        [{n.l}-{n.r}]
                      </div>
                      <div className="flex gap-1">
                        {n.values.map((v, i) => (
                          <div
                            key={i}
                            className="min-w-8 h-8 rounded bg-white text-gray-800 flex items-center justify-center text-sm font-semibold"
                          >
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        {/* Right: Pseudocode at bottom (same style as Selection Sort) */}
        <div className="w-full md:w-1/4 flex flex-col justify-end items-start p-4">
          <h2 className="font-bold text-lg mb-2">Merge Sort</h2>
          <div className="bg-amber-500 text-white px-3 py-2 mb-2 rounded w-full">
            {message}
          </div>
          <div
            id="codetrace"
            className="panel font-mono text-sm rounded w-full"
            style={{ backgroundColor: "#FEA405" }}
          >
            <p style={lineStyle(1)}>
              if left &gt;= right: return
            </p>
            <p style={lineStyle(2)}>&nbsp;&nbsp;mid = (left + right) / 2</p>
            <p style={lineStyle(3)}>&nbsp;&nbsp;mergeSort(left, mid)</p>
            <p style={lineStyle(4)}>&nbsp;&nbsp;mergeSort(mid+1, right)</p>
            <p style={lineStyle(6)}>&nbsp;&nbsp;merge(left..mid, mid+1..right)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
