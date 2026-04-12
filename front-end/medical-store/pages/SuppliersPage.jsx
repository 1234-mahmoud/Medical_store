import { useState } from "react";
import API from "../src/api";
import {
  FormCard, Input, SubmitButton, CancelButton,
  TableWrap, Th, Td, EditButton, DeleteButton,
} from "../components/UI";

const EMPTY = { name: "", contact: "", address: "" };

/**
 * SuppliersPage
 * Props:
 *   suppliers   – array of supplier objects
 *   canManage   – boolean (Admin only)
 *   onRefresh() – reload data from parent
 */
export default function SuppliersPage({ suppliers, canManage, onRefresh }) {
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);

  function patch(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/suppliers/${editingId}`, form);
      } else {
        await API.post("/suppliers", form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save supplier");
    }
  }

  function startEdit(s) {
    setEditingId(s.supplier_id);
    setForm({ name: s.name, contact: s.contact, address: s.address });
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/suppliers/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <section className="space-y-4">
      {canManage && (
        <FormCard
          title={editingId ? "Edit Supplier" : "Add Supplier"}
          onSubmit={handleSubmit}
        >
          <Input value={form.name}    onChange={(v) => patch("name", v)}    placeholder="Name" />
          <Input value={form.contact} onChange={(v) => patch("contact", v)} placeholder="Contact" />
          <Input value={form.address} onChange={(v) => patch("address", v)} placeholder="Address" />
          <SubmitButton label={editingId ? "Update Supplier" : "Save Supplier"} />
          {editingId && <CancelButton onClick={cancelEdit} />}
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
                <Td>{s.supplier_id}</Td>
                <Td>{s.name}</Td>
                <Td>{s.contact}</Td>
                <Td>{s.address}</Td>
                <Td>
                  <div className="flex gap-2">
                    {canManage && <EditButton onClick={() => startEdit(s)} />}
                    {canManage && <DeleteButton onClick={() => handleDelete(s.supplier_id)} />}
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
