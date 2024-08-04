"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

const ChangeRole = ({ className }: { className: string }) => {
  const { data: session } = useSession();
  const rtr = useRouter();

  const roleChangeHandler = async () => {
    toast.loading("Changing role", {
      id: "role-change",
      duration: 10000,
    });

    const res = await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: session?.user?.role === "USER" ? "CREATOR" : "USER",
      }),
    });

    signOut();

    toast.dismiss("role-change");
    toast.success("Role changed successfully. Please sign in again");
    rtr.push("/api/auth/signin");
  };

  return (
    <span onClick={roleChangeHandler} className={className}>
      Change to {session?.user?.role === "USER" ? "creator" : "user"}
    </span>
  );
};

export default ChangeRole;
