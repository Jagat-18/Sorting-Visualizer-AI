import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ArrayContainer } from "./ArrayContainer";
import { MergeContainer } from "./MergeContainer";
import { InfoFooter } from "./InfoFooter";
import { Timer } from "./Timer";
import Card from "@material-ui/core/Card";
import { delay } from "../../common/helper";
import shallow from "zustand/shallow";
import { useControls, useData } from "../../common/store";
import {
  buildSuggestionPayload,
  generateAlgorithmTrace,
  getComplexity,
} from "../../common/aiSuggestion";
import { saveSortResult } from "../../common/resultsApi";

let compareTime = useControls.getState().compareTime;
let swapTime = useControls.getState().swapTime;

useControls.subscribe(
  ([cTime, sTime]) => {
    compareTime = cTime;
    swapTime = sTime;
  },
  (state) => [state.compareTime, state.swapTime],
  shallow
);

const Container = styled(Card)`
  && {
    padding: 12px;
    border: 1px solid var(--border-soft);
    border-radius: 14px;
    background-color: var(--surface-card-soft) !important;
    color: var(--text-primary) !important;
    box-shadow: var(--shadow-medium);
    transition: background-color 220ms ease, border-color 220ms ease, color 220ms ease;
  }
`;

const AlgoHeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--chip-border);
  background: var(--surface-muted);
`;

const AlgoName = styled.strong`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  color: var(--text-primary);
  letter-spacing: 0.2px;
  font-size: 0.92rem;
`;

const TimerDiv = styled.div`
  display: flex;
  column-gap: 6px;
  min-width: 8rem;
  justify-content: flex-end;
  font-size: 0.95rem;
  color: var(--text-secondary);
`;

const TimerBadge = styled.strong`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
  color: var(--text-primary);
`;

const ComplexityWrap = styled.div`
  margin-top: 8px;
  margin-bottom: 6px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  background: var(--surface-card);
  padding: 8px;
`;

const ComplexityHeading = styled.div`
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  margin-bottom: 6px;
`;

const ComplexityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ComplexityCell = styled.div`
  border-radius: 8px;
  border: 1px solid var(--chip-border);
  background: var(--chip-bg);
  padding: 6px;
`;

const ComplexityLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
`;

const ComplexityValue = styled.div`
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const SortManager = React.memo(function ({
  array,
  sortFunction,
  sortingAlgorithmName,
}) {
  const [swapIndices, setSwapIndices] = useState([-1, -1]);
  const [hightlightedIndices, setHightlightedIndices] = useState([-1, -1]);
  const [saveStatus, setSaveStatus] = useState("idle");

  const algoArray = useRef([]);
  const initialArray = useRef([]);
  const sortedIndices = useRef([]);
  const pivot = useRef(-1);
  const swapCount = useRef(0);
  const comparisionCount = useRef(0);
  const isAlgoExecutionOver = useRef(false);
  const isComponentUnMounted = useRef(false);
  const hasSavedResult = useRef(false);
  const startedAt = useRef(0);

  const complexity = getComplexity(sortingAlgorithmName);

  const markSortngDone = useControls((state) => state.markSortngDone);
  const progress = useRef("");
  const sortProgressIterator = useRef(null);

  async function persistRunResult() {
    if (hasSavedResult.current) {
      return;
    }

    hasSavedResult.current = true;
    setSaveStatus("saving");

    try {
      const sourceArray = [...initialArray.current];
      const suggestion = buildSuggestionPayload({
        selectedAlgorithm: sortingAlgorithmName,
        array: sourceArray,
      });
      const trace = await generateAlgorithmTrace({
        algorithmName: sortingAlgorithmName,
        array: sourceArray,
        maxTraceLines: 140,
      });

      const timeMs = startedAt.current > 0 ? Date.now() - startedAt.current : 0;

      await saveSortResult({
        algorithm: sortingAlgorithmName,
        inputArray: sourceArray,
        finalArray: [...algoArray.current],
        comparisons: comparisionCount.current,
        swaps: swapCount.current,
        timeMs,
        complexity,
        themeMode: useControls.getState().themeMode,
        aiExplanation: {
          selectedSteps: suggestion.selectedSteps,
          recommendedAlgorithm: suggestion.recommended,
          rationale: suggestion.rationale,
          traceLines: trace.lines,
          traceSummary: {
            comparisons: trace.comparisonCount,
            swaps: trace.swapCount,
            moves: trace.moveCount,
            truncated: trace.truncated,
          },
        },
        createdAt: new Date().toISOString(),
      });

      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  async function reset() {
    const source = [...useData.getState().sortingArray];
    algoArray.current = [...source];
    initialArray.current = [...source];
    sortedIndices.current = [];
    pivot.current = -1;
    swapCount.current = 0;
    comparisionCount.current = 0;
    isAlgoExecutionOver.current = false;
    hasSavedResult.current = false;
    startedAt.current = 0;
    setSaveStatus("idle");
    setSwapIndices([-1, -1]);
    setHightlightedIndices([-1, -1]);

    sortProgressIterator.current =
      sortingAlgorithmName === "MergeSort"
        ? await sortFunction(algoArray.current, combine, highlight, markSort)
        : await sortFunction(algoArray.current, swap, highlight, markSort);
  }

  useEffect(() => {
    progress.current = useControls.getState().progress;
    const unsubscribe = useControls.subscribe(
      (value) => {
        progress.current = value;
        if (progress.current === "start") runAlgo();
        if (progress.current === "reset") reset();
      },
      (state) => state.progress
    );

    return () => {
      isComponentUnMounted.current = true;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    reset();
  }, [array]);

  async function runAlgo() {
    if (!startedAt.current) {
      startedAt.current = Date.now();
    }

    let completion = { done: false };
    while (
      !completion?.done &&
      progress.current === "start" &&
      !isComponentUnMounted.current
    ) {
      completion = await sortProgressIterator.current?.next();
    }

    if (isComponentUnMounted.current) {
      return;
    }

    if (!isAlgoExecutionOver.current && completion?.done) {
      isAlgoExecutionOver.current = true;
      pivot.current = -1;
      setSwapIndices([-1, -1]);
      setHightlightedIndices([-1, -1]);
      markSortngDone();
      persistRunResult();
    }
  }

  async function swap(i, j) {
    let tmp = algoArray.current[i];
    algoArray.current[i] = algoArray.current[j];
    algoArray.current[j] = tmp;
    setSwapIndices([i, j]);

    pivot.current = -1;
    swapCount.current += 1;
    await delay(swapTime);
  }

  async function combine(source, destination) {
    if (source !== destination) {
      swapCount.current += 1;
      setHightlightedIndices([-1, -1]);
      setSwapIndices([source, destination]);
      await delay(swapTime);
    }
  }

  async function highlight(indices, p) {
    setSwapIndices([-1, -1]);
    comparisionCount.current += 1;
    pivot.current = p;
    setHightlightedIndices(indices);
    await delay(compareTime);
  }

  function markSort(...indices) {
    sortedIndices.current.push(...indices);
  }

  const mergeContainer = (
    <MergeContainer
      array={algoArray.current}
      source={swapIndices[0]}
      destination={swapIndices[1]}
      hightlightedIndices={hightlightedIndices}
      sortedIndices={sortedIndices.current}
    />
  );
  const arrayContainer = (
    <ArrayContainer
      array={algoArray.current}
      source={swapIndices[0]}
      destination={swapIndices[1]}
      pivot={pivot.current}
      highlightIndices={hightlightedIndices}
      sortedIndices={sortedIndices.current}
    />
  );

  return (
    <Container>
      <AlgoHeaderBar>
        <AlgoName>{sortingAlgorithmName}</AlgoName>
        <TimerDiv>
          <span>Time:</span>
          <TimerBadge>
            <Timer isAlgoExecutionOver={isAlgoExecutionOver.current} />
          </TimerBadge>
        </TimerDiv>
      </AlgoHeaderBar>
      {sortingAlgorithmName === "MergeSort" ? mergeContainer : arrayContainer}

      <ComplexityWrap>
        <ComplexityHeading>Algorithm Complexity Chart</ComplexityHeading>
        <ComplexityGrid>
          <ComplexityCell>
            <ComplexityLabel>Best Time</ComplexityLabel>
            <ComplexityValue>{complexity.best}</ComplexityValue>
          </ComplexityCell>
          <ComplexityCell>
            <ComplexityLabel>Average Time</ComplexityLabel>
            <ComplexityValue>{complexity.average}</ComplexityValue>
          </ComplexityCell>
          <ComplexityCell>
            <ComplexityLabel>Worst Time</ComplexityLabel>
            <ComplexityValue>{complexity.worst}</ComplexityValue>
          </ComplexityCell>
          <ComplexityCell>
            <ComplexityLabel>Space</ComplexityLabel>
            <ComplexityValue>{complexity.space}</ComplexityValue>
          </ComplexityCell>
        </ComplexityGrid>
      </ComplexityWrap>

      <InfoFooter
        swapCount={swapCount.current}
        comparisionCount={comparisionCount.current}
        saveStatus={saveStatus}
      />
    </Container>
  );
});
