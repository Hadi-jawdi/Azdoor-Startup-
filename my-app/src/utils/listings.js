import { apiRequest } from "./api";

export function getListings(categoryId) {
  const query = categoryId ? `?category=${categoryId}` : "";
  return apiRequest(`/listings/${query}`);
}

export function getListing(id) {
  return apiRequest(`/listings/${id}/`);
}

export function createListing(data, token) {
  return apiRequest("/listings/", { method: "POST", body: data, token });
}