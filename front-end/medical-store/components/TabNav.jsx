const tabs = ["dashboard", "users", "medicines", "suppliers", "sales"];

/**
 * TabNav
 * Props:
 *   activeTab    – currently selected tab string
 *   onTabChange  – callback(tabName)
 */
export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
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
  );
}
