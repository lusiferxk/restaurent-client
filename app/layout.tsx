import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutClient from "@/components/LayoutClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "tasteBite",
  description: "Food Ordering System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  );
}
