"use client";
import React, { useState } from "react";

import { Button } from "./ui/button";
import { useRecoilValue } from "recoil";
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

export default function GmailPage() {
  const [classifiedmail, setClassifiedMail] = useState<any[]>([]);
  const mails = useRecoilValue(gmailAtom);
  if (!mails) return null;
  const [selected, setSelected] = useState(10);
  
  const ClassifyMail = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_APIKEY;
      console.log(apiKey);
    if (!apiKey) return alert("You have not set the OpenAI key");

    const selectedMails = mails.slice(0, selected);
    const emailContents = selectedMails.map((mail: any) => mail.snippet);
    const categories = await handleClassification(emailContents, apiKey);

    const classifiedMails = selectedMails.map((mail: any, index: number) => ({
      ...mail,
      category: categories[index],
    }));

    setClassifiedMail(classifiedMails);
  };

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
          Classify
        </Button>
      </div>
      <div className="flex flex-col items-center gap-5 mt-2">
        {classifiedmail.length > 0
          ? classifiedmail.map((mail: any, index) => (
              <div key={index}>
                <GmailCard
                  content={mail.snippet}
                  from={mail.payload.headers[13].value.slice(0, 40)}
                  category={mail.category}
                />
              </div>
            ))
          : mails
              .slice(0, selected)
              .map((mail: any, index: React.Key | null | undefined) => (
                <div key={index}>
                  <GmailCard
                    content={mail.snippet}
                    from={mail.payload.headers[13].value.slice(0, 40)}
                  />
                </div>
              ))}
      </div>
    </div>
  );
}
