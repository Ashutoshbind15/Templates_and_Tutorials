"use client"; // Error components must be Client Components

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const rtr = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.log(error);
    toast(error.message);
    rtr.push("/profile");
  }, [error, rtr]);

  return (
    <>
      <h2>Change to another role for this action</h2>
    </>
  );
}
