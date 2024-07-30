"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { DoorClosed, DoorOpen, ShoppingBag, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../uilib/ui/avatar";
import { useState } from "react";
import ChangeRole from "./Buttons/ChangeRole";

const Navbar = () => {
  const sess = useSession();
  const status = sess?.status;
  const user = sess?.data?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-between py-2 px-6 font-semibold text-xl">
      <Link href={"/"} className="text-2xl font-bold">
        Templates & Tutorials
      </Link>
      <div className="flex items-center gap-x-6">
        <Link href={"/repo"} className="mr-3 flex items-center gap-x-2">
          <span>Store</span> <ShoppingCart />
        </Link>

        {user?.role === "CREATOR" && (
          <Link href={"/editrepo"} className="mr-3 flex items-center gap-x-2">
            <span>Edit Store</span> <ShoppingBag />
          </Link>
        )}

        {user && user.name?.length ? (
          <div className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="cursor-pointer"
            >
              <Avatar>
                <AvatarImage src={user.image as string} alt={user?.name} />
                <AvatarFallback>
                  <span>{user.name?.[0]}</span>
                </AvatarFallback>
              </Avatar>
            </div>
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 transition-transform transform origin-top-right"
                style={{ zIndex: 10 }}
              >
                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  {sess?.data?.user?.name}
                </span>
                <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                  {sess?.data?.user?.role.toLowerCase()}
                </span>
                <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">
                  <ChangeRole className="" />
                </div>
                <div
                  className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer gap-x-3"
                  onClick={() => signOut()}
                >
                  <span>Sign Out</span>
                  <DoorOpen />
                </div>
              </div>
            )}
          </div>
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
