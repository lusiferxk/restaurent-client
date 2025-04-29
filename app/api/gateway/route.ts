import { NextResponse } from 'next/server';

// Service registry
const SERVICES = {
  restaurant: 'https://restaurant-service-ilaj.onrender.com',
  // Add other services here
};

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100
};

// Cache for rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Circuit breaker configuration
const CIRCUIT_BREAKER = {
  failureThreshold: 3,
  resetTimeout: 30000,
};

// Circuit breaker state
const circuitBreakerState = new Map<string, {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}>();

export async function POST(request: Request) {
  try {
    const { service, path, ...body } = await request.json();
    
    // Validate service
    if (!SERVICES[service as keyof typeof SERVICES]) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 });
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const clientState = requestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };
    
    if (now > clientState.resetTime) {
      clientState.count = 0;
      clientState.resetTime = now + RATE_LIMIT.windowMs;
    }
    
    if (clientState.count >= RATE_LIMIT.max) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    clientState.count++;
    requestCounts.set(clientIp, clientState);

    // Circuit breaker check
    const serviceState = circuitBreakerState.get(service) || {
      failures: 0,
      lastFailureTime: 0,
      isOpen: false
    };

    if (serviceState.isOpen) {
      if (now - serviceState.lastFailureTime > CIRCUIT_BREAKER.resetTimeout) {
        serviceState.isOpen = false;
        serviceState.failures = 0;
      } else {
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
    }

    try {
      // Forward request to service
      const response = await fetch(`${SERVICES[service as keyof typeof SERVICES]}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZXN0T3duZXIxMjMiLCJ1c2VySWQiOjMsInJvbGUiOlsiUk9MRV9SRVNUQVVSQU5UX09XTkVSIl0sImlhdCI6MTc0NTI1NDUxNCwiZXhwIjoxNzQ4ODU0NTE0LCJpc3MiOiJjcmVhdGl2ZWxrLWF1dGgifQ.n0uCBj-8wbNmQ99eGeb-6d5wj6qciwAxJD32wYqFVdU`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Service responded with status ${response.status}`);
      }

      // Reset circuit breaker on success
      serviceState.failures = 0;
      serviceState.isOpen = false;
      circuitBreakerState.set(service, serviceState);

      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      // Update circuit breaker state
      serviceState.failures++;
      serviceState.lastFailureTime = now;
      
      if (serviceState.failures >= CIRCUIT_BREAKER.failureThreshold) {
        serviceState.isOpen = true;
      }
      
      circuitBreakerState.set(service, serviceState);

      console.error(`Service error: ${error}`);
      return NextResponse.json(
        { error: 'Service error' },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error('Gateway error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 