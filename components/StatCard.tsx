type Props = {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
};

export function StatCard({ label, value, sub, positive }: Props) {
  const valueColor =
    positive === true
      ? "var(--green)"
      : positive === false
        ? "var(--red)"
        : "var(--text)";

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold tracking-tight font-mono"
        style={{ color: valueColor }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
