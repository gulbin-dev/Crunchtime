import { FeatureFlagName, FeatureFlags } from "@utils/featureFlag";

export default function FeatureFlagWrapper({
  featureFlag,
  children,
}: {
  featureFlag: FeatureFlagName;
  children: React.ReactNode;
}) {
  return FeatureFlags[featureFlag] ? children : null;
}
