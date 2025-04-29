export async function fetchFromService(service: string, path: string, method: "GET" | "POST" = "POST", body = {}) {
  const headers: any = {
    'Content-Type': 'application/json',
  };

  // Get token from localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch('/api/gateway', {
    method: 'POST',
    headers,
    body: JSON.stringify({ service, path, method, body }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Service error');
  }

  return response.json();
}
