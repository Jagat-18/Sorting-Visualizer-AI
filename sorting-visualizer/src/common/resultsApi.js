import { request } from "./apiClient";

function notifyUsageChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("usage-updated"));
  }
}

export async function saveSortResult(payload) {
  const data = await request("/api/results", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  notifyUsageChanged();
  return data;
}

export async function fetchSavedResults() {
  return request("/api/results", {
    method: "GET",
  });
}

export async function deleteSelectedResults(ids) {
  const data = await request("/api/results", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
  notifyUsageChanged();
  return data;
}

export async function deleteAllResults() {
  const data = await request("/api/results/clear", {
    method: "DELETE",
  });
  notifyUsageChanged();
  return data;
}
