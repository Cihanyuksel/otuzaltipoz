import { API_BASE_URL } from "lib/config";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export default async function fetchWithAuth (
  path: string,
  options: RequestInit = {},
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  const headers = {
    ...options.headers,
    Authorization: accessToken ? `Bearer ${accessToken}` : "",
    "Content-Type": "application/json",
  };

  let response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: "include" });
  
  if (response.status === 401) {
    // refresh token
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch("http://localhost:4000/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setAccessToken(data.accessToken); // context state güncelle
          isRefreshing = false;
          return data.accessToken;
        });
    }

    const newToken = await refreshPromise;
    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: retryHeaders, credentials: "include" });
  }

  return response;
}
