import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/sonner";

export function Layout() {
  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main>
        <Outlet />
      </main>
    </>
  );
}
