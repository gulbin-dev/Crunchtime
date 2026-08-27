import toastStatus from "@utils/notification/toastStatus";
export const fetcher: <T>(url: string) => Promise<T> = async (url) => {
  const res = await fetch(url);
  if (res.status >= 500) {
    const error = new Error("An error occurred while fetching the data.");
    toastStatus(error.message, {
      id: `fetch-error-${url}`,
      status: "error",
    });
    return error;
  }
  return res.json();
};
