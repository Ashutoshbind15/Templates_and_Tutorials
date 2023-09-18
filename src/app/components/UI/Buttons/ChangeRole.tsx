"use client";

import { useRouter } from "next/navigation";
import Button from "../Button";
import { useSession } from "next-auth/react";

const ChangeRole = ({
  body,
  className,
}: {
  body: string;
  className: string;
}) => {
  const { data: session } = useSession();
  const rtr = useRouter();

  const roleChangeHandler = async () => {
    const res = await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: session?.user?.role === "ADMIN" ? "USER" : "ADMIN",
      }),
    });
    const data = await res.json();
    console.log(data);

    rtr.push("/");
  };

  return (
    <Button type="button" onClickf={roleChangeHandler} className={className}>
      {body}
    </Button>
  );
};

export default ChangeRole;
