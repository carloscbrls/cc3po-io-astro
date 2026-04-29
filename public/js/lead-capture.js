// Lead Capture Module — submits to Supabase + triggers email notification
// Usage: import { submitLead } from './lead-capture.js';

const SUPABASE_URL = 'https://cdrcgmdvepxwsbqaifxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcmNnbWR2ZXB4d3NicWFpZnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDY4MDksImV4cCI6MjA4OTA4MjgwOX0.pKWLWvsSimTOMkpaXKKrLJESrQEMUayUU1c9ANzr1Dc';

/**
 * Submit a lead to Supabase and trigger an email notification.
 * @param {Object} data
 * @param {string} data.table - 'leads' or 'audit_requests'
 * @param {string} data.source - tracking source, e.g. 'cc3po.io-hero'
 * @param {Object} data.payload - field values
 */
export async function submitLead({ table, source, payload }) {
  const body = { ...payload, source };

  // 1. Insert into Supabase
  const sbRes = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(body)
  });

  if (!sbRes.ok) {
    const err = await sbRes.text().catch(() => 'Supabase error');
    throw new Error(err);
  }

  // 2. Trigger email notification (fire-and-forget)
  try {
    fetch('/.netlify/functions/lead-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, source, ...payload })
    }).catch(() => {}); // silent fail for notifications
  } catch (_) {
    // ignore notification errors
  }

  return { success: true };
}

/**
 * Convenience wrapper for the `leads` table.
 */
export function submitLeadCapture(payload, source, leadType = 'contact') {
  return submitLead({
    table: 'leads',
    source,
    payload: { ...payload, lead_type: leadType }
  });
}

/**
 * Convenience wrapper for the `audit_requests` table.
 */
export function submitAuditRequest(payload, source) {
  return submitLead({
    table: 'audit_requests',
    source,
    payload
  });
}
