"use client";

import { useParams } from "next/navigation";
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

  const normalize = (data && normalizePreviewData(data)) ?? null;
  const videoTrailer = normalize
    ? normalize?.videos?.results.find((v) => v.type === "Trailer")
    : null;

  return { params, data, normalize, videoTrailer, isLoading, isValidating };
}
