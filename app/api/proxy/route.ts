import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const response = await fetch('https://restaurant-service-ilaj.onrender.com/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZXN0T3duZXIxMjMiLCJ1c2VySWQiOjMsInJvbGUiOlsiUk9MRV9SRVNUQVVSQU5UX09XTkVSIl0sImlhdCI6MTc0NTI1NDUxNCwiZXhwIjoxNzQ4ODU0NTE0LCJpc3MiOiJjcmVhdGl2ZWxrLWF1dGgifQ.n0uCBj-8wbNmQ99eGeb-6d5wj6qciwAxJD32wYqFVdU`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to register restaurant' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 