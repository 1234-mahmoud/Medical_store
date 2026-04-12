import { useState } from "react";
import API from "../src/api";
import {
  FormCard, Input, SubmitButton, CancelButton,
  TableWrap, Th, Td, EditButton, DeleteButton,
} from "../components/UI";

const EMPTY = { customer_name: "", date: "", total_amount: "" };

/**
 * SalesPage
 * Props:
 *   sales       – array of sale objects
 *   canManage   – boolean (Admin only)
 *   onRefresh() – reload data from parent
 */
export default function SalesPage({ sales, canManage, onRefresh }) {
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
        await API.put(`/sales/${editingId}`, form);
      } else {
        await API.post("/sales", form);
      }
      cancelEdit();
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save sale");
    }
  }

  function startEdit(s) {
    setEditingId(s.sale_id);
    setForm({
      customer_name: s.customer_name,
      date: s.date?.slice(0, 10) || "",
      total_amount: String(s.total_amount),
    });
  }

  async function handleDelete(id) {
    try {
      await API.delete(`/sales/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  }

  return (
    <section className="space-y-4">
      {canManage && (
        <FormCard
          title={editingId ? "Edit Sale" : "Add Sale"}
          onSubmit={handleSubmit}
        >
          <Input
            value={form.customer_name}
            onChange={(v) => patch("customer_name", v)}
            placeholder="Customer Name"
          />
          <Input type="date" value={form.date} onChange={(v) => patch("date", v)} />
          <Input
            type="number"
            value={form.total_amount}
            onChange={(v) => patch("total_amount", v)}
            placeholder="Total Amount"
          />
          <SubmitButton label={editingId ? "Update Sale" : "Save Sale"} />
          {editingId && <CancelButton onClick={cancelEdit} />}
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
                <Td>{s.sale_id}</Td>
                <Td>{s.customer_name}</Td>
                <Td>{s.date?.slice(0, 10)}</Td>
                <Td>{s.total_amount}</Td>
                <Td>
                  <div className="flex gap-2">
                    {canManage && <EditButton onClick={() => startEdit(s)} />}
                    {canManage && <DeleteButton onClick={() => handleDelete(s.sale_id)} />}
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
