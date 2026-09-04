export type FeatureFlagName = keyof typeof FeatureFlags;

export const FeatureFlags = {
  ACCOUNT_FLAG: process.env.NEXT_PUBLIC_FEATURE_ACCOUNT_FLAG === "true",
  CATALOG_FLAG: process.env.NEXT_PUBLIC_FEATURE_CATALOG_FLAG === "true",
} as const;
