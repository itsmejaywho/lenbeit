export async function apiRequest<T = unknown>(path: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const response = await fetch(`${baseUrl}${path}`);
  const data = (await response.json()) as T & {
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    const message = data.message ?? data.error ?? response.statusText;
    throw new Error(`API request failed (${response.status}): ${message}`);
  }

  return data;
}
