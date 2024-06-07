"use client";
import React, { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { useRecoilState, useRecoilValue } from "recoil";
import { classifiedMailAtom, gmailAtom } from "@/states/atoms/gmail";
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

export default function GmailPage() {
  const [classifiedmail, setClassifiedMail] =
    useRecoilState(classifiedMailAtom);
  const mails = useRecoilValue(gmailAtom);
  const [selected, setSelected] = useState(10);
  const [loading, setLoading] = useState(false);

  if (!mails) return null;

  const ClassifyMail = async () => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_APIKEY;
    console.log(apiKey);
    if (!apiKey) return alert("You have not set the OpenAI key");

    const selectedMails = mails.slice(0, selected);
    const emailContents = selectedMails.map((mail: any) => mail.snippet);
    const categories = await handleClassification(emailContents, apiKey);
    const categoriesObj = JSON.parse(categories);
    const classifiedMails = selectedMails.map((mail: any, index: number) => {
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
    });

    setClassifiedMail(classifiedMails);
    setLoading(false);
  };

  useEffect(() => {
    if (classifiedmail.length > 0) {
      ClassifyMail();
    }
  }, [selected]);

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

        <Button variant={"outline"} size={"sm"} onClick={ClassifyMail}>
          {loading ? "Classifying..." : "Classify"}
        </Button>
      </div>
      <div className="flex flex-col items-center gap-5 mt-2">
        {classifiedmail.length > 0
          ? classifiedmail.map((mail: any, index: any) => (
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
                        <p
                          className={`text-sm px-2 py-1 text-white rounded-[50px] ${
                            (mail.category === "marketing" && "bg-cyan-500") ||
                            (mail.category === "spam" && "bg-red-500") ||
                            (mail.category === "social" && "bg-purple-500") ||
                            (mail.category === "promotional" &&
                              "bg-gray-500") ||
                            (mail.category === "important" && "bg-green-500")
                          }`}
                        >
                          {mail.category}
                        </p>
                      </SheetTitle>
                      <SheetDescription>{mail.snippet}</SheetDescription>
                    </SheetHeader>
                    <SheetFooter className=" flex justify-start text-start">
                      From:{mail.from.email}
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            ))
          : mails
              .slice(0, selected)
              .map((mail: any, index: React.Key | null | undefined) => (
                <div key={index}>
                  <Sheet>
                    <SheetTrigger>
                      <GmailCard content={mail.snippet} from={mail.from.name} />
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle className="flex justify-between items-center">
                          <p>{mail.from.name}</p>
                        </SheetTitle>
                        <SheetDescription>{mail.snippet}</SheetDescription>
                      </SheetHeader>
                      <SheetFooter className=" flex justify-start text-start">
                        From:{mail.from.email}
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              ))}
      </div>
    </div>
  );
}
