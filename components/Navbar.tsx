"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  const session = useSession();
  const user = session.data?.user;

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("openai-key");
    localStorage.removeItem("recoil-persist");
    signOut({ callbackUrl: "https://gmail-topaz-three.vercel.app/" });
  };
  return (
    <div className="flex justify-between pt-20 px-10 md:px-[200px]">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={user.image} alt="@shadcn" />
        </Avatar>
        <div className="flex flex-col">
          <p className="font-roboto text-sm font-bold">{user.name}</p>
          <p className="text-xs text-black/70">{user.email}</p>
        </div>
      </div>
      <div>
        <Button size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
