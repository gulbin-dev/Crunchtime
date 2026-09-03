import toastStatus from "@utils/notification/toastStatus";

/**
 * Handles common fetch errors and shows appropriate toast notifications.
 * @param error - The error that occurred
 * @param url - The URL being fetched (for toast ID)
 * @throws The error if it's not an AbortError
 * @returns Empty object if AbortError or server error
 */
const handleFetchError = <T>(error: unknown, url: string): T => {
  if (error instanceof Error && error.name === "AbortError") {
    toastStatus("Request was cancelled.", {
      id: `fetch-cancelled-${url}`,
      status: "error",
    });
    return {} as T;
  }

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  toastStatus(errorMessage, {
    id: `fetch-error-${url}`,
    status: "error",
  });
  throw error;
};

/**
 * Generic fetch wrapper with error handling and server error checking.
 * @param url - The URL to fetch
 * @param options - Fetch options (method, headers, body, signal, etc.)
 * @returns Promise with the parsed JSON response
 */
const fetchWithErrorHandling = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    if (res.status >= 500) {
      toastStatus("An error occurred while fetching the data.", {
        id: `fetch-error-${url}`,
        status: "error",
      });
      return {} as T;
    }
    return res.json() as Promise<T>;
  } catch (error) {
    return handleFetchError<T>(error, url);
  }
};

/**
 * Fetcher function for SWR with AbortSignal support.
 * @param url - The URL to fetch
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise with the parsed JSON response
 */
export const fetcher = async <T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> => fetchWithErrorHandling<T>(url, { signal });

/**
 * POST request helper .
 * @param url - The URL to fetch
 * @param body - Optional request body
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise with the parsed JSON response
 */
export const postRequest = async <T>(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> =>
  fetchWithErrorHandling<T>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

/**
 * DELETE request helper
 * @param url - The URL to fetch
 * @param body - Optional request body
 * @param signal - Optional AbortSignal to cancel the request
 * @returns Promise with the parsed JSON response
 */
export const deleteRequest = async <T>(
  url: string,
  body?: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> =>
  fetchWithErrorHandling<T>(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
