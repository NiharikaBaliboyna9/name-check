import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NamesPlay — Discover the Story Behind Every Name",
  description:
    "Explore the etymology, cultural origins, and meaning of first, middle, and last names powered by Amazon AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased text-white">{children}</body>
    </html>
  );
}
