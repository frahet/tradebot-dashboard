import Link from "next/link";

export function Nav() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-base tracking-tight"
          style={{ color: "var(--text)" }}
        >
          <span style={{ color: "var(--accent-hi)" }}>⚡</span>
          <span>tradebot</span>
          <span
            className="text-xs font-normal ml-1 px-2 py-0.5 rounded-full"
            style={{
              background: "var(--bg-raised)",
              color: "var(--text-muted)",
              border: "1px solid var(--border)",
            }}
          >
            dashboard
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link href="/" className="nav-link">Overview</Link>
          <Link href="/trades" className="nav-link">Trades</Link>
          <a
            href="https://huginn.huginndigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Ops console ↗
          </a>
        </nav>
      </div>

      <style>{`
        .nav-link {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-sec);
          text-decoration: none;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover {
          background: var(--bg-raised);
          color: var(--text);
        }
      `}</style>
    </header>
  );
}
