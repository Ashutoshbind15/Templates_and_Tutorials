"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./UI/Navbar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <nav>
        <Navbar />
      </nav>
      {children}
    </SessionProvider>
  );
};

export default Providers;
