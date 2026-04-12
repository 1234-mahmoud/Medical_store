import { useState } from "react";
import API from "../src/api";
import { Input, Select } from "../components/UI";

/**
 * AuthPage
 * Props:
 *   onLogin(token, user) – called after successful login or register
 */
export default function AuthPage({ onLogin }) {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    role: "Cashier",
  });
  const [error, setError] = useState("");

  async function submitAuth(e) {
    e.preventDefault();
    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        authMode === "login"
          ? { username: authForm.username, password: authForm.password }
          : authForm;
      const res = await API.post(path, payload);
      onLogin(res.data.token, res.data.user);
      setAuthForm({ username: "", password: "", role: "Cashier" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold mb-1">MedStore Auth</h1>
        <p className="text-slate-400 text-sm mb-4">
          {authMode === "login" ? "Login to continue" : "Create first account"}
        </p>

        {error && (
          <p className="mb-3 rounded bg-red-500/15 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <form onSubmit={submitAuth} className="space-y-3">
          <Input
            value={authForm.username}
            onChange={(v) => setAuthForm({ ...authForm, username: v })}
            placeholder="Username"
          />
          <Input
            type="password"
            value={authForm.password}
            onChange={(v) => setAuthForm({ ...authForm, password: v })}
            placeholder="Password"
          />
          {authMode === "register" && (
            <Select
              value={authForm.role}
              onChange={(v) => setAuthForm({ ...authForm, role: v })}
              options={["Admin", "Pharmacist", "Cashier"]}
            />
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-900 hover:bg-emerald-400"
          >
            {authMode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() =>
            setAuthMode(authMode === "login" ? "register" : "login")
          }
          className="mt-3 text-sm text-emerald-400 hover:text-emerald-300"
        >
          {authMode === "login"
            ? "No account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
