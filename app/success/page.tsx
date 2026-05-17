import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Task Posted | TaskU Trinity",
  description: "Your TaskU Trinity task was posted successfully.",
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#061A40] px-5 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,164,74,0.28),transparent_34%),linear-gradient(135deg,#061A40_0%,#08265E_48%,#030B1C_100%)]" />
      <section className="relative w-full max-w-3xl rounded-[2rem] border border-white/18 bg-white/10 p-8 text-center shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F4D77F] text-[#061A40]">
          <CheckCircle2 size={34} strokeWidth={3} />
        </div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-[#F4D77F]">
          TaskU Trinity
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.9] sm:text-6xl">
          Task posted successfully.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-xl font-bold leading-tight text-white/72">
          Thanks for using TaskU Trinity.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#F4D77F] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#061A40] shadow-[0_22px_70px_rgba(201,164,74,0.28)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Post another task
        </a>
      </section>
    </main>
  );
}
