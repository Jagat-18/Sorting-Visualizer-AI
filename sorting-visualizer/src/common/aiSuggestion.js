import { BubbleSort } from "../sortFunctions/BubbleSort";
import { SelectionSort } from "../sortFunctions/SelectionSort";
import { InsertionSort } from "../sortFunctions/InsertionSort";
import { HeapSort } from "../sortFunctions/HeapSort";
import { MergeSort } from "../sortFunctions/MergeSort";
import { QuickSort } from "../sortFunctions/QuickSort";

const ALGORITHM_NAMES = [
  "BubbleSort",
  "SelectionSort",
  "InsertionSort",
  "HeapSort",
  "MergeSort",
  "QuickSort",
];

const ALGORITHM_RUNNERS = {
  BubbleSort,
  SelectionSort,
  InsertionSort,
  HeapSort,
  MergeSort,
  QuickSort,
};

const algorithmSteps = {
  BubbleSort: [
    "Start at the beginning of the array and compare neighboring values.",
    "Swap neighbors when they are in the wrong order.",
    "After each pass, the largest unsorted value moves to its final position.",
    "Repeat passes until no swaps are needed.",
  ],
  SelectionSort: [
    "Scan the unsorted part to find the smallest value.",
    "Place that value at the next sorted position at the front.",
    "Shrink the unsorted part and repeat.",
    "Continue until the whole array is sorted.",
  ],
  InsertionSort: [
    "Treat the first element as already sorted.",
    "Pick the next element and compare it with previous sorted elements.",
    "Shift larger elements one step right to make room.",
    "Insert the picked element at its correct position.",
  ],
  HeapSort: [
    "Build a max heap so the largest value is at the root.",
    "Swap the root with the last unsorted element.",
    "Reduce heap size and restore heap property.",
    "Repeat until all elements are extracted in sorted order.",
  ],
  MergeSort: [
    "Split the array into smaller halves recursively.",
    "Continue splitting until each part has one element.",
    "Merge parts back while always taking the smaller front element.",
    "Keep merging until one fully sorted array is formed.",
  ],
  QuickSort: [
    "Pick a pivot element from the current range.",
    "Partition elements so smaller values go left and larger values go right.",
    "Pivot lands at its final sorted position.",
    "Recursively quicksort left and right partitions.",
  ],
  All: [
    "Select one tab to view one algorithm in detail.",
    "Use AI recommendation to choose the best algorithm for your input.",
  ],
};

const complexity = {
  BubbleSort: { best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" },
  SelectionSort: { best: "O(n^2)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" },
  InsertionSort: { best: "O(n)", average: "O(n^2)", worst: "O(n^2)", space: "O(1)" },
  HeapSort: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" },
  MergeSort: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  QuickSort: { best: "O(n log n)", average: "O(n log n)", worst: "O(n^2)", space: "O(log n)" },
  All: { best: "-", average: "-", worst: "-", space: "-" },
};

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function isValidIndex(index, length) {
  return Number.isInteger(index) && index >= 0 && index < length;
}

function formatArray(array) {
  return `[${array.join(", ")}]`;
}

function moveValue(array, source, destination) {
  if (!isValidIndex(source, array.length) || !isValidIndex(destination, array.length)) {
    return;
  }

  const [value] = array.splice(source, 1);
  array.splice(destination, 0, value);
}

function resolveTraceAlgorithm(selectedAlgorithm, recommendedAlgorithm) {
  if (selectedAlgorithm && selectedAlgorithm !== "All") {
    return selectedAlgorithm;
  }

  return recommendedAlgorithm || "QuickSort";
}

export function analyzeArrayFeatures(array) {
  const safeArray = Array.isArray(array) ? array : [];
  const n = safeArray.length;

  if (n <= 1) {
    return {
      n,
      isNearlySorted: true,
      inversionRatioEstimate: 0,
      duplicateRatio: 0,
      valueRange: 0,
    };
  }

  let inversionCount = 0;
  const pairCount = (n * (n - 1)) / 2;
  const uniqueValues = new Set(safeArray);

  for (let i = 0; i < n - 1; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (safeArray[i] > safeArray[j]) inversionCount += 1;
    }
  }

  const inversionRatioEstimate = pairCount === 0 ? 0 : inversionCount / pairCount;
  const adjacentDisorderCount = safeArray.slice(1).reduce((count, value, idx) => {
    return safeArray[idx] > value ? count + 1 : count;
  }, 0);
  const adjacentDisorderRatio = adjacentDisorderCount / (n - 1);

  const isNearlySorted =
    inversionRatioEstimate <= 0.15 || adjacentDisorderRatio <= 0.2;
  const duplicateRatio = n === 0 ? 0 : 1 - uniqueValues.size / n;
  const minValue = Math.min(...safeArray);
  const maxValue = Math.max(...safeArray);
  const valueRange = maxValue - minValue;

  return {
    n,
    isNearlySorted,
    inversionRatioEstimate,
    duplicateRatio,
    valueRange,
  };
}

export function getAlgorithmSteps(name) {
  return algorithmSteps[name] || algorithmSteps.All;
}

export function getComplexity(name) {
  return complexity[name] || complexity.All;
}

export function recommendAlgorithm(features) {
  const {
    n = 0,
    isNearlySorted = false,
    duplicateRatio = 0,
    inversionRatioEstimate = 0,
  } = features || {};

  if (n <= 1) {
    return {
      name: "InsertionSort",
      reason:
        "Array is already sorted or has one element, so a simple in-place approach is enough.",
      scoreMap: {},
    };
  }

  const scoreMap = {
    BubbleSort: -100,
    SelectionSort: -100,
    InsertionSort: 0,
    HeapSort: 0,
    MergeSort: 0,
    QuickSort: 0,
  };
  const reasons = [];

  if (n <= 12 && isNearlySorted) {
    scoreMap.InsertionSort += 80;
    reasons.push(
      "Small and nearly sorted input favors InsertionSort due to low constant overhead."
    );
  }

  if (duplicateRatio >= 0.5) {
    scoreMap.QuickSort -= 30;
    scoreMap.MergeSort += 20;
    scoreMap.HeapSort += 15;
    reasons.push(
      "High duplicate density can hurt pivot quality in basic QuickSort, so Merge/Heap are safer."
    );
  }

  if (n >= 40 && !isNearlySorted) {
    scoreMap.MergeSort += 50;
    scoreMap.HeapSort += 25;
    reasons.push(
      "Large unsorted input benefits from predictable O(n log n) behavior."
    );
  }

  if (n >= 13 && n < 40 && !isNearlySorted) {
    scoreMap.QuickSort += 25;
    reasons.push("Medium random input often performs well with QuickSort.");
  }

  if (inversionRatioEstimate < 0.08) {
    scoreMap.InsertionSort += 20;
  }

  if (n <= 8) {
    scoreMap.BubbleSort = -5;
    scoreMap.SelectionSort = -5;
    reasons.push(
      "Very tiny inputs can tolerate simpler educational algorithms, but faster choices are still preferred."
    );
  }

  scoreMap.QuickSort += 10;
  scoreMap.MergeSort += 5;

  const sortedCandidates = ALGORITHM_NAMES.slice().sort(
    (a, b) => scoreMap[b] - scoreMap[a]
  );
  const name = sortedCandidates[0] || "QuickSort";

  const reason =
    reasons[0] || "General-purpose fallback picks QuickSort for medium random input.";

  return { name, reason, scoreMap };
}

export function buildSuggestionPayload({ selectedAlgorithm, array }) {
  const selected = selectedAlgorithm || "All";
  const features = analyzeArrayFeatures(array);
  const recommendation = recommendAlgorithm(features);
  const recommended = recommendation.name;

  const selectedComplexity = getComplexity(selected);
  const recommendedComplexity = getComplexity(recommended);

  const rationale = [
    recommendation.reason,
    `Input size: ${features.n}`,
    `Nearly sorted: ${features.isNearlySorted ? "Yes" : "No"}`,
    `Duplicate ratio: ${Math.round(features.duplicateRatio * 100)}%`,
    `Inversion estimate: ${Math.round(features.inversionRatioEstimate * 100)}%`,
  ];

  return {
    selected,
    recommended,
    rationale,
    selectedSteps: getAlgorithmSteps(selected),
    recommendedSteps: getAlgorithmSteps(recommended),
    complexityTable: [
      { algorithm: selected, ...selectedComplexity, label: "Selected" },
      { algorithm: recommended, ...recommendedComplexity, label: "Recommended" },
    ],
    traceAlgorithm: resolveTraceAlgorithm(selected, recommended),
    features: {
      ...features,
      duplicateRatio: clampNumber(features.duplicateRatio, 0, 1),
      inversionRatioEstimate: clampNumber(features.inversionRatioEstimate, 0, 1),
    },
  };
}

export async function generateAlgorithmTrace({
  algorithmName,
  array,
  maxTraceLines = 500,
}) {
  const runner = ALGORITHM_RUNNERS[algorithmName] || QuickSort;
  const traceAlgorithm = ALGORITHM_RUNNERS[algorithmName] ? algorithmName : "QuickSort";
  const workingArray = Array.isArray(array) ? [...array] : [];

  const lines = [];
  let comparisonCount = 0;
  let swapCount = 0;
  let moveCount = 0;
  let truncated = false;

  function pushLine(line) {
    if (lines.length < maxTraceLines) {
      lines.push(line);
      return;
    }

    truncated = true;
  }

  async function highlight(indices = [], pivot = -1) {
    const validIndices = Array.isArray(indices)
      ? indices.filter((idx) => isValidIndex(idx, workingArray.length))
      : [];

    if (validIndices.length >= 2) {
      const leftIndex = validIndices[0];
      const rightIndex = validIndices[1];
      comparisonCount += 1;
      pushLine(
        `Compare index ${leftIndex} (${workingArray[leftIndex]}) with index ${rightIndex} (${workingArray[rightIndex]}).`
      );
      return;
    }

    if (
      validIndices.length === 1 &&
      isValidIndex(pivot, workingArray.length)
    ) {
      const index = validIndices[0];
      comparisonCount += 1;
      pushLine(
        `Compare index ${index} (${workingArray[index]}) with pivot index ${pivot} (${workingArray[pivot]}).`
      );
      return;
    }

    if (validIndices.length === 1) {
      const index = validIndices[0];
      pushLine(`Inspect index ${index} (${workingArray[index]}).`);
    }
  }

  async function swap(i, j) {
    if (!isValidIndex(i, workingArray.length) || !isValidIndex(j, workingArray.length)) {
      return;
    }

    const left = workingArray[i];
    const right = workingArray[j];
    workingArray[i] = right;
    workingArray[j] = left;
    swapCount += 1;
    pushLine(
      `Swap index ${i} (${left}) with index ${j} (${right}) -> ${formatArray(workingArray)}.`
    );
  }

  async function combine(source, destination) {
    if (
      !isValidIndex(source, workingArray.length) ||
      !isValidIndex(destination, workingArray.length)
    ) {
      return;
    }

    if (source === destination) {
      return;
    }

    const moved = workingArray[source];
    moveValue(workingArray, source, destination);
    moveCount += 1;
    pushLine(
      `Move value ${moved} from index ${source} to index ${destination} -> ${formatArray(workingArray)}.`
    );
  }

  function markSort() {}

  try {
    const iterator =
      traceAlgorithm === "MergeSort"
        ? runner(workingArray, combine, highlight, markSort)
        : runner(workingArray, swap, highlight, markSort);

    let nextStep = await iterator.next();
    let iterationCount = 0;
    const maxIterations = 500000;

    while (!nextStep.done) {
      if (truncated) {
        break;
      }

      nextStep = await iterator.next();
      iterationCount += 1;

      if (iterationCount > maxIterations) {
        truncated = true;
        pushLine("Trace stopped because it became too long.");
        break;
      }
    }
  } catch (error) {
    return {
      algorithm: traceAlgorithm,
      lines: [
        `Could not generate trace: ${error?.message || "Unexpected error"}`,
      ],
      comparisonCount,
      swapCount,
      moveCount,
      truncated: true,
      finalArray: workingArray,
    };
  }

  if (lines.length === 0) {
    lines.push("No comparison steps were generated for this input.");
  }

  if (truncated) {
    lines.push("Trace truncated to keep the popup responsive.");
  }

  return {
    algorithm: traceAlgorithm,
    lines,
    comparisonCount,
    swapCount,
    moveCount,
    truncated,
    finalArray: workingArray,
  };
}
