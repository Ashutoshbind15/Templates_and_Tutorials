"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { useSession } from "next-auth/react";

const ChangeRole = ({ className }: { className: string }) => {
  const { data: session } = useSession();
  const rtr = useRouter();

  const roleChangeHandler = async () => {
    const res = await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: session?.user?.role === "USER" ? "CREATOR" : "USER",
      }),
    });

    rtr.push("/");
  };

  return (
    <Button type="button" onClickf={roleChangeHandler} className={className}>
      Change Role to {session?.user?.role === "USER" ? "CREATOR" : "USER"}
    </Button>
  );
};

export default ChangeRole;
