const { getZoomAccessToken } = require('./zoom-token');

const TIMEZONE = 'America/Los_Angeles';
const SLOT_DURATION = 30;
const BUFFER_MINUTES = 15;
const START_HOUR = 9;
const END_HOUR = 17;

function toISOPT(date) {
  return date.toLocaleString('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
}

function getPTDateParts(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function getPTDateTime(isoDate, hour, minute) {
  const { year, month, day } = getPTDateParts(isoDate);
  const date = new Date(Date.UTC(year, month, day, hour + 7, minute)); // Approximate PT to UTC offset (will be corrected)
  // Better approach: create date string in PT and parse as if PT
  const ptStr = `${isoDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  return new Date(ptStr + '-07:00'); // PT is UTC-7 (PDT) or UTC-8 (PST)
}

function getSlotStartEnd(isoDate, hour, minute) {
  const ptStr = `${isoDate}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  const start = new Date(ptStr + '-07:00');
  const end = new Date(start.getTime() + SLOT_DURATION * 60000);
  return { start, end };
}

function getBusinessDays(startDate, endDate) {
  const days = [];
  let current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const iso = current.toISOString().split('T')[0];
      days.push(iso);
    }
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function generateSlots(dates) {
  const slots = [];
  for (const date of dates) {
    for (let h = START_HOUR; h < END_HOUR; h++) {
      for (const m of [0, 30]) {
        if (h === END_HOUR - 1 && m === 30) continue; // 4:30 ends at 5:00, that's fine
        const { start, end } = getSlotStartEnd(date, h, m);
        // Only include future slots (buffer 1 minute)
        if (start.getTime() > Date.now() - 60000) {
          slots.push({ start: start.toISOString(), end: end.toISOString(), date });
        }
      }
    }
  }
  return slots;
}

function parseMeetingTime(timeStr) {
  if (!timeStr) return null;
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return null;
  return d;
}

function overlaps(slotStart, slotEnd, meetingStart, meetingEnd, bufferMs) {
  const bufferedMeetingStart = new Date(meetingStart.getTime() - bufferMs);
  const bufferedMeetingEnd = new Date(meetingEnd.getTime() + bufferMs);
  return slotStart < bufferedMeetingEnd && slotEnd > bufferedMeetingStart;
}

async function getExistingMeetings(token, fromDate, toDate) {
  const meetings = [];
  let nextPageToken = '';
  let page = 1;

  do {
    const url = new URL('https://api.zoom.us/v2/users/me/meetings');
    url.searchParams.set('type', 'scheduled');
    url.searchParams.set('page_size', '300');
    url.searchParams.set('from', fromDate);
    url.searchParams.set('to', toDate);
    if (nextPageToken) url.searchParams.set('next_page_token', nextPageToken);

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Zoom meetings fetch error:', response.status, errText);
      break;
    }

    const data = await response.json();
    if (data.meetings) {
      for (const m of data.meetings) {
        const start = parseMeetingTime(m.start_time);
        if (start) {
          const duration = m.duration || 30;
          const end = new Date(start.getTime() + duration * 60000);
          meetings.push({ start, end, topic: m.topic });
        }
      }
    }

    nextPageToken = data.next_page_token || '';
    page++;
  } while (nextPageToken && page <= 10);

  return meetings;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const params = new URLSearchParams(event.queryStringParameters || {});
    const startDate = params.get('start_date');
    const endDate = params.get('end_date');

    if (!startDate || !endDate) {
      return { statusCode: 400, body: JSON.stringify({ error: 'start_date and end_date are required' }) };
    }

    const token = await getZoomAccessToken();
    const meetings = await getExistingMeetings(token, startDate, endDate);

    const businessDays = getBusinessDays(startDate, endDate);
    const allSlots = generateSlots(businessDays);

    const bufferMs = BUFFER_MINUTES * 60000;
    const availableSlots = allSlots.filter(slot => {
      const s = new Date(slot.start);
      const e = new Date(slot.end);
      return !meetings.some(m => overlaps(s, e, m.start, m.end, bufferMs));
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
      body: JSON.stringify({
        slots: availableSlots.map(s => ({ start: s.start, end: s.end })),
        timezone: TIMEZONE,
      }),
    };
  } catch (err) {
    console.error('zoom-availability error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
