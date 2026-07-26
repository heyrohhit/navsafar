// src/app/admin/settings/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// ⚙️ SETTINGS — Dynamic Business Configuration
//
// Edit NAP (Name / Address / Phone), social links, geo coordinates,
// opening hours, and all other business data used for SEO/AEO/GEO/XOS
// structured data generation.
//
// Changes go LIVE immediately — no redeploy needed.
// All pages, schemas, and meta tags automatically reflect updates.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Link,
  Image,
  DollarSign,
  CreditCard,
  Languages,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Map,
  Smartphone,
} from "lucide-react";

const getToken = () =>
  typeof window !== "undefined"
    ? sessionStorage.getItem("ns_admin_token")
    : "";

const defaultSettings = {
  legalName: "NavSafar Travel Solutions",
  brandName: "NavSafar",
  description: "",
  phone: "",
  email: "",
  address: {
    streetAddress: "",
    addressLocality: "",
    addressRegion: "",
    postalCode: "",
    addressCountry: "IN",
  },
  geo: {
    latitude: 28.6090,
    longitude: 77.1075,
  },
  geoRegion: "IN-DL",
  geoPlacename: "New Delhi, India",
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "",
  openingHours: {
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:30",
    closes: "19:30",
  },
  sameAs: ["", "", "", "", ""],
  languages: ["en-IN", "hi-IN"],
  logoUrl: "",
  defaultOgImage: "",
  themeColor: "#0F6177",
  pinterestRichPin: "enabled",
  rating: "General",
  revisitAfter: "1 day",
};

export default function AdminSettings() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [extras, setExtras] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }
  const [activeTab, setActiveTab] = useState("business");

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push("/admin/login");
          return;
        }
        const res = await fetch("/api/admin/packages", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          sessionStorage.removeItem("ns_admin_token");
          sessionStorage.removeItem("ns_admin_email");
          router.push("/admin/login");
          return;
        }
        setAuthenticated(true);
      } catch (error) {
        console.error("[Settings] Auth check failed:", error);
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const json = await res.json();
      if (json.success) {
        // Merge with defaults so all fields are present
        const merged = { ...defaultSettings, ...json.data, extras: json.extras || {} };
        setSettings(merged);
        setExtras(json.extras || {});
      }
    } catch (error) {
      console.error("[Settings] Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchSettings();
    }
  }, [authenticated, fetchSettings]);

  // Helper to update nested fields
  const updateField = (path, value) => {
    setSettings((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]] = { ...obj[keys[i]] };
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateDay = (index, value) => {
    setSettings((prev) => {
      const days = [...prev.openingHours.dayOfWeek];
      if (value) {
        days[index] = value;
      } else {
        days.splice(index, 1);
      }
      return { ...prev, openingHours: { ...prev.openingHours, dayOfWeek: days } };
    });
  };

  const addDay = () => {
    setSettings((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        dayOfWeek: [...prev.openingHours.dayOfWeek, "Sunday"],
      },
    }));
  };

  const updateSocial = (index, value) => {
    setSettings((prev) => {
      const links = [...prev.sameAs];
      links[index] = value;
      return { ...prev, sameAs: links };
    });
  };

  const addSocial = () => {
    setSettings((prev) => ({
      ...prev,
      sameAs: [...prev.sameAs, ""],
    }));
  };

  const removeSocial = (index) => {
    setSettings((prev) => ({
      ...prev,
      sameAs: prev.sameAs.filter((_, i) => i !== index),
    }));
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Build the data object (only changed fields)
      const data = {};

      // Scalars
      const scalarFields = [
        "legalName", "brandName", "description", "phone", "email",
        "geoRegion", "geoPlacename", "priceRange", "currenciesAccepted",
        "paymentAccepted", "logoUrl", "defaultOgImage", "themeColor",
        "pinterestRichPin", "rating", "revisitAfter",
      ];
      for (const field of scalarFields) {
        if (settings[field] !== undefined) {
          data[field] = settings[field];
        }
      }

      // Objects
      data.address = settings.address;
      data.geo = settings.geo;
      data.openingHours = settings.openingHours;
      data.sameAs = settings.sameAs.filter(Boolean);
      data.languages = settings.languages;

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ data }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ type: "success", text: "✅ Settings saved successfully! Changes are live now. SEO/AEO/GEO/XOS schemas will reflect updates instantly." });
        // Purge business-config cache
        fetch("/api/business-config?revalidate=true", { method: "POST" }).catch(() => {});
      } else {
        setMessage({ type: "error", text: json.message || "Failed to save settings." });
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Network error." });
    } finally {
      setSaving(false);
    }
  };

  // ── Auth Loading ──
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
      </div>
    );
  }

  if (!authenticated) return null;

  // ── Field component ──
  const Field = ({ label, icon: Icon, children, help }) => (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
        {Icon && <Icon size={16} className="text-amber-400" />}
        {label}
      </label>
      {children}
      {help && <p className="text-xs text-slate-500">{help}</p>}
    </div>
  );

  const Input = ({ path, value, ...props }) => (
    <input
      value={value ?? ""}
      onChange={(e) => updateField(path, e.target.value)}
      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
      {...props}
    />
  );

  const TextArea = ({ path, value, ...props }) => (
    <textarea
      value={value ?? ""}
      onChange={(e) => updateField(path, e.target.value)}
      rows={3}
      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none resize-y"
      {...props}
    />
  );

  // ── Tabs ──
  const tabs = [
    { id: "business", label: "Business Info", icon: Building2 },
    { id: "contact", label: "Contact & Address", icon: MapPin },
    { id: "social", label: "Social & Links", icon: Link },
    { id: "hours", label: "Opening Hours", icon: Clock },
    { id: "geo", label: "Geo & SEO", icon: Map },
    { id: "advanced", label: "Advanced", icon: Smartphone },
  ];

  // ── Main Render ──
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Building2 className="text-amber-400" size={28} />
            Settings
          </h1>
          <p className="text-slate-400 text-sm">
            Edit business information used for SEO/AEO/GEO/XOS structured data.
            Changes go live immediately — no redeploy needed.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-60 shadow-lg shadow-amber-500/25"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-3 p-4 rounded-xl border ${
            message.type === "success"
              ? "bg-green-900/30 border-green-700/50 text-green-300"
              : "bg-red-900/30 border-red-700/50 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{message.text}</p>
          <button
            onClick={() => setMessage(null)}
            className="ml-auto text-slate-500 hover:text-white shrink-0"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* GEO/XOS Impact Banner */}
      <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-800/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Globe size={24} className="text-blue-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-blue-300 font-semibold mb-1">
              🌐 GEO + XOS Impact
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              These settings power all structured data on the website. AI engines
              (ChatGPT, Perplexity, Google AI Overviews, Gemini) use this data to
              generate accurate answers about your business. Updated NAP (Name,
              Address, Phone), fresh geo coordinates, and complete social profiles
              help search engines trust and rank your site higher.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-amber-400" />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-800/80 text-amber-400 border border-slate-700 border-b-transparent"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* ═══ BUSINESS INFO ═══ */}
            {activeTab === "business" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Legal Name" icon={Building2}>
                    <Input path="legalName" value={settings.legalName} />
                  </Field>
                  <Field label="Brand Name" icon={Building2}>
                    <Input path="brandName" value={settings.brandName} />
                  </Field>
                </div>

                <Field label="Business Description" icon={Building2} help="Used in JSON-LD schema description & meta description fallbacks">
                  <TextArea path="description" value={settings.description} />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field label="Price Range" icon={DollarSign}>
                    <Input path="priceRange" value={settings.priceRange} />
                  </Field>
                  <Field label="Currency" icon={CreditCard}>
                    <Input path="currenciesAccepted" value={settings.currenciesAccepted} />
                  </Field>
                  <Field label="Payment Methods" icon={CreditCard}>
                    <Input path="paymentAccepted" value={settings.paymentAccepted} />
                  </Field>
                </div>

                <Field label="Languages" icon={Languages} help="Comma-separated language codes (e.g., en-IN, hi-IN)">
                  <Input
                    value={Array.isArray(settings.languages) ? settings.languages.join(", ") : settings.languages}
                    onChange={(e) => updateField("languages", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                  />
                </Field>
              </div>
            )}

            {/* ═══ CONTACT & ADDRESS ═══ */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Phone" icon={Phone}>
                    <Input path="phone" value={settings.phone} type="tel" />
                  </Field>
                  <Field label="Email" icon={Mail}>
                    <Input path="email" value={settings.email} type="email" />
                  </Field>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin size={18} className="text-amber-400" />
                    Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Street Address">
                      <Input path="address.streetAddress" value={settings.address?.streetAddress} />
                    </Field>
                    <Field label="Locality">
                      <Input path="address.addressLocality" value={settings.address?.addressLocality} />
                    </Field>
                    <Field label="Region">
                      <Input path="address.addressRegion" value={settings.address?.addressRegion} />
                    </Field>
                    <Field label="Postal Code">
                      <Input path="address.postalCode" value={settings.address?.postalCode} />
                    </Field>
                    <Field label="Country Code">
                      <Input path="address.addressCountry" value={settings.address?.addressCountry} />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ SOCIAL & LINKS ═══ */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <p className="text-slate-400 text-sm">
                  Social profile URLs help AI engines (ChatGPT, Perplexity, Google)
                  verify your brand authority. Add all active profiles.
                </p>

                {settings.sameAs?.map((url, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <Field label={`Social Link #${index + 1}`} icon={Link}>
                        <Input
                          value={url}
                          onChange={(e) => updateSocial(index, e.target.value)}
                          placeholder="https://..."
                        />
                      </Field>
                    </div>
                    {settings.sameAs.length > 1 && (
                      <button
                        onClick={() => removeSocial(index)}
                        className="mt-6 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addSocial}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 border border-dashed border-slate-700 rounded-xl hover:border-amber-500/50 transition-all"
                >
                  + Add Social Link
                </button>

                <div className="border-t border-slate-800 pt-6 space-y-6">
                  <Field label="Logo URL" icon={Image} help="Full URL to your logo image">
                    <Input path="logoUrl" value={settings.logoUrl} />
                  </Field>
                  <Field label="Default OG Image" icon={Image} help="Used for social sharing previews">
                    <Input path="defaultOgImage" value={settings.defaultOgImage} />
                  </Field>
                </div>
              </div>
            )}

            {/* ═══ OPENING HOURS ═══ */}
            {activeTab === "hours" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Opens" icon={Clock}>
                    <Input path="openingHours.opens" value={settings.openingHours?.opens} type="time" />
                  </Field>
                  <Field label="Closes" icon={Clock}>
                    <Input path="openingHours.closes" value={settings.openingHours?.closes} type="time" />
                  </Field>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                    <Clock size={16} className="text-amber-400" />
                    Open Days
                  </label>
                  {settings.openingHours?.dayOfWeek?.map((day, index) => (
                    <div key={index} className="flex items-center gap-3 mb-2">
                      <input
                        value={day}
                        onChange={(e) => updateDay(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
                      />
                      <button
                        onClick={() => updateDay(index, "")}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addDay}
                    className="mt-2 flex items-center gap-2 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 border border-dashed border-slate-700 rounded-xl hover:border-amber-500/50 transition-all"
                  >
                    + Add Day
                  </button>
                </div>
              </div>
            )}

            {/* ═══ GEO & SEO ═══ */}
            {activeTab === "geo" && (
              <div className="space-y-6">
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-xl p-4">
                  <p className="text-blue-300 text-sm flex items-center gap-2">
                    <Map size={16} />
                    Geo coordinates are used for GEO meta tags (geo.region, geo.position, ICBM)
                    and LocalBusiness JSON-LD. Accurate coordinates help AI engines geo-target
                    your business correctly to Indian users.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Latitude" icon={Map}>
                    <Input path="geo.latitude" value={settings.geo?.latitude} type="number" step="0.0001" />
                  </Field>
                  <Field label="Longitude" icon={Map}>
                    <Input path="geo.longitude" value={settings.geo?.longitude} type="number" step="0.0001" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Geo Region" icon={Globe} help="ISO 3166-2 region code (e.g., IN-DL)">
                    <Input path="geoRegion" value={settings.geoRegion} />
                  </Field>
                  <Field label="Geo Placename" icon={Globe} help="Human-readable location (e.g., New Delhi, India)">
                    <Input path="geoPlacename" value={settings.geoPlacename} />
                  </Field>
                </div>
              </div>
            )}

            {/* ═══ ADVANCED ═══ */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                <Field label="Theme Color" icon={Smartphone} help="PWA theme-color meta tag">
                  <Input path="themeColor" value={settings.themeColor} type="color" className="w-20 h-10 p-1" />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field label="Pinterest Rich Pin" icon={Link}>
                    <select
                      value={settings.pinterestRichPin ?? "enabled"}
                      onChange={(e) => updateField("pinterestRichPin", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
                    >
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </Field>

                  <Field label="Rating" icon={StarIcon}>
                    <select
                      value={settings.rating ?? "General"}
                      onChange={(e) => updateField("rating", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
                    >
                      <option value="General">General</option>
                      <option value="Safe">Safe</option>
                      <option value="Mature">Mature</option>
                      <option value="Restricted">Restricted</option>
                    </select>
                  </Field>

                  <Field label="Revisit After" icon={RefreshCw} help="Search engine crawl frequency hint">
                    <select
                      value={settings.revisitAfter ?? "1 day"}
                      onChange={(e) => updateField("revisitAfter", e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all outline-none"
                    >
                      <option value="1 day">1 day</option>
                      <option value="3 days">3 days</option>
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}
          </motion.div>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end pt-6 border-t border-slate-800">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-60 shadow-lg shadow-amber-500/25"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save All Changes"}
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
}

// Inline star icon to avoid import issues
function StarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
