const API_URL = import.meta.env.VITE_API_URL;

interface ApiFetchOptions extends RequestInit {
  accessToken?: string;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {}
) {
  const {
    accessToken,
    headers,
    ...requestOptions
  } = options;

  return fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...headers,
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
    },
  });
}