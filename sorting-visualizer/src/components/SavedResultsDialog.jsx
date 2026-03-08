import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Button,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { MdClose } from "react-icons/md";
import {
  fetchSavedResults,
  deleteSelectedResults,
  deleteAllResults,
} from "../common/resultsApi";

const paperStyle = {
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 22px 55px rgba(12, 49, 137, 0.28)",
};

const titleWrapStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "var(--dialog-title-gradient)",
  color: "#fff",
  margin: "-16px -24px",
  padding: "16px 24px",
};

const listWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  maxHeight: "62vh",
  overflowY: "auto",
};

const cardStyle = {
  border: "1px solid var(--dialog-card-border)",
  borderRadius: "10px",
  background: "var(--dialog-card-bg)",
  padding: "12px",
};

const metricPillStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "4px 10px",
  background: "var(--dialog-metric-bg)",
  border: "1px solid var(--dialog-metric-border)",
  borderRadius: "999px",
  fontSize: "0.82rem",
  fontWeight: 700,
  color: "var(--text-primary)",
};

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

function renderShortArray(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return "[]";
  }

  const maxItems = 18;
  if (array.length <= maxItems) {
    return `[${array.join(", ")}]`;
  }

  const sliced = array.slice(0, maxItems).join(", ");
  return `[${sliced}, ...]`;
}

function getResultId(row, index) {
  if (typeof row?.id === "string" && row.id.trim().length > 0) {
    return row.id;
  }

  return `no-id-${index}`;
}

export function SavedResultsDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const selectableIds = useMemo(() => {
    return results
      .map((row) => row?.id)
      .filter((id) => typeof id === "string" && id.trim().length > 0);
  }, [results]);

  const allSelected =
    selectableIds.length > 0 && selectedIds.length === selectableIds.length;
  const partiallySelected =
    selectedIds.length > 0 && selectedIds.length < selectableIds.length;

  function applyResults(nextResults) {
    setResults(nextResults);
    setSelectedIds((prev) => {
      const allowed = new Set(
        nextResults
          .map((row) => row?.id)
          .filter((id) => typeof id === "string" && id.trim().length > 0)
      );
      return prev.filter((id) => allowed.has(id));
    });
  }

  async function refreshResults() {
    const data = await fetchSavedResults();
    const nextResults = Array.isArray(data?.results) ? data.results : [];
    applyResults(nextResults);
  }

  async function loadResults() {
    setLoading(true);
    setError("");

    try {
      await refreshResults();
    } catch (err) {
      setError(err?.message || "Could not load saved results. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    loadResults();
  }, [open]);

  function toggleRowSelection(id) {
    if (!id) {
      return;
    }

    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }

      return [...prev, id];
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(selectableIds);
  }

  async function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${selectedIds.length} selected record(s)?`
    );
    if (!shouldDelete) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteSelectedResults(selectedIds);
      await refreshResults();
      setSelectedIds([]);
    } catch (err) {
      setError(err?.message || "Could not delete selected records.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAll() {
    if (results.length === 0) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete all ${results.length} saved record(s)?`
    );
    if (!shouldDelete) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await deleteAllResults();
      applyResults([]);
      setSelectedIds([]);
    } catch (err) {
      setError(err?.message || "Could not delete all records.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="saved-results-title"
      PaperProps={{ style: paperStyle }}
    >
      <DialogTitle id="saved-results-title" disableTypography>
        <div style={titleWrapStyle}>
          <Typography variant="h6" style={{ color: "#fff", fontWeight: 700 }}>
            Saved Sorting Results
          </Typography>
          <IconButton aria-label="close" onClick={onClose} style={{ color: "#fff" }}>
            <MdClose />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent dividers style={{ background: "var(--dialog-surface-bg)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          <Typography variant="body2" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
            Stored records: {results.length}
          </Typography>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <FormControlLabel
              style={{ margin: 0 }}
              control={
                <Checkbox
                  color="primary"
                  checked={allSelected}
                  indeterminate={partiallySelected}
                  onChange={toggleSelectAll}
                  disabled={loading || selectableIds.length === 0}
                />
              }
              label={
                <Typography variant="body2" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
                  Select All
                </Typography>
              }
            />

            <Button onClick={loadResults} variant="outlined" color="primary" disabled={loading}>
              Refresh
            </Button>
            <Button
              onClick={handleDeleteSelected}
              variant="contained"
              color="secondary"
              disabled={loading || selectedIds.length === 0}
            >
              Delete Selected
            </Button>
            <Button
              onClick={handleDeleteAll}
              variant="outlined"
              color="secondary"
              disabled={loading || results.length === 0}
            >
              Delete All
            </Button>
          </div>
        </div>

        <Divider style={{ marginBottom: "12px" }} />

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <CircularProgress size={22} />
            <Typography variant="body2" style={{ color: "var(--text-secondary)" }}>
              Loading saved records...
            </Typography>
          </div>
        ) : null}

        {!loading && error ? (
          <div style={{ ...cardStyle, borderColor: "#d66" }}>
            <Typography variant="body2" style={{ color: "#ff7a7a", fontWeight: 700 }}>
              {error}
            </Typography>
          </div>
        ) : null}

        {!loading && !error && results.length === 0 ? (
          <div style={cardStyle}>
            <Typography variant="body2" style={{ color: "var(--text-secondary)" }}>
              No saved data yet. Run a sort to store records.
            </Typography>
          </div>
        ) : null}

        {!loading && !error && results.length > 0 ? (
          <div style={listWrapStyle}>
            {results.map((row, index) => {
              const rowId = getResultId(row, index);
              const canSelect = !rowId.startsWith("no-id-");

              return (
                <div key={rowId} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Checkbox
                        color="primary"
                        checked={canSelect && selectedIds.includes(rowId)}
                        onChange={() => toggleRowSelection(canSelect ? rowId : "")}
                        disabled={!canSelect || loading}
                        style={{ padding: "4px" }}
                      />
                      <Typography variant="subtitle1" style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                        {row.algorithm}
                      </Typography>
                    </div>
                    <Typography variant="caption" style={{ color: "var(--text-muted)" }}>
                      {formatTimestamp(row.createdAt)}
                    </Typography>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    <span style={metricPillStyle}>Comparisons: {row.comparisons}</span>
                    <span style={metricPillStyle}>Swaps: {row.swaps}</span>
                    <span style={metricPillStyle}>Time: {row.timeMs} ms</span>
                    <span style={metricPillStyle}>Theme: {row.themeMode}</span>
                  </div>

                  <Typography variant="body2" style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
                    Complexity: best {row?.complexity?.best || "-"}, avg {row?.complexity?.average || "-"}, worst {row?.complexity?.worst || "-"}, space {row?.complexity?.space || "-"}
                  </Typography>

                  <Typography variant="body2" style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
                    AI Recommended: <strong>{row?.aiExplanation?.recommendedAlgorithm || "-"}</strong>
                  </Typography>

                  <details style={{ marginTop: "8px" }}>
                    <summary style={{ cursor: "pointer", color: "var(--text-primary)", fontWeight: 700 }}>
                      View Input / Output / Trace
                    </summary>
                    <Typography variant="body2" style={{ marginTop: "8px", color: "var(--text-secondary)", fontFamily: "Consolas, monospace" }}>
                      Input: {renderShortArray(row.inputArray)}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "4px", color: "var(--text-secondary)", fontFamily: "Consolas, monospace" }}>
                      Final: {renderShortArray(row.finalArray)}
                    </Typography>
                    <Typography variant="body2" style={{ marginTop: "6px", color: "var(--text-secondary)" }}>
                      Trace preview:
                    </Typography>
                    <ol style={{ marginTop: "6px", marginBottom: 0, paddingLeft: "20px" }}>
                      {(row?.aiExplanation?.traceLines || []).slice(0, 6).map((line, idx) => (
                        <li key={`${rowId}-${idx}`}>
                          <Typography variant="body2" style={{ color: "var(--text-primary)" }}>
                            {line}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                  </details>
                </div>
              );
            })}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
