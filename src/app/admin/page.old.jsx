// src/app/admin/page.jsx
// NavSafar Admin Panel — Production · Tailwind + minimal inline styles
// No site header/footer on this page (handled by SiteShell in root layout)
"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  #ns-root, #ns-root * { font-family:'Plus Jakarta Sans',system-ui,sans-serif; box-sizing:border-box; }
  #ns-root ::-webkit-scrollbar{width:4px;height:4px}
  #ns-root ::-webkit-scrollbar-thumb{background:#334155;border-radius:99px}
  @keyframes ns-spin{to{transform:rotate(360deg)}}
  @keyframes ns-up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ns-in{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
  .ns-up{animation:ns-up .3s ease both}
  .ns-in{animation:ns-in .2s ease both}
  .ns-spin{animation:ns-spin .7s linear infinite}
`;

const C = {
  bg:"#070d1a", bg2:"#0d1526", surf:"#111c30", surf2:"#162036",
  bdr:"rgba(255,255,255,.07)", bdr2:"rgba(255,255,255,.12)",
  amber:"#f59e0b", amberL:"#fbbf24", amberD:"#d97706",
  teal:"#0ea5e9", tealD:"#0284c7",
  red:"#f43f5e", green:"#10b981",
  tx:"#f0f6ff", tx2:"#8b9bb4", tx3:"#4a5568",
};

// ── Image URL resolver — handles Google Drive + other external URLs ──────────
function resolveImg(url) {
  if (!url || typeof url !== "string") return null;
  // Google Drive: /file/d/FILE_ID/view  or  /open?id=FILE_ID
  const m1 = url.match(/\/file\/d\/([^/?#]+)/);
  if (m1) return `https://lh3.googleusercontent.com/d/${m1[1]}=w800`;
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2 && url.includes("drive.google")) return `https://lh3.googleusercontent.com/d/${m2[1]}=w800`;
  return url;
}

// ── Thumbnail component — shows placeholder on any load error ───────────────
function PackageImg({ src, className, style }) {
  const [err, setErr] = useState(false);
  const resolved = resolveImg(src);
  if (!resolved || err) {
    return (
      <div className={`flex items-center justify-center text-lg rounded-md ${className ?? ""}`}
        style={{ background:C.surf2, ...style }}>🖼</div>
    );
  }
  return (
    <img src={resolved} alt="" className={className} style={style}
      referrerPolicy="no-referrer" crossOrigin="anonymous"
      onError={() => setErr(true)} />
  );
}

// ── Field defs ────────────────────────────────────────────────────────────────
const PKG_FIELDS = [
  { k:"title",              l:"Title *",                                    type:"text",     col:"full", required:true },
  { k:"city",               l:"City",                                       type:"text",     col:"half" },
  { k:"country",            l:"Country",                                    type:"text",     col:"half" },
  { k:"duration",           l:"Duration  (e.g. 5N / 6D)",                  type:"text",     col:"half" },
  { k:"rating",             l:"Rating  (1-5)",                             type:"number",   col:"half" },
  { k:"bestTime",           l:"Best Time to Visit",                         type:"text",     col:"half" },
  { k:"popular",            l:"Mark as Popular?",                           type:"select",   col:"half", opts:["false","true"] },
  { k:"category",           l:"Category  (comma-separated, e.g. domestic,family)", type:"text", col:"full" },
  { k:"tourism_type",       l:"Tourism Type  (comma-separated, e.g. Beach,Cultural)", type:"text", col:"full" },
  { k:"famous_attractions", l:"Famous Attractions  (comma-separated)",      type:"text",     col:"full" },
  { k:"image",              l:"Image URL  (Unsplash, Drive, or any direct link)", type:"text", col:"full" },
  { k:"tagline",            l:"Tagline",                                    type:"text",     col:"full" },
  { k:"description",        l:"Description",                               type:"textarea", col:"full" },
  { k:"highlights",         l:"Highlights  (comma-separated)",              type:"textarea", col:"full" },
  { k:"activities",         l:"Activities  (comma-separated)",              type:"textarea", col:"full" },
];

// ── API helpers ───────────────────────────────────────────────────────────────
const getToken = () => (typeof window !== "undefined" ? sessionStorage.getItem("ns_admin_token") : "") ?? "";
const authHdr  = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${getToken()}` });
async function apiFetch(url, init = {}) {
  const res  = await fetch(url, { ...init, headers:{ ...authHdr(), ...(init.headers ?? {}) } });
  const json = await res.json();
  return { ok:res.ok, ...json };
}
const apiGet    = (url)       => apiFetch(url);
const apiPost   = (url, body) => apiFetch(url, { method:"POST",   body:JSON.stringify(body) });
const apiPut    = (url, body) => apiFetch(url, { method:"PUT",    body:JSON.stringify(body) });
const apiDelete = (url)       => apiFetch(url, { method:"DELETE" });

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [phase, setPhase] = useState("checking");
  useEffect(() => {
    const tok = sessionStorage.getItem("ns_admin_token");
    if (!tok) { setPhase("login"); return; }
    fetch("/api/admin/packages", { headers:{ Authorization:`Bearer ${tok}` } })
      .then(r => setPhase(r.ok ? "app" : "login"))
      .catch(() => setPhase("login"));
  }, []);
  return (
    <>
      <style>{G}</style>
      <div id="ns-root" style={{ minHeight:"100vh", background:C.bg, color:C.tx }}>
        {phase === "checking" && <Splash />}
        {phase === "login"    && <LoginPage  onSuccess={() => setPhase("app")} />}
        {phase === "app"      && <Dashboard  onLogout={() => { sessionStorage.removeItem("ns_admin_token"); setPhase("login"); }} />}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SPLASH
// ─────────────────────────────────────────────────────────────────────────────
function Splash() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5">
      <span className="text-3xl font-black"
        style={{ background:`linear-gradient(90deg,${C.amber},${C.amberL})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
        ✈ NavSafar
      </span>
      <Spinner />
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
  const [showPass, setShowPass] = useState(false);

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const res  = await fetch("/api/admin/auth", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify({ email, password }) });
      const json = await res.json();
      if (json.success) { sessionStorage.setItem("ns_admin_token", json.token); onSuccess(); }
      else setErr(json.message || "Invalid credentials.");
    } catch { setErr("Network error. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${C.amber}18 0%,transparent 70%)` }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background:`radial-gradient(circle,${C.teal}14 0%,transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage:`linear-gradient(${C.bdr} 1px,transparent 1px),linear-gradient(90deg,${C.bdr} 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />

      <div className="w-full max-w-sm ns-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl mb-4"
            style={{ background:C.surf, border:`1px solid ${C.bdr2}` }}>
            <span className="text-xl">✈</span>
            <span className="text-lg font-black"
              style={{ background:`linear-gradient(90deg,${C.amber},${C.amberL})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              NavSafar
            </span>
          </div>
          <h1 className="text-2xl font-black mb-1" style={{ color:C.tx }}>Welcome back</h1>
          <p className="text-sm" style={{ color:C.tx2 }}>Sign in to your admin panel</p>
        </div>

        <div className="rounded-2xl p-7" style={{ background:C.surf, border:`1px solid ${C.bdr2}`, boxShadow:"0 24px 64px rgba(0,0,0,.5)" }}>
          {err && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
              style={{ background:"rgba(244,63,94,.1)", border:"1px solid rgba(244,63,94,.3)", color:"#fda4af" }}>
              <span>⚠</span>{err}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <FancyInput label="Email Address" icon="✉" type="email" value={email} onChange={setEmail}
              placeholder="NavsafarAdmin@navsafar.com" required />
            <FancyInput label="Password" icon="🔒" type={showPass ? "text" : "password"} value={password}
              onChange={setPassword} placeholder="••••••••" required
              suffix={
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="text-xs px-1 py-0.5"
                  style={{ background:"none", border:"none", color:C.tx3, cursor:"pointer" }}>
                  {showPass ? "Hide" : "Show"}
                </button>
              }
            />
            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: busy ? C.tx3 : `linear-gradient(135deg,${C.amber},${C.amberD})`,
                color: busy ? C.tx2 : "#0d0d0d", border:"none", cursor: busy ? "not-allowed" : "pointer",
                boxShadow: busy ? "none" : `0 4px 20px ${C.amber}40`,
              }}>
              {busy ? <><Spinner sm /> Signing in…</> : "Sign In to Dashboard →"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs mt-4" style={{ color:C.tx3 }}>NavSafar Admin · Secured</p>
      </div>
    </div>
  );
}

function FancyInput({ label, icon, suffix, onChange, ...rest }) {
  const [foc, setFoc] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color:C.tx3 }}>{label}</label>
      <div className="flex items-center rounded-xl transition-all duration-200"
        style={{ background:C.bg2, border:`1px solid ${foc ? C.amber+"55" : C.bdr2}`, boxShadow: foc ? `0 0 0 3px ${C.amber}12` : "none", minHeight:44 }}>
        <span className="px-3 text-sm opacity-40 flex-shrink-0">{icon}</span>
        <input {...rest} onChange={e => onChange(e.target.value)} onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
          className="flex-1 bg-transparent text-sm py-3 pr-2 outline-none min-w-0"
          style={{ color:C.tx, border:"none" }} />
        {suffix && <div className="pr-3 flex-shrink-0">{suffix}</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD SHELL
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", icon:"◈", label:"Overview"  },
  { id:"packages",  icon:"⊞", label:"Packages"  },
  { id:"contacts",  icon:"◎", label:"Contacts"  },
];

function Dashboard({ onLogout }) {
  const [page,     setPage]     = useState("dashboard");
  const [packages, setPackages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const check = () => setSideOpen(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadPackages = useCallback(async () => {
    setLoading(true);
    const r = await apiGet("/api/admin/packages");
    if (r.success) setPackages(r.data); else showToast(r.message, "error");
    setLoading(false);
  }, [showToast]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const r = await apiGet("/api/admin/contacts");
    if (r.success) setContacts(r.data); else showToast(r.message, "error");
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    if (page === "dashboard" || page === "packages") loadPackages();
    if (page === "dashboard" || page === "contacts") loadContacts();
  }, [page, loadPackages, loadContacts]);

  const pending = contacts.filter(c => c.status === "pending").length;
  const current = NAV.find(n => n.id === page);

  // ── Navigate: ONLY sets state, never routes ───────────────────────────────
  function navigate(e, p) {
    e.preventDefault();
    e.stopPropagation();
    setPage(p);
    if (window.innerWidth < 1024) setSideOpen(false);
  }

  return (
    // Full viewport — no site header/footer offset needed (SiteShell removed them)
    <div className="flex min-h-screen" style={{ background:C.bg }}>

      {/* Mobile overlay */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/60 lg:hidden"
          style={{ zIndex:150 }} onClick={() => setSideOpen(false)} />
      )}

      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      {/* Full height, starts at top-0 (no site header anymore) */}
      <aside className={`
          fixed top-0 left-0 h-screen z-[160]
          w-56 lg:w-60 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sideOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background:C.bg2, borderRight:`1px solid ${C.bdr}` }}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5"
          style={{ borderBottom:`1px solid ${C.bdr}` }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
            >
              <img src="/assets/logo.jpeg" alt="/assets/logo.png" className="rounded-3xl"/>
            </div>
          <div>
            <div className="text-[9px] tracking-[2px]" style={{ color:C.tx3 }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <p className="text-[9px] font-bold tracking-widest px-2 mb-2 mt-1" style={{ color:C.tx3 }}>MAIN MENU</p>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              /* type="button" prevents any form-submit behaviour */
              <button
                key={n.id}
                type="button"
                onClick={e => navigate(e, n.id)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl mb-1 text-sm text-left relative transition-all duration-200"
                style={{
                  background: active ? `linear-gradient(90deg,${C.amber}22,${C.amber}06)` : "transparent",
                  color: active ? C.amber : C.tx2, fontWeight: active ? 700 : 400,
                  border:"none", cursor:"pointer",
                }}>
                {active && <span className="absolute left-0 top-[18%] bottom-[18%] w-[3px] rounded-r-sm" style={{ background:C.amber }} />}
                <span className="text-base leading-none" style={{ opacity: active ? 1 : .4 }}>{n.icon}</span>
                <span className="flex-1">{n.label}</span>
                {n.id === "contacts" && pending > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:C.red, color:"#fff" }}>{pending}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4" style={{ borderTop:`1px solid ${C.bdr}` }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background:`linear-gradient(135deg,${C.teal}50,${C.tealD}30)` }}>👤</div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate" style={{ color:C.tx }}>NavsafarAdmin</div>
              <div className="text-[10px]" style={{ color:C.tx3 }}>Administrator</div>
            </div>
          </div>
          <button type="button" onClick={onLogout}
            className="w-full py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
            style={{ background:"transparent", border:`1px solid ${C.bdr2}`, color:C.tx2, cursor:"pointer" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(244,63,94,.4)"; e.currentTarget.style.color=C.red; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.bdr2; e.currentTarget.style.color=C.tx2; }}>
            ↩ Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sideOpen ? "lg:ml-60" : ""}`}>

        {/*
          TOPBAR — deliberately minimal so it blends into the content area
          NOT styled like a navigation bar — just a slim utility strip
        */}
        <div className="sticky top-0 z-[140] flex items-center justify-between px-4 lg:px-6 h-11"
          style={{ background:`${C.bg}f8`, borderBottom:`1px solid ${C.bdr}` }}>

          <div className="flex items-center gap-3">
            {/* Hamburger — only shows when sidebar is closed */}
            <button type="button" onClick={() => setSideOpen(v => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors"
              style={{ background:"transparent", border:`1px solid ${C.bdr}`, color:C.tx2, cursor:"pointer" }}>
              ☰
            </button>
            {/* Breadcrumb style: panel name / page name */}
            <span className="text-xs" style={{ color:C.tx3 }}>
              Admin
              <span className="mx-1.5" style={{ color:C.bdr2 }}>/</span>
              <span className="font-semibold" style={{ color:C.tx2 }}>{current?.label}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {loading && <Spinner sm />}
            {toast && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium ns-in"
                style={{
                  background: toast.type === "success" ? "rgba(16,185,129,.12)" : "rgba(244,63,94,.12)",
                  color:       toast.type === "success" ? "#34d399" : "#fda4af",
                  border:`1px solid ${toast.type === "success" ? "#10b98140" : "#f43f5e40"}`,
                }}>
                {toast.type === "success" ? "✓" : "✕"} {toast.msg}
              </div>
            )}
            <span className="hidden sm:block text-[11px] px-2.5 py-1 rounded-lg"
              style={{ color:C.tx3, background:C.surf, border:`1px solid ${C.bdr}` }}>
              {new Date().toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          {page === "dashboard" && <DashboardPage packages={packages} contacts={contacts} navigate={navigate} />}
          {page === "packages"  && <PackagesPage  packages={packages} reload={loadPackages} toast={showToast} />}
          {page === "contacts"  && <ContactsPage  contacts={contacts} reload={loadContacts} toast={showToast} />}
        </div>
      </div>
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
    { icon:"⊞",  val:packages.length, lbl:"Packages",  clr:C.amber,   bg:`${C.amber}12` },
    { icon:"⭐", val:popular,          lbl:"Popular",   clr:"#f472b6", bg:"rgba(244,114,182,.1)" },
    { icon:"◎",  val:contacts.length,  lbl:"Inquiries", clr:C.teal,    bg:`${C.teal}12` },
    { icon:"⏳", val:pending,          lbl:"Pending",   clr:C.red,     bg:`${C.red}12` },
    { icon:"✓",  val:responded,        lbl:"Responded", clr:C.green,   bg:`${C.green}12` },
  ];

  const catBreakdown = useMemo(() => {
    const m = {};
    packages.forEach(p => (p.category ?? []).forEach(c => { m[c] = (m[c] || 0) + 1; }));
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [packages]);

  const maxCat = catBreakdown[0]?.[1] || 1;

  return (
    <div className="ns-up space-y-5 max-w-7xl">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <div key={s.lbl}
            className="rounded-xl p-4 relative overflow-hidden transition-all duration-200 cursor-default"
            style={{ background:C.surf, border:`1px solid ${C.bdr}` }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; }}>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:`linear-gradient(90deg,${s.clr},transparent)` }} />
            <div className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background:s.bg }}>{s.icon}</div>
            <div className="text-2xl font-black leading-none mb-1" style={{ color:s.clr }}>{s.val}</div>
            <div className="text-xs font-semibold" style={{ color:C.tx }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Panel>
          <PanelTitle>Quick Actions</PanelTitle>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { icon:"＋", lbl:"Add Package",   sub:"New package",   clr:C.amber, p:"packages" },
              { icon:"◎",  lbl:"View Contacts", sub:"See inquiries", clr:C.teal,  p:"contacts" },
            ].map(a => (
              <button key={a.lbl} type="button" onClick={e => navigate(e, a.p)}
                className="rounded-xl p-4 text-left transition-all duration-200"
                style={{ background:C.bg2, border:`1px solid ${C.bdr}`, cursor:"pointer" }}
                onMouseEnter={e2 => { e2.currentTarget.style.borderColor=a.clr+"55"; e2.currentTarget.style.background=a.clr+"0a"; }}
                onMouseLeave={e2 => { e2.currentTarget.style.borderColor=C.bdr; e2.currentTarget.style.background=C.bg2; }}>
                <div className="text-xl mb-2">{a.icon}</div>
                <div className="text-sm font-bold mb-0.5" style={{ color:C.tx }}>{a.lbl}</div>
                <div className="text-xs" style={{ color:C.tx3 }}>{a.sub}</div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle>Package Categories</PanelTitle>
          <div className="mt-4 space-y-3">
            {catBreakdown.length === 0 && <p className="text-sm" style={{ color:C.tx3 }}>No packages yet.</p>}
            {catBreakdown.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-medium capitalize" style={{ color:C.tx2 }}>{cat}</span>
                  <span className="text-xs" style={{ color:C.tx3 }}>{count}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background:C.bg2 }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ background:`linear-gradient(90deg,${C.amber},${C.amberD})`, width:`${(count/maxCat)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel>
        <div className="flex items-center justify-between mb-4">
          <PanelTitle>Recent Inquiries</PanelTitle>
          <button type="button" onClick={e => navigate(e, "contacts")} className="text-xs font-semibold"
            style={{ background:"none", border:"none", color:C.amber, cursor:"pointer" }}>View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth:380 }}>
            <thead>
              <tr>{["Name","Subject","Phone","Status","Date"].map(h => (
                <th key={h} className="text-left py-2 px-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color:C.tx3 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {contacts.slice(0,6).length === 0
                ? <tr><td colSpan={5} className="text-center py-8 text-sm" style={{ color:C.tx3 }}>No inquiries yet.</td></tr>
                : contacts.slice(0,6).map(c => (
                    <HoverRow key={c.id}>
                      <td className="py-2 px-3 border-t text-sm" style={{ borderColor:C.bdr }}><strong style={{ color:C.tx }}>{c.name}</strong></td>
                      <td className="py-2 px-3 border-t text-sm max-w-[120px] truncate" style={{ borderColor:C.bdr, color:C.tx2 }}>{c.subject || "—"}</td>
                      <td className="py-2 px-3 border-t text-sm whitespace-nowrap" style={{ borderColor:C.bdr, color:C.tx2 }}>{c.phone || "—"}</td>
                      <td className="py-2 px-3 border-t" style={{ borderColor:C.bdr }}><StatusPill status={c.status} /></td>
                      <td className="py-2 px-3 border-t text-xs whitespace-nowrap" style={{ borderColor:C.bdr, color:C.tx3 }}>{c.date || "—"}</td>
                    </HoverRow>
                  ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGES PAGE
// ─────────────────────────────────────────────────────────────────────────────
function PackagesPage({ packages, reload, toast }) {
  const [modal,  setModal]  = useState(null);
  const [item,   setItem]   = useState({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() =>
    search ? packages.filter(p => JSON.stringify(p).toLowerCase().includes(search.toLowerCase())) : packages,
    [packages, search]
  );

  function openAdd()     { setItem({});        setModal("add");  }
  function openEdit(pkg) { setItem({ ...pkg }); setModal("edit"); }
  function closeModal()  { setModal(null);      setItem({});      }

  async function save() {
    if (!item.title?.trim()) { toast("Title is required", "error"); return; }
    setSaving(true);
    const r = modal === "edit" ? await apiPut("/api/admin/packages", item) : await apiPost("/api/admin/packages", item);
    if (r.success) { toast(modal === "edit" ? "Package updated ✅" : "Package created ✅"); closeModal(); reload(); }
    else toast(r.message, "error");
    setSaving(false);
  }

  async function del(id, title) {
    if (!confirm(`Delete "${title}"?`)) return;
    const r = await apiDelete(`/api/admin/packages?id=${id}`);
    if (r.success) { toast("Deleted ✅"); reload(); } else toast(r.message, "error");
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(packages, null, 2)], { type:"application/json" });
    Object.assign(document.createElement("a"), { href:URL.createObjectURL(blob), download:`navsafar_packages_${Date.now()}.json` }).click();
    toast("Exported ✅");
  }

  async function importJSON(e) {
    const file = e.target.files[0]; if (!file) return;
    try {
      const arr = JSON.parse(await file.text());
      if (!Array.isArray(arr)) { toast("Must be a JSON array", "error"); return; }
      let ok = 0;
      for (const pkg of arr) { const r = await apiPost("/api/admin/packages", pkg); if (r.success) ok++; }
      toast(`Imported ${ok} packages ✅`); reload();
    } catch { toast("Could not parse file", "error"); }
    e.target.value = "";
  }

  return (
    <div className="ns-up space-y-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color:C.tx }}>Package Management</h2>
          <p className="text-xs mt-0.5" style={{ color:C.tx3 }}>{packages.length} total · {filtered.length} shown</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <SearchBox value={search} onChange={setSearch} placeholder="Search…" />
          <GhostBtn onClick={exportJSON}>⬇ Export</GhostBtn>
          <label className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            style={{ background:"transparent", border:`1px solid ${C.bdr2}`, color:C.tx2 }}>
            ⬆ Import <input type="file" accept=".json" className="hidden" onChange={importJSON} />
          </label>
          <PrimaryBtn onClick={openAdd}>+ Add Package</PrimaryBtn>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background:C.surf, border:`1px solid ${C.bdr}` }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth:660 }}>
            <thead>
              <tr style={{ background:C.bg2 }}>
                {["#","Image","Title / Location","Category","Duration","Rating","Status","Actions"].map(h => (
                  <th key={h} className="py-3 px-3 text-left text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color:C.tx3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-14 text-sm" style={{ color:C.tx3 }}>
                  {packages.length === 0 ? "No packages yet. Click '+ Add Package' or import your data." : "No matches found."}
                </td></tr>
              )}
              {filtered.map((p, i) => (
                <HoverRow key={p.id}>
                  <td className="py-3 px-3 border-t text-xs" style={{ borderColor:C.bdr, color:C.tx3 }}>{i+1}</td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr }}>
                    {/* PackageImg handles all external URLs including Google Drive */}
                    <PackageImg src={p.image} className="w-12 h-8 object-cover rounded-md" style={{ border:`1px solid ${C.bdr}` }} />
                  </td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr, maxWidth:180 }}>
                    <div className="text-sm font-semibold truncate" style={{ color:C.tx }}>{p.title}</div>
                    <div className="text-xs mt-0.5 truncate" style={{ color:C.tx3 }}>{[p.city,p.country].filter(Boolean).join(", ")}</div>
                  </td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr }}>
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(p.category) ? p.category : []).slice(0,2).map(c => (
                        <span key={c} className="text-[10px] font-semibold capitalize px-2 py-0.5 rounded whitespace-nowrap"
                          style={{ color:C.amber, background:`${C.amber}12`, border:`1px solid ${C.amber}25` }}>{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 border-t text-xs whitespace-nowrap" style={{ borderColor:C.bdr, color:C.tx2 }}>{p.duration || "—"}</td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr }}>
                    {p.rating ? <span className="text-xs font-bold" style={{ color:C.amber }}>★ {p.rating}</span> : <span style={{ color:C.tx3 }}>—</span>}
                  </td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr }}>
                    {(p.popular===true||p.popular==="true")
                      ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap" style={{ color:"#34d399", background:"rgba(52,211,153,.12)", border:"1px solid rgba(52,211,153,.2)" }}>Popular</span>
                      : <span className="text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap" style={{ color:C.tx3, background:C.bg2, border:`1px solid ${C.bdr}` }}>Standard</span>}
                  </td>
                  <td className="py-3 px-3 border-t" style={{ borderColor:C.bdr }}>
                    <div className="flex gap-1.5">
                      <ActionBtn color="blue" onClick={() => openEdit(p)}>Edit</ActionBtn>
                      <ActionBtn color="red"  onClick={() => del(p.id, p.title)}>Del</ActionBtn>
                    </div>
                  </td>
                </HoverRow>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Add New Package" : "Edit Package"} onClose={closeModal} wide>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5">
            {PKG_FIELDS.map(f => {
              const val = Array.isArray(item[f.k]) ? item[f.k].join(", ") : (item[f.k] ?? "");
              return (
                <div key={f.k} className={f.col === "full" ? "sm:col-span-2" : ""}>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color:C.tx3 }}>{f.l}</label>
                  {f.type === "textarea"
                    ? <textarea rows={3} value={val} onChange={e => setItem(prev => ({ ...prev, [f.k]:e.target.value }))}
                        className="w-full text-sm rounded-lg px-3 py-2 outline-none resize-y"
                        style={{ background:C.bg, border:`1px solid ${C.bdr2}`, color:C.tx }} />
                    : f.type === "select"
                    ? <select value={String(item[f.k] ?? "false")} onChange={e => setItem(prev => ({ ...prev, [f.k]:e.target.value }))}
                        className="w-full text-sm rounded-lg px-3 py-2 outline-none"
                        style={{ background:C.bg, border:`1px solid ${C.bdr2}`, color:C.tx }}>
                        {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    : <input type={f.type} step={f.type==="number"?"0.1":undefined} value={val}
                        onChange={e => setItem(prev => ({ ...prev, [f.k]:e.target.value }))}
                        placeholder={f.l} className="w-full text-sm rounded-lg px-3 py-2 outline-none"
                        style={{ background:C.bg, border:`1px solid ${C.bdr2}`, color:C.tx }} />}
                </div>
              );
            })}
            {/* Image preview — uses PackageImg for proper external URL handling */}
            {item.image && (
              <div className="sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color:C.tx3 }}>Preview</p>
                <PackageImg src={item.image} className="w-full object-cover rounded-lg"
                  style={{ height:100, border:`1px solid ${C.bdr}` }} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-end px-5 py-4 border-t" style={{ borderColor:C.bdr }}>
            <GhostBtn onClick={closeModal}>Cancel</GhostBtn>
            <PrimaryBtn onClick={save} disabled={saving}>{saving ? "Saving…" : modal==="add" ? "Create Package" : "Save Changes"}</PrimaryBtn>
          </div>
        </Modal>
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
    const ms = !search || JSON.stringify(c).toLowerCase().includes(search.toLowerCase());
    const mf = filter === "all" || c.status === filter;
    return ms && mf;
  }), [contacts, search, filter]);

  async function updateStatus(id, status) {
    const r = await apiPut("/api/admin/contacts", { id, status });
    if (r.success) { toast("Status updated ✅"); reload(); } else toast(r.message, "error");
  }

  async function del(id, name) {
    if (!confirm(`Delete inquiry from "${name}"?`)) return;
    const r = await apiDelete(`/api/admin/contacts?id=${id}`);
    if (r.success) { toast("Deleted ✅"); reload(); } else toast(r.message, "error");
  }

  const tabDef = [
    { k:"all",       lbl:"All",       clr:C.teal  },
    { k:"pending",   lbl:"Pending",   clr:C.red   },
    { k:"responded", lbl:"Responded", clr:C.green },
    { k:"closed",    lbl:"Closed",    clr:C.tx3   },
  ];

  const statusConf = {
    pending:   { clr:"#fbbf24", bd:"rgba(245,158,11,.3)"  },
    responded: { clr:"#34d399", bd:"rgba(52,211,153,.3)"  },
    closed:    { clr:"#94a3b8", bd:"rgba(148,163,184,.2)" },
  };

  return (
    <div className="ns-up space-y-4 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color:C.tx }}>Contact Inquiries</h2>
          <p className="text-xs mt-0.5" style={{ color:C.tx3 }}>{contacts.length} total · {counts.pending} pending</p>
        </div>
        <SearchBox value={search} onChange={setSearch} placeholder="Search contacts…" />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabDef.map(t => {
          const active = filter === t.k;
          return (
            <button key={t.k} type="button" onClick={() => setFilter(t.k)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{ border:`1px solid ${active ? t.clr+"60" : C.bdr}`, background: active ? `${t.clr}15` : "transparent", color: active ? t.clr : C.tx2, fontWeight: active ? 700 : 400, cursor:"pointer" }}>
              {t.lbl}
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: active ? `${t.clr}25` : C.bg2, color: active ? t.clr : C.tx3 }}>
                {counts[t.k]}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && <div className="text-center py-14 text-sm" style={{ color:C.tx3 }}>No contacts match your filter.</div>}

      <div className="space-y-3">
        {filtered.map((c) => {
          const sd = statusConf[c.status] ?? statusConf.pending;
          return (
            <div key={c.id} className="rounded-xl p-4 transition-all duration-200"
              style={{ background:C.surf, border:`1px solid ${C.bdr}` }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,.3)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                    style={{ background:`linear-gradient(135deg,${C.teal}40,${C.tealD}20)`, border:`1px solid ${C.teal}30` }}>
                    {c.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold" style={{ color:C.tx }}>{c.name}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] mt-0.5" style={{ color:C.tx3 }}>
                      {c.email && <span className="truncate max-w-[160px]">✉ {c.email}</span>}
                      {c.phone && <span className="whitespace-nowrap">📱 {c.phone}</span>}
                      <span>📅 {c.date || c.createdAt?.slice(0,10) || "—"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                  <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background:C.bg2, border:`1px solid ${sd.bd}`, color:sd.clr, cursor:"pointer" }}>
                    <option value="pending">⏳ Pending</option>
                    <option value="responded">✓ Responded</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                  <button type="button" onClick={() => del(c.id, c.name)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ color:"#fda4af", background:"rgba(244,63,94,.1)", border:"1px solid rgba(244,63,94,.2)", cursor:"pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t pt-3 space-y-1" style={{ borderColor:C.bdr }}>
                {c.subject && <p className="text-sm font-bold" style={{ color:C.amber }}>{c.subject}</p>}
                {c.packageInterest && <p className="text-xs" style={{ color:C.teal }}>🎒 {c.packageInterest}</p>}
                <p className="text-sm leading-relaxed" style={{ color:C.tx2 }}>{c.message}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t" style={{ borderColor:C.bdr }}>
                <StatusPill status={c.status} />
                {c.email && <a href={`mailto:${c.email}`} className="text-xs font-medium" style={{ color:"#60a5fa" }}>✉ Email</a>}
                {c.phone && <a href={`tel:${c.phone}`}    className="text-xs font-medium" style={{ color:"#34d399" }}>📞 Call</a>}
                {c.phone && <a href={`https://wa.me/91${c.phone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="text-xs font-medium" style={{ color:"#4ade80" }}>💬 WhatsApp</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-start justify-center px-4 py-6 overflow-y-auto"
      style={{ background:"rgba(0,0,0,.82)", backdropFilter:"blur(4px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full my-auto rounded-2xl ns-up" style={{ background:C.bg2, border:`1px solid ${C.bdr2}`, maxWidth: wide ? 680 : 460, boxShadow:"0 32px 80px rgba(0,0,0,.6)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:C.bdr }}>
          <span className="text-base font-bold" style={{ color:C.tx }}>{title}</span>
          <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-xl leading-none"
            style={{ background:"transparent", border:`1px solid ${C.bdr}`, color:C.tx2, cursor:"pointer" }}>×</button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Panel({ children }) {
  return <div className="rounded-xl p-5" style={{ background:C.surf, border:`1px solid ${C.bdr}` }}>{children}</div>;
}

function PanelTitle({ children }) {
  return <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color:C.tx3 }}>{children}</h3>;
}

function HoverRow({ children }) {
  const [h, setH] = useState(false);
  return <tr style={{ background: h ? C.surf2 : "transparent", transition:"background .15s" }} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</tr>;
}

function StatusPill({ status }) {
  const m = { pending:{ c:"#fbbf24", bg:"rgba(245,158,11,.12)" }, responded:{ c:"#34d399", bg:"rgba(52,211,153,.12)" }, closed:{ c:"#94a3b8", bg:"rgba(148,163,184,.08)" } };
  const s = m[status] ?? m.pending;
  return <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ color:s.c, background:s.bg }}>{status}</span>;
}

function SearchBox({ value, onChange, placeholder }) {
  const [foc, setFoc] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 transition-all duration-200" style={{ background:C.surf, border:`1px solid ${foc ? C.amber+"40" : C.bdr}`, minHeight:36 }}>
      <span className="text-sm" style={{ color:C.tx3 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFoc(true)} onBlur={() => setFoc(false)}
        className="bg-transparent text-sm py-2 outline-none min-w-0 w-36 sm:w-44"
        style={{ color:C.tx, border:"none" }} />
      {value && <button type="button" onClick={() => onChange("")} className="text-sm" style={{ background:"none", border:"none", color:C.tx3, cursor:"pointer" }}>×</button>}
    </div>
  );
}

function GhostBtn({ children, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick}
      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200"
      style={{ background:"transparent", border:`1px solid ${C.bdr2}`, color: h ? C.tx : C.tx2, cursor:"pointer" }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick, disabled }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200"
      style={{
        background: disabled ? C.tx3 : h ? C.amberL : C.amber,
        color: disabled ? "#555" : "#0d0d0d", border:"none",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: !disabled && h ? `0 4px 14px ${C.amber}40` : "none",
      }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function ActionBtn({ children, onClick, color }) {
  const [h, setH] = useState(false);
  const blue = color === "blue";
  return (
    <button type="button" onClick={onClick}
      className="text-xs font-semibold px-2.5 py-1 rounded-md transition-all duration-150"
      style={{
        color:      h ? "#fff" : blue ? "#60a5fa" : "#fda4af",
        background: h ? (blue ? "rgba(96,165,250,.25)" : "rgba(244,63,94,.25)") : (blue ? "rgba(96,165,250,.1)" : "rgba(244,63,94,.1)"),
        border:`1px solid ${blue ? "rgba(96,165,250,.3)" : "rgba(244,63,94,.3)"}`, cursor:"pointer",
      }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
      {children}
    </button>
  );
}

function Spinner({ sm }) {
  const sz = sm ? 14 : 18;
  return <div className="ns-spin flex-shrink-0 rounded-full border-2" style={{ width:sz, height:sz, borderColor:C.bdr2, borderTopColor:C.amber }} />;
}