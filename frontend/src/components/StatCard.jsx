export default function StatCard({ label, value, icon, accent = "brand", hint }) {
  const accents = {
    brand: "from-brand-500 to-brand-700 text-white",
    emerald: "from-emerald-400 to-emerald-600 text-white",
    amber: "from-amber-400 to-amber-600 text-white",
    rose: "from-rose-400 to-rose-600 text-white",
    sky: "from-sky-400 to-sky-600 text-white",
  };

  return (
    <div className="card flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center text-xl font-bold shadow-md`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-slate-500">{label}</div>
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {hint && <div className="text-xs text-slate-400 mt-0.5">{hint}</div>}
      </div>
    </div>
  );
}
