import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GmailCardProps {
  content: string;
  from: string;
  category?: string;
}

export default function GmailCard({ content, from, category }: GmailCardProps) {
  return (
    <div className="overflow-x-hidden">
      <Card className="w-[80vw] md:w-[820px]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <p className="text-lg">{from}</p>
            <p
              className={`text-sm px-2 py-1 text-white rounded-[50px] ${
                (category === "marketing" && "bg-cyan-500") ||
                (category === "spam" && "bg-red-500") ||
                (category === "social" && "bg-purple-500") ||
                (category === "promotional" && "bg-gray-500") ||
                (category === "important" && "bg-green-500") ||
                (category === "personal" && "bg-yellow-500") ||
                (category === "unknown" && "bg-blue-500")
              }`}
            >
              {category}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/70 md:w-[750px] text-start">
            {content}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
