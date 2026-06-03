import PageLoader from "@components/UI/PageLoader";
export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <PageLoader />
    </div>
  );
}
