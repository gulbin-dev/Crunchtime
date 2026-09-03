export type FeatureFlagName = keyof typeof FeatureFlags;

export const FeatureFlags = {
  ACCOUNT_FLAG: process.env.NEXT_PUBLIC_FEATURE_ACCOUNT_FLAG === "true",
} as const;
