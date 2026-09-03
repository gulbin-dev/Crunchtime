import PageLoader from "@components/UI/PageLoader";
export default function Loading() {
  return (
    <div className="bg-primary flex h-screen items-center justify-center">
      <PageLoader />
    </div>
  );
}
