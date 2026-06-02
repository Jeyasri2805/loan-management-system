export default function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-700",
    Approved: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`badge ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
