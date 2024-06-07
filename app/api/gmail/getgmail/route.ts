import { NEXT_AUTH } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(NEXT_AUTH);
  if (!session)
    return NextResponse.json({ message: "No session found" }, { status: 401 });

  try {
    const { accessToken } = session.user;

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const gmails = await gmail.users.messages.list({
      userId: "me",
      maxResults: 50,
    });

    const messages = gmails.data.messages;
    if (!messages) return NextResponse.json({ message: "No messages found" });
    const fullMessages = await Promise.all(
      messages.map(async (message: any) => {
        const fullMessage = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return fullMessage.data;
      })
    );
    return NextResponse.json(fullMessages);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
