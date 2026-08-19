"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

type Order = {
  id: number;
  name: string;
  address: string;
  pincode: string;
  country: string;
  state: string;
  screenshot_filename: string | null;
  status: string | null;
  email_sent: boolean;
  whatsapp_sent: boolean;
  created_at: string;
};
type Volunteer = {
  id: number;
  name: string;
  email: string;
  place: string | null;
  interest: string | null;
  availability: string | null;
  message: string | null;
  created_at: string;
};
type Contribution = {
  id: number;
  name: string;
  email: string | null;
  amount: string | null;
  payment_method: string | null;
  message: string | null;
  created_at: string;
};

type Tab = "orders" | "volunteers" | "contributions";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = await res.json();
      if (data.ok) {
        setOrders(data.orders ?? []);
        setVolunteers(data.volunteers ?? []);
        setContributions(data.contributions ?? []);
        setAuthed(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setLoginError(data.error || "Login failed.");
      return;
    }
    await loadData();
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setOrders([]);
    setVolunteers([]);
    setContributions([]);
  };

  if (authed === null) {
    return <p className="p-10 text-sm text-black/50">Checking session…</p>;
  }

  if (!authed) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-5">
        <form onSubmit={onLogin} className="flex w-full max-w-[380px] flex-col gap-4 rounded-2xl bg-white p-8 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.25)]">
          <h1 className="font-serif text-2xl tracking-tight">Ganga Tiram — Admin</h1>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="min-h-12 rounded-xl border border-black/15 px-4 outline-none focus:border-black/50"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="min-h-12 rounded-xl border border-black/15 px-4 outline-none focus:border-black/50"
            />
          </label>
          {loginError && <p className="text-sm font-medium text-red-600">{loginError}</p>}
          <button type="submit" className="min-h-12 rounded-full bg-black text-sm font-medium text-white">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "orders", label: "Book Orders", count: orders.length },
    { key: "volunteers", label: "Volunteers", count: volunteers.length },
    { key: "contributions", label: "Contributions", count: contributions.length },
  ];

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-10 md:px-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl tracking-tight">Ganga Tiram — Admin</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="min-h-10 rounded-full bg-black/5 px-5 text-sm font-medium transition-colors hover:bg-black/10"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={onLogout}
            className="min-h-10 rounded-full bg-black px-5 text-sm font-medium text-white"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              tab === t.key
                ? "min-h-10 rounded-full bg-black px-5 text-sm font-medium text-white"
                : "min-h-10 rounded-full bg-black/5 px-5 text-sm font-medium transition-colors hover:bg-black/10"
            }
          >
            {t.label} · {t.count}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white">
        {tab === "orders" && (
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.1em] text-black/45">
              <tr>
                {["#", "Name", "Address", "State", "Pincode", "Country", "Status", "Alerts", "Payment proof", "Placed"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 align-top">
                  <td className="px-4 py-3 font-medium">{o.id}</td>
                  <td className="px-4 py-3">{o.name}</td>
                  <td className="max-w-[280px] px-4 py-3 text-black/70">{o.address}</td>
                  <td className="px-4 py-3">{o.state}</td>
                  <td className="px-4 py-3">{o.pincode}</td>
                  <td className="px-4 py-3">{o.country}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium">
                      {o.status || "new"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      title={o.email_sent ? "Email alert sent" : "Email alert NOT sent"}
                      className={
                        o.email_sent
                          ? "mr-1 rounded-full bg-black/5 px-2 py-1 text-xs font-medium"
                          : "mr-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      Mail {o.email_sent ? "OK" : "—"}
                    </span>
                    <span
                      title={o.whatsapp_sent ? "WhatsApp alert sent" : "WhatsApp alert NOT sent"}
                      className={
                        o.whatsapp_sent
                          ? "rounded-full bg-black/5 px-2 py-1 text-xs font-medium"
                          : "rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                      }
                    >
                      WA {o.whatsapp_sent ? "OK" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`/api/admin/screenshot?id=${o.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      View
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-black/55">{fmt(o.created_at)}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-black/45">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "volunteers" && (
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.1em] text-black/45">
              <tr>
                {["#", "Name", "Email", "Place", "Interest", "Availability", "Message", "Signed up"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v.id} className="border-b border-black/5 align-top">
                  <td className="px-4 py-3 font-medium">{v.id}</td>
                  <td className="px-4 py-3">{v.name}</td>
                  <td className="px-4 py-3">{v.email}</td>
                  <td className="px-4 py-3">{v.place}</td>
                  <td className="px-4 py-3">{v.interest}</td>
                  <td className="px-4 py-3">{v.availability}</td>
                  <td className="max-w-[280px] px-4 py-3 text-black/70">{v.message}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-black/55">{fmt(v.created_at)}</td>
                </tr>
              ))}
              {!volunteers.length && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-black/45">No volunteer signups yet.</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "contributions" && (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-black/10 text-xs uppercase tracking-[0.1em] text-black/45">
              <tr>
                {["#", "Name", "Email", "Amount", "Method", "Message", "Received"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id} className="border-b border-black/5 align-top">
                  <td className="px-4 py-3 font-medium">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.amount}</td>
                  <td className="px-4 py-3">{c.payment_method}</td>
                  <td className="max-w-[280px] px-4 py-3 text-black/70">{c.message}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-black/55">{fmt(c.created_at)}</td>
                </tr>
              ))}
              {!contributions.length && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-black/45">No contributions yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
