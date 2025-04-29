export async function fetchFromService(service: string, path: string, method: "GET" | "POST" = "POST", body = {}) {
  const response = await fetch('/api/gateway', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ service, path, method, ...body }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Service error');
  }

  return response.json();
}
