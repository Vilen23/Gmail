"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const session = useSession();
  console.log(session);
  const handleClick = async () => {
    signIn("google", {
      callbackUrl: "http://localhost:3000",
    });
  };
  const handlegetGmail = async () => {
    const response = await axios.post("/api/gmail/getgmail");
    console.log(response);
  }
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] gap-10">
      <Button onClick={handlegetGmail}>Get gmails</Button>
      <Button onClick={handleClick}>Login with google</Button>
      <Input placeholder="Enter OpenAI Key" className="w-[800px]" />
    </div>
  );
}
