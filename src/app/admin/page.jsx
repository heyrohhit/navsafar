// src/app/admin/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// NavSafar Admin Panel — Production Level
// Route: /admin
// Auth:  POST /api/admin/auth  → token stored in sessionStorage
// CRUD:  GET/POST/PUT/DELETE /api/admin/packages
//        GET/PUT/DELETE       /api/admin/contacts
// ─────────────────────────────────────────────────────────────────────────────
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE FORM FIELD DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
const PKG_FIELDS = [
  { k: "title",               l: "Title *",                                  type: "text",     col: "full", required: true },
  { k: "city",                l: "City",                                      type: "text",     col: "half" },
  { k: "country",             l: "Country",                                   type: "text",     col: "half" },
  { k: "duration",            l: "Duration  (e.g. 5N / 6D)",                 type: "text",     col: "half" },
  { k: "rating",              l: "Rating  (1 – 5)",                          type: "number",   col: "half" },
  { k: "bestTime",            l: "Best Time to Visit",                        type: "text",     col: "half" },
  { k: "popular",             l: "Mark as Popular?",                          type: "select",   col: "half", opts: ["false", "true"] },
  { k: "category",            l: "Category  (comma-separated)  e.g. domestic,family", type: "text", col: "full" },
  { k: "tourism_type",        l: "Tourism Type  (comma-separated)  e.g. Beach,Cultural", type: "text", col: "full" },
  { k: "famous_attractions",  l: "Famous Attractions  (comma-separated)",     type: "text",     col: "full" },
  { k: "image",               l: "Image URL",                                 type: "text",     col: "full" },
  { k: "tagline",             l: "Tagline",                                   type: "text",     col: "full" },
  { k: "description",         l: "Description",                               type: "textarea", col: "full" },
  { k: "highlights",          l: "Highlights  (comma-separated)",              type: "textarea", col: "full" },
  { k: "activities",          l: "Activities  (comma-separated)",              type: "textarea", col: "full" },
];

// ─────────────────────────────────────────────────────────────────────────────
// API HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const getToken = () =>
  (typeof window !== "undefined" ? sessionStorage.getItem("ns_admin_token") : "") ?? "";

const authHdr = () => ({
  "Content-Type": "application/json",
  Authorization:  `Bearer ${getToken()}`,
});

async function apiFetch(url, init = {}) {
  const res  = await fetch(url, { ...init, headers: { ...authHdr(), ...(init.headers ?? {}) } });
  const json = await res.json();
  return { ok: res.ok, status: res.status, ...json };
}

const apiGet    = (url)       => apiFetch(url);
const apiPost   = (url, body) => apiFetch(url, { method: "POST",   body: JSON.stringify(body) });
const apiPut    = (url, body) => apiFetch(url, { method: "PUT",    body: JSON.stringify(body) });
const apiDelete = (url)       => apiFetch(url, { method: "DELETE" });

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [phase,    setPhase]   = useState("checking"); // checking | login | app
  const [initErr,  setInitErr] = useState("");

  useEffect(() => {
    const tok = sessionStorage.getItem("ns_admin_token");
    if (!tok) { setPhase("login"); return; }
    // Verify token is still valid
    fetch("/api/admin/packages", { headers: { Authorization: `Bearer ${tok}` } })
      .then((r) => setPhase(r.ok ? "app" : "login"))
      .catch(()  => setPhase("login"));
  }, []);

  if (phase === "checking") return <Splash />;
  if (phase === "login")    return <LoginPage  onSuccess={() => setPhase("app")} />;
  return                           <Dashboard  onLogout={() => { sessionStorage.removeItem("ns_admin_token"); setPhase("login"); }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH
// ─────────────────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div style={S.splash}>
      <div style={S.spinner} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onSuccess }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [busy,     setBusy]     = useState(false);
  const [err,      setErr]      = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.success) { sessionStorage.setItem("ns_admin_token", json.token); onSuccess(); }
      else setErr(json.message || "Invalid credentials.");
    } catch { setErr("Network error — please try again."); }
    finally  { setBusy(false); }
  }

  return (
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>✈ NavSafar</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "2px", marginTop: 4 }}>ADMIN CONTROL PANEL</div>
        </div>

        {err && <div style={S.errBox}>{err}</div>}

        <form onSubmit={submit}>
          <label style={S.lbl}>Email Address</label>
          <input style={S.inp} type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="NavsafarAdmin@navsafar.com" required autoFocus />

          <label style={{ ...S.lbl, marginTop: 14 }}>Password</label>
          <input style={S.inp} type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" required
            onKeyDown={e => e.key === "Enter" && submit(e)} />

          <button style={{ ...S.btnPrimary, width: "100%", marginTop: 20, padding: "12px 0", fontSize: 15 }}
            disabled={busy}>
            {busy ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "packages",  icon: "🎒", label: "Packages"  },
  { id: "contacts",  icon: "📞", label: "Contacts"  },
];

function Dashboard({ onLogout }) {
  const [page,      setPage]     = useState("dashboard");
  const [packages,  setPackages] = useState([]);
  const [contacts,  setContacts] = useState([]);
  const [loading,   setLoading]  = useState(false);
  const [toast,     setToast]    = useState(null);
  const [sideOpen,  setSideOpen] = useState(true);

  // ── Toast helper ──────────────────────────────────────────────────
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Data loaders ──────────────────────────────────────────────────
  const loadPackages = useCallback(async () => {
    setLoading(true);
    const r = await apiGet("/api/admin/packages");
    if (r.success) setPackages(r.data);
    else showToast(r.message, "error");
    setLoading(false);
  }, [showToast]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const r = await apiGet("/api/admin/contacts");
    if (r.success) setContacts(r.data);
    else showToast(r.message, "error");
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    if (page === "dashboard" || page === "packages") loadPackages();
    if (page === "dashboard" || page === "contacts") loadContacts();
  }, [page, loadPackages, loadContacts]);

  const pending = contacts.filter(c => c.status === "pending").length;

  return (
    <div style={S.app}>
      {/* ── SIDEBAR ── */}
      <aside style={{ ...S.sidebar, transform: sideOpen ? "translateX(0)" : "translateX(-240px)" }}>
        <div style={{ padding: "20px 18px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.accent }}>✈ NavSafar</div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: "1.5px", marginTop: 2 }}>ADMIN PANEL</div>
        </div>

        <nav style={{ flex: 1, padding: "8px 0", overflowY: "auto" }}>
          {NAV_ITEMS.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              ...S.navItem,
              ...(page === n.id ? S.navActive : {}),
            }}>
              <span style={{ fontSize: 18, width: 24 }}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === "contacts" && pending > 0 && (
                <span style={S.navBadge}>{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px 18px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, wordBreak: "break-all" }}>
            NavsafarAdmin@navsafar.com
          </div>
          <button style={S.logoutBtn} onClick={onLogout}>Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ ...S.main, marginLeft: sideOpen ? 240 : 0 }}>
        {/* Topbar */}
        <header style={S.topbar}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={S.menuBtn} onClick={() => setSideOpen(v => !v)}>☰</button>
            <span style={{ fontSize: 17, fontWeight: 600 }}>
              {NAV_ITEMS.find(n => n.id === page)?.icon}{" "}
              {NAV_ITEMS.find(n => n.id === page)?.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {toast && (
              <div style={toast.type === "success" ? S.toastOk : S.toastErr}>{toast.msg}</div>
            )}
            <span style={{ fontSize: 12, color: C.muted }}>
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div style={S.content}>
          {loading && <div style={S.loadBar} />}
          {page === "dashboard" && <DashboardPage packages={packages} contacts={contacts} navigate={setPage} />}
          {page === "packages"  && <PackagesPage  packages={packages} reload={loadPackages} toast={showToast} />}
          {page === "contacts"  && <ContactsPage  contacts={contacts} reload={loadContacts} toast={showToast} />}
        </div>
      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────
function DashboardPage({ packages, contacts, navigate }) {
  const popular   = packages.filter(p => p.popular === true || p.popular === "true").length;
  const pending   = contacts.filter(c => c.status === "pending").length;
  const responded = contacts.filter(c => c.status === "responded").length;

  const stats = [
    { icon: "🎒", val: packages.length, lbl: "Total Packages",   clr: C.accent },
    { icon: "⭐", val: popular,          lbl: "Popular",          clr: "#8b5cf6" },
    { icon: "📞", val: contacts.length,  lbl: "Total Inquiries",  clr: "#3b82f6" },
    { icon: "⏳", val: pending,          lbl: "Pending",          clr: "#ef4444" },
    { icon: "✅", val: responded,        lbl: "Responded",        clr: "#10b981" },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={S.statsGrid}>
        {stats.map(s => (
          <div key={s.lbl} style={S.statCard}>
            <span style={{ fontSize: 26 }}>{s.icon}</span>
            <div style={{ fontSize: 30, fontWeight: 700, color: s.clr, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h3 style={S.sectionH}>Quick Actions</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { icon: "➕", lbl: "Add Package",   fn: () => navigate("packages") },
          { icon: "📋", lbl: "View Contacts", fn: () => navigate("contacts") },
        ].map(a => (
          <button key={a.lbl} onClick={a.fn} style={S.qaCard}>
            <span style={{ fontSize: 28 }}>{a.icon}</span>
            <span style={{ fontSize: 13, color: C.text2 }}>{a.lbl}</span>
          </button>
        ))}
      </div>

      {/* Recent contacts */}
      <h3 style={S.sectionH}>Recent Inquiries</h3>
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>{["Name", "Subject", "Phone", "Status", "Date"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {contacts.slice(0, 8).length === 0
              ? <tr><td colSpan={5} style={S.emptyCell}>No inquiries yet.</td></tr>
              : contacts.slice(0, 8).map(c => (
                  <TableRow key={c.id}>
                    <td style={S.td}><strong style={{ color: C.text }}>{c.name}</strong></td>
                    <td style={S.td}>{c.subject || "—"}</td>
                    <td style={S.td}>{c.phone   || "—"}</td>
                    <td style={S.td}><StatusBadge status={c.status} /></td>
                    <td style={S.td}>{c.date    || "—"}</td>
                  </TableRow>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PackagesPage({ packages, reload, toast }) {
  const [modal,   setModal]   = useState(null); // null | "add" | "edit"
  const [item,    setItem]    = useState({});
  const [search,  setSearch]  = useState("");
  const [saving,  setSaving]  = useState(false);

  const filtered = useMemo(() =>
    search
      ? packages.filter(p => JSON.stringify(p).toLowerCase().includes(search.toLowerCase()))
      : packages,
    [packages, search]
  );

  function openAdd()     { setItem({});        setModal("add");  }
  function openEdit(pkg) { setItem({ ...pkg }); setModal("edit"); }
  function closeModal()  { setModal(null);      setItem({});      }

  async function save() {
    if (!item.title?.trim()) { toast("Title is required", "error"); return; }
    setSaving(true);
    const r = modal === "edit"
      ? await apiPut("/api/admin/packages", item)
      : await apiPost("/api/admin/packages", item);
    if (r.success) { toast(modal === "edit" ? "Package updated ✅" : "Package created ✅"); closeModal(); reload(); }
    else toast(r.message, "error");
    setSaving(false);
  }

  async function del(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const r = await apiDelete(`/api/admin/packages?id=${id}`);
    if (r.success) { toast("Deleted ✅"); reload(); }
    else toast(r.message, "error");
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(packages, null, 2)], { type: "application/json" });
    const a    = Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(blob),
      download: `navsafar_packages_${Date.now()}.json`,
    });
    a.click();
    toast("Exported ✅");
  }

  async function importJSON(e) {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const arr = JSON.parse(text);
      if (!Array.isArray(arr)) { toast("File must be a JSON array", "error"); return; }
      let ok = 0;
      for (const pkg of arr) {
        const r = await apiPost("/api/admin/packages", pkg);
        if (r.success) ok++;
      }
      toast(`Imported ${ok} packages ✅`);
      reload();
    } catch { toast("Could not parse file", "error"); }
    e.target.value = "";
  }

  return (
    <div>
      {/* Header */}
      <div style={S.secHdr}>
        <div>
          <div style={S.secTitle}>Package Management</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{packages.length} total packages</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input style={S.searchBar} placeholder="Search packages…" value={search} onChange={e => setSearch(e.target.value)} />
          <button style={S.btnOutline} onClick={exportJSON}>⬇ Export JSON</button>
          <label style={{ ...S.btnOutline, cursor: "pointer" }}>
            ⬆ Import JSON
            <input type="file" accept=".json" style={{ display: "none" }} onChange={importJSON} />
          </label>
          <button style={S.btnPrimary} onClick={openAdd}>+ Add Package</button>
        </div>
      </div>

      {/* Table */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>{["#","Image","Title / Location","Category","Duration","Rating","Popular","Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={S.emptyCell}>
                {packages.length === 0
                  ? "No packages yet. Click '+ Add Package' or import your existing data."
                  : "No packages match your search."}
              </td></tr>
            )}
            {filtered.map((p, i) => (
              <TableRow key={p.id}>
                <td style={S.td}><span style={{ color: C.muted }}>{i + 1}</span></td>
                <td style={S.td}>
                  {p.image
                    ? <img src={p.image} alt="" style={S.thumb} onError={e => e.target.style.display = "none"} />
                    : <span style={{ color: C.muted, fontSize: 11 }}>—</span>}
                </td>
                <td style={S.td}>
                  <strong style={{ color: C.text, fontSize: 13 }}>{p.title}</strong>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                    {[p.city, p.country].filter(Boolean).join(", ")}
                  </div>
                </td>
                <td style={S.td}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {(Array.isArray(p.category) ? p.category : []).slice(0, 3).map(c => (
                      <span key={c} style={S.tag}>{c}</span>
                    ))}
                  </div>
                </td>
                <td style={S.td}>{p.duration || "—"}</td>
                <td style={S.td}>
                  {p.rating ? <span><span style={{ color: C.accent }}>★</span> {p.rating}</span> : "—"}
                </td>
                <td style={S.td}>
                  {(p.popular === true || p.popular === "true")
                    ? <span style={S.badgeGreen}>Popular</span>
                    : <span style={S.badgeGray}>Standard</span>}
                </td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button style={S.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                    <button style={S.btnDel}  onClick={() => del(p.id, p.title)}>Delete</button>
                  </div>
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal title={modal === "add" ? "Add New Package" : "Edit Package"} onClose={closeModal}>
          <PackageForm item={item} onChange={setItem} />
          <div style={S.modalFoot}>
            <button style={S.btnOutline} onClick={closeModal}>Cancel</button>
            <button style={S.btnPrimary} onClick={save} disabled={saving}>
              {saving ? "Saving…" : modal === "add" ? "Create Package" : "Save Changes"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Package form ─────────────────────────────────────────────────────────────
function PackageForm({ item, onChange }) {
  function set(k, v) { onChange(prev => ({ ...prev, [k]: v })); }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {PKG_FIELDS.map(f => {
        const val = Array.isArray(item[f.k]) ? item[f.k].join(", ") : (item[f.k] ?? "");
        return (
          <div key={f.k} style={{ gridColumn: f.col === "full" ? "1/-1" : "auto" }}>
            <label style={S.lbl}>{f.l}</label>
            {f.type === "textarea" ? (
              <textarea style={{ ...S.inp, minHeight: 72, resize: "vertical" }}
                value={val} onChange={e => set(f.k, e.target.value)} />
            ) : f.type === "select" ? (
              <select style={S.inp} value={String(item[f.k] ?? "false")} onChange={e => set(f.k, e.target.value)}>
                {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input style={S.inp} type={f.type} step={f.type === "number" ? "0.1" : undefined}
                value={val} onChange={e => set(f.k, e.target.value)} placeholder={f.l} />
            )}
          </div>
        );
      })}
      {/* Image preview */}
      {item.image && (
        <div style={{ gridColumn: "1/-1" }}>
          <img src={item.image} alt="preview"
            style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, border: `1px solid ${C.border}` }}
            onError={e => e.target.style.display = "none"} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ContactsPage({ contacts, reload, toast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => ({
    all:       contacts.length,
    pending:   contacts.filter(c => c.status === "pending").length,
    responded: contacts.filter(c => c.status === "responded").length,
    closed:    contacts.filter(c => c.status === "closed").length,
  }), [contacts]);

  const filtered = useMemo(() => contacts.filter(c => {
    const matchSearch = !search || JSON.stringify(c).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  }), [contacts, search, filter]);

  async function updateStatus(id, status) {
    const r = await apiPut("/api/admin/contacts", { id, status });
    if (r.success) { toast("Status updated ✅"); reload(); }
    else toast(r.message, "error");
  }

  async function del(id, name) {
    if (!confirm(`Delete inquiry from "${name}"?`)) return;
    const r = await apiDelete(`/api/admin/contacts?id=${id}`);
    if (r.success) { toast("Deleted ✅"); reload(); }
    else toast(r.message, "error");
  }

  return (
    <div>
      {/* Header */}
      <div style={S.secHdr}>
        <div>
          <div style={S.secTitle}>Contact Inquiries</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
            {contacts.length} total · {counts.pending} pending
          </div>
        </div>
        <input style={S.searchBar} placeholder="Search contacts…" value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(counts).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)}
            style={{ ...S.filterTab, ...(filter === k ? S.filterTabActive : {}) }}>
            {k.charAt(0).toUpperCase() + k.slice(1)} ({v})
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: C.muted, fontSize: 14 }}>
          No contacts match your filter.
        </div>
      )}

      {filtered.map(c => (
        <div key={c.id} style={S.contactCard}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{c.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                {c.email && `✉ ${c.email}  `}{c.phone && `📱 ${c.phone}  `}📅 {c.date || c.createdAt?.slice(0, 10) || "—"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select style={S.statusSel} value={c.status} onChange={e => updateStatus(c.id, e.target.value)}>
                <option value="pending">⏳ Pending</option>
                <option value="responded">✅ Responded</option>
                <option value="closed">🔒 Closed</option>
              </select>
              <button style={S.btnDel} onClick={() => del(c.id, c.name)}>Delete</button>
            </div>
          </div>

          {c.subject && (
            <div style={{ fontSize: 13, fontWeight: 600, color: C.accent, marginTop: 8 }}>{c.subject}</div>
          )}
          {c.packageInterest && (
            <div style={{ fontSize: 12, color: "#60a5fa", marginTop: 2 }}>
              Package Interest: {c.packageInterest}
            </div>
          )}
          <div style={{ fontSize: 13, color: C.text2, marginTop: 6, lineHeight: 1.6 }}>{c.message}</div>

          <div style={{ display: "flex", gap: 14, marginTop: 10, fontSize: 12, alignItems: "center", flexWrap: "wrap" }}>
            <StatusBadge status={c.status} />
            {c.email && <a href={`mailto:${c.email}`} style={{ color: "#60a5fa" }}>✉ Email</a>}
            {c.phone && <a href={`tel:${c.phone}`}    style={{ color: "#34d399" }}>📞 Call</a>}
            {c.phone && (
              <a href={`https://wa.me/91${c.phone.replace(/\D/g, "")}`}
                target="_blank" rel="noreferrer"
                style={{ color: "#22c55e" }}>💬 WhatsApp</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={S.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modal}>
        <div style={S.modalHead}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
          <button style={S.closeBtn} onClick={onClose}>×</button>
        </div>
        <div style={S.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function TableRow({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <tr style={{ background: hov ? "#1a2840" : "transparent", transition: "background .15s" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </tr>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending:   { bg: "#451a03", color: "#fbbf24" },
    responded: { bg: "#064e3b", color: "#34d399" },
    closed:    { bg: "#1e293b", color: "#94a3b8" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {status ?? "pending"}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS + STYLES
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0f172a",
  surface: "#1e293b",
  surface2:"#263246",
  border:  "#334155",
  accent:  "#f59e0b",
  text:    "#f8fafc",
  text2:   "#94a3b8",
  muted:   "#64748b",
  red:     "#ef4444",
  green:   "#10b981",
};

const S = {
  // Splash
  splash:  { minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" },
  spinner: { width: 40, height: 40, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite" },

  // Login
  loginWrap: { minHeight: "100vh", background: `linear-gradient(135deg,${C.bg},${C.surface})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  loginCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 420 },
  errBox:    { background: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13 },

  // Form basics
  lbl:  { display: "block", fontSize: 11, color: C.muted, marginBottom: 5, textTransform: "uppercase", letterSpacing: ".5px" },
  inp:  { width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", color: C.text, fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color .2s" },

  // Buttons
  btnPrimary: { background: C.accent, color: "#000", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnOutline: { background: "none",   color: C.text2, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, cursor: "pointer" },
  btnEdit:    { background: "#1d4ed8", color: "#fff",  border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" },
  btnDel:     { background: C.red,     color: "#fff",  border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" },

  // Layout
  app:    { display: "flex", minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Segoe UI',system-ui,sans-serif" },
  sidebar: { width: 240, background: C.bg, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100, transition: "transform .3s" },
  main:   { flex: 1, minHeight: "100vh", transition: "margin .3s" },
  topbar: { background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 },
  content: { padding: 24 },

  // Nav
  navItem:   { display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", cursor: "pointer", fontSize: 13.5, color: C.text2, background: "none", border: "none", width: "100%", textAlign: "left", borderLeft: "3px solid transparent", transition: "all .15s", fontFamily: "inherit" },
  navActive: { background: C.surface, color: C.accent, borderLeftColor: C.accent },
  navBadge:  { background: C.red, color: "#fff", borderRadius: 10, fontSize: 10, padding: "1px 6px", fontWeight: 600, marginLeft: "auto" },
  logoutBtn: { background: "none", border: `1px solid ${C.border}`, color: C.text2, borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer", width: "100%", fontFamily: "inherit" },
  menuBtn:   { background: "none", border: `1px solid ${C.border}`, color: C.text2, width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" },

  // Toast
  toastOk:  { background: "#064e3b", color: "#34d399", border: "1px solid #065f46", borderRadius: 8, padding: "6px 14px", fontSize: 13 },
  toastErr: { background: "#450a0a", color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 8, padding: "6px 14px", fontSize: 13 },

  // Loading bar
  loadBar: { height: 3, background: C.accent, borderRadius: 2, marginBottom: 16 },

  // Stats
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 24 },
  statCard:  { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 },
  sectionH:  { fontSize: 14, fontWeight: 600, color: C.text2, marginBottom: 12, marginTop: 4 },
  qaCard:    { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "18px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: "inherit", color: C.text, transition: "border-color .2s" },

  // Table
  tableWrap: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflowX: "auto" },
  table:     { width: "100%", borderCollapse: "collapse", minWidth: 640 },
  th:        { background: C.surface2, padding: "11px 16px", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: C.muted, textAlign: "left", fontWeight: 600 },
  td:        { padding: "11px 16px", fontSize: 13, borderTop: `1px solid ${C.border}`, color: C.text2, verticalAlign: "middle" },
  emptyCell: { textAlign: "center", padding: 48, color: C.muted, fontSize: 14 },
  tag:       { background: "#1e3a5f", color: "#60a5fa", padding: "2px 8px", borderRadius: 4, fontSize: 11 },
  thumb:     { width: 44, height: 32, objectFit: "cover", borderRadius: 6, border: `1px solid ${C.border}` },
  badgeGreen:{ background: "#064e3b", color: "#34d399", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
  badgeGray: { background: C.surface, color: C.muted,  padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },

  // Section header
  secHdr:    { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 },
  secTitle:  { fontSize: 16, fontWeight: 600 },
  searchBar: { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", color: C.text, fontSize: 13, width: 220, outline: "none", fontFamily: "inherit" },

  // Modal
  overlay:   { position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 20, overflowY: "auto" },
  modal:     { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, width: "100%", maxWidth: 680, margin: "auto" },
  modalHead: { padding: "18px 22px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
  modalBody: { padding: 22, maxHeight: "70vh", overflowY: "auto" },
  modalFoot: { padding: "16px 22px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, justifyContent: "flex-end" },
  closeBtn:  { background: "none", border: "none", color: C.text2, fontSize: 24, cursor: "pointer", lineHeight: 1, fontFamily: "inherit" },

  // Contact card
  contactCard: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 12 },
  filterTab:   { background: "none", border: `1px solid ${C.border}`, color: C.text2, borderRadius: 20, padding: "5px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
  filterTabActive: { background: C.accent, color: "#000", border: `1px solid ${C.accent}` },
  statusSel:   { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", color: C.text, fontSize: 12, cursor: "pointer", fontFamily: "inherit" },
};

// Inject keyframe for spinner
if (typeof document !== "undefined") {
  const id = "ns-admin-style";
  if (!document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(el);
  }
}