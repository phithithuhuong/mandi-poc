import type { Metadata } from "next";
import "@/styles/_global.css";

export const metadata: Metadata = {
  title: "Mandi POC",
  description: "Next.js structure with Results screen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
