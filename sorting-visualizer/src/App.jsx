import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { NavBar } from "./components/NavBar";
import { Controller } from "./components/Controller";
import { AlgoDisplay } from "./components/AlgoDisplay";
import { AuthPanel } from "./components/AuthPanel";
import { UsageChart } from "./components/UsageChart";
import { useControls } from "./common/store";
import {
  fetchCurrentUser,
  hasStoredAuthToken,
  logoutUser,
} from "./common/authApi";

const Backdrop = styled.div`
  min-height: 100vh;
  padding: 20px 14px 46px;
  background: var(--app-backdrop);
  transition: background 220ms ease;
`;

const Container = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  min-height: calc(100vh - 56px);
  position: relative;
  border-radius: 20px;
  padding: 18px;
  border: 1px solid var(--app-container-border);
  background: var(--app-container-bg);
  backdrop-filter: blur(4px);
  box-shadow: var(--app-container-shadow);
  transition: background 220ms ease, border-color 220ms ease, box-shadow 220ms ease;
`;

const LoadingState = styled.div`
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-weight: 700;
`;

export default function App() {
  const themeMode = useControls((state) => state.themeMode);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const effectiveTheme = currentUser ? themeMode : "light";
    document.documentElement.setAttribute("data-theme", effectiveTheme);
  }, [themeMode, currentUser]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      if (!hasStoredAuthToken()) {
        if (!cancelled) {
          setAuthLoading(false);
        }
        return;
      }

      try {
        const data = await fetchCurrentUser();
        if (!cancelled) {
          setCurrentUser(data?.user || null);
        }
      } catch {
        if (!cancelled) {
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      setCurrentUser(null);
    }
  }

  if (authLoading) {
    return (
      <Backdrop>
        <Container>
          <LoadingState>Checking authentication...</LoadingState>
        </Container>
      </Backdrop>
    );
  }

  if (!currentUser) {
    return (
      <Backdrop>
        <Container>
          <AuthPanel onAuthenticated={setCurrentUser} />
        </Container>
      </Backdrop>
    );
  }

  return (
    <Backdrop>
      <Container>
        <NavBar user={currentUser} onLogout={handleLogout} />
        <Controller />
        <UsageChart />
        <AlgoDisplay />
      </Container>
    </Backdrop>
  );
}
