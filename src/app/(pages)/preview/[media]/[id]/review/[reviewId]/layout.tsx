import { connection } from "next/server";

export default async function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  return <>{children}</>;
}
