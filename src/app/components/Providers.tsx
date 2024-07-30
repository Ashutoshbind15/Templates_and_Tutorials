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
      <main className="min-h-screen">{children}</main>
      <Toaster />
      <footer className="flex items-center bg-gray-800 text-white py-6 px-4 justify-between text-lg">
        <div className="flex flex-col items-center">
          <div>Templates and Tutorials</div>
          <div>2024</div>
        </div>
        <div className="flex flex-col items-center">
          <div>Ashutosh Bind</div>
        </div>
      </footer>
    </SessionProvider>
  );
};

export default Providers;
