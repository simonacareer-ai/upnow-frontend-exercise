import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UpNow — Frontend Exercise",
  description: "Blank Next.js starter for the frontend assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
