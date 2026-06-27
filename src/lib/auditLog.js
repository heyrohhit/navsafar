// src/lib/auditLog.js
// ─────────────────────────────────────────────────────────────────────────────
// 📋 AUDIT LOGGING — Track all admin actions for compliance & security
// ─────────────────────────────────────────────────────────────────────────────

import { createSupabaseClient } from "./supabaseClient";

/**
 * Log an admin action to the audit_logs table
 *
 * @param {string} action - 'CREATE', 'UPDATE', 'DELETE', 'LOGIN_FAILED', etc.
 * @param {string} resource - 'package', 'blog', 'contact', 'testimonial', 'auth'
 * @param {string} resourceId - ID of the affected resource
 * @param {object} changes - { before: {...}, after: {...} } or detailed changes
 * @param {string} adminEmail - Email of the admin who performed the action (optional)
 */
export async function logAdminAction(
  action,
  resource,
  resourceId,
  changes = {},
  adminEmail = "unknown"
) {
  try {
    const supabase = createSupabaseClient(true);

    const logEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      admin_email: adminEmail,
      action,
      resource,
      resource_id: resourceId || "",
      changes,
      ip_address: "",
      user_agent: "",
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("audit_logs").insert([logEntry]);

    if (error) {
      console.warn("[auditLog] Failed to log action:", error.message);
    }
  } catch (err) {
    console.warn("[auditLog] Error logging action:", err.message);
    // Don't throw - logging failure shouldn't break the main operation
  }
}

/**
 * Retrieve audit logs with optional filtering
 *
 * @param {object} filters - { action, resource, adminEmail, startDate, endDate }
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Results per page (default: 50)
 * @returns {object} { data: [...], pagination: {...} }
 */
export async function getAuditLogs(
  filters = {},
  page = 1,
  limit = 50
) {
  try {
    const supabase = createSupabaseClient(true);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("audit_logs")
      .select("*", { count: "exact" });

    // Apply filters
    if (filters.action) {
      query = query.eq("action", filters.action);
    }

    if (filters.resource) {
      query = query.eq("resource", filters.resource);
    }

    if (filters.adminEmail) {
      query = query.eq("admin_email", filters.adminEmail);
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[getAuditLogs]", error.message);
      return { data: [], pagination: { page, limit, total: 0, pages: 0 } };
    }

    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  } catch (err) {
    console.error("[getAuditLogs]", err.message);
    return { data: [], pagination: { page, limit, total: 0, pages: 0 } };
  }
}

/**
 * Get audit statistics
 * @returns {object} { totalActions, byResource, byAction, adminActions }
 */
export async function getAuditStats() {
  try {
    const supabase = createSupabaseClient(true);

    // Get all logs for stats
    const { data, error } = await supabase
      .from("audit_logs")
      .select("action, resource, admin_email")
      .order("created_at", { ascending: false })
      .limit(10000); // Last 10k actions

    if (error) {
      console.error("[getAuditStats]", error.message);
      return null;
    }

    const stats = {
      totalActions: data.length,
      byResource: {},
      byAction: {},
      adminActions: {},
    };

    // Calculate stats
    data.forEach((log) => {
      // By resource
      stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;

      // By action
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;

      // By admin
      stats.adminActions[log.admin_email] =
        (stats.adminActions[log.admin_email] || 0) + 1;
    });

    return stats;
  } catch (err) {
    console.error("[getAuditStats]", err.message);
    return null;
  }
}

/**
 * Export audit logs as CSV
 * @returns {string} CSV formatted string
 */
export async function exportAuditLogsAsCSV(filters = {}) {
  try {
    const { data } = await getAuditLogs(filters, 1, 10000);

    if (!data || data.length === 0) {
      return "No audit logs found\n";
    }

    // CSV Headers
    const headers = ["Timestamp", "Admin", "Action", "Resource", "Resource ID", "Details"];
    const rows = [headers.join(",")];

    // Add rows
    data.forEach((log) => {
      const row = [
        log.created_at,
        log.admin_email,
        log.action,
        log.resource,
        log.resource_id || "-",
        JSON.stringify(log.changes || {}),
      ];
      rows.push(row.map((cell) => `"${cell}"`).join(","));
    });

    return rows.join("\n");
  } catch (err) {
    console.error("[exportAuditLogsAsCSV]", err.message);
    return "Error exporting audit logs\n";
  }
}
