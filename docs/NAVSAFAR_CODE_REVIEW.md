# 🔍 NavSafar Code Review & Issue Analysis

**Project:** NavSafar (Travel Booking Admin Panel)  
**Framework:** Next.js 16 + React 19 + Supabase  
**Analysis Date:** June 25, 2026

---

## 📊 Summary

- **Total Issues Found:** 8
- **🔴 Critical:** 3
- **🟠 High:** 2  
- **🟡 Medium:** 2
- **🟢 Low:** 1

---

## 🔴 CRITICAL ISSUES

### Issue #1: Weak Password Hashing in Auth Route

**Location:** `src/app/api/admin/auth/route.js` (Line 31)

**Problem:**
```javascript
// ❌ INSECURE - Plain string comparison
const passOk = password === validPass;
```

**Why It's Critical:**
- Password is stored as plain text in `.env.local`
- No hashing/salting mechanism
- Environment variables can be leaked
- Not timing-attack resistant (comment claims so, but implementation doesn't use crypto.timingSafeEqual)

**Solution:**
```javascript
// ✅ SECURE - Use crypto.timingSafeEqual
import crypto from 'crypto';

// Generate hash once: 
// node -e "console.log(require('crypto').scryptSync('your-password', 'salt-v1', 32).toString('hex'))"

const getHashedPassword = () => {
  const hashed = process.env.ADMIN_PASSWORD_HASH; // Use hash, not plain password
  if (!hashed) throw new Error('ADMIN_PASSWORD_HASH not configured');
  return Buffer.from(hashed, 'hex');
};

const passOk = crypto.timingSafeEqual(
  crypto.scryptSync(password, 'salt-v1', 32),
  getHashedPassword()
);
```

**Setup Instructions:**
1. Generate hash: `node -e "console.log(require('crypto').scryptSync('your-secure-password', 'salt-v1', 32).toString('hex'))"`
2. Store in `.env.local`: `ADMIN_PASSWORD_HASH=<generated-hash>`
3. Remove `ADMIN_PASSWORD` from `.env.local`

---

### Issue #2: Missing CORS & Rate Limiting on Auth Endpoint

**Location:** `src/app/api/admin/auth/route.js`

**Problem:**
- No rate limiting on login endpoint
- Vulnerable to brute-force attacks
- No CORS protection
- No request throttling

**Impact:**
- Attacker can send unlimited login attempts
- Can guess weak passwords in seconds
- No audit trail of failed attempts

**Solution - Implement Rate Limiting:**

Create `src/lib/rateLimiter.js`:
```javascript
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip) {
  const now = Date.now();
  const attempts = loginAttempts.get(ip) || [];
  
  // Remove old attempts outside window
  const recent = attempts.filter(t => now - t < WINDOW_MS);
  
  if (recent.length >= MAX_ATTEMPTS) {
    return false; // Too many attempts
  }
  
  recent.push(now);
  loginAttempts.set(ip, recent);
  return true;
}

export function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}
```

Update `src/app/api/admin/auth/route.js`:
```javascript
import { checkRateLimit } from "@/lib/rateLimiter";

export async function POST(request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-client-ip") || 
               "unknown";
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Try again in 15 minutes." },
        { status: 429 }
      );
    }
    
    // ... rest of auth logic
  }
}
```

**Add to `next.config.mjs` for CORS headers:**
```javascript
const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
];

export default {
  async headers() {
    return [
      {
        source: '/api/admin/auth',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

### Issue #3: Unvalidated PUT Request in Contacts Route

**Location:** `src/app/api/admin/contacts/route.js` (Lines 98-103)

**Problem:**
```javascript
// ❌ DANGEROUS - Accepts ANY field without validation
contacts[idx] = {
  ...contacts[idx],
  ...body,  // 🔴 What if body contains malicious fields?
  id: contacts[idx].id,
  createdAt: contacts[idx].createdAt,
};
```

**Vulnerability:**
- Admin can accidentally overwrite protected fields
- No validation of input data types
- Could allow SQL injection-like attacks through field names
- No audit trail of what changed

**Solution:**
```javascript
export async function PUT(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const body = await req.json();
    const contacts = readContacts();
    const idx = contacts.findIndex((c) => c.id === body.id);

    if (idx === -1) {
      return NextResponse.json(
        { success: false, message: "Contact not found." },
        { status: 404 }
      );
    }

    // ✅ SAFE - Whitelist allowed fields only
    const allowedFields = {
      status: ['pending', 'contacted', 'resolved', 'closed'],
      priority: ['low', 'normal', 'high'],
    };

    const updates = {};
    
    if (body.status && allowedFields.status.includes(body.status)) {
      updates.status = body.status;
    }
    
    if (body.priority && allowedFields.priority.includes(body.priority)) {
      updates.priority = body.priority;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update." },
        { status: 400 }
      );
    }

    contacts[idx] = {
      ...contacts[idx],
      ...updates,
      // Protected fields always preserved
      id: contacts[idx].id,
      createdAt: contacts[idx].createdAt,
      name: contacts[idx].name,
      email: contacts[idx].email,
      message: contacts[idx].message,
    };

    writeContacts(contacts);
    return NextResponse.json({ success: true, data: contacts[idx], message: "Contact updated." });

  } catch (err) {
    console.error("[PUT /api/admin/contacts]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
```

---

## 🟠 HIGH PRIORITY ISSUES

### Issue #4: Supabase Service Role Key Not Validated

**Location:** `src/lib/supabaseClient.js` (Lines 18-23)

**Problem:**
- No validation if `SUPABASE_SERVICE_ROLE_KEY` is missing
- Falls back to anon key silently (security downgrade)
- Could expose RLS bypass accidentally

**Solution:**
```javascript
export function createSupabaseClient(useServiceRole = false) {
  if (useServiceRole) {
    if (!supabaseServiceKey) {
      throw new Error(
        "Service role key required but not configured. " +
        "Add SUPABASE_SERVICE_ROLE_KEY to .env.local"
      );
    }
    return createClient(supabaseUrl, supabaseServiceKey);
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
```

---

### Issue #5: No Input Validation in Testimonials POST

**Location:** `src/app/api/admin/testimonials/route.js` (Lines 93-98)

**Problem:**
```javascript
// ❌ Minimal validation
if (!body.name || !body.review || !body.rating || !body.trip) {
  return NextResponse.json(...);
}
```

**What's Missing:**
- No rating range validation (should be 1-5)
- No string length limits (XSS vulnerability)
- No email format validation
- No sanitization of user input

**Solution:**
```javascript
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  review: z.string().min(10).max(5000).trim(),
  rating: z.number().min(1).max(5),
  trip: z.string().min(2).max(200).trim(),
  avatar: z.string().url().optional().nullable(),
  location: z.string().max(200).optional().or(z.literal('')),
  travelDate: z.string().optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().regex(/^[0-9\s\-\+\(\)]{0,20}$/).optional().or(z.literal('')),
  isApproved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    const body = await request.json();
    
    // ✅ Validate using schema
    const validated = testimonialSchema.parse(body);
    
    const supabaseAdmin = createSupabaseClient(true);
    
    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert({
        name: validated.name,
        avatar: validated.avatar || null,
        rating: validated.rating,
        review: validated.review,
        trip: validated.trip,
        location: validated.location || "",
        travel_date: validated.travelDate || "",
        email: validated.email || "",
        phone: validated.phone || "",
        is_approved: validated.isApproved || false,
        is_featured: validated.isFeatured || false,
      })
      .select()
      .single();

    if (error) {
      console.error("[POST /api/admin/testimonials]", error);
      return NextResponse.json(
        { success: false, message: "Failed to create testimonial" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Validation error", errors: err.errors },
        { status: 400 }
      );
    }
    console.error("[POST /api/admin/testimonials]", err);
    return NextResponse.json({ success: false, message: "Failed to create testimonial" }, { status: 500 });
  }
}
```

---

## 🟡 MEDIUM PRIORITY ISSUES

### Issue #6: kvStore Missing Error Recovery for Vercel KV Failures

**Location:** `src/lib/kvStore.js` (Lines 125-141)

**Problem:**
```javascript
// If KV fails, data is lost
if (hasKV()) {
  await kvSet(key, json);  // ❌ What if this fails?
  return;
}
```

**Scenario:**
- Network glitch during KV write
- Data is in /tmp but not persisted to KV
- Next deployment loses /tmp data
- Data is gone permanently

**Solution:**
```javascript
export async function kvWrite(key, data) {
  const json = JSON.stringify(data);

  // Always write /tmp first
  try {
    writeTmp(key, json);
  } catch (e) {
    console.error(`[kvWrite:${key}] /tmp write FAILED:`, e.message);
    throw new Error(`Cannot persist data: ${e.message}`);
  }

  // Then write to KV with retry logic
  if (hasKV()) {
    let retries = 3;
    while (retries > 0) {
      try {
        await kvSet(key, json);
        return; // Success
      } catch (err) {
        retries--;
        if (retries === 0) {
          console.error(`[kvWrite:${key}] KV failed after 3 retries. Data in /tmp only.`);
          // Don't throw - /tmp backup is sufficient
          return;
        }
        // Wait before retry
        await new Promise(r => setTimeout(r, 1000 * (4 - retries)));
      }
    }
  } else {
    console.warn(`[kvWrite:${key}] No KV configured — data ephemeral on this instance`);
  }
}
```

---

### Issue #7: No Logging/Audit Trail for Admin Actions

**Location:** All admin API routes

**Problem:**
- No way to track who changed what
- No timestamp for modifications (except createdAt)
- No rollback capability
- Compliance/security audit issues

**Solution - Add Audit Logging:**

Create `src/lib/auditLog.js`:
```javascript
import { kvWrite, kvRead } from "./kvStore";

export async function logAdminAction(action, resource, resourceId, changes, adminEmail = "unknown") {
  const log = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    action, // 'CREATE', 'UPDATE', 'DELETE'
    resource, // 'testimonial', 'package', 'contact'
    resourceId,
    changes, // object showing before/after
    adminEmail,
  };

  const logs = await kvRead("auditLogs") || [];
  logs.unshift(log);
  
  // Keep only last 10,000 logs
  if (logs.length > 10000) logs.pop();
  
  await kvWrite("auditLogs", logs);
}

export async function getAuditLogs(filters = {}) {
  const logs = await kvRead("auditLogs") || [];
  
  let filtered = logs;
  if (filters.resource) {
    filtered = filtered.filter(l => l.resource === filters.resource);
  }
  if (filters.action) {
    filtered = filtered.filter(l => l.action === filters.action);
  }
  
  return filtered;
}
```

Use in testimonials route:
```javascript
import { logAdminAction } from "../../../../lib/auditLog";

export async function POST(request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  try {
    // ... validation and creation code ...
    
    await logAdminAction('CREATE', 'testimonial', data.id, { created: data }, request.headers.get('x-admin-email') || 'admin');
    
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    // ...
  }
}
```

---

### Issue #8: No Pagination/Limits on Contact Search

**Location:** `src/app/api/admin/contacts/route.js` (Line 77-78)

**Problem:**
```javascript
// ❌ Loads ALL contacts into memory
const contacts = readContacts();
return NextResponse.json({ success: true, data: contacts, total: contacts.length });
```

**Issues:**
- If 100K+ contacts, will crash
- No pagination support
- All data transferred in one request
- Frontend can't filter by date/status

**Solution:**
```javascript
export async function GET(req) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status"); // filter by status
    const priority = searchParams.get("priority"); // filter by priority
    const search = searchParams.get("search"); // search in name/email

    const offset = (page - 1) * limit;
    let contacts = readContacts();

    // Apply filters
    if (status) {
      contacts = contacts.filter(c => c.status === status);
    }
    if (priority) {
      contacts = contacts.filter(c => c.priority === priority);
    }
    if (search) {
      const q = search.toLowerCase();
      contacts = contacts.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      );
    }

    const total = contacts.length;
    const paginated = contacts.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/contacts]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
```

---

## 🟢 LOW PRIORITY ISSUES

### Issue #9: Missing HTTPS Enforcement in Production

**Location:** `next.config.mjs`

**Problem:**
- No redirect from HTTP to HTTPS
- Environment variables exposed in development

**Solution:**
```javascript
export default {
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://:host/:path*',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
      },
    ];
  },
};
```

---

## 📋 ACTION PLAN

### Immediate (This Week)
- [ ] Implement Issue #1 - Fix password hashing
- [ ] Implement Issue #2 - Add rate limiting
- [ ] Implement Issue #3 - Validate PUT requests
- [ ] Implement Issue #5 - Add Zod validation

### Short Term (Next 2 Weeks)
- [ ] Implement Issue #4 - Validate service role key
- [ ] Implement Issue #6 - Error recovery for KV
- [ ] Implement Issue #7 - Add audit logging

### Medium Term (Next Month)
- [ ] Implement Issue #8 - Add pagination
- [ ] Implement Issue #9 - HTTPS enforcement
- [ ] Add comprehensive test coverage for auth flows
- [ ] Set up automated security scanning (Snyk)

---

## 📦 Dependencies to Add

```json
{
  "zod": "^4.3.6"  // Already in package.json ✅
}
```

No new dependencies needed! Zod is already available.

---

## 🧪 Testing Checklist

```bash
# Test rate limiting
for i in {1..10}; do 
  curl -X POST http://localhost:3000/api/admin/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Test input validation
curl -X POST http://localhost:3000/api/admin/testimonials \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"A","review":"short","rating":10,"trip":"T"}'
  # Should fail validation

# Test pagination
curl "http://localhost:3000/api/admin/contacts?page=1&limit=10&status=pending"
```

---

## 📚 References

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Next.js Security: https://nextjs.org/docs/basic-features/security
- Zod Validation: https://zod.dev
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security

---

**Report Generated:** June 25, 2026  
**Reviewer:** Claude AI Code Analyzer
