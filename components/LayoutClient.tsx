"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hideLayout = pathname.startsWith("/dashboard/") || pathname.startsWith("/restaurant/") || pathname.startsWith("/login") || pathname.startsWith("/register/") || pathname.startsWith("/deliverer/") || pathname.startsWith("/delivery/") || pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");

      if (
        !token &&
        (pathname.startsWith("/dashboard") || pathname.startsWith("/restaurant"))
      ) {
        router.push("/login");
      }
    }
  }, [pathname]);

  return (
    <>
      {!hideLayout && <Header />}
      <main className="flex-grow">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
