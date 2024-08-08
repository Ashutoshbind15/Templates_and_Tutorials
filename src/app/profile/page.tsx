import React from "react";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { options1 } from "../api/auth/[...nextauth]/options";
import ChangeRole from "../components/UI/Buttons/ChangeRole";

const ProfilePage = async () => {
  const sess = await getServerSession(options1);
  const user = sess?.user;

  return (
    <div className="flex flex-col my-20 p-4 border-2 border-white w-1/3 items-center">
      <div className="w-1/2">
        {user && user?.image && (
          <Image src={user?.image} width={300} height={300} alt="profile" />
        )}
      </div>
      <div className="w-1/2 flex flex-col items-center">
        <div>{user?.name}</div>
        <div>{user?.email}</div>
        <div>{user?.role}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
