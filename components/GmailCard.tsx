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
          <CardTitle>
            <p className="text-lg">{from}</p>
            <p>{category}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/70 md:w-[800px]">{content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
