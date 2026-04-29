let tokenCache = null;
let tokenExpiry = 0;

async function getZoomAccessToken() {
  const now = Date.now();
  if (tokenCache && tokenExpiry > now + 60000) {
    return tokenCache;
  }

  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID;

  if (!clientId || !clientSecret || !accountId) {
    throw new Error('Missing Zoom credentials in environment');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Zoom token error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  tokenCache = data.access_token;
  tokenExpiry = now + (data.expires_in * 1000);
  return tokenCache;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const token = await getZoomAccessToken();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, expires_in: Math.max(0, Math.floor((tokenExpiry - Date.now()) / 1000)) }),
    };
  } catch (err) {
    console.error('zoom-token error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

exports.getZoomAccessToken = getZoomAccessToken;
