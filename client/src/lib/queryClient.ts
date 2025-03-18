import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAccessToken } from "./propelauth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    console.error('Response error:', {
      status: res.status,
      statusText: res.statusText,
      body: text
    });
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  try {
    console.log(`Making ${method} request to ${url} with data:`, data);
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      ...(data ? { "Content-Type": "application/json" } : {}),
      "Authorization": `Bearer ${token}`
    };

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const token = await getAccessToken();
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});