import { NextResponse } from 'next/server';

const SERVICES = {
  restaurant: 'https://restaurant-service-ilaj.onrender.com',
  user: 'https://user-service-f124.onrender.com',
  order: 'https://order-service-96vx.onrender.com',
};

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const CIRCUIT_BREAKER = {
  failureThreshold: 3,
  resetTimeout: 30000,
};

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const circuitBreakerState = new Map<string, {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}>();

export async function POST(request: Request) {
  try {
    const { service, path, method = 'POST', body = null, token = null } = await request.json();

    if (!SERVICES[service as keyof typeof SERVICES]) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    const now = Date.now();
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const clientState = requestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };

    if (now > clientState.resetTime) {
      clientState.count = 0;
      clientState.resetTime = now + RATE_LIMIT.windowMs;
    }

    if (clientState.count >= RATE_LIMIT.max) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    clientState.count++;
    requestCounts.set(clientIp, clientState);

    const serviceState = circuitBreakerState.get(service) || {
      failures: 0,
      lastFailureTime: 0,
      isOpen: false,
    };

    if (serviceState.isOpen) {
      if (now - serviceState.lastFailureTime > CIRCUIT_BREAKER.resetTimeout) {
        serviceState.isOpen = false;
        serviceState.failures = 0;
      } else {
        return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
      }
    }

    try {
      const url = `${SERVICES[service as keyof typeof SERVICES]}${path}`;
      const headers: any = {
        'Content-Type': 'application/json'
      };

      const isPublicPath =
        path.startsWith('/api/auth/signup') ||
        path.startsWith('/api/auth/login');

      if (!isPublicPath && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Service responded with status ${response.status}`);
      }

      const data = await response.json();

      serviceState.failures = 0;
      serviceState.isOpen = false;
      circuitBreakerState.set(service, serviceState);

      return NextResponse.json(data);
    } catch (error) {
      serviceState.failures++;
      serviceState.lastFailureTime = Date.now();
      if (serviceState.failures >= CIRCUIT_BREAKER.failureThreshold) {
        serviceState.isOpen = true;
      }
      circuitBreakerState.set(service, serviceState);

      console.error('Service error:', error);
      return NextResponse.json({ error: 'Service error' }, { status: 502 });
    }
  } catch (error) {
    console.error('Gateway error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
