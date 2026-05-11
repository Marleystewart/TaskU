import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskU | How It Works",
  description: "How TaskU helps students get everyday tasks done on campus.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-uconn">
      <section className="relative px-5 py-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <a className="text-sm font-black uppercase tracking-[0.28em]" href="/">
                TaskU
              </a>
              <a
                className="text-xs font-black uppercase tracking-[0.18em] text-husky"
                href="/how-it-works"
              >
                How It Works
              </a>
            </div>
            <a
              href="/#task-form"
              className="rounded-full border border-uconn px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition duration-200 hover:scale-[1.03] hover:bg-uconn hover:text-white"
            >
              Post
            </a>
          </header>

          <div className="grid gap-8 py-12 sm:py-16 lg:py-20">
            <div className="border-y-2 border-uconn py-5">
              <p className="mb-4 inline-flex rounded-full bg-ice px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-husky">
                TaskU @ UConn
              </p>
              <h1 className="max-w-5xl text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.82] tracking-normal">
                How TaskU Works
              </h1>
            </div>

            <div className="max-w-3xl space-y-6 text-xl font-extrabold leading-tight text-uconn/78 sm:text-3xl">
              <p>
                TaskU is a simple way to get help with everyday tasks on campus.
              </p>
              <p>
                Just describe what you need, pay a small posting fee, and your task is shared so someone can help you quickly.
              </p>
              <p>
                Whether it&apos;s moving something, running an errand, or getting quick help — TaskU makes it easy.
              </p>
              <p>
                The person who completes your task keeps 100% of the payment, and you work out the job details and payment directly with them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
