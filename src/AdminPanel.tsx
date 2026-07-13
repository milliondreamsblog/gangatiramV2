import React, { useEffect, useState } from 'react';
import { LogOut, RefreshCw } from 'lucide-react';
import Logo from './Logo';

type Order = {
  id: number; name: string; address: string; pincode: string; country: string;
  state: string; screenshot_filename: string | null; status: string; created_at: string;
};
type Volunteer = {
  id: number; name: string; email: string; place: string; interest: string;
  availability: string; message: string | null; created_at: string;
};
type Contribution = {
  id: number; name: string; email: string; amount: string; payment_method: string;
  message: string | null; created_at: string;
};
type AdminData = { orders: Order[]; volunteers: Volunteer[]; contributions: Contribution[] };
type Tab = 'orders' | 'volunteers' | 'contributions';

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<Tab>('orders');

  const load = async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (res.status === 401) { setAuthed(false); setData(null); return; }
      const d = await res.json();
      if (d.ok) { setData(d); setAuthed(true); }
      else setAuthed(false);
    } catch {
      setAuthed(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) throw new Error(d.error || 'Login failed.');
      setPassword('');
      await load();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setData(null);
  };

  if (authed === null) {
    return <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center text-[#A8988A] font-bold">Checking session…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-white border border-[#E8DCC4] rounded-3xl p-10 shadow-xl w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Logo size={28} />
            <span className="text-2xl font-serif font-bold text-[#2D241E]">Ganga Tiram Admin</span>
          </div>
          <label className="flex flex-col gap-2 mb-4">
            <span className="text-sm font-bold text-[#2D241E]">Username</span>
            <input required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
          </label>
          <label className="flex flex-col gap-2 mb-6">
            <span className="text-sm font-bold text-[#2D241E]">Password</span>
            <input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="px-4 py-3 rounded-xl border border-[#E8DCC4] focus:outline-none focus:border-[#3A7CA5] bg-[#FDFCF8]" />
          </label>
          {loginError && <p className="text-red-700 text-sm font-bold mb-4">{loginError}</p>}
          <button type="submit" disabled={busy} className="w-full bg-[#3A7CA5] text-white py-3 rounded-full font-bold hover:bg-[#2F668A] transition-colors disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  const counts: Record<Tab, number> = {
    orders: data?.orders.length ?? 0,
    volunteers: data?.volunteers.length ?? 0,
    contributions: data?.contributions.length ?? 0
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#2D241E] font-sans">
      <nav className="bg-white/85 backdrop-blur-md border-b border-[#E8DCC4] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-xl font-serif font-bold">Ganga Tiram Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="flex items-center gap-2 text-[#3A7CA5] font-bold text-sm hover:underline"><RefreshCw size={16} /> Refresh</button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-[#A8988A] font-bold text-sm hover:text-[#2D241E]"><LogOut size={16} /> Sign out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-3 mb-8">
          {(['orders', 'volunteers', 'contributions'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold capitalize transition-colors ${tab === t ? 'bg-[#3A7CA5] text-white' : 'bg-white border border-[#E8DCC4] text-[#5A4B3F] hover:border-[#3A7CA5]'}`}
            >
              {t} ({counts[t]})
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#E8DCC4] rounded-2xl shadow-sm overflow-x-auto">
          {tab === 'orders' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-[#A8988A] border-b border-[#E8DCC4]">
                  <th className="px-5 py-4">#</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Address</th><th className="px-5 py-4">Pincode</th><th className="px-5 py-4">State</th>
                  <th className="px-5 py-4">Status</th><th className="px-5 py-4">Payment</th>
                </tr>
              </thead>
              <tbody>
                {data?.orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#F4EDDE] align-top">
                    <td className="px-5 py-4 font-bold">{o.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{fmtDate(o.created_at)}</td>
                    <td className="px-5 py-4 font-bold">{o.name}</td>
                    <td className="px-5 py-4 max-w-[280px]">{o.address}, {o.country}</td>
                    <td className="px-5 py-4">{o.pincode}</td>
                    <td className="px-5 py-4">{o.state}</td>
                    <td className="px-5 py-4"><span className="bg-[#F4EDDE] text-[#5A4B3F] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap">{o.status}</span></td>
                    <td className="px-5 py-4">
                      <a href={`/api/admin/screenshot?id=${o.id}`} target="_blank" rel="noopener noreferrer" className="text-[#3A7CA5] font-bold hover:underline whitespace-nowrap">View screenshot</a>
                    </td>
                  </tr>
                ))}
                {!data?.orders.length && <tr><td colSpan={8} className="px-5 py-10 text-center text-[#A8988A]">No orders yet.</td></tr>}
              </tbody>
            </table>
          )}

          {tab === 'volunteers' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-[#A8988A] border-b border-[#E8DCC4]">
                  <th className="px-5 py-4">#</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th><th className="px-5 py-4">Place</th><th className="px-5 py-4">Interest</th>
                  <th className="px-5 py-4">Availability</th><th className="px-5 py-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {data?.volunteers.map((v) => (
                  <tr key={v.id} className="border-b border-[#F4EDDE] align-top">
                    <td className="px-5 py-4 font-bold">{v.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{fmtDate(v.created_at)}</td>
                    <td className="px-5 py-4 font-bold">{v.name}</td>
                    <td className="px-5 py-4"><a href={`mailto:${v.email}`} className="text-[#3A7CA5] hover:underline">{v.email}</a></td>
                    <td className="px-5 py-4">{v.place}</td>
                    <td className="px-5 py-4">{v.interest}</td>
                    <td className="px-5 py-4">{v.availability}</td>
                    <td className="px-5 py-4 max-w-[240px]">{v.message || '—'}</td>
                  </tr>
                ))}
                {!data?.volunteers.length && <tr><td colSpan={8} className="px-5 py-10 text-center text-[#A8988A]">No volunteer registrations yet.</td></tr>}
              </tbody>
            </table>
          )}

          {tab === 'contributions' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-[#A8988A] border-b border-[#E8DCC4]">
                  <th className="px-5 py-4">#</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Message</th>
                </tr>
              </thead>
              <tbody>
                {data?.contributions.map((c) => (
                  <tr key={c.id} className="border-b border-[#F4EDDE] align-top">
                    <td className="px-5 py-4 font-bold">{c.id}</td>
                    <td className="px-5 py-4 whitespace-nowrap">{fmtDate(c.created_at)}</td>
                    <td className="px-5 py-4 font-bold">{c.name}</td>
                    <td className="px-5 py-4"><a href={`mailto:${c.email}`} className="text-[#3A7CA5] hover:underline">{c.email}</a></td>
                    <td className="px-5 py-4 font-bold">{c.amount}</td>
                    <td className="px-5 py-4">{c.payment_method}</td>
                    <td className="px-5 py-4 max-w-[240px]">{c.message || '—'}</td>
                  </tr>
                ))}
                {!data?.contributions.length && <tr><td colSpan={7} className="px-5 py-10 text-center text-[#A8988A]">No contributions yet.</td></tr>}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
