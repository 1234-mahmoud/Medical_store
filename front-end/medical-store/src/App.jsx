import { useEffect, useMemo, useState } from "react";
import API from "./api";

import AuthPage     from "../components/AuthPage";
import Header       from "../components/Header";
import TabNav       from "../components/TabNav";
import DashboardPage from "../pages/DashboardPage";
import UsersPage    from "../pages/UsersPage";
import MedicinesPage from "../pages/MedicinesPage";
import SuppliersPage from "../pages/SuppliersPage";
import SalesPage    from "../pages/SalesPage";

export default function App() {
  // ── Auth state ────────────────────────────────────────────────────────────
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  });

  // ── Data state ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers]         = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // ── Data loading ──────────────────────────────────────────────────────────
  async function loadAll() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [u, m, s, sa] = await Promise.all([
        API.get("/users"),
        API.get("/medicines"),
        API.get("/suppliers"),
        API.get("/sales"),
      ]);
      setUsers(u.data);
      setMedicines(m.data);
      setSuppliers(s.data);
      setSales(sa.data);
    } catch (err) {
      if (err.response?.status === 401) { logout(); return; }
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, [token]);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  function handleLogin(nextToken, user) {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("currentUser", JSON.stringify(user));
    setToken(nextToken);
    setCurrentUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken("");
    setCurrentUser(null);
    setUsers([]); setMedicines([]); setSuppliers([]); setSales([]);
  }

  // ── Permissions ───────────────────────────────────────────────────────────
  const canManageAll      = currentUser?.role === "Admin";
  const canManageMedicines =
    currentUser?.role === "Admin" || currentUser?.role === "Pharmacist";

  // ── Dashboard stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => [
    { title: "Users",     value: users.length },
    { title: "Medicines", value: medicines.length },
    { title: "Suppliers", value: suppliers.length },
    { title: "Sales",     value: sales.length },
  ], [users.length, medicines.length, suppliers.length, sales.length]);

  // ── Guard: unauthenticated ─────────────────────────────────────────────────
  if (!token) return <AuthPage onLogin={handleLogin} />;

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header currentUser={currentUser} onLogout={logout} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {error   && <p className="mb-4 rounded-lg bg-red-500/15 p-3 text-red-300">{error}</p>}
        {loading && <p className="mb-4 text-slate-300">Loading…</p>}

        {activeTab === "dashboard" && <DashboardPage stats={stats} />}

        {activeTab === "users" && (
          <UsersPage
            users={users}
            canManage={canManageAll}
            onRefresh={loadAll}
          />
        )}

        {activeTab === "medicines" && (
          <MedicinesPage
            medicines={medicines}
            canManage={canManageMedicines}
            onRefresh={loadAll}
          />
        )}

        {activeTab === "suppliers" && (
          <SuppliersPage
            suppliers={suppliers}
            canManage={canManageAll}
            onRefresh={loadAll}
          />
        )}

        {activeTab === "sales" && (
          <SalesPage
            sales={sales}
            canManage={canManageAll}
            onRefresh={loadAll}
          />
        )}
      </main>
    </div>
  );
}
