import { NextRequest, NextResponse } from 'next/server';

const SERVICES = {
  restaurant: 'https://restaurant-service-ilaj.onrender.com',
  user: 'https://user-service-f124.onrender.com',
  order: 'https://order-service-96vx.onrender.com',
  delivery: 'https://delivery-service-s468.onrender.com',
};

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { service, path, method, body: requestBody, token } = body;

    if (!service || !path || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: service, path, or method' },
        { status: 400 }
      );
    }

    const serviceUrl = SERVICES[service as keyof typeof SERVICES];
    if (!serviceUrl) {
      return NextResponse.json({ error: `Service ${service} not found` }, { status: 404 });
    }

    const now = Date.now();
    const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
    const clientState = requestCounts.get(clientIp) || {
      count: 0,
      resetTime: now + RATE_LIMIT.windowMs,
    };

    if (now > clientState.resetTime) {
      clientState.count = 0;
      clientState.resetTime = now + RATE_LIMIT.windowMs;
    }

    if (clientState.count >= RATE_LIMIT.max) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    clientState.count++;
    requestCounts.set(clientIp, clientState);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${serviceUrl}${path}`, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(requestBody) : undefined,
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const responseBody = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        return NextResponse.json(
          { error: isJson ? responseBody?.message : responseBody || `Service responded with status ${response.status}` },
          { status: response.status }
        );
      }

      return NextResponse.json(isJson ? responseBody : { message: responseBody });
    } catch (error) {
      console.error('Service error:', error);
      return NextResponse.json({ error: 'Service error occurred' }, { status: 502 });
    }
  } catch (error) {
    console.error('Gateway error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
