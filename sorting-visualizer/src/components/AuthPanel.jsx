import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Divider from "@material-ui/core/Divider";
import { loginUser, signupUser, loginWithGoogleCredential } from "../common/authApi";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const Wrap = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  padding: 18px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid #dbe6ff;
  background: linear-gradient(135deg, #f9fcff 0%, #eef4ff 48%, #f7fbff 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    z-index: -1;
  }

  &::before {
    width: 220px;
    height: 220px;
    top: -82px;
    right: -36px;
    background: radial-gradient(circle, rgba(60, 128, 255, 0.28), rgba(60, 128, 255, 0));
  }

  &::after {
    width: 260px;
    height: 260px;
    bottom: -110px;
    left: -80px;
    background: radial-gradient(circle, rgba(65, 201, 181, 0.22), rgba(65, 201, 181, 0));
  }

  @media (max-width: 720px) {
    min-height: calc(100vh - 120px);
    padding: 12px;
    border-radius: 18px;
  }
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 470px;
  padding: 26px 24px;
  border-radius: 22px !important;
  border: 1px solid #d3e1ff;
  background: rgba(255, 255, 255, 0.96) !important;
  box-shadow:
    0 26px 54px rgba(35, 72, 145, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);

  @media (max-width: 720px) {
    padding: 20px 16px;
    border-radius: 16px !important;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 11px;
  margin-bottom: 14px;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  color: #16409b;
  background: linear-gradient(135deg, #e8f1ff 0%, #dce9ff 100%);
  border: 1px solid #c9dcff;
`;

const ToggleRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 14px;
  padding: 4px;
  border-radius: 12px;
  background: #f1f6ff;
  border: 1px solid #d7e5ff;
`;

const ModeButton = styled.button`
  border: 1px solid ${(props) => (props.$active ? "#2c6fff" : "transparent")};
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #2f6fff 0%, #4d92ff 100%)"
      : "transparent"};
  color: ${(props) => (props.$active ? "#fff" : "#20407f")};
  border-radius: 10px;
  height: 40px;
  font-weight: 700;
  cursor: pointer;
  transition: all 180ms ease;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #2f6fff 0%, #4d92ff 100%)"
        : "#e8f1ff"};
  }
`;

const FormSection = styled.form`
  .MuiInputBase-root {
    border-radius: 12px;
    background: #f8faff;
  }

  .MuiInputBase-input {
    color: #102650 !important;
    font-weight: 600;
  }

  .MuiInputLabel-root {
    color: #5f73a1 !important;
    font-weight: 600;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #cfdefc !important;
  }

  .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: #7ea9ff !important;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #2f72ff !important;
    border-width: 2px;
  }
`;

const GoogleWrap = styled.div`
  margin-top: 14px;
`;

const GoogleButtonHost = styled.div`
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const titleStyle = {
  margin: 0,
  marginBottom: "6px",
  color: "#0d2558",
  fontSize: "1.9rem",
  lineHeight: 1.1,
};

const subtitleStyle = {
  margin: 0,
  marginBottom: "18px",
  color: "#4a6598",
  fontWeight: 500,
};

const inputStyle = {
  width: "100%",
  marginBottom: "13px",
};

const errorStyle = {
  marginBottom: "12px",
  color: "#d7263d",
  fontWeight: 700,
  background: "#ffeef1",
  border: "1px solid #ffcfd7",
  borderRadius: "10px",
  padding: "9px 11px",
  fontSize: "0.9rem",
};

const helperStyle = {
  marginTop: "8px",
  color: "#556d9d",
  fontSize: "0.82rem",
  textAlign: "center",
};

const submitStyle = {
  textTransform: "none",
  fontWeight: 800,
  width: "100%",
  height: "46px",
  borderRadius: "12px",
  marginTop: "2px",
  background: "linear-gradient(135deg, #215eff 0%, #3e8bff 100%)",
  boxShadow: "0 14px 28px rgba(40, 94, 203, 0.27)",
};

function normalizeGoogleError(err) {
  const fallback = "Google login failed";
  if (!err) {
    return fallback;
  }

  const message = `${err?.message || fallback}`.toLowerCase();

  if (message.includes("client") && message.includes("mismatch")) {
    return "Google Client ID mismatch. Check VITE_GOOGLE_CLIENT_ID in frontend and GOOGLE_CLIENT_ID in backend.";
  }

  if (message.includes("credential")) {
    return "Google credential missing. Please retry sign-in.";
  }

  if (message.includes("enotfound") || message.includes("timeout") || message.includes("network")) {
    return "Backend could not verify Google token. Check internet access on backend host.";
  }

  return err?.message || fallback;
}

export function AuthPanel({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleReady, setGoogleReady] = useState(false);
  const [googleStatusMessage, setGoogleStatusMessage] = useState("");
  const googleButtonRef = useRef(null);

  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = isSignup
        ? { name: name.trim(), email: email.trim(), password }
        : { email: email.trim(), password };

      const data = isSignup
        ? await signupUser(payload)
        : await loginUser(payload);

      onAuthenticated(data.user);
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function handleGoogleCredentialResponse(response) {
      const credential = response?.credential;
      if (!credential) {
        setError("Google sign-in did not return a credential. Please try again.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await loginWithGoogleCredential(credential);
        if (!cancelled) {
          onAuthenticated(data.user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(normalizeGoogleError(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    function renderGoogleButton() {
      if (cancelled) {
        return;
      }

      const googleApi = window?.google?.accounts?.id;
      if (!googleApi || !googleButtonRef.current) {
        return;
      }

      googleButtonRef.current.innerHTML = "";

      googleApi.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });

      const maxWidth = Math.min(360, window.innerWidth - 90);
      googleApi.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "continue_with",
        width: Math.max(maxWidth, 220),
      });

      setGoogleReady(true);
      setGoogleStatusMessage("");
    }

    if (!GOOGLE_CLIENT_ID) {
      setGoogleReady(false);
      setGoogleStatusMessage("Set VITE_GOOGLE_CLIENT_ID to enable Google sign-in.");
      return () => {
        cancelled = true;
      };
    }

    if (window?.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      renderGoogleButton();
    };
    script.onerror = () => {
      if (!cancelled) {
        setGoogleReady(false);
        setGoogleStatusMessage("Could not load Google sign-in script. Check internet connection.");
      }
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [onAuthenticated]);

  return (
    <Wrap>
      <Panel>
        <Badge>Sorting Visualizer</Badge>
        <h2 style={titleStyle}>{isSignup ? "Create Your Account" : "Welcome Back"}</h2>
        <p style={subtitleStyle}>
          {isSignup
            ? "Sign up to save sorting runs and view your algorithm analytics."
            : "Login to continue your sorting practice dashboard."}
        </p>

        <ToggleRow>
          <ModeButton
            type="button"
            $active={mode === "login"}
            onClick={() => setMode("login")}
          >
            Login
          </ModeButton>
          <ModeButton
            type="button"
            $active={mode === "signup"}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </ModeButton>
        </ToggleRow>

        <FormSection onSubmit={handleSubmit}>
          {isSignup ? (
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              variant="outlined"
              size="small"
              required
              style={inputStyle}
            />
          ) : null}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            variant="outlined"
            size="small"
            required
            style={inputStyle}
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            variant="outlined"
            size="small"
            required
            style={inputStyle}
            helperText={isSignup ? "Use at least 6 characters" : ""}
          />

          {error ? <div style={errorStyle}>{error}</div> : null}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            style={submitStyle}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Login"}
          </Button>
        </FormSection>

        <GoogleWrap>
          <Divider style={{ marginBottom: "10px", marginTop: "14px" }} />
          <GoogleButtonHost ref={googleButtonRef} />
          {!googleReady || googleStatusMessage ? (
            <div style={helperStyle}>{googleStatusMessage || "Loading Google sign-in..."}</div>
          ) : null}
        </GoogleWrap>
      </Panel>
    </Wrap>
  );
}