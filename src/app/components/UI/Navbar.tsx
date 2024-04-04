"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const sess = useSession();
  const status = sess?.status;

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Unauthenticated</div>;

  const user = sess?.data?.user;

  return (
    <div className="flex items-center justify-between py-2 px-6 font-semibold text-xl">
      <Link href={"/"}>Templates & Tutorials</Link>
      <div className="flex items-center">
        <Link href={"/addrepo"} className="mr-3">
          Add Repo
        </Link>
        {user && user.name?.length ? (
          <Link
            href={"/profile"}
            className="mr-3 bg-white text-black h-10 w-10 rounded-full flex items-center justify-center"
          >
            {user.name && user.name.length && user.name[0]}
          </Link>
        ) : (
          <Link href={"/api/auth/signin"} className="mr-3">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
