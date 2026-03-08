import React, { useMemo, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MdClose } from "react-icons/md";
import {
  buildSuggestionPayload,
  generateAlgorithmTrace,
} from "../common/aiSuggestion";

function getPaperStyle(isMobile) {
  if (isMobile) {
    return {
      borderRadius: 0,
      overflow: "hidden",
      boxShadow: "none",
    };
  }

  return {
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 22px 55px rgba(12, 49, 137, 0.28)",
  };
}

function getTitleWrapStyle(isMobile) {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--dialog-title-gradient)",
    color: "#fff",
    margin: isMobile ? "-16px -16px" : "-16px -24px",
    padding: isMobile ? "14px 16px" : "16px 24px",
  };
}

function getSectionStyle(isMobile) {
  return {
    border: "1px solid var(--dialog-card-border)",
    borderRadius: "10px",
    background: "var(--dialog-card-bg)",
    padding: isMobile ? "10px" : "14px",
  };
}

const sectionTitleStyle = {
  fontWeight: 700,
  marginBottom: "8px",
  color: "var(--text-primary)",
};

const metricPillStyle = {
  display: "inline-block",
  padding: "4px 10px",
  background: "var(--dialog-metric-bg)",
  border: "1px solid var(--dialog-metric-border)",
  borderRadius: "999px",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "var(--text-primary)",
};

function getTraceContainerStyle(isMobile) {
  return {
    maxHeight: isMobile ? "220px" : "280px",
    overflowY: "auto",
    border: "1px solid var(--dialog-trace-border)",
    borderRadius: "8px",
    background: "var(--dialog-trace-bg)",
    padding: "10px",
  };
}

const finalArrayStyle = {
  marginTop: "10px",
  background: "var(--dialog-final-bg)",
  color: "var(--dialog-final-text)",
  borderRadius: "6px",
  padding: "8px 10px",
  fontFamily: "Consolas, Menlo, monospace",
  fontSize: "0.85rem",
  wordBreak: "break-word",
};

const recommendationCardStyle = {
  marginTop: "8px",
  borderRadius: "8px",
  padding: "10px 12px",
  border: "1px solid var(--dialog-metric-border)",
  background: "var(--dialog-trace-bg)",
};

export function AiSuggestionDialog({ open, onClose, selectedAlgorithm, array }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const payload = useMemo(() => {
    return buildSuggestionPayload({ selectedAlgorithm, array });
  }, [selectedAlgorithm, array]);

  const [traceState, setTraceState] = useState({
    loading: false,
    algorithm: payload.traceAlgorithm,
    lines: [],
    comparisonCount: 0,
    swapCount: 0,
    moveCount: 0,
    truncated: false,
    finalArray: [],
  });

  useEffect(() => {
    let isCancelled = false;

    async function loadTrace() {
      if (!open) {
        return;
      }

      setTraceState((prev) => ({
        ...prev,
        loading: true,
        algorithm: payload.traceAlgorithm,
        lines: [],
      }));

      const result = await generateAlgorithmTrace({
        algorithmName: payload.traceAlgorithm,
        array,
      });

      if (isCancelled) {
        return;
      }

      setTraceState({
        loading: false,
        ...result,
      });
    }

    loadTrace();

    return () => {
      isCancelled = true;
    };
  }, [open, payload.traceAlgorithm, array]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={isMobile}
      maxWidth={isMobile ? false : "md"}
      aria-labelledby="ai-suggestion-title"
      PaperProps={{ style: getPaperStyle(isMobile) }}
    >
      <DialogTitle id="ai-suggestion-title" disableTypography>
        <div style={getTitleWrapStyle(isMobile)}>
          <Typography
            variant={isMobile ? "h5" : "h6"}
            style={{ color: "#fff", fontWeight: 700 }}
          >
            AI Suggestion
          </Typography>
          <IconButton aria-label="close" onClick={onClose} style={{ color: "#fff" }}>
            <MdClose />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent
        dividers
        style={{
          background: "var(--dialog-surface-bg)",
          padding: isMobile ? "12px" : "24px",
        }}
      >
        <div style={getSectionStyle(isMobile)}>
          <Typography variant="subtitle1" style={sectionTitleStyle}>
            Step-by-Step Trace ({traceState.algorithm})
          </Typography>
          <Typography variant="body2" style={{ marginBottom: 10, color: "var(--text-secondary)" }}>
            Each line below describes exactly what happens to your current array.
          </Typography>

          {traceState.loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: 8 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" style={{ color: "var(--text-secondary)" }}>
                Generating detailed trace...
              </Typography>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: 10 }}>
                <span style={metricPillStyle}>Comparisons: {traceState.comparisonCount}</span>
                <span style={metricPillStyle}>Swaps: {traceState.swapCount}</span>
                <span style={metricPillStyle}>Moves: {traceState.moveCount}</span>
              </div>
              <div style={getTraceContainerStyle(isMobile)}>
                <ol style={{ margin: 0, paddingLeft: "20px" }}>
                  {traceState.lines.map((line, idx) => (
                    <li key={`${line}-${idx}`} style={{ marginBottom: 8 }}>
                      <Typography
                        variant="body2"
                        style={{ color: "var(--text-primary)", wordBreak: "break-word" }}
                      >
                        {line}
                      </Typography>
                    </li>
                  ))}
                </ol>
              </div>
              <div style={finalArrayStyle}>Final order: [{traceState.finalArray.join(", ")}]</div>
            </>
          )}
        </div>

        <Divider style={{ margin: "14px 0" }} />

        <div style={getSectionStyle(isMobile)}>
          <Typography variant="subtitle1" style={sectionTitleStyle}>
            AI Recommended Algorithm
          </Typography>
          <div style={recommendationCardStyle}>
            <Typography variant="body1" style={{ fontWeight: 700, color: "var(--text-primary)" }}>
              {payload.recommended}
            </Typography>
          </div>
        </div>

        <Divider style={{ margin: "14px 0" }} />

        <div style={getSectionStyle(isMobile)}>
          <Typography variant="subtitle1" style={sectionTitleStyle}>
            Why This Recommendation
          </Typography>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: isMobile ? "18px" : "24px" }}>
            {payload.rationale.map((line) => (
              <li key={line} style={{ marginBottom: 6 }}>
                <Typography variant="body2" style={{ color: "var(--text-primary)", wordBreak: "break-word" }}>
                  {line}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        <Divider style={{ margin: "14px 0" }} />

        <div style={getSectionStyle(isMobile)}>
          <Typography variant="subtitle1" style={sectionTitleStyle}>
            Complexity Comparison
          </Typography>
          <div
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              marginTop: 6,
            }}
          >
            <Table size="small" style={{ minWidth: 560 }}>
              <TableHead>
                <TableRow style={{ background: "var(--dialog-table-head)" }}>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Role</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Algorithm</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Best</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Average</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Worst</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Space</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payload.complexityTable.map((row) => (
                  <TableRow key={`${row.label}-${row.algorithm}`}>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.label}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.algorithm}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.best}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.average}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.worst}</TableCell>
                    <TableCell style={{ whiteSpace: "nowrap" }}>{row.space}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
