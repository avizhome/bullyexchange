import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BullyExchange | American Bully Marketplace",
  description: "Buy, sell, swap and connect with approved American Bully sellers and breeders."
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><nav className="mobile-nav" aria-label="Mobile navigation"><a href="/">Home</a><a href="/puppies">Puppies</a><a href="/stores">Stores</a><a href="/seller/dashboard">My account</a></nav>{children}</body>
    </html>
  );
}
