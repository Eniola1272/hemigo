import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Hemigo — Sell in batches", template: "%s · Hemigo" },
  description: "Create a storefront, set when orders close, collect payments, and fulfill without chaos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
