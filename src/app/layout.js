import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Noor G Fabrics | Premium Clothing",
  description: "Premium cotton & lawn for everyday elegance.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
