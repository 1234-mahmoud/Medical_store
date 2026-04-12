/**
 * DashboardPage
 * Props:
 *   stats – [{ title, value }]
 */
export default function DashboardPage({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4"
        >
          <p className="text-slate-400 text-sm">{item.title}</p>
          <p className="text-3xl font-bold mt-1">{item.value}</p>
        </div>
      ))}
    </section>
  );
}
