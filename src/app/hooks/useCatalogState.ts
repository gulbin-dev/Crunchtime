import { useState } from "react";

export type CatalogType = "movie" | "tv";
export const useCatalogState = () => {
  const [catalog, setCatalog] = useState<CatalogType>("movie");
  return { catalog, setCatalog };
};
