"use client";

import React from "react";

export default function Button({
  onClickf,
  className,
  children,
  type = "button",
}: {
  onClickf?: any;
  className?: string;
  children?: React.ReactNode;
  type: "submit" | "button";
}) {
  return (
    <button
      onClick={onClickf}
      className={`border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105 ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}
