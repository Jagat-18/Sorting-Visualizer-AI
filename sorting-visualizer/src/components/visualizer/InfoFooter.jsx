import React from "react";
import styled from "styled-components";

const InfoFlex = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px dashed var(--border-soft);
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const StatBox = styled.div`
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-border);
`;

const SaveState = styled.span`
  color: ${(props) => props.$color || "inherit"};
  font-weight: 700;
`;

function getSaveStatusMeta(saveStatus) {
  switch (saveStatus) {
    case "saving":
      return { label: "Saving...", color: "#f39c12" };
    case "saved":
      return { label: "Saved", color: "#2ecc71" };
    case "error":
      return { label: "Backend Offline", color: "#ff6b6b" };
    default:
      return { label: "Pending", color: "var(--text-muted)" };
  }
}

export function InfoFooter({ swapCount, comparisionCount, saveStatus = "idle" }) {
  const saveMeta = getSaveStatusMeta(saveStatus);

  return (
    <InfoFlex>
      <StatBox>
        Swaps: <strong>{swapCount}</strong>
      </StatBox>
      <StatBox>
        Comparisions: <strong>{comparisionCount}</strong>
      </StatBox>
      <StatBox>
        Stored: <SaveState $color={saveMeta.color}>{saveMeta.label}</SaveState>
      </StatBox>
    </InfoFlex>
  );
}
