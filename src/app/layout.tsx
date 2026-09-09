import type { Metadata } from "next";
import { Inter, Roboto_Serif } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import Header from "./components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-roboto-serif",
});

export const metadata: Metadata = {
  title: "UpNow — Find a Space You Can Trust",
  description:
    "Premium marketplace for rentals, services, and curated experiences across the UAE.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSerif.variable}`}>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
