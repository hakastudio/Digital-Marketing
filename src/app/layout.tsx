import type { Metadata } from "next";

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Marketing Analytics Dashboard",
  description: "Track and optimize your marketing campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body className={inter.className}>
          <DashboardShell>{children}</DashboardShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
