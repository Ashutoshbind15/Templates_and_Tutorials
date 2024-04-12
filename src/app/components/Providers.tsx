"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./UI/Navbar";
import { Toaster } from "./uilib/ui/sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <nav>
        <Navbar />
      </nav>
      <main>{children}</main>
      <Toaster />
      <footer></footer>
    </SessionProvider>
  );
};

export default Providers;
