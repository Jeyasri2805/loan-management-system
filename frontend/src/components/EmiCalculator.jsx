import { useMemo, useState } from "react";

function calcEmi(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (!principal || !months) return 0;
  if (r === 0) return principal / months;
  const emi = (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return emi;
}

export default function EmiCalculator() {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(10);
  const [months, setMonths] = useState(12);

  const { emi, total, interest } = useMemo(() => {
    const e = calcEmi(Number(amount), Number(rate), Number(months));
    const t = e * months;
    return { emi: e, total: t, interest: t - amount };
  }, [amount, rate, months]);

  const fmt = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800">EMI Calculator</h3>
        <span className="text-xs text-slate-400">Quick estimate</span>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Loan Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            min="0"
          />
        </div>
        <div>
          <label className="label">Interest (% / year)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="input"
            step="0.1"
            min="0"
          />
        </div>
        <div>
          <label className="label">Tenure (months)</label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="input"
          >
            <option value={6}>6 Months</option>
            <option value={12}>1 Year</option>
            <option value={24}>2 Years</option>
            <option value={60}>5 Years</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        <Mini label="Monthly EMI" value={fmt(emi)} accent="bg-brand-50 text-brand-700" />
        <Mini label="Total Interest" value={fmt(interest)} accent="bg-amber-50 text-amber-700" />
        <Mini label="Total Payment" value={fmt(total)} accent="bg-emerald-50 text-emerald-700" />
      </div>
    </div>
  );
}

function Mini({ label, value, accent }) {
  return (
    <div className={`p-4 rounded-xl ${accent}`}>
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
