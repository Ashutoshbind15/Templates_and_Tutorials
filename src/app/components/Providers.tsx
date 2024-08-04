"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "./UI/Navbar";
import { Toaster } from "./uilib/ui/sonner";
import { GithubOutlined } from "@ant-design/icons";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <nav>
        <Navbar />
      </nav>
      <main className="min-h-screen">{children}</main>
      <Toaster />
      <footer className="flex items-center bg-gray-950 border-t-4 border-white text-white py-6 px-4 justify-between text-lg">
        <div className="flex flex-col items-center">
          <div>Templates and Tutorials</div>
          <div>2024</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-sm">
            Made by: <span className="font-semibold">Ashutosh Bind</span>
          </div>

          <a
            href={`https://github.com/Ashutoshbind15/Templates_and_Tutorials`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubOutlined />
          </a>
        </div>
      </footer>
    </SessionProvider>
  );
};

export default Providers;
