import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import { fetchUsageStats } from "../common/authApi";

const ChartWrap = styled(Card)`
  margin-top: 12px;
  padding: 14px;
  border-radius: 14px !important;
  border: 1px solid var(--border-soft);
  background: var(--surface-card-soft) !important;
  box-shadow: var(--shadow-soft);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Title = styled.h4`
  margin: 0;
  color: var(--text-primary);
`;

const Meta = styled.div`
  color: var(--text-secondary);
  font-size: 0.95rem;
`;

const Flex = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const Pie = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid var(--border-strong);
  background: ${(props) => props.$gradient};
  box-shadow: inset 0 0 0 16px rgba(255, 255, 255, 0.08);
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 250px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-primary);
  font-size: 0.9rem;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  display: inline-block;
`;

const algorithmColors = [
  "#5b8dff",
  "#31b7ff",
  "#4dd7a8",
  "#ffd166",
  "#ff8fab",
  "#c77dff",
  "#ff9f1c",
  "#3dd5f3",
];

function getPieGradient(items) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  if (!total) {
    return "conic-gradient(#2c3f69 0 100%)";
  }

  let current = 0;
  const segments = items.map((item, index) => {
    const color = algorithmColors[index % algorithmColors.length];
    const percent = (item.count / total) * 100;
    const start = current;
    const end = current + percent;
    current = end;
    return `${color} ${start}% ${end}%`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

export function UsageChart() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState({
    totalRuns: 0,
    algorithms: [],
    mostUsed: null,
    notUsed: [],
  });

  async function loadUsage() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchUsageStats();
      setUsage(data?.usage || {
        totalRuns: 0,
        algorithms: [],
        mostUsed: null,
        notUsed: [],
      });
    } catch (err) {
      setError(err?.message || "Could not load usage data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsage();

    function onUsageUpdated() {
      loadUsage();
    }

    window.addEventListener("usage-updated", onUsageUpdated);
    return () => window.removeEventListener("usage-updated", onUsageUpdated);
  }, []);

  const sortedAlgorithms = useMemo(() => {
    return [...(usage.algorithms || [])].sort((a, b) => b.count - a.count);
  }, [usage.algorithms]);

  const pieGradient = useMemo(() => {
    return getPieGradient(sortedAlgorithms);
  }, [sortedAlgorithms]);

  return (
    <ChartWrap>
      <HeaderRow>
        <Title>Algorithm Usage Analytics</Title>
        <Button variant="outlined" color="primary" size="small" onClick={loadUsage}>
          Refresh
        </Button>
      </HeaderRow>

      {loading ? <Meta>Loading usage stats...</Meta> : null}
      {error ? <Meta style={{ color: "#ff7a7a" }}>{error}</Meta> : null}

      {!loading && !error ? (
        <>
          <Meta>Total runs: {usage.totalRuns}</Meta>
          <Meta>
            Most used: {usage?.mostUsed?.algorithm || "-"} ({usage?.mostUsed?.count || 0})
          </Meta>
          <Meta>
            Not used: {usage?.notUsed?.length ? usage.notUsed.join(", ") : "None"}
          </Meta>

          <Flex style={{ marginTop: "12px" }}>
            <Pie $gradient={pieGradient} />
            <LegendList>
              {sortedAlgorithms.map((item, index) => (
                <LegendItem key={item.algorithm}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <Dot $color={algorithmColors[index % algorithmColors.length]} />
                    {item.algorithm}
                  </span>
                  <strong>{item.count}</strong>
                </LegendItem>
              ))}
            </LegendList>
          </Flex>
        </>
      ) : null}
    </ChartWrap>
  );
}
