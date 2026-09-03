import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#059669",
};

export const metadata: Metadata = {
  title: "SMARTCART | Instant WhatsApp Order & Verified Electronics Store",
  description:
    "Official SMARTCART e-commerce store with verified catalog, Daraz-style mobile grid, and instant WhatsApp ordering system for 01794608874.",
  openGraph: {
    title: "SMARTCART | Instant WhatsApp Order & Verified Electronics Store",
    description:
      "Official SMARTCART e-commerce store with verified catalog, Daraz-style mobile grid, and instant WhatsApp ordering system for 01794608874.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#f8fafc] text-slate-800 antialiased">{children}</body>
    </html>
  );
}
