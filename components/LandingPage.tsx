"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gmailAtom } from "@/states/atoms/gmail";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { Error } from "./Error";
import { OpenAIAtom } from "@/states/atoms/OpenAI";

export default function LandingPage() {
  const router = useRouter();
  const session = useSession();
  const [error, setError] = useState("");
  const [gmail, setGmail] = useRecoilState(gmailAtom);
  const [openAIKey, setOpenAIKey] = useRecoilState(OpenAIAtom);

  const handleClick = async () => {
    signIn("google", {
      callbackUrl: "http://localhost:3000",
    });
  };

  const handlegetGmail = async () => {
    if (!session?.data?.user) return setError("Please login first");
    try {
      const response = await axios.post("/api/gmail/getgmail");
      setGmail(response.data);
      router.push("/yourgmail");
    } catch (error) {
      console.log(error);
      setError("Something went wrong try again later");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] gap-10">
      {error && (
        <div className="w-[80vw] md:w-[60vw]">
          <Error message={error} />
        </div>
      )}
      <Button onClick={handlegetGmail}>Get gmails</Button>
      <Button onClick={handleClick}>
        {session?.data?.user ? "Logged in" : "Log in with google"}
      </Button>
      <Input
        placeholder="Enter OpenAI Key"
        className="w-[80vw] md:w-[60vw]"
        onChange={(e) => {
          setOpenAIKey(e.target.value);
          localStorage.setItem("openai-key", e.target.value);
        }}
      />
    </div>
  );
}
