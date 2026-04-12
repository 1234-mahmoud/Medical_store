import { useState } from "react";
import API from "../src/api";
import {
  FormCard, Input, Select, SubmitButton, CancelButton,
  TableWrap, Th, Td, EditButton, DeleteButton,
} from "../components/UI";

/**
 * UsersPage
 * Props:
 *   users       – array of user objects
 *   canManage   – boolean (Admin only)
 *   onRefresh() – reload data from parent
 */
export default function UsersPage({ users, canManage, onRefresh }) {
  const [form, setForm] = useState({ username: "", password: "", role: "Cashier" });
  const [editingId, setEditingId] = useState(null);

  function patch(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ username: "", password: "", role: "Cashier" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/users/${editingId}`, form);
      } else {
        await API.post("/users", form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save user");
    }
  }

  function startEdit(user) {
    setEditingId(user.userId);
    setForm({ username: user.username, password: "", role: user.role });
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/users/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <section className="space-y-4">
      {canManage && (
        <FormCard
          title={editingId ? "Edit User" : "Add User"}
          onSubmit={handleSubmit}
        >
          <Input
            value={form.username}
            onChange={(v) => patch("username", v)}
            placeholder="Username"
          />
          <Input
            type="password"
            value={form.password}
            onChange={(v) => patch("password", v)}
            placeholder={editingId ? "New password (optional)" : "Password"}
          />
          <Select
            value={form.role}
            onChange={(v) => patch("role", v)}
            options={["Admin", "Pharmacist", "Cashier"]}
          />
          <SubmitButton label={editingId ? "Update User" : "Save User"} />
          {editingId && <CancelButton onClick={cancelEdit} />}
        </FormCard>
      )}

      <TableWrap>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <Th>ID</Th>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId} className="border-t border-slate-800">
                <Td>{u.userId}</Td>
                <Td>{u.username}</Td>
                <Td>{u.role}</Td>
                <Td>
                  <div className="flex gap-2">
                    {canManage && <EditButton onClick={() => startEdit(u)} />}
                    {canManage && (
                      <DeleteButton onClick={() => handleDelete(u.userId)} />
                    )}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
    </section>
  );
}
