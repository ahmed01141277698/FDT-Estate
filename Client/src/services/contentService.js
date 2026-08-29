const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function fetchPublishedJobs(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      query.append(key, value);
  });

  const response = await fetch(`${API_BASE}/careers?${query.toString()}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to load jobs");
  }

  return response.json();
}

export async function fetchCareerBySlug(slug) {
  const response = await fetch(
    `${API_BASE}/careers/${encodeURIComponent(slug)}`,
  );
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to load job");
  }

  return response.json();
}

export async function submitCareerApplication(slug, formData) {
  const response = await fetch(
    `${API_BASE}/careers/${encodeURIComponent(slug)}/apply`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Failed to send application");
  }

  return payload;
}

export async function fetchArticles(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      query.append(key, value);
  });

  const response = await fetch(`${API_BASE}/blog?${query.toString()}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to load articles");
  }

  return response.json();
}

export async function fetchArticleCategories() {
  const response = await fetch(`${API_BASE}/blog/categories`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to load categories");
  }

  return response.json();
}

export async function fetchArticleBySlug(slug) {
  const response = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Failed to load article");
  }

  return response.json();
}

export async function submitContactMessage(payload) {
  const response = await fetch(`${API_BASE}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Failed to send message");
  }

  return data;
}
