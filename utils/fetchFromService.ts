export async function fetchFromService(service: string, path: string, method = "POST", body = {}, requireAuth = true) {
  const payload: any = {
    service,
    path,
    method,
    body
  };

  if (typeof window !== 'undefined' && requireAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      payload.token = token; // Send as body param
    }
  }

  const response = await fetch('/api/gateway', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Service responded with status ${response.status}`);
  }

  return response.json();
}
