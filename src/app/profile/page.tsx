"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "../components/UI/Button";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const sess = useSession();
  console.log(sess);
  const rtr = useRouter();
  const user = sess?.data?.user;

  const roleChangeHandler = async () => {
    const res = await fetch("/api/user/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: user?.role === "ADMIN" ? "BASIC" : "ADMIN",
      }),
    });
    const data = await res.json();
    console.log(data);
    rtr.push("/");
  };

  return (
    <div className="flex py-20 px-20 items-center">
      <div className="w-1/2">
        {/* <Image src={user?.user?.image}>{(user as any)?.name}</Image> */}

        {user && user?.image && (
          <Image src={user?.image} width={300} height={300} alt="profile" />
        )}
      </div>
      <div className="w-1/2">
        <div>{user?.name}</div>
        <div>{user?.email}</div>
        <div>{user?.role}</div>
        <Button onClick={roleChangeHandler} type="button">
          Change Role
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
