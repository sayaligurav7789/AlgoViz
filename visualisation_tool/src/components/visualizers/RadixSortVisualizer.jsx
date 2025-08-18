import React, { useState, useEffect } from "react";

export default function RadixSortVisualizer() {
  const [array, setArray] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSorting, setIsSorting] = useState(false);
  const [highlightLine, setHighlightLine] = useState(null);

  // Pseudocode for Radix Sort
  const pseudocode = [
    "function radixSort(arr):",
    "  find max number to know digit count",
    "  for each digit from LSD to MSD:",
    "    apply countingSort(arr, digit)",
    "    place numbers according to current digit"
  ];

  // Generate random array
  const createArray = () => {
    const newArr = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 900 + 10)
    );
    setArray(newArr);
    setSteps([]);
    setCurrentStep(0);
    setHighlightLine(null);
    setIsSorting(false);
  };

  // Radix Sort with steps recording
  const radixSort = (arr) => {
    let steps = [];
    let max = Math.max(...arr);
    let exp = 1; // digit place

    steps.push({ array: [...arr], message: "Start Radix Sort", line: 0 });

    while (Math.floor(max / exp) > 0) {
      steps.push({
        array: [...arr],
        message: `Sorting by digit place ${exp}`,
        line: 2,
      });

      arr = countingSort(arr, exp, steps);

      exp *= 10;
    }

    steps.push({ array: [...arr], message: "Array fully sorted!", line: null });
    return steps;
  };

  // Counting Sort for a digit (inside Radix)
  const countingSort = (arr, exp, steps) => {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);

    // Count occurrences
    arr.forEach((num) => {
      let digit = Math.floor(num / exp) % 10;
      count[digit]++;
    });

    steps.push({
      array: [...arr],
      message: `Frequency count for digit place ${exp}: [${count.join(", ")}]`,
      line: 3,
    });

    // Cumulative count
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output (stable sort)
    for (let i = arr.length - 1; i >= 0; i--) {
      let digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }

    steps.push({
      array: [...output],
      message: `After placing numbers by digit ${exp}`,
      line: 4,
    });

    return output;
  };

  // Run sorting stepwise
  const startSort = () => {
    if (isSorting) return;
    const allSteps = radixSort([...array]);
    setSteps(allSteps);
    setIsSorting(true);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isSorting && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setArray(steps[currentStep].array);
        setHighlightLine(steps[currentStep].line);
        setCurrentStep((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSorting, currentStep, steps]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Array Display */}
      <div className="flex space-x-3 mb-6">
        {array.map((val, idx) => (
          <div
            key={idx}
            className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white font-bold rounded-lg shadow-md"
          >
            {val}
          </div>
        ))}
      </div>

      {/* Message */}
      <p className="mb-6 text-lg font-semibold text-gray-700">
        {steps[currentStep - 1]?.message || "Click Sort to begin!"}
      </p>

      <div className="flex justify-between w-full px-12">
        {/* Left Bottom Corner - Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={createArray}
            className="px-4 py-2 bg-green-500 text-white rounded-xl shadow-lg hover:bg-green-600"
          >
            Create
          </button>
          <button
            onClick={startSort}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600"
          >
            Sort
          </button>
        </div>

        {/* Right Bottom Corner - Pseudocode */}
        <div className="bg-white shadow-xl p-4 rounded-2xl w-80">
          <h3 className="text-lg font-bold mb-2">Pseudocode</h3>
          <pre className="text-sm text-gray-800">
            {pseudocode.map((line, idx) => (
              <div
                key={idx}
                className={`${
                  highlightLine === idx ? "bg-yellow-200 font-bold" : ""
                }`}
              >
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
