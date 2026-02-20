import type { Metadata } from "next";
import "./index.css";
import { getServerSession } from "next-auth";
import RootLayoutClient from "@/lib/RootLayoutClient";

export const metadata: Metadata = {
  title: "Untick Task",
  description: "Never Miss Your To Do's!",
  keywords: [
    "Vrushabh Gawas",
    "Untick Task",
    "Untick Task Vrushabh Gawas",
    "Untick Task Vercel",
    "Vercel",
    "To Do app",
  ],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://untick-task.vercel.app"),
  verification: {
    google: "JH2cAfFIcBaQ_rBQ5Yhbzua6sFpwoB0W6fo5RIf5QIQ",
  },
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
