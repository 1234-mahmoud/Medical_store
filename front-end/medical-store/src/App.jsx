
import { useEffect, useMemo, useState } from "react";
import API from "./api";

const tabs = ["dashboard", "users", "medicines", "suppliers", "sales"];

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  });
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    username: "",
    password: "",
    role: "Cashier",
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    role: "Cashier",
  });
  const [medicineForm, setMedicineForm] = useState({
    name: "",
    category: "",
    batch_number: "",
    expiry_date: "",
    price: "",
    quantity: "",
  });
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [saleForm, setSaleForm] = useState({
    customer_name: "",
    date: "",
    total_amount: "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingMedicineId, setEditingMedicineId] = useState(null);
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [editingSaleId, setEditingSaleId] = useState(null);

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
      if (err.response?.status === 401) {
        logout();
        return;
      }
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, [token]);

  async function submitAuth(e) {
    e.preventDefault();
    try {
      const path = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        authMode === "login"
          ? { username: authForm.username, password: authForm.password }
          : authForm;
      const res = await API.post(path, payload);
      const nextToken = res.data.token;
      const user = res.data.user;
      localStorage.setItem("token", nextToken);
      localStorage.setItem("currentUser", JSON.stringify(user));
      setToken(nextToken);
      setCurrentUser(user);
      setAuthForm({ username: "", password: "", role: "Cashier" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken("");
    setCurrentUser(null);
    setUsers([]);
    setMedicines([]);
    setSuppliers([]);
    setSales([]);
  }

  const stats = useMemo(
    () => [
      { title: "Users", value: users.length },
      { title: "Medicines", value: medicines.length },
      { title: "Suppliers", value: suppliers.length },
      { title: "Sales", value: sales.length },
    ],
    [users.length, medicines.length, suppliers.length, sales.length]
  );
  const canManageAll = currentUser?.role === "Admin";
  const canManageMedicines =
    currentUser?.role === "Admin" || currentUser?.role === "Pharmacist";

  async function addUser(e) {
    e.preventDefault();
    try {
      if (editingUserId) {
        await API.put(`/users/${editingUserId}`, userForm);
      } else {
        await API.post("/users", userForm);
      }
      setUserForm({ username: "", password: "", role: "Cashier" });
      setEditingUserId(null);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user");
    }
  }

  async function addMedicine(e) {
    e.preventDefault();
    try {
      if (editingMedicineId) {
        await API.put(`/medicines/${editingMedicineId}`, medicineForm);
      } else {
        await API.post("/medicines", medicineForm);
      }
      setMedicineForm({
        name: "",
        category: "",
        batch_number: "",
        expiry_date: "",
        price: "",
        quantity: "",
      });
      setEditingMedicineId(null);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save medicine");
    }
  }

  async function addSupplier(e) {
    e.preventDefault();
    try {
      if (editingSupplierId) {
        await API.put(`/suppliers/${editingSupplierId}`, supplierForm);
      } else {
        await API.post("/suppliers", supplierForm);
      }
      setSupplierForm({ name: "", contact: "", address: "" });
      setEditingSupplierId(null);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save supplier");
    }
  }

  async function addSale(e) {
    e.preventDefault();
    try {
      if (editingSaleId) {
        await API.put(`/sales/${editingSaleId}`, saleForm);
      } else {
        await API.post("/sales", saleForm);
      }
      setSaleForm({ customer_name: "", date: "", total_amount: "" });
      setEditingSaleId(null);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save sale");
    }
  }

  async function removeItem(type, id) {
    try {
      await API.delete(`/${type}/${id}`);
      loadAll();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  async function editUser(user) {
    if (!canManageAll) return;
    setEditingUserId(user.userId);
    setUserForm({ username: user.username, password: "", role: user.role });
  }

  async function editMedicine(medicine) {
    if (!canManageMedicines) return;
    setEditingMedicineId(medicine.medicine_id);
    setMedicineForm({
      name: medicine.name,
      category: medicine.category,
      batch_number: medicine.batch_number,
      expiry_date: medicine.expiry_date?.slice(0, 10) || "",
      price: String(medicine.price),
      quantity: String(medicine.quantity),
    });
  }

  async function editSupplier(supplier) {
    if (!canManageAll) return;
    setEditingSupplierId(supplier.supplier_id);
    setSupplierForm({
      name: supplier.name,
      contact: supplier.contact,
      address: supplier.address,
    });
  }

  async function editSale(sale) {
    if (!canManageAll) return;
    setEditingSaleId(sale.sale_id);
    setSaleForm({
      customer_name: sale.customer_name,
      date: sale.date?.slice(0, 10) || "",
      total_amount: String(sale.total_amount),
    });
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center p-4">
        <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold mb-1">MedStore Auth</h1>
          <p className="text-slate-400 text-sm mb-4">
            {authMode === "login" ? "Login to continue" : "Create first account"}
          </p>
          {error && <p className="mb-3 rounded bg-red-500/15 px-3 py-2 text-sm text-red-300">{error}</p>}
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
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/70 sticky top-0 z-10 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Medical Store</h1>
          
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 rounded bg-slate-800 px-2 py-1">
              {currentUser?.username} ({currentUser?.role})
            </span>
            <button
              onClick={logout}
              className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
                activeTab === tab
                  ? "bg-emerald-500 text-slate-900"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-500/15 p-3 text-red-300">{error}</p>}
        {loading && <p className="mb-4 text-slate-300">Loading...</p>}

        {activeTab === "dashboard" && (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                <p className="text-slate-400 text-sm">{item.title}</p>
                <p className="text-3xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </section>
        )}

        {activeTab === "users" && (
          <section className="space-y-4">
            {canManageAll && (
              <FormCard
                title={editingUserId ? "Edit User" : "Add User"}
                onSubmit={addUser}
              >
                <Input value={userForm.username} onChange={(v) => setUserForm({ ...userForm, username: v })} placeholder="Username" />
                <Input type="password" value={userForm.password} onChange={(v) => setUserForm({ ...userForm, password: v })} placeholder={editingUserId ? "New password (optional)" : "Password"} />
                <Select value={userForm.role} onChange={(v) => setUserForm({ ...userForm, role: v })} options={["Admin", "Pharmacist", "Cashier"]} />
                <SubmitButton label={editingUserId ? "Update User" : "Save User"} />
                {editingUserId && (
                  <CancelButton
                    onClick={() => {
                      setEditingUserId(null);
                      setUserForm({ username: "", password: "", role: "Cashier" });
                    }}
                  />
                )}
              </FormCard>
            )}
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800">
                  <tr>
                    <Th>ID</Th><Th>Username</Th><Th>Role</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.userId} className="border-t border-slate-800">
                      <Td>{u.userId}</Td><Td>{u.username}</Td><Td>{u.role}</Td>
                      <Td>
                        <div className="flex gap-2">
                          {canManageAll && <EditButton onClick={() => editUser(u)} />}
                          {canManageAll && <DeleteButton onClick={() => removeItem("users", u.userId)} />}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </section>
        )}

        {activeTab === "medicines" && (
          <section className="space-y-4">
            {canManageMedicines && (
              <FormCard
                title={editingMedicineId ? "Edit Medicine" : "Add Medicine"}
                onSubmit={addMedicine}
              >
                <Input value={medicineForm.name} onChange={(v) => setMedicineForm({ ...medicineForm, name: v })} placeholder="Name" />
                <Input value={medicineForm.category} onChange={(v) => setMedicineForm({ ...medicineForm, category: v })} placeholder="Category" />
                <Input value={medicineForm.batch_number} onChange={(v) => setMedicineForm({ ...medicineForm, batch_number: v })} placeholder="Batch Number" />
                <Input type="date" value={medicineForm.expiry_date} onChange={(v) => setMedicineForm({ ...medicineForm, expiry_date: v })} />
                <Input type="number" value={medicineForm.price} onChange={(v) => setMedicineForm({ ...medicineForm, price: v })} placeholder="Price" />
                <Input type="number" value={medicineForm.quantity} onChange={(v) => setMedicineForm({ ...medicineForm, quantity: v })} placeholder="Quantity" />
                <SubmitButton label={editingMedicineId ? "Update Medicine" : "Save Medicine"} />
                {editingMedicineId && (
                  <CancelButton
                    onClick={() => {
                      setEditingMedicineId(null);
                      setMedicineForm({
                        name: "",
                        category: "",
                        batch_number: "",
                        expiry_date: "",
                        price: "",
                        quantity: "",
                      });
                    }}
                  />
                )}
              </FormCard>
            )}
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800">
                  <tr>
                    <Th>ID</Th><Th>Name</Th><Th>Category</Th><Th>Batch</Th><Th>Expiry</Th><Th>Price</Th><Th>Qty</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((m) => (
                    <tr key={m.medicine_id} className="border-t border-slate-800">
                      <Td>{m.medicine_id}</Td><Td>{m.name}</Td><Td>{m.category}</Td><Td>{m.batch_number}</Td>
                      <Td>{m.expiry_date?.slice(0, 10)}</Td><Td>{m.price}</Td><Td>{m.quantity}</Td>
                      <Td>
                        <div className="flex gap-2">
                          {canManageMedicines && <EditButton onClick={() => editMedicine(m)} />}
                          {canManageMedicines && <DeleteButton onClick={() => removeItem("medicines", m.medicine_id)} />}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </section>
        )}

        {activeTab === "suppliers" && (
          <section className="space-y-4">
            {canManageAll && (
              <FormCard
                title={editingSupplierId ? "Edit Supplier" : "Add Supplier"}
                onSubmit={addSupplier}
              >
                <Input value={supplierForm.name} onChange={(v) => setSupplierForm({ ...supplierForm, name: v })} placeholder="Name" />
                <Input value={supplierForm.contact} onChange={(v) => setSupplierForm({ ...supplierForm, contact: v })} placeholder="Contact" />
                <Input value={supplierForm.address} onChange={(v) => setSupplierForm({ ...supplierForm, address: v })} placeholder="Address" />
                <SubmitButton label={editingSupplierId ? "Update Supplier" : "Save Supplier"} />
                {editingSupplierId && (
                  <CancelButton
                    onClick={() => {
                      setEditingSupplierId(null);
                      setSupplierForm({ name: "", contact: "", address: "" });
                    }}
                  />
                )}
              </FormCard>
            )}
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800">
                  <tr>
                    <Th>ID</Th><Th>Name</Th><Th>Contact</Th><Th>Address</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.supplier_id} className="border-t border-slate-800">
                      <Td>{s.supplier_id}</Td><Td>{s.name}</Td><Td>{s.contact}</Td><Td>{s.address}</Td>
                      <Td>
                        <div className="flex gap-2">
                          {canManageAll && <EditButton onClick={() => editSupplier(s)} />}
                          {canManageAll && <DeleteButton onClick={() => removeItem("suppliers", s.supplier_id)} />}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </section>
        )}

        {activeTab === "sales" && (
          <section className="space-y-4">
            {canManageAll && (
              <FormCard
                title={editingSaleId ? "Edit Sale" : "Add Sale"}
                onSubmit={addSale}
              >
                <Input value={saleForm.customer_name} onChange={(v) => setSaleForm({ ...saleForm, customer_name: v })} placeholder="Customer Name" />
                <Input type="date" value={saleForm.date} onChange={(v) => setSaleForm({ ...saleForm, date: v })} />
                <Input type="number" value={saleForm.total_amount} onChange={(v) => setSaleForm({ ...saleForm, total_amount: v })} placeholder="Total Amount" />
                <SubmitButton label={editingSaleId ? "Update Sale" : "Save Sale"} />
                {editingSaleId && (
                  <CancelButton
                    onClick={() => {
                      setEditingSaleId(null);
                      setSaleForm({ customer_name: "", date: "", total_amount: "" });
                    }}
                  />
                )}
              </FormCard>
            )}
            <TableWrap>
              <table className="min-w-full text-sm">
                <thead className="bg-slate-800">
                  <tr>
                    <Th>ID</Th><Th>Customer</Th><Th>Date</Th><Th>Total</Th><Th>Action</Th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.sale_id} className="border-t border-slate-800">
                      <Td>{s.sale_id}</Td><Td>{s.customer_name}</Td><Td>{s.date?.slice(0, 10)}</Td><Td>{s.total_amount}</Td>
                      <Td>
                        <div className="flex gap-2">
                          {canManageAll && <EditButton onClick={() => editSale(s)} />}
                          {canManageAll && <DeleteButton onClick={() => removeItem("sales", s.sale_id)} />}
                        </div>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          </section>
        )}
      </main>
    </div>
  );
}

function FormCard({ title, onSubmit, children }) {
  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </form>
  );
}

function Input({ type = "text", value, onChange, placeholder }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-emerald-500"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SubmitButton({ label = "Save" }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
    >
      {label}
    </button>
  );
}

function CancelButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-600"
    >
      Cancel
    </button>
  );
}

function DeleteButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500/30"
    >
      Delete
    </button>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-500/30"
    >
      Edit
    </button>
  );
}

function TableWrap({ children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left font-semibold text-slate-300 whitespace-nowrap">{children}</th>;
}

function Td({ children }) {
  return <td className="px-4 py-3 whitespace-nowrap">{children}</td>;
}

export default App;
