import { useState } from "react";
import { signUp, logIn, resetPassword } from "./firebase";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setInfo(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) { setError("Enter an email and password."); return; }
    if (mode === "signup" && !username.trim()) { setError("Choose a username."); return; }
    setBusy(true);
    const result = mode === "signup" ? await signUp(trimmedEmail, password, username) : await logIn(trimmedEmail, password);
    setBusy(false);
    if (result.error) setError(result.error);
  }

  async function handleForgotPassword() {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) { setError("Enter your email above first, then tap \"Forgot password?\"."); return; }
    setError(null);
    setInfo(null);
    setBusy(true);
    const result = await resetPassword(trimmedEmail);
    setBusy(false);
    if (result.error) setError(result.error);
    else setInfo("Password reset email sent — check your inbox.");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#141C27", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#EDE4D3", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 360, background: "#232E3D", border: "1px solid #33414F", borderRadius: 16, padding: 28 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, fontFamily: "Georgia, serif", textAlign: "center" }}>Quest Log</h1>
        <p style={{ margin: "0 0 22px", fontSize: 12, color: "#8A8578", textAlign: "center" }}>{mode === "signup" ? "Create an account to start your quest." : "Log in to continue your quest."}</p>

        <div style={{ display: "flex", gap: 6, marginBottom: 18, background: "#1F2836", borderRadius: 10, padding: 4 }}>
          <button type="button" onClick={() => { setMode("login"); setError(null); setInfo(null); }} style={{ flex: 1, background: mode === "login" ? "#C9A227" : "transparent", color: mode === "login" ? "#1B2430" : "#8A8578", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Log In</button>
          <button type="button" onClick={() => { setMode("signup"); setError(null); setInfo(null); }} style={{ flex: 1, background: mode === "signup" ? "#C9A227" : "transparent", color: mode === "signup" ? "#1B2430" : "#8A8578", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Sign Up</button>
        </div>

        <form onSubmit={submit}>
          <label style={{ display: "block", fontSize: 11, color: "#8A8578", marginBottom: 5 }}>Email</label>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", marginBottom: 14, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14 }} />

          {mode === "signup" && (<>
            <label style={{ display: "block", fontSize: 11, color: "#8A8578", marginBottom: 5 }}>Username</label>
            <input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="letters, numbers, underscores" style={{ width: "100%", marginBottom: 14, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14 }} />
          </>)}

          <label style={{ display: "block", fontSize: 11, color: "#8A8578", marginBottom: 5 }}>Password</label>
          <input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"} style={{ width: "100%", marginBottom: 8, background: "#141C27", border: "1px solid #33414F", borderRadius: 8, padding: "10px 12px", color: "#EDE4D3", fontSize: 14 }} />

          {mode === "login" && (
            <button type="button" onClick={handleForgotPassword} disabled={busy} style={{ background: "none", border: "none", color: "#8A8578", fontSize: 11, cursor: "pointer", padding: 0, marginBottom: 14, textDecoration: "underline" }}>Forgot password?</button>
          )}
          {mode === "signup" && <div style={{ marginBottom: 14 }} />}

          {error && <p style={{ fontSize: 12, color: "#C1652B", margin: "0 0 14px" }}>{error}</p>}
          {info && <p style={{ fontSize: 12, color: "#4C9A6A", margin: "0 0 14px" }}>{info}</p>}

          <button type="submit" disabled={busy} className="qlog-btn" style={{ width: "100%", background: "#C9A227", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, fontSize: 14, color: "#1B2430", cursor: busy ? "default" : "pointer", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Please wait..." : mode === "signup" ? "Create Account" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
