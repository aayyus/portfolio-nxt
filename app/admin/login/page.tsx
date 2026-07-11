import React from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  if (isAdmin()) redirect("/admin");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#030705] px-4 text-white">
      <div className="orb orb-green -top-40 -left-40 h-[30rem] w-[30rem]" />
      <div className="orb orb-emerald bottom-0 -right-40 h-[30rem] w-[30rem]" />
      <LoginForm />
    </main>
  );
}
