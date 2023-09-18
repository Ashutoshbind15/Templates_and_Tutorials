"use client";

import { signOut } from "next-auth/react";
import Button from "../UI/Button";

export default function SignOut() {
  return (
    <Button onClickf={() => signOut()} type="button">
      Sign out
    </Button>
  );
}
