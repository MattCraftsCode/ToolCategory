import { cn } from "@/lib/utils";

type JoinTheCommunityProps = {
  className?: string;
};

// Renders the shared newsletter CTA used across detail and marketing pages.
export function JoinTheCommunity({ className }: JoinTheCommunityProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[92rem] px-6 lg:px-12 xl:px-20",
        className,
      )}
    >
      <div className="rounded-[32px] bg-[#f6f6f8] px-10 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ff6d57]">
          Newsletter
        </p>
        <h2 className="mt-4 text-[2.1rem] font-semibold tracking-tight text-[#1f1f24]">
          Join the Community
        </h2>
        <p className="mt-3 text-sm text-[#6f6f78]">
          Subscribe to our newsletter for the latest news and updates.
        </p>
        <form className="mx-auto mt-8 flex max-w-xl items-center rounded-full bg-white pr-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="h-14 w-full rounded-full px-6 text-sm text-[#2c2c32] placeholder:text-[#a7a7af] focus:outline-none"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#ff6d57] text-white transition hover:bg-[#ff5a43]"
            aria-label="Subscribe"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22l-4-9-9-4Z" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
