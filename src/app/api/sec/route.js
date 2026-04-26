import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cik = searchParams.get('cik');

  if (!cik) return NextResponse.json({ error: 'No CIK provided' }, { status: 400 });

  const userAgent = process.env.SEC_USER_AGENT || process.env.NEXT_PUBLIC_SEC_USER_AGENT;
  if (!userAgent) {
    console.error('SEC User-Agent is not configured');
    return NextResponse.json({ error: 'SEC User-Agent not configured' }, { status: 500 });
  }

  try {
    const paddedCik = cik.toString().padStart(10, '0');
    const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${paddedCik}.json`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': userAgent,
        Accept: 'application/json',
        Connection: 'keep-alive',
      },
      timeout: 15000,
    });

    return NextResponse.json(response.data);
  } catch (err) {
    console.error('SEC Proxy Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      code: err.code,
    });

    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      (err?.code === 'ECONNABORTED' ? 'SEC request timed out' : 'SEC server unreachable');

    return NextResponse.json({ error: message }, { status: err?.response?.status || 500 });
  }
}