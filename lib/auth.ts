import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/gmail.readonly",
        },
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user.accessToken = token.accessToken;
      session.user.id = token.id;
      return session;
    },
  },
};
