import type { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
  title: "To Do List",
  description: "Never miss you to do's.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-black">{children}</body>
    </html>
  );
}
