"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRecoilState } from "recoil";
import { gmailAtom } from "@/states/atoms/gmail";
import GmailCard from "./GmailCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { handleClassification } from "@/app/actions/categorise";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useSession } from "next-auth/react";

export default function GmailPage() {
  const session = useSession();
  const [mails, setMails] = useRecoilState(gmailAtom);
  const [selected, setSelected] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isClassified, setIsClassified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  if (!mails) return null;
  if (!session?.data?.user.id) return <div>Loading...</div>;
  const ClassifyMail = async () => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_APIKEY;
    if (!apiKey) return alert("You have not set the key");

    const selectedMails = mails;
    const emailContents = selectedMails.map((mail: any) => mail.snippet);
    const categories = await handleClassification(emailContents, apiKey);
    const categoriesObj = JSON.parse(categories);
    console.log(categoriesObj);
    setMails(
      mails.map((mail: any, index: number) => {
        const fromHeader = mail.payload.headers.find(
          (header: any) => header.name === "From"
        )?.value;
        const fromEmail = fromHeader?.match(/<(.*?)>/)?.[1];
        const fromName = fromHeader?.match(/(.+?)\s?</)?.[1];
        return {
          ...mail,
          category:
            categoriesObj[`Email ${index + 1}` as keyof typeof categoriesObj],
          from: {
            name: fromName || "",
            email: fromEmail || fromHeader || "",
          },
        };
      })
    );
    setLoading(false);
    setIsClassified(true);
  };

  const filteredMails =
    selectedCategory === "All Categories"
      ? mails
      : mails.filter((mail: any) => mail.category === selectedCategory);

  return (
    <div className="md:px-[210px] px-12 pt-3">
      <div className="flex justify-between">
        <Select
          onValueChange={(e) => {
            setSelected(parseInt(e));
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={selected || "Number of mails"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        {isClassified && (
          <Select
            onValueChange={(e) => {
              setSelectedCategory(e);
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue
                placeholder={selectedCategory || "All type of mails"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="unknown">Others</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant={"outline"} size={"sm"} onClick={ClassifyMail}>
          {loading ? "Classifying..." : "Classify"}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-5 mt-2">
        {filteredMails
          .slice(0, selected)
          .map((mail: any, index: React.Key | null | undefined) => (
            <div key={index}>
              <Sheet>
                <SheetTrigger>
                  <GmailCard
                    content={mail.snippet}
                    from={mail.from.name}
                    category={mail.category}
                  />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex justify-between items-center">
                      <p>{mail.from.name}</p>
                      {mail.category && (
                        <p
                          className={`text-sm px-2 py-1 text-white rounded-[50px] ${
                            (mail.category === "marketing" && "bg-cyan-500") ||
                            (mail.category === "spam" && "bg-red-500") ||
                            (mail.category === "social" && "bg-purple-500") ||
                            (mail.category === "promotional" &&
                              "bg-gray-500") ||
                            (mail.category === "important" && "bg-green-500") ||
                            (mail.category === "personal" && "bg-yellow-500") ||
                            (mail.category === "unknown" && "bg-blue-500")
                          }`}
                        >
                          {mail.category}
                        </p>
                      )}
                    </SheetTitle>
                    <SheetDescription>{mail.snippet}</SheetDescription>
                  </SheetHeader>
                  <SheetFooter className="flex justify-start text-start">
                    From: {mail.from.email}
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          ))}
      </div>
    </div>
  );
}
