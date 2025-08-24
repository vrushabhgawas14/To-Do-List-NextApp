import type { Metadata } from "next";
import "./index.css";
import { getServerSession } from "next-auth";
import RootLayoutClient from "@/lib/RootLayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://untick-task.vercel.app"),

  title: "To Do List",
  description: "Never miss you to do's.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className="text-black">
        <RootLayoutClient session={session}>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
