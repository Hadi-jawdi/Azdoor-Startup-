

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

export function getListings({ categoryId, cityId, search, dealType, propertyType} = {}) {
  const params = new URLSearchParams();
  if (categoryId) params.append("category", categoryId);
  if (cityId) params.append("city", cityId);
  if (search) params.append("search", search);
  if (dealType) params.append("deal_type", dealType);
  if (propertyType) params.append("property_type", propertyType);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/listings/${query}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}/`);
}

export async function createListing(
  // { title, price, location, description, category, deal_type, property_type, images },
  // { title, price, location, description, category, deal_type, property_type, employment_type, images },
  { title, price, location, address, description, category, deal_type, property_type, employment_type, images },

  token
) {
  const form = new FormData();
  form.append("title", title);
  // form.append("price", price);
  form.append("address", address || "");
  form.append("price", price || "");
  form.append("location", location);
  form.append("description", description || "");
  form.append("category", category);
  if (deal_type) form.append("deal_type", deal_type);
  if (property_type) form.append("property_type", property_type);
  if (employment_type) form.append("employment_type", employment_type);

  images.forEach((uri, i) => {
    const filename = uri.split("/").pop();
    const ext = filename.split(".").pop();
    form.append("uploaded_images", {
      uri,
      name: filename || `photo${i}.jpg`,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
  });

  const res = await fetch(`${BASE_URL}/listings/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      // NOTE: do NOT set Content-Type manually — fetch sets the correct
      // multipart boundary automatically when the body is FormData.
    },
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.detail || Object.values(data || {})[0] || "خطایی رخ داد.";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data;
}

export function updateListing(id, data, token) {
  return apiRequest(`/listings/${id}/`, { method: "PATCH", body: data, token });
}

export function deleteListing(id, token) {
  return apiRequest(`/listings/${id}/`, { method: "DELETE", token });
}

export function getMyListings(token) {
  return apiRequest(`/listings/mine/`, { token });
}

export function toggleFavorite(id, token) {
  return apiRequest(`/listings/${id}/favorite/`, { method: "POST", token });
}

export function getFavorites(token) {
  return apiRequest(`/listings/favorites/`, { token });
}