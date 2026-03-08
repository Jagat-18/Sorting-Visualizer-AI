import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { sortingAlgorithms } from "../common/config";
import { useData, useControls } from "../common/store";
import shallow from "zustand/shallow";
import { AiSuggestionDialog } from "./AiSuggestionDialog";
import { SavedResultsDialog } from "./SavedResultsDialog";

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
  };
}

const aiButtonStyle = {
  background: "var(--accent-gradient)",
  color: "#ffffff",
  borderRadius: "999px",
  padding: "8px 18px",
  fontWeight: 700,
  textTransform: "none",
  letterSpacing: "0.2px",
  boxShadow: "0 10px 24px rgba(29, 120, 255, 0.32)",
};

const savedButtonStyle = {
  borderRadius: "999px",
  padding: "8px 16px",
  fontWeight: 700,
  textTransform: "none",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  background: "var(--surface-card)",
};

const logoutButtonStyle = {
  borderRadius: "999px",
  padding: "8px 14px",
  fontWeight: 700,
  textTransform: "none",
  border: "1px solid var(--border-strong)",
  color: "var(--text-primary)",
  background: "transparent",
};

const headingWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const headingTagStyle = {
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "3px 10px",
  borderRadius: "999px",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.85px",
  textTransform: "uppercase",
  color: "var(--text-secondary)",
  background: "var(--surface-muted)",
  border: "1px solid var(--border-soft)",
};

const headingStyle = {
  margin: 0,
  fontSize: "clamp(1.45rem, 2.7vw, 2.35rem)",
  fontWeight: 900,
  letterSpacing: "0.35px",
  lineHeight: 1.05,
};

const headingSoftTextStyle = {
  color: "var(--text-primary)",
};

const headingAccentTextStyle = {
  backgroundImage: "linear-gradient(135deg, #205eff 0%, #2bc2ff 45%, #3db89f 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  textShadow: "0 8px 20px rgba(32, 94, 255, 0.2)",
};

const tabBarStyle = {
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid var(--tabbar-border)",
  boxShadow: "var(--tabbar-shadow)",
  background: "var(--tabbar-bg)",
};

const themeLabelStyle = {
  margin: 0,
  color: "var(--text-secondary)",
  fontWeight: 700,
  fontSize: "0.9rem",
};

const userChipStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  borderRadius: "999px",
  border: "1px solid var(--border-soft)",
  background: "var(--surface-card)",
  color: "var(--text-primary)",
  padding: "4px 8px 4px 4px",
  maxWidth: "220px",
};

const avatarStyle = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--accent-gradient)",
  color: "#fff",
  fontWeight: 800,
  fontSize: "0.78rem",
  flexShrink: 0,
};

const userTextStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "0.85rem",
  fontWeight: 700,
};

function getUserLabel(user) {
  if (!user) {
    return "";
  }

  const name = typeof user.name === "string" ? user.name.trim() : "";
  const email = typeof user.email === "string" ? user.email.trim() : "";
  return name || email || "User";
}

function getInitial(label) {
  if (!label) {
    return "U";
  }

  return label[0].toUpperCase();
}

export function NavBar({ user, onLogout }) {
  const [isAiSuggestionOpen, setIsAiSuggestionOpen] = useState(false);
  const [isSavedDialogOpen, setIsSavedDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [algorithm, setAlgorithm, sortingArray] = useData(
    (state) => [state.algorithm, state.setAlgorithm, state.sortingArray],
    shallow
  );

  const [themeMode, toggleThemeMode] = useControls(
    (state) => [state.themeMode, state.toggleThemeMode],
    shallow
  );

  const selectedAlgorithmName = sortingAlgorithms[algorithm]?.name || "All";
  const userLabel = getUserLabel(user);

  async function handleLogoutClick() {
    if (!onLogout || isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <div>
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
        <div style={headingWrapStyle}>
          <p style={headingTagStyle}>Interactive Playground</p>
          <h3 style={headingStyle}>
            <span style={headingSoftTextStyle}>Sorting</span>{" "}
            <span style={headingAccentTextStyle}>Algorithms Visualizer</span>
          </h3>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {userLabel ? (
            <span style={userChipStyle} title={userLabel}>
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={userLabel}
                  style={{ ...avatarStyle, objectFit: "cover", padding: 0 }}
                />
              ) : (
                <span style={avatarStyle}>{getInitial(userLabel)}</span>
              )}
              <span style={userTextStyle}>{userLabel}</span>
            </span>
          ) : null}

          <FormControlLabel
            style={{ marginRight: "2px" }}
            control={
              <Switch
                color="primary"
                checked={themeMode === "dark"}
                onChange={toggleThemeMode}
                name="theme-toggle"
              />
            }
            label={<span style={themeLabelStyle}>{themeMode === "dark" ? "Dark Mode" : "Light Mode"}</span>}
          />

          <Button
            variant="outlined"
            onClick={() => setIsSavedDialogOpen(true)}
            style={savedButtonStyle}
          >
            Saved Data
          </Button>

          <Button
            variant="contained"
            onClick={() => setIsAiSuggestionOpen(true)}
            style={aiButtonStyle}
          >
            AI Suggestion
          </Button>

          {onLogout ? (
            <Button
              variant="outlined"
              onClick={handleLogoutClick}
              style={logoutButtonStyle}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          ) : null}
        </div>
      </div>
      <AppBar position="static" color="default" style={tabBarStyle}>
        <Tabs
          value={algorithm}
          onChange={(event, id) => setAlgorithm(id)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          textColor="inherit"
          indicatorColor="primary"
        >
          {sortingAlgorithms.map((item, idx) => (
            <Tab
              label={item.title}
              {...a11yProps(idx)}
              key={item.title}
              style={{ color: "var(--text-secondary)", fontWeight: 700 }}
            />
          ))}
          <Tab
            label="All"
            {...a11yProps(sortingAlgorithms.length)}
            style={{ color: "var(--text-secondary)", fontWeight: 700 }}
          />
        </Tabs>
      </AppBar>

      <AiSuggestionDialog
        open={isAiSuggestionOpen}
        onClose={() => setIsAiSuggestionOpen(false)}
        selectedAlgorithm={selectedAlgorithmName}
        array={sortingArray}
      />

      <SavedResultsDialog
        open={isSavedDialogOpen}
        onClose={() => setIsSavedDialogOpen(false)}
      />
    </div>
  );
}
