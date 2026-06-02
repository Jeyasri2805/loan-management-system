import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pie, Bar } from "react-chartjs-2";
import "../components/charts";
import { PIE_COLORS } from "../components/charts";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/loans/admin/stats/"), api.get("/loans/admin/all/")])
      .then(([s, l]) => {
        setStats(s.data);
        setRecent(l.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  const statusPie = {
    labels: ["Pending", "Approved", "Rejected"],
    datasets: [
      {
        data: [
          stats?.pending || 0,
          stats?.approved || 0,
          stats?.rejected || 0,
        ],
        backgroundColor: ["#f59e0b", "#10b981", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const byType = stats?.by_type || [];
  const typeBar = {
    labels: byType.map((b) => b.loan_type.replace(" Loan", "")),
    datasets: [
      {
        label: "Applications",
        data: byType.map((b) => b.count),
        backgroundColor: PIE_COLORS,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="admin" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="card bg-gradient-to-br from-slate-800 to-slate-950 text-white border-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Admin Dashboard 🛡️</h2>
          <p className="opacity-90 mt-1">
            Monitor applications and approve loans in one place.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Applications" value={stats?.total_applications ?? 0} icon="📄" accent="brand" />
          <StatCard label="Approved" value={stats?.approved ?? 0} icon="✅" accent="emerald" />
          <StatCard label="Pending" value={stats?.pending ?? 0} icon="⏳" accent="amber" />
          <StatCard label="Rejected" value={stats?.rejected ?? 0} icon="❌" accent="rose" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <StatCard label="Total Disbursed Amount" value={fmtINR(stats?.total_amount)} icon="💰" accent="sky" />
          <StatCard label="Total Repaid" value={fmtINR(stats?.total_paid)} icon="💳" accent="emerald" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card">
            <h3 className="font-bold text-slate-800 mb-3">Status Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie data={statusPie} options={{ plugins: { legend: { position: "bottom" } } }} />
            </div>
          </div>
          <div className="card lg:col-span-2">
            <h3 className="font-bold text-slate-800 mb-3">Loan Distribution by Type</h3>
            <div className="h-64">
              {byType.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No applications yet
                </div>
              ) : (
                <Bar
                  data={typeBar}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Recent Applications</h3>
            <Link to="/admin/applications" className="text-sm text-brand-700 hover:underline">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No applications yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b border-slate-100">
                  <tr>
                    <Th>Applicant</Th>
                    <Th>Loan Type</Th>
                    <Th>Amount</Th>
                    <Th>Tenure</Th>
                    <Th>Status</Th>
                    <Th>Date</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((l) => (
                    <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <Td>
                        <div className="font-semibold text-slate-800">{l.full_name}</div>
                        <div className="text-xs text-slate-500">{l.email}</div>
                      </Td>
                      <Td>{l.loan_type}</Td>
                      <Td>{fmtINR(l.loan_amount)}</Td>
                      <Td>{l.tenure_months} mo</Td>
                      <Td><StatusBadge status={l.status} /></Td>
                      <Td>{new Date(l.created_at).toLocaleDateString()}</Td>
                      <Td>
                        <Link to={`/admin/applications/${l.id}`} className="text-brand-700 hover:underline text-xs font-semibold">
                          View
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="py-2 pr-4 font-semibold text-xs uppercase tracking-wide">{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`py-3 pr-4 text-slate-700 ${className}`}>{children}</td>
);
