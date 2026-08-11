// const BASE_URL = "http://localhost:8000/api/auth";

// export async function apiRequest(path, { method = "GET", body, token } = {}) {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Token ${token}` } : {}),
//     },
//     body: body ? JSON.stringify(body) : undefined,
//   });

//   const data = res.status !== 204 ? await res.json().catch(() => null) : null;

//   if (!res.ok) {
//     const message = data?.detail || Object.values(data || {})[0] || "خطایی رخ داد.";
//     throw new Error(Array.isArray(message) ? message[0] : message);
//   }

//   return data;
// }
const BASE_URL = "http://localhost:8000/api";

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = res.status !== 204 ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.detail || Object.values(data || {})[0] || "خطایی رخ داد.";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }

  return data;
}