import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-white">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
            L
          </div>
          <div>
            <div className="font-bold text-slate-800 text-lg">LoanPro</div>
            <div className="text-xs text-slate-500 -mt-1">
              Smart Loan Management
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-sm text-slate-600">
          <a href="#features" className="hover:text-brand-700">Features</a>
          <a href="#about" className="hover:text-brand-700">About</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 pb-20">
        <section className="text-center mb-14">
          <span className="badge bg-brand-100 text-brand-700 mb-4">
            Trusted by students, salaried & businesses
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Apply, Track and Manage Your Loans
            <span className="block bg-gradient-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">
              Faster, Smarter, Easier
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            A modern loan application & verification system with EMI calculator,
            beautiful dashboards, and secure role-based access.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <RoleCard
            title="Login as User"
            subtitle="Apply, track and manage your personal loans"
            icon="👤"
            color="from-brand-500 to-brand-700"
            primaryTo="/user/login"
            primaryLabel="User Login"
            secondaryTo="/user/signup"
            secondaryLabel="Create Account"
            bullets={[
              "Apply for any loan in minutes",
              "Live EMI calculator & tracking",
              "Beautiful loan analytics dashboard",
            ]}
          />

          <RoleCard
            title="Login as Admin"
            subtitle="Verify, approve and analyse applications"
            icon="🛡️"
            color="from-slate-700 to-slate-900"
            primaryTo="/admin/login"
            primaryLabel="Admin Login"
            bullets={[
              "View every applicant in one place",
              "Approve or reject in a single click",
              "Charts, filters & full analytics",
            ]}
          />
        </section>

        <section id="features" className="mt-20 grid sm:grid-cols-3 gap-4">
          <Feature icon="🚀" title="Fast & Modern" desc="Built with React, Tailwind and Django REST." />
          <Feature icon="🔒" title="Secure" desc="JWT authentication & role-based access control." />
          <Feature icon="📊" title="Insightful" desc="Charts, EMI calculator and analytics dashboards." />
        </section>
      </main>

      <footer id="about" className="text-center text-sm text-slate-500 pb-8">
        &copy; {new Date().getFullYear()} LoanPro - College mini project.
      </footer>
    </div>
  );
}

function RoleCard({ title, subtitle, icon, color, primaryTo, primaryLabel, secondaryTo, secondaryLabel, bullets }) {
  return (
    <div className="card hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} text-white text-3xl flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mt-4">{title}</h3>
      <p className="text-slate-500 mt-1">{subtitle}</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">✔</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to={primaryTo} className="btn-primary">{primaryLabel}</Link>
        {secondaryTo && (
          <Link to={secondaryTo} className="btn-secondary">{secondaryLabel}</Link>
        )}
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="card text-center">
      <div className="text-3xl">{icon}</div>
      <div className="mt-2 font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-500 mt-1">{desc}</div>
    </div>
  );
}
