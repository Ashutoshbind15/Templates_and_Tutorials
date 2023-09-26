"use client";

import React from "react";
import Button from "../Button";
import { redirect } from "next/navigation";

const RedirectButton = ({ url }: { url: string }) => {
  return (
    <div>
      <Button type="button" onClickf={() => redirect(`${url}`)}></Button>
    </div>
  );
};

export default RedirectButton;
