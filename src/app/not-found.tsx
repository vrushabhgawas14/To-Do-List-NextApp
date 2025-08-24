"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const requestedPath = usePathname();

  return (
    <>
      <main className="flex items-center justify-center h-[60vh]">
        <section className="space-y-4 py-2 px-8">
          <h2 className="text-4xl sm:text-3xl font-bold">Oops!</h2>
          <h2 className="text-2xl sm:text-xl">
            Requested Page &quot;{requestedPath}&quot; Doesn&apos;t Exists.
          </h2>
          <p className="text-2xl sm:text-xl">
            Please check the URL or return to the{" "}
            <Link href="/" className="underline">
              homepage
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
