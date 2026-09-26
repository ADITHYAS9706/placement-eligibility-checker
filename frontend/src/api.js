export const apiFetch = async (
  input,
  options = {}
) => {
  const token =
    localStorage.getItem(
      "authToken"
    );

  const headers = new Headers(
    options.headers || {}
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response =
    await window.fetch(input, {
      ...options,
      headers,
    });

  // =========================
  // AUTHENTICATION FAILURE
  // =========================

  if (response.status === 401) {

    localStorage.removeItem(
      "loggedIn"
    );

    localStorage.removeItem(
      "username"
    );

    localStorage.removeItem(
      "userRole"
    );

    localStorage.removeItem(
      "authToken"
    );

    window.location.reload();

    return response;
  }

  return response;
};