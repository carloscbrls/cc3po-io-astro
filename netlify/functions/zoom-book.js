const { getZoomAccessToken } = require('./zoom-token');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

function getLeadEmailHtml(data, meeting) {
  const { name, slot_start } = data;
  const startDate = new Date(slot_start);
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
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
        <h1 style="color:#fff;margin:0;font-size:28px">🎉 You're Booked!</h1>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px">
        <p style="font-size:16px;line-height:1.6">Hi ${name},</p>
        <p style="font-size:16px;line-height:1.6">Your CC3PO Strategy Call is confirmed. Here are the details:</p>
        
        <div style="background:#f8f9fa;border-radius:12px;padding:24px;margin:24px 0">
          <p style="margin:0 0 8px;font-weight:600">📅 Date: <span style="font-weight:400">${dateStr}</span></p>
          <p style="margin:0 0 8px;font-weight:600">🕐 Time: <span style="font-weight:400">${timeStr}</span></p>
          <p style="margin:0 0 8px;font-weight:600">⏱️ Duration: <span style="font-weight:400">30 minutes</span></p>
          <p style="margin:0;font-weight:600">🔗 Join Link: <a href="${meeting.join_url}" style="color:#4cc9f0">${meeting.join_url}</a></p>
        </div>

        <p style="font-size:14px;color:#666">We'll send you a reminder 24 hours before the call. If you need to reschedule, just reply to this email.</p>
        <p style="font-size:14px;color:#666">Looking forward to speaking with you! — Carlos & the CC3PO team</p>
      </div>
    </div>
  `;
}

function getTeamEmailHtml(data, meeting) {
  const { name, email, phone, company, message, slot_start } = data;
  const startDate = new Date(slot_start);
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Los_Angeles',
  });
  const timeStr = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Los_Angeles',
    timeZoneName: 'short',
  });

  return `
    <div style="font-family:sans-serif;max-width:600px">
      <h2 style="color:#f72585">🔔 New Strategy Call Booked</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;margin-top:16px">
        <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Name</strong></td><td style="padding:6px 12px">${name}</td></tr>
        <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Email</strong></td><td style="padding:6px 12px"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Phone</strong></td><td style="padding:6px 12px">${phone}</td></tr>` : ''}
        ${company ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Company</strong></td><td style="padding:6px 12px">${company}</td></tr>` : ''}
        <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Date/Time</strong></td><td style="padding:6px 12px">${dateStr} at ${timeStr}</td></tr>
        <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Zoom Link</strong></td><td style="padding:6px 12px"><a href="${meeting.join_url}">${meeting.join_url}</a></td></tr>
        <tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Meeting ID</strong></td><td style="padding:6px 12px">${meeting.id}</td></tr>
        ${message ? `<tr><td style="padding:6px 12px;background:#f4f4f4"><strong>Message</strong></td><td style="padding:6px 12px">${message.replace(/\n/g, '<br>')}</td></tr>` : ''}
      </table>
    </div>
  `;
}

async function sendEmail({ to, subject, html, replyTo }) {
  if (!SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set, skipping email');
    return;
  }
  const body = {
    personalizations: [{ to: to.map(email => ({ email })) }],
    from: { email: 'leads@cc3po.com', name: 'CC3PO' },
    subject,
    content: [{ type: 'text/html', value: html }],
  };
  if (replyTo) body.reply_to = { email: replyTo };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`SendGrid error: ${err}`);
  }
}

async function saveLead(data) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase credentials not set, skipping lead save');
    return null;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      message: data.message,
      source: data.source,
      status: 'new',
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Supabase lead save error:', response.status, errText);
    return null;
  }

  return await response.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { name, email, phone, company, message, slot_start, slot_end } = data;

  if (!name || !email || !phone || !slot_start || !slot_end) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  try {
    const token = await getZoomAccessToken();

    // 1. Create Zoom meeting
    const zoomResponse = await fetch('https://api.zoom.us/v2/users/me/meetings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: `CC3PO Strategy Call with ${name}`,
        type: 2,
        start_time: slot_start,
        duration: 30,
        timezone: 'America/Los_Angeles',
        settings: {
          join_before_host: true,
          waiting_room: false,
          auto_recording: 'cloud',
          host_video: true,
          participant_video: true,
          mute_upon_entry: false,
        },
      }),
    });

    if (!zoomResponse.ok) {
      const errText = await zoomResponse.text();
      console.error('Zoom meeting creation error:', zoomResponse.status, errText);
      return { statusCode: 500, body: JSON.stringify({ error: `Zoom API error: ${zoomResponse.status}` }) };
    }

    const meeting = await zoomResponse.json();

    // 2. Save lead to Supabase
    const leadData = {
      name,
      email,
      phone,
      company,
      message,
      source: 'cc3po.io-strategy-call',
    };
    await saveLead(leadData);

    // 3. Send confirmation email to lead
    try {
      await sendEmail({
        to: [email],
        subject: 'Your CC3PO Strategy Call is Confirmed',
        html: getLeadEmailHtml(data, meeting),
        replyTo: 'leads@cc3po.com',
      });
    } catch (emailErr) {
      console.error('Lead confirmation email failed:', emailErr);
    }

    // 4. Send notification to team
    try {
      await sendEmail({
        to: ['leads@cc3po.com', 'ccabrales@cc3po.com'],
        subject: `🔔 New Strategy Call: ${name} booked for ${new Date(slot_start).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles', month: 'short', day: 'numeric' })}`,
        html: getTeamEmailHtml(data, meeting),
      });
    } catch (emailErr) {
      console.error('Team notification email failed:', emailErr);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        meeting: {
          join_url: meeting.join_url,
          start_time: meeting.start_time,
          duration: meeting.duration,
          id: meeting.id,
        },
      }),
    };
  } catch (err) {
    console.error('zoom-book error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
