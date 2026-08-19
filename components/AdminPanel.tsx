"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

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

const ORDER_TOTAL = 1144;
const PAGE_SIZE = 20;
const STATUSES = ["new", "verified", "shipped"] as const;

const STATUS_STYLE: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  verified: "bg-sky-100 text-sky-800",
  shipped: "bg-emerald-100 text-emerald-800",
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
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
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

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

  const setStatus = async (id: number, status: string) => {
    setBusyId(id);
    const prev = orders;
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
    const res = await fetch("/api/admin/order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) setOrders(prev);
    setBusyId(null);
  };

  const deleteOrder = async (id: number) => {
    setBusyId(id);
    const res = await fetch("/api/admin/order-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setOrders((os) => os.filter((o) => o.id !== id));
    setConfirmDelete(null);
    setBusyId(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [String(o.id), o.name, o.address, o.state, o.pincode, o.country, o.status ?? "new"]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [orders, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const pendingCount = orders.filter((o) => (o.status ?? "new") === "new").length;

  const exportCsv = () => {
    const header = ["id", "name", "address", "pincode", "state", "country", "status", "email_sent", "whatsapp_sent", "created_at"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
      header.join(","),
      ...filtered.map((o) => header.map((h) => esc((o as unknown as Record<string, unknown>)[h])).join(",")),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "gangatiram-orders.csv";
    a.click();
    URL.revokeObjectURL(a.href);
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
    <div className="mx-auto w-full max-w-[1480px] px-5 py-10 md:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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

      {tab === "orders" && (
        <>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-black/45">Total orders</p>
              <p className="mt-1 font-serif text-3xl tracking-tight">{orders.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-black/45">Total value</p>
              <p className="mt-1 font-serif text-3xl tracking-tight">{inr(orders.length * ORDER_TOTAL)}</p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-black/45">Awaiting verification</p>
              <p className="mt-1 font-serif text-3xl tracking-tight">{pendingCount}</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, address, state, pincode, #id…"
              className="min-h-11 w-full max-w-[420px] rounded-full border border-black/15 bg-white px-5 text-sm outline-none focus:border-black/50"
            />
            <button
              onClick={exportCsv}
              className="min-h-11 rounded-full bg-black/5 px-5 text-sm font-medium transition-colors hover:bg-black/10"
            >
              Export CSV
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl bg-white">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="border-b border-black/10 text-xs uppercase tracking-[0.1em] text-black/45">
                <tr>
                  {["#", "Name", "Address", "State", "Pincode", "Status", "Alerts", "Proof", "Placed", ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => {
                  const status = o.status ?? "new";
                  return (
                    <tr key={o.id} className="border-b border-black/5 align-top">
                      <td className="px-4 py-3 font-medium">{o.id}</td>
                      <td className="px-4 py-3">{o.name}</td>
                      <td className="max-w-[260px] px-4 py-3 text-black/70">{o.address}</td>
                      <td className="px-4 py-3">{o.state}</td>
                      <td className="px-4 py-3">{o.pincode}</td>
                      <td className="px-4 py-3">
                        <select
                          value={status}
                          disabled={busyId === o.id}
                          onChange={(e) => setStatus(o.id, e.target.value)}
                          className={`cursor-pointer rounded-full border-0 px-2.5 py-1.5 text-xs font-medium outline-none ${STATUS_STYLE[status] ?? "bg-black/5"}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
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
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        {confirmDelete === o.id ? (
                          <span className="inline-flex gap-1">
                            <button
                              onClick={() => deleteOrder(o.id)}
                              disabled={busyId === o.id}
                              className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                            >
                              {busyId === o.id ? "…" : "Confirm"}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium"
                            >
                              Keep
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(o.id)}
                            className="rounded-full bg-black/5 px-3 py-1.5 text-xs font-medium text-black/60 transition-colors hover:bg-red-100 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!pageRows.length && (
                  <tr><td colSpan={10} className="px-4 py-10 text-center text-black/45">
                    {query ? "No orders match the search." : "No orders yet — the table is clean and waiting for #1."}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-black/55">
            <span>
              Showing {filtered.length ? (safePage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
              {query && ` (filtered from ${orders.length})`}
            </span>
            <span className="inline-flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="min-h-9 rounded-full bg-black/5 px-4 font-medium disabled:opacity-40"
              >
                Prev
              </button>
              Page {safePage} of {pages}
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={safePage >= pages}
                className="min-h-9 rounded-full bg-black/5 px-4 font-medium disabled:opacity-40"
              >
                Next
              </button>
            </span>
          </div>
        </>
      )}

      {tab === "volunteers" && (
        <div className="overflow-x-auto rounded-2xl bg-white">
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
        </div>
      )}

      {tab === "contributions" && (
        <div className="overflow-x-auto rounded-2xl bg-white">
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
        </div>
      )}
    </div>
  );
}
