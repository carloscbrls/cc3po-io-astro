const { getZoomAccessToken } = require('./zoom-token');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

function getReminderHtml(meeting) {
  const startDate = new Date(meeting.start_time);
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  });

  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
      <div style="background:linear-gradient(135deg,#4cc9f0,#f72585);padding:32px;border-radius:16px 16px 0 0;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:24px">⏰ Reminder: Your Strategy Call is Tomorrow</h1>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px">
        <p style="font-size:16px;line-height:1.6">Hi there,</p>
        <p style="font-size:16px;line-height:1.6">Just a friendly reminder that your CC3PO Strategy Call is coming up:</p>
        
        <div style="background:#f8f9fa;border-radius:12px;padding:24px;margin:24px 0">
          <p style="margin:0 0 8px;font-weight:600">📅 Date: <span style="font-weight:400">${dateStr}</span></p>
          <p style="margin:0 0 8px;font-weight:600">🕐 Time: <span style="font-weight:400">${timeStr}</span></p>
          <p style="margin:0;font-weight:600">🔗 Join Link: <a href="${meeting.join_url}" style="color:#4cc9f0">${meeting.join_url}</a></p>
        </div>

        <p style="font-size:14px;color:#666">Looking forward to our call! — Carlos & the CC3PO team</p>
      </div>
    </div>
  `;
}

async function sendEmail({ to, subject, html }) {
  if (!SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set, skipping email');
    return;
  }
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: to.map(email => ({ email })) }],
      from: { email: 'leads@cc3po.com', name: 'CC3PO' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SendGrid error: ${err}`);
  }
}

async function getUpcomingMeetings(token) {
  const now = new Date();
  const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 60 * 60 * 1000);

  const fromDate = now.toISOString().split('T')[0];
  const toDate = tomorrowEnd.toISOString().split('T')[0];

  const url = new URL('https://api.zoom.us/v2/users/me/meetings');
  url.searchParams.set('type', 'scheduled');
  url.searchParams.set('page_size', '300');
  url.searchParams.set('from', fromDate);
  url.searchParams.set('to', toDate);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Zoom meetings fetch error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  if (!data.meetings) return [];

  return data.meetings
    .filter(m => {
      const start = new Date(m.start_time);
      return start >= tomorrowStart && start <= tomorrowEnd;
    })
    .map(m => ({
      id: m.id,
      topic: m.topic,
      start_time: m.start_time,
      join_url: m.join_url,
    }));
}

exports.handler = async (event) => {
  // Allow GET (manual trigger) and POST (scheduled function / n8n webhook)
  if (!['GET', 'POST'].includes(event.httpMethod)) {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const token = await getZoomAccessToken();
    const meetings = await getUpcomingMeetings(token);

    const results = [];
    for (const meeting of meetings) {
      // Extract email from topic like "CC3PO Strategy Call with John Doe"
      // We'll skip extracting email since it's not stored with the meeting.
      // In a real implementation, you'd query your database for the lead email.
      // For now, this function logs what it would send.
      results.push({
        meeting_id: meeting.id,
        topic: meeting.topic,
        start_time: meeting.start_time,
        status: 'logged',
        note: 'Reminder emails require lead database lookup. Implement with Supabase leads table query.',
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        meetings_found: meetings.length,
        results,
        note: 'To enable actual reminder emails, query the leads table for the email associated with each meeting topic.',
      }),
    };
  } catch (err) {
    console.error('zoom-reminder error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
