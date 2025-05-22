import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  body?: any,
  options?: RequestInit,
): Promise<Response> {
  // Determine if we're handling FormData (for file uploads) or regular JSON data
  const isFormData = body instanceof FormData;
  
  // Only set Content-Type for JSON requests, browsers set it automatically with boundary for FormData
  const headers = isFormData 
    ? { ...options?.headers } 
    : { 
        'Content-Type': 'application/json', 
        ...options?.headers 
      };
  
  const res = await fetch(url, {
    method,
    headers,
    // Don't JSON.stringify FormData objects
    body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    credentials: "include",
    ...options,
  });

  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
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
