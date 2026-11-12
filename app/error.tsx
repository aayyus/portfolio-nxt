"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col justify-between bg-paper p-4 text-ink md:p-6">
      <p className="label opacity-70">Something went wrong</p>
      <div>
        <h1 className="display-title text-[clamp(5rem,22vw,16rem)]">oops.</h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed">
          The page hit an unexpected error. Trying again usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          className="label mt-8 inline-flex h-11 items-center border border-ink px-5 transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
