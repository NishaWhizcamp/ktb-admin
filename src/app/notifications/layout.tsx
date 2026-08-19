import { AuthGuard } from "@/components/layout/AuthGuard";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
