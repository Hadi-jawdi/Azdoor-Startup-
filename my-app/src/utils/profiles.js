import { apiRequest } from "./api";

const BASE_URL = "http://localhost:8000/api";

// Some DRF setups paginate lists ({results: [...]}), some don't. Handle both.
const asList = (data) => (Array.isArray(data) ? data : data?.results || []);

export function getProfile(id, token) {
  return apiRequest(`/auth/users/${id}/`, { token });
}

export function followUser(id, token) {
  return apiRequest(`/auth/users/${id}/follow/`, { method: "POST", token });
}

export function unfollowUser(id, token) {
  return apiRequest(`/auth/users/${id}/follow/`, { method: "DELETE", token });
}

export async function getFollowers(id, token) {
  return asList(await apiRequest(`/auth/users/${id}/followers/`, { token }));
}

export async function getFollowing(id, token) {
  return asList(await apiRequest(`/auth/users/${id}/following/`, { token }));
}

export async function getUserListings(id, token) {
  return asList(await apiRequest(`/listings/user/${id}/`, { token }));
}

// Edit my profile. Uses FormData so the avatar photo can be uploaded.
export async function updateProfile(
  { full_name, bio, city, account_type, agency_name, avatarUri },
  token
) {
  const form = new FormData();
  form.append("full_name", full_name || "");
  form.append("bio", bio || "");
  form.append("city", city || "");
  form.append("account_type", account_type || "user");
  form.append("agency_name", agency_name || "");

  // only send the avatar if a NEW photo was picked
  if (avatarUri) {
    const filename = avatarUri.split("/").pop() || "avatar.jpg";
    const ext = filename.includes(".")
      ? filename.split(".").pop().toLowerCase()
      : "jpg";
    form.append("avatar", {
      uri: avatarUri,
      name: filename,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    });
  }

  const res = await fetch(`${BASE_URL}/auth/me/`, {
    method: "PATCH",
    headers: { Authorization: `Token ${token}` },
    body: form,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      data?.detail || Object.values(data || {})[0] || "خطایی رخ داد.";
    throw new Error(Array.isArray(message) ? message[0] : message);
  }
  return data;
}