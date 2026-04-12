// ─── Primitive UI Components ───────────────────────────────────────────────

export function Input({ type = "text", value, onChange, placeholder }) {
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

export function Select({ value, onChange, options }) {
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

export function SubmitButton({ label = "Save" }) {
  return (
    <button
      type="submit"
      className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
    >
      {label}
    </button>
  );
}

export function CancelButton({ onClick }) {
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

export function DeleteButton({ onClick }) {
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

export function EditButton({ onClick }) {
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

export function FormCard({ title, onSubmit, children }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900 p-4"
    >
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </form>
  );
}

export function TableWrap({ children }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Th({ children }) {
  return (
    <th className="px-4 py-3 text-left font-semibold text-slate-300 whitespace-nowrap">
      {children}
    </th>
  );
}

export function Td({ children }) {
  return <td className="px-4 py-3 whitespace-nowrap">{children}</td>;
}
