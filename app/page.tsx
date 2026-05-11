"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowDown, Bolt, Check, CircleDollarSign, MapPin, Users } from "lucide-react";

type TaskForm = {
  task: string;
  budget: string;
  location: string;
  time: "ASAP" | "Today" | "This Week";
  contact: string;
};

const trustItems = [
  { label: "Student-powered", icon: Users },
  { label: "Fast responses", icon: Bolt },
  { label: "Affordable help", icon: CircleDollarSign },
];

const taskCategories = ["Move", "Tutor", "Pickup", "Clean", "Errand", "Fix", "Other"];
const taskPlaceholders = ["Move a mini fridge", "Take trash out", "Help move boxes", "Pick up groceries"];

export default function Home() {
  const [form, setForm] = useState<TaskForm>({
    task: "",
    budget: "",
    location: "",
    time: "ASAP",
    contact: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("Move");
  const [posted, setPosted] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [paymentMessage, setPaymentMessage] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderFading, setPlaceholderFading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentComplete = paymentStatus === "success";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");

    if (payment === "success") {
      setPaymentStatus("success");
      setPaymentMessage("Payment complete — you can now submit your task.");
      window.history.replaceState(null, "", "/#task-form");
    }

    if (payment === "cancel") {
      setPaymentStatus("idle");
      setPaymentMessage("Payment canceled. Your task was not submitted.");
      window.history.replaceState(null, "", "/#task-form");
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPlaceholderFading(true);
      window.setTimeout(() => {
        setPlaceholderIndex((current) => (current + 1) % taskPlaceholders.length);
        setPlaceholderFading(false);
      }, 250);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  function updateField(field: keyof TaskForm, value: string) {
    setPosted(false);
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handlePayment() {
    setPaymentStatus("loading");
    setPaymentMessage("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Payment setup is not complete yet.");
      }

      window.location.href = data.url;
    } catch (error) {
      setPaymentStatus("error");
      setPaymentMessage(error instanceof Error ? error.message : "Payment setup is not complete yet.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!paymentComplete) {
      setPaymentStatus("error");
      setPaymentMessage("Please pay the $3 posting fee before submitting.");
      return;
    }

    setIsSubmitting(true);
    setPaymentMessage("");

    try {
      const response = await fetch("/api/submit-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          taskDescription: form.task,
          location: form.location,
          timeNeeded: form.time,
          contact: form.contact,
          price: form.budget,
          paid: paymentComplete ? "Yes" : "No",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not submit task. Please try again.");
      }

      console.log("TaskU post", { ...form, category: selectedCategory, paid: "Yes" });
      setPosted(true);
    } catch (error) {
      setPaymentStatus("error");
      setPaymentMessage(error instanceof Error ? error.message : "Could not submit task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="overflow-hidden bg-white text-uconn">
      <section className="relative px-5 py-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between">
          <header className="flex items-center justify-between">
            <a className="text-sm font-black uppercase tracking-[0.28em]" href="#top">
              TaskU
            </a>
            <a
              href="#task-form"
              className="rounded-full border border-uconn px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition duration-200 hover:scale-[1.03] hover:bg-uconn hover:text-white"
            >
              Post
            </a>
          </header>

          <div id="top" className="grid items-end gap-5 py-5 sm:py-6">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-husky">
                <Bolt size={15} fill="currentColor" />
                UConn help in minutes
              </p>
              <h1 className="max-w-4xl text-[clamp(2.75rem,10vw,9rem)] font-black uppercase leading-[0.78] tracking-normal">
                Need help at UConn?
              </h1>
              <p className="mt-4 max-w-xl text-xl font-extrabold leading-tight text-uconn/78 sm:text-3xl">
                Post a task. Get it done fast.
              </p>
              <a
                href="#task-form"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-uconn px-7 py-3.5 text-base font-black uppercase tracking-[0.12em] text-white shadow-speed transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-husky focus:outline-none focus:ring-4 focus:ring-husky/25"
              >
                Post a Task
                <ArrowDown size={20} strokeWidth={3} />
              </a>
            </div>

            <div className="border-y-2 border-uconn py-3">
              <div className="flex items-center justify-between text-sm font-black uppercase tracking-[0.18em]">
                <span>30 sec</span>
                <span className="text-husky">No feed. No clutter.</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {taskCategories.map((task) => (
                  <button
                    type="button"
                    key={task}
                    onClick={() => setSelectedCategory(task)}
                    className={`flex h-10 items-center justify-center gap-1.5 rounded-md border-2 text-xs font-black uppercase transition duration-200 hover:scale-[1.02] sm:text-base ${
                      selectedCategory === task
                        ? "border-husky bg-white text-uconn"
                        : "border-uconn bg-uconn text-white hover:bg-husky"
                    }`}
                  >
                    {selectedCategory === task ? <Check size={14} strokeWidth={4} /> : null}
                    {task}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="task-form" className="border-y-2 border-uconn bg-uconn px-5 py-6 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[0.7fr_1fr] xl:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-husky">Quick task form</p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-[0.88]">
              Post in 30 seconds
            </h2>
            <div className="mt-3 grid gap-1 text-sm font-bold text-white/52">
              <span>Helping students across campus</span>
              <span>Students available today</span>
            </div>
          </div>

          {posted ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-md border-2 border-white/25 bg-white/8 p-8 text-center">
              <h3 className="text-4xl font-black uppercase leading-[0.9] text-white">
                Task Submitted ✅
              </h3>
              <p className="mt-4 text-xl font-black text-white">
                Your task has been sent to TaskU.
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-white/55">
                Check your phone or email soon
              </p>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="grid gap-3">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                What do you need help with?
              </span>
              <input
                required
                value={form.task}
                onChange={(event) => updateField("task", event.target.value)}
                placeholder={taskPlaceholders[placeholderIndex]}
                className={`h-16 rounded-md border-2 border-white bg-white px-5 text-lg font-extrabold text-uconn outline-none transition placeholder:transition-colors placeholder:duration-300 focus:border-husky ${
                  placeholderFading ? "placeholder:text-uconn/10" : "placeholder:text-uconn/35"
                }`}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Budget</span>
                <input
                  required
                  inputMode="decimal"
                  value={form.budget}
                  onChange={(event) => updateField("budget", event.target.value)}
                  placeholder="$25"
                  className="h-16 rounded-md border-2 border-white bg-white px-5 text-lg font-extrabold text-uconn outline-none transition placeholder:text-uconn/35 focus:border-husky"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Where on campus?</span>
                <input
                  required
                  value={form.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  placeholder="Dorm, building, or area (ex: Busby, North, Storrs Center)"
                  className="h-16 rounded-md border-2 border-white bg-white px-5 text-lg font-extrabold text-uconn outline-none transition placeholder:text-uconn/35 focus:border-husky"
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Time needed</span>
                <select
                  value={form.time}
                  onChange={(event) => updateField("time", event.target.value)}
                  className="h-16 rounded-md border-2 border-white bg-white px-5 text-lg font-extrabold text-uconn outline-none transition focus:border-husky"
                >
                  <option>ASAP</option>
                  <option>Today</option>
                  <option>This Week</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Contact</span>
                <input
                  required
                  value={form.contact}
                  onChange={(event) => updateField("contact", event.target.value)}
                  placeholder="phone or email"
                  className="h-16 rounded-md border-2 border-white bg-white px-5 text-lg font-extrabold text-uconn outline-none transition placeholder:text-uconn/35 focus:border-husky"
                />
              </label>
            </div>

            <div className="mt-2 rounded-md border-2 border-white/25 bg-white/8 p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                Posting Fee
              </h3>
              <p className="mt-2 text-sm font-bold leading-snug text-white/72">
                Quick $3 fee to post your task
              </p>
              <button
                type="button"
                onClick={handlePayment}
                disabled={paymentStatus === "loading" || paymentComplete}
                className="mt-4 h-14 w-full rounded-md bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-uconn transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-husky hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:bg-white disabled:hover:text-uconn"
              >
                {paymentComplete ? "Fee Paid" : paymentStatus === "loading" ? "Opening Checkout" : "Pay $3 Posting Fee"}
              </button>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-white/45">
                Secure payment • takes 10 seconds
              </p>
              {paymentMessage ? (
                <p
                  className={`mt-3 text-sm font-black ${
                    paymentComplete ? "text-white" : "text-white/72"
                  }`}
                >
                  {paymentMessage}
                </p>
              ) : null}
            </div>

            <button
              disabled={!paymentComplete || isSubmitting}
              className={`mt-2 h-16 rounded-md text-lg font-black uppercase tracking-[0.16em] text-white transition duration-200 focus:outline-none focus:ring-4 focus:ring-white/25 ${
                paymentComplete
                  ? "bg-uconn shadow-speed hover:-translate-y-0.5 hover:scale-[1.01] hover:brightness-110"
                  : "cursor-not-allowed bg-husky opacity-50"
              }`}
            >
              {isSubmitting ? "Submitting Task" : "Submit Task"}
            </button>
            {!paymentComplete ? (
              <p className="-mt-1 text-center text-xs font-black uppercase tracking-[0.16em] text-white/62">
                Complete payment to unlock submission
              </p>
            ) : null}
          </form>
          )}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.22em] text-husky">
              <MapPin size={18} fill="currentColor" />
              UConn coverage
            </p>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">
              We cover all of UConn
            </h2>
            <p className="mt-5 text-xl font-extrabold text-uconn/70">
              Including dorms + nearby areas
            </p>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-uconn/45">
              Example areas we serve — you can enter your exact location above
            </p>
          </div>

          <div className="relative min-h-[360px] overflow-hidden rounded-md border-2 border-uconn bg-ice p-5 shadow-speed">
            <div className="absolute left-8 top-10 h-24 w-44 rotate-[-8deg] rounded-full border-2 border-husky/35" />
            <div className="absolute bottom-8 right-8 h-32 w-56 rotate-[-10deg] rounded-full border-2 border-uconn/25" />
            <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <div className="relative grid h-full min-h-[320px] grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                "North Campus",
                "South Campus",
                "Hilltop Apartments",
                "Busby Suites",
                "Storrs Center",
              ].map((zone, index) => (
                <div
                  key={zone}
                  className={`flex items-center justify-center rounded-md border-2 border-uconn bg-white p-4 text-center text-sm font-black uppercase tracking-[0.12em] transition duration-200 hover:scale-[1.02] hover:border-husky hover:text-husky ${
                    index === 4 ? "sm:col-span-2" : ""
                  }`}
                >
                  {zone}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-uconn px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
          {trustItems.map(({ label, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 rounded-md bg-uconn px-5 py-5 text-white">
              <Icon className="text-husky" size={25} strokeWidth={3} />
              <span className="text-lg font-black uppercase tracking-[0.08em]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-black uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:justify-between">
          <p>TaskU @ UConn</p>
          <p className="text-husky">Instagram: @theTaskU</p>
        </div>
      </footer>
    </main>
  );
}
