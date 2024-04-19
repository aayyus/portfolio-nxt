import React from "react";

export default function Title({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h1 className="text-3xl font-bold flex gap-3 group-hover:text-green-400 transition-all">
        {text}
      </h1>
      <div className="w-40 h-2 bg-purple-500 rounded-full translate-x-4"></div>
      <div className="w-40 h-2 bg-gray-500 rounded-full"></div>
    </div>
  );
}
