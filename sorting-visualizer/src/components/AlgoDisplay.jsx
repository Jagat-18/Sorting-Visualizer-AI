import React, { useEffect } from "react";
import styled from "styled-components";
import { sortingAlgorithms } from "../common/config";
import { useControls, useData } from "../common/store";
import shallow from "zustand/shallow";
import { SortManager } from "./visualizer/SortManager";

const FlexWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  column-gap: 12px;
  row-gap: 12px;

  & > div {
    max-width: 100%;
    min-width: 375px;
  }
`;

const DisplayWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 14px;
  min-height: 120px;
  width: 100%;
  border-radius: 12px;
  border: 1px dashed var(--border-strong);
  background: var(--surface-muted);
  color: var(--text-secondary);
  font-weight: 700;
`;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
      style={{ maxWidth: "100%" }}
    >
      {value === index && children}
    </div>
  );
}

export function AlgoDisplay() {
  const resetSorting = useControls((state) => state.resetSorting);
  const [sortingArray, algorithm] = useData(
    (state) => [state.sortingArray, state.algorithm],
    shallow
  );

  useEffect(() => {
    resetSorting();
  }, [algorithm]);

  if (sortingArray.length === 0) {
    return <EmptyState>Please enter input array or use generate button</EmptyState>;
  }

  return (
    <DisplayWrap>
      {sortingAlgorithms.map((algoInfo, idx) => (
        <TabPanel value={algorithm} index={idx} key={algoInfo.name}>
          <SortManager
            array={sortingArray}
            sortFunction={algoInfo.component}
            sortingAlgorithmName={algoInfo.name}
          />
        </TabPanel>
      ))}
      <TabPanel value={algorithm} index={sortingAlgorithms.length}>
        <FlexWrap>
          {sortingAlgorithms.map((algoInfo) => (
            <SortManager
              array={sortingArray}
              sortFunction={algoInfo.component}
              sortingAlgorithmName={algoInfo.name}
              key={algoInfo.name}
            />
          ))}
        </FlexWrap>
      </TabPanel>
    </DisplayWrap>
  );
}
