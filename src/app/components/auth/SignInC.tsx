"use client";

import { signIn } from "next-auth/react";
import Button from "../UI/Button";

const SignInC = () => {
  return (
    <Button onClick={() => signIn()} type="button">
      Signin
    </Button>
  );
};

export default SignInC;
