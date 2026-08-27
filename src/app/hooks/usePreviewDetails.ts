import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import { Preview } from "@utils/types";

interface UsePreviewOptions {
  suspense?: boolean;
}

export default function usePreview(
  media: string | string[] | undefined,
  id: string | string[] | undefined,
  options: UsePreviewOptions = {},
) {
  const key =
    media && id
      ? `/preview/${media}/${id}/api/preview?media=${media}&id=${id}`
      : null;

  return useSWR<Preview>(key, (url) => fetcher(url), {
    suspense: options.suspense ?? false,
  });
}
