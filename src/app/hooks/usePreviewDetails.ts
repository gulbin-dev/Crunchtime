import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import { Preview } from "@utils/types";
import { useAbortController } from "./useAbortController";

interface UsePreviewOptions {
  suspense?: boolean;
}

export default function usePreview(
  media: string | string[] | undefined,
  id: string | string[] | undefined,
  options: UsePreviewOptions = {},
) {
  const signal = useAbortController([media, id]);

  const key =
    media && id
      ? `/preview/${media}/${id}/api/preview?media=${media}&id=${id}`
      : null;

  return useSWR<Preview>(key, (url) => fetcher(url, signal), {
    suspense: options.suspense ?? false,
  });
}
