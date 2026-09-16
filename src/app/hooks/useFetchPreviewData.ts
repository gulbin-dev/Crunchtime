"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import usePreview from "@hooks/usePreviewDetails";
import { normalizePreviewData } from "@utils/normalizeData";
export default function useFetchPreviewData() {
  const params = useParams();
  const { data, isLoading, isValidating } = usePreview(
    params.media,
    params.id,
    {
      suspense: true,
    },
  );

  const normalize = useMemo(
    () => (data && normalizePreviewData(data)) ?? null,
    [data],
  );
  const videoTrailer = useMemo(
    () =>
      normalize
        ? normalize?.videos?.results.find((v) => v.type === "Trailer")
        : null,
    [normalize],
  );

  return useMemo(
    () => ({
      params,
      data,
      normalize,
      videoTrailer,
      isLoading,
      isValidating,
    }),
    [params, data, normalize, videoTrailer, isLoading, isValidating],
  );
}
