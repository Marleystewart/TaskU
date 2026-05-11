import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskU @ UConn",
  description: "Post a task and get help from nearby UConn students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white font-sans text-uconn antialiased">{children}</body>
    </html>
  );
}
