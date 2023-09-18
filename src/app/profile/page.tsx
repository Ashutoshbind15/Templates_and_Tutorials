import React from "react";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import ChangeRole from "../components/UI/Buttons/ChangeRole";

const ProfilePage = async () => {
  const sess = await getServerSession(options1);
  const user = sess?.user;

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
        <ChangeRole body={"Change Role"} className="" />
      </div>
    </div>
  );
};

export default ProfilePage;
