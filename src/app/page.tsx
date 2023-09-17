"use client";
import SignInC from "./components/auth/SignInC";
import SignOut from "./components/auth/SingOut";
import PostForm from "./components/forms/Post";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const { data: sess } = useSession();

  useEffect(() => {
    const helper = async () => {
      const { data } = await axios.get("/api/gauth/repos");
      console.log(data);
    };

    helper();
  }, [sess]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Prisma and nextauth</div>

      <PostForm />
      <SignInC />
      <SignOut />
    </main>
  );
}
