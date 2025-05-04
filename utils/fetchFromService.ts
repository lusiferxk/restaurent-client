export async function fetchFromService(
  service: string,
  path: string,
  method = "POST",
  body = {},
  requireAuth = true
) {
  const payload: any = {
    service,
    path,
    method,
    body
  };

  // Only access localStorage on the client side
  if (typeof window !== 'undefined' && requireAuth) {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        payload.token = token;
      }
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
    }
  }

  try {
    const response = await fetch('/api/gateway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Invalid response format: ${contentType}`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Service responded with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}
