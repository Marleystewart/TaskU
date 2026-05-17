"use client";

import { FormEvent, useState } from "react";
import {
  ArrowRight,
  AtSign,
  BadgeDollarSign,
  BookOpen,
  CheckCircle2,
  Coffee,
  Handshake,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";

const SHEET_URL = "https://api.sheetbest.com/sheets/2322f9c9-a31f-4c3b-860b-7570ce78972d";
const STRIPE_LINK = "https://buy.stripe.com/test_28EbJ14ZW6W81wy8cA2go00";

type TaskForm = {
  name: string;
  email: string;
  phone: string;
  taskTitle: string;
  description: string;
  helperPay: string;
  paymentMethod: "Cash App" | "Zelle" | "Venmo" | "Apple Pay";
};

const initialForm: TaskForm = {
  name: "",
  email: "",
  phone: "",
  taskTitle: "",
  description: "",
  helperPay: "",
  paymentMethod: "Venmo",
};

const taskTypes = [
  { label: "Moving", icon: Package },
  { label: "Errands", icon: Truck },
  { label: "Food pickup", icon: Coffee },
  { label: "Cleaning", icon: Sparkles },
  { label: "Tutoring", icon: BookOpen },
  { label: "Deliveries", icon: Handshake },
];

const paymentMethods = ["Cash App", "Zelle", "Venmo", "Apple Pay"] as const;

export default function Home() {
  const [form, setForm] = useState<TaskForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof TaskForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = {
      campus: "Trinity College Hartford",
      name: form.name,
      email: form.email,
      phone: form.phone,
      taskTitle: form.taskTitle,
      description: form.description,
      helperPay: form.helperPay,
      paymentMethod: form.paymentMethod,
      postingFee: "$3",
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(SHEET_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("TaskU Trinity Sheet.best request failed", {
          status: response.status,
          statusText: response.statusText,
          response: errorText,
          payload,
        });
      }
    } catch (error) {
      console.error("TaskU Trinity sheet submit failed", error);
    } finally {
      window.location.href = STRIPE_LINK;
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#061A40] text-white">
      <section className="relative isolate px-5 py-5 sm:px-8 lg:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(201,164,74,0.28),transparent_34%),linear-gradient(135deg,#061A40_0%,#08265E_48%,#030B1C_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#C9A44A]/12 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          <header className="flex items-center justify-between border-b border-white/15 pb-5">
            <a href="#top" className="text-sm font-black uppercase tracking-[0.28em] text-[#F4D77F]">
              TaskU Trinity
            </a>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/thetasku"
                target="_blank"
                rel="noreferrer"
                className="hidden items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-white/68 transition hover:text-[#F4D77F] sm:flex"
              >
                <AtSign size={16} />
                @thetasku
              </a>
              <a
                href="#task-form"
                className="rounded-full border border-[#F4D77F]/70 bg-[#F4D77F] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#061A40] shadow-[0_18px_45px_rgba(201,164,74,0.25)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Post
              </a>
            </div>
          </header>

          <div id="top" className="grid gap-10 py-12 lg:grid-cols-[1fr_0.82fr] lg:items-center lg:py-20">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F4D77F] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur">
                <Sparkles size={15} fill="currentColor" />
                Campus help for Trinity students
              </p>
              <h1 className="max-w-5xl text-[clamp(3.25rem,10vw,8.75rem)] font-black uppercase leading-[0.82] tracking-normal">
                Get campus help fast.
              </h1>
              <p className="mt-6 max-w-2xl text-xl font-bold leading-tight text-white/74 sm:text-3xl">
                Moving, errands, food pickup, cleaning, tutoring, and deliveries around Trinity College.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#task-form"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#F4D77F] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#061A40] shadow-[0_22px_70px_rgba(201,164,74,0.32)] transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  Start a task
                  <ArrowRight size={19} strokeWidth={3} />
                </a>
                <a
                  href="https://instagram.com/thetasku"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:border-[#F4D77F] hover:text-[#F4D77F]"
                >
                  <AtSign size={18} />
                  Instagram
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/18 bg-white/10 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.32)] backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-3">
                {taskTypes.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/12 bg-[#061A40]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:-translate-y-1 hover:border-[#F4D77F]/70 hover:bg-white/12"
                  >
                    <Icon className="text-[#F4D77F]" size={24} strokeWidth={2.7} />
                    <p className="mt-5 text-sm font-black uppercase tracking-[0.12em] text-white">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl border border-[#F4D77F]/35 bg-[#F4D77F]/12 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F4D77F]">
                  Premium campus network
                </p>
                <p className="mt-2 text-base font-bold leading-snug text-white/76">
                  Post the task, pay the $3 listing fee, and get connected with students who can help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="task-form" className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.62fr_1fr] lg:items-start">
          <div className="lg:sticky lg:top-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F4D77F]">
              Post in under a minute
            </p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-[0.88] sm:text-6xl">
              Tell us what you need.
            </h2>
            <div className="mt-6 grid gap-3 text-sm font-bold uppercase tracking-[0.14em] text-white/58">
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#F4D77F]" />
                Trinity-focused campus help
              </p>
              <p className="flex items-center gap-2">
                <BadgeDollarSign size={17} className="text-[#F4D77F]" />
                Helpers keep their task pay
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/18 bg-white/10 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-6"
          >
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Your name"
                    className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="name@trincoll.edu"
                    className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Phone</span>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="Phone number"
                    className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Helper pay</span>
                  <input
                    required
                    inputMode="decimal"
                    value={form.helperPay}
                    onChange={(event) => updateField("helperPay", event.target.value)}
                    placeholder="$25"
                    className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Task title</span>
                <input
                  required
                  value={form.taskTitle}
                  onChange={(event) => updateField("taskTitle", event.target.value)}
                  placeholder="Move boxes from Vernon to Summit"
                  className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">Description</span>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Add the details, timing, pickup spot, or anything the helper should know."
                  className="min-h-32 resize-none rounded-2xl border border-white/14 bg-white px-4 py-4 text-base font-bold text-[#061A40] outline-none transition placeholder:text-[#061A40]/35 focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/62">
                  Preferred payment method
                </span>
                <select
                  value={form.paymentMethod}
                  onChange={(event) => updateField("paymentMethod", event.target.value)}
                  className="h-14 rounded-2xl border border-white/14 bg-white px-4 text-base font-bold text-[#061A40] outline-none transition focus:border-[#F4D77F] focus:ring-4 focus:ring-[#F4D77F]/20"
                >
                  {paymentMethods.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-[#F4D77F]/35 bg-[#F4D77F]/12 p-5">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#F4D77F]">
                  $3 posting fee
                </p>
                <p className="mt-2 text-sm font-bold leading-snug text-white/70">
                  Submit your task details, then pay the $3 TaskU Trinity posting fee through Stripe.
                </p>
              </div>

              <button
                disabled={isSubmitting}
                className="h-16 rounded-2xl bg-[#F4D77F] px-6 text-base font-black uppercase tracking-[0.16em] text-[#061A40] shadow-[0_22px_70px_rgba(201,164,74,0.28)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100"
              >
                {isSubmitting ? "Submitting..." : "Submit Task + Pay"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/12 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-black uppercase tracking-[0.18em] text-white/58 sm:flex-row sm:items-center sm:justify-between">
          <p>TaskU Trinity</p>
          <a
            href="https://instagram.com/thetasku"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#F4D77F] no-underline hover:underline"
          >
            <AtSign size={16} />
            @thetasku
          </a>
        </div>
      </footer>
    </main>
  );
}
