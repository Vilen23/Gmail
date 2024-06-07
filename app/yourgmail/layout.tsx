import { Roboto } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
