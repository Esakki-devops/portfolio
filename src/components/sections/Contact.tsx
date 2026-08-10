"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  Download,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useToast } from "@/components/ui/Toast";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { contactSchema, type ContactValues } from "@/lib/contact-schema";
import { site } from "@/lib/site";

const fieldClass =
  "w-full rounded-xl border border-line bg-white/4 px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-faint focus:border-cyan/50";

export function Contact() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const inFlight = useRef(false);

  async function onSubmit(values: ContactValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      toast("Message sent — I'll get back to you shortly.", "success");
      reset();
    } catch {
      toast("Something went wrong. Try emailing me directly.", "error");
    }
  }

  // `disabled` on the button only blocks clicks. Pressing Enter, or a second
  // click landing before React re-renders, still re-enters handleSubmit and
  // sends a duplicate. The in-flight flag is the real guard.
  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (inFlight.current) {
      event.preventDefault();
      return;
    }
    inFlight.current = true;
    void handleSubmit(onSubmit)(event).finally(() => {
      inFlight.current = false;
    });
  }

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk"
        description="Open to DevOps, cloud and IT infrastructure opportunities. Send a message and I'll get back to you."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-[0.85fr_1fr]">
        <div className="space-y-4">
          <Reveal>
            <div className="glass glow-ring rounded-2xl p-6">
              <h3 className="text-sm font-medium tracking-tight text-fg">
                Direct channels
              </h3>
              <ul className="mt-5 space-y-3.5">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-cyan"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white/4 text-cyan">
                      <Mail className="size-4" />
                    </span>
                    {/* break-all, not truncate: the address is 28 chars with no
                        break opportunity and gets clipped at 320px. */}
                    <span className="min-w-0 break-all">{site.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="flex items-center gap-3 text-sm text-muted transition-colors hover:text-cyan"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white/4 text-blue">
                      <Phone className="size-4" />
                    </span>
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-muted">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-white/4 text-purple">
                    <MapPin className="size-4" />
                  </span>
                  {site.location}
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-2.5 border-t border-line pt-5">
                <a
                  href={site.githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="GitHub profile"
                  className="grid size-11 place-items-center rounded-xl border border-line bg-white/4 text-muted transition-colors hover:text-cyan"
                >
                  <GithubIcon className="size-4" />
                </a>
                <a
                  href={site.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="LinkedIn profile"
                  className="grid size-11 place-items-center rounded-xl border border-line bg-white/4 text-muted transition-colors hover:text-cyan"
                >
                  <LinkedinIcon className="size-4" />
                </a>
                <a
                  href={site.resumeHref}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white/4 px-3.5 py-2.5 text-xs text-muted transition-colors hover:text-cyan"
                >
                  <Download className="size-3.5" />
                  Resume
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass relative overflow-hidden rounded-2xl p-6">
              <div aria-hidden className="grid-bg absolute inset-0 opacity-30" />
              <div className="relative flex items-center gap-3">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-cyan" />
                </span>
                <p className="text-sm text-fg">{site.location}</p>
              </div>
              <p className="relative mt-2 text-xs text-muted">
                Available for remote and on-site roles across India.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.14}>
          <form
            onSubmit={handleFormSubmit}
            noValidate
            className="glass glow-ring rounded-2xl p-6 sm:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-[11px] tracking-[0.16em] text-faint uppercase"
                >
                  Name
                </label>
                <input
                  id="name"
                  autoComplete="name"
                  className={fieldClass}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] tracking-[0.16em] text-faint uppercase"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={fieldClass}
                  placeholder="you@company.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="subject"
                className="mb-1.5 block text-[11px] tracking-[0.16em] text-faint uppercase"
              >
                Subject
              </label>
              <input
                id="subject"
                className={fieldClass}
                placeholder="What's this about?"
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                {...register("subject")}
              />
              {errors.subject && (
                <p id="subject-error" role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="message"
                className="mb-1.5 block text-[11px] tracking-[0.16em] text-faint uppercase"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className={`${fieldClass} resize-y`}
                placeholder="Tell me about the role or project…"
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                {...register("message")}
              />
              {errors.message && (
                <p id="message-error" role="alert" className="mt-1.5 text-xs text-red-400">
                  {errors.message.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(100deg,var(--color-blue),var(--color-cyan))] px-6 py-3.5 text-sm font-medium text-[#03121f] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send message
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
