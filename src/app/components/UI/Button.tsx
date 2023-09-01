"use client";

export default function Button({
  onClick,
  className,
  children,
  type = "button",
}: {
  onClick?: any;
  className?: string;
  children?: string;
  type: "submit" | "button";
}) {
  return (
    <button
      onClick={onClick}
      className={`border-white border-2 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-all hover:scale-105 ${className}`}
      type={type}
    >
      {children}
    </button>
  );
}
