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
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    signIn("google", {
      callbackUrl: "https://gmail-topaz-three.vercel.app/",
    });
  };

  const handlegetGmail = async () => {
    if (!session?.data?.user) return setError("Please login first");
    try {
      setLoading(true);
      const response = await axios.post("/api/gmail/getgmail");
      const selectedMails = response.data;
      const Mails = selectedMails.map((mail: any, index: number) => {
        const fromHeader = mail.payload.headers.find(
          (header: any) => header.name === "From"
        )?.value;
        const fromEmail = fromHeader?.match(/<(.*?)>/)?.[1];
        const fromName = fromHeader?.match(/(.+?)\s?</)?.[1];
        return {
          ...mail,
          from: {
            name: fromName || "",
            email: fromEmail || fromHeader || "",
          },
        };
      });
      setGmail(Mails);
      router.push("/yourgmail");
      setLoading(false);
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
      <Button onClick={handlegetGmail}>
        {loading ? "Wait while we get your mails" : "Get Mails"}
      </Button>
      <Button onClick={handleClick}>
        {session?.data?.user ? "Logged in" : "Log in with google"}
      </Button>
    </div>
  );
}
