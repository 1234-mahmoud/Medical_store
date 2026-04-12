/**
 * Header
 * Props:
 *   currentUser  – { username, role }
 *   onLogout()   – callback to clear session
 */
export default function Header({ currentUser, onLogout }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/70 sticky top-0 z-10 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Medical Store</h1>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 rounded bg-slate-800 px-2 py-1">
            {currentUser?.username} ({currentUser?.role})
          </span>
          <button
            onClick={onLogout}
            className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
