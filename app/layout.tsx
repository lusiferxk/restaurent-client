import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext"; 
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import "./globals.css";


export const metadata: Metadata = {
  title: "tasteBite",
  description: "Foof Ordering System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <AuthProvider>
          <Header />
            <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
