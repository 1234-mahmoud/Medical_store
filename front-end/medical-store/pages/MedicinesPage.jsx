import { useState } from "react";
import API from "../src/api";
import {
  FormCard, Input, SubmitButton, CancelButton,
  TableWrap, Th, Td, EditButton, DeleteButton,
} from "../components/UI";

const EMPTY = {
  name: "", category: "", batch_number: "",
  expiry_date: "", price: "", quantity: "",
};

/**
 * MedicinesPage
 * Props:
 *   medicines   – array of medicine objects
 *   canManage   – boolean (Admin or Pharmacist)
 *   onRefresh() – reload data from parent
 */
export default function MedicinesPage({ medicines, canManage, onRefresh }) {
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
        await API.put(`/medicines/${editingId}`, form);
      } else {
        await API.post("/medicines", form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save medicine");
    }
  }

  function startEdit(m) {
    setEditingId(m.medicine_id);
    setForm({
      name: m.name,
      category: m.category,
      batch_number: m.batch_number,
      expiry_date: m.expiry_date?.slice(0, 10) || "",
      price: String(m.price),
      quantity: String(m.quantity),
    });
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/medicines/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <section className="space-y-4">
      {canManage && (
        <FormCard
          title={editingId ? "Edit Medicine" : "Add Medicine"}
          onSubmit={handleSubmit}
        >
          <Input value={form.name}         onChange={(v) => patch("name", v)}         placeholder="Name" />
          <Input value={form.category}     onChange={(v) => patch("category", v)}     placeholder="Category" />
          <Input value={form.batch_number} onChange={(v) => patch("batch_number", v)} placeholder="Batch Number" />
          <Input type="date" value={form.expiry_date} onChange={(v) => patch("expiry_date", v)} />
          <Input type="number" value={form.price}    onChange={(v) => patch("price", v)}    placeholder="Price" />
          <Input type="number" value={form.quantity} onChange={(v) => patch("quantity", v)} placeholder="Quantity" />
          <SubmitButton label={editingId ? "Update Medicine" : "Save Medicine"} />
          {editingId && <CancelButton onClick={cancelEdit} />}
        </FormCard>
      )}

      <TableWrap>
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <Th>ID</Th><Th>Name</Th><Th>Category</Th>
              <Th>Batch</Th><Th>Expiry</Th><Th>Price</Th><Th>Qty</Th><Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.medicine_id} className="border-t border-slate-800">
                <Td>{m.medicine_id}</Td>
                <Td>{m.name}</Td>
                <Td>{m.category}</Td>
                <Td>{m.batch_number}</Td>
                <Td>{m.expiry_date?.slice(0, 10)}</Td>
                <Td>{m.price}</Td>
                <Td>{m.quantity}</Td>
                <Td>
                  <div className="flex gap-2">
                    {canManage && <EditButton onClick={() => startEdit(m)} />}
                    {canManage && <DeleteButton onClick={() => handleDelete(m.medicine_id)} />}
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
