"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { useSession } from "next-auth/react";
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

    toast.dismiss("role-change");

    rtr.push("/");
  };

  return (
    <span onClick={roleChangeHandler} className={className}>
      Change to {session?.user?.role === "USER" ? "creator" : "user"}
    </span>
  );
};

export default ChangeRole;
