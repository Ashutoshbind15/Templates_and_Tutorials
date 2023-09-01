"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const sess = useSession();
  const user = sess?.data?.user;

  return (
    <div className="flex items-center justify-between py-2 px-6 font-semibold text-xl">
      <Link href={"/"}>Templates & Tutorials</Link>
      <div className="flex items-center">
        <Link href={"/addrepo"} className="mr-3">
          Add Repo
        </Link>
        {user && (
          <Link href={"/profile"} className="mr-3">
            {/* circular user profile having the initials */}

            <div className="bg-white text-black h-10 w-10 rounded-full flex items-center justify-center">
              {user.name && user.name.length && user.name[0]}
            </div>
          </Link>
        )}
        {!user && (
          <Link href={"/api/auth/signin"} className="mr-3">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
