import type { Metadata } from "next";
import "./globals.css";
import { landingPageContent } from "../lib/placeholder-data";

export const metadata: Metadata = {
  title: landingPageContent.brand,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
