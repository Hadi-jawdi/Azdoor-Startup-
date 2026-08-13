// import { apiRequest } from "./api";

// export function getListings(categoryId) {
//   const query = categoryId ? `?category=${categoryId}` : "";
//   return apiRequest(`/listings/${query}`);
// }

// export function getListing(id) {
//   return apiRequest(`/listings/${id}/`);
// }

// export function createListing(data, token) {
//   return apiRequest("/listings/", { method: "POST", body: data, token });
// }
import { apiRequest } from "./api";

const BASE_URL = "http://localhost:8000/api";

export function getListings(categoryId) {
  const query = categoryId ? `?category=${categoryId}` : "";
  return apiRequest(`/listings/${query}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}/`);
}

export async function createListing({ title, price, location, description, category, images }, token) {
  const form = new FormData();
  form.append("title", title);
  form.append("price", price);
  form.append("location", location);
  form.append("description", description || "");
  form.append("category", category);

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