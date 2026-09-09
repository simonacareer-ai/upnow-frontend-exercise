"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { requestOtp, verifyOtp, ApiError } from "@/lib/api";
import { ArrowLeft, Loader2, Mail, KeyRound, CheckCircle2 } from "lucide-react";

type Step = "email" | "otp" | "done";

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [step, setStep] = useState<Step>(user ? "done" : "email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [masked, setMasked] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendOtp() {
    setError("");
    setLoading(true);
    try {
      const res = await requestOtp(email);
      setMasked(res.maskedPhone || email);
      setStep("otp");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Failed to send code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleEmail(e: FormEvent) {
    e.preventDefault();
    sendOtp();
  }

  async function handleOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp(email, code);
      await login(res.access_token);
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 429) {
          setError("Too many attempts. Please wait a few minutes.");
        } else {
          setError(err.message || "Invalid or expired code.");
        }
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* Left panel — brand illustration */}
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <img
          src="/images/auth-hero.jpg"
          alt="UpNow — Find a space you can trust"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-10">
          <h2 className="text-3xl font-bold text-white">
            Find a space you can trust.
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Buy · Sell · Rent · Commercial
          </p>
          <div className="mt-6 flex gap-4 text-xs text-white/70">
            <span>✓ Verified listings</span>
            <span>✓ Transparent pricing</span>
            <span>✓ Secure leasing</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2 font-semibold text-primary">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
              U
            </span>
            <span className="text-xl">UpNow</span>
          </div>

          {/* ── Step: Email ─────────────────────────── */}
          {step === "email" && (
            <>
              <h1 className="text-2xl font-bold text-neutral-900">
                Sign in to your account
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                We&apos;ll send a verification code to your email.
              </p>

              <form onSubmit={handleEmail} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-neutral-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. alex@upnow.ae"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-lg border border-base-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Continue
                </button>
              </form>
            </>
          )}

          {/* ── Step: OTP ───────────────────────────── */}
          {step === "otp" && (
            <>
              <button
                onClick={() => {
                  setStep("email");
                  setError("");
                  setCode("");
                }}
                className="mb-4 flex items-center gap-1 text-sm text-neutral-500 hover:text-primary"
              >
                <ArrowLeft size={14} /> Back
              </button>

              <h1 className="text-2xl font-bold text-neutral-900">
                Enter verification code
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                We sent a code to <span className="font-medium text-neutral-700">{masked}</span>
              </p>

              <form onSubmit={handleOtp} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="mb-1 block text-sm font-medium text-neutral-700"
                  >
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      autoFocus
                      className="h-11 w-full rounded-lg border border-base-200 bg-white pl-9 pr-3 text-sm tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-error">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length < 4}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Verify &amp; Sign In
                </button>
              </form>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="mt-3 w-full text-center text-xs text-neutral-500 hover:text-primary disabled:opacity-50"
              >
                Didn&apos;t receive it? Resend code
              </button>
            </>
          )}

          {/* ── Step: Done ──────────────────────────── */}
          {step === "done" && user && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle2 size={48} className="text-primary" />
              <h1 className="text-2xl font-bold text-neutral-900">
                Welcome back!
              </h1>
              <p className="text-sm text-neutral-500">
                Signed in as{" "}
                <span className="font-medium text-neutral-700">
                  {user.firstName ?? user.email ?? `User #${user.id}`}
                </span>
                {user.role && (
                  <span className="block mt-0.5 text-xs text-neutral-400">
                    Role: {user.role.replace(/_/g, " ")}
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="rounded-lg border border-base-200 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-base-100"
                >
                  Browse Listings
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          {step !== "done" && (
            <p className="mt-8 text-center text-xs text-neutral-400">
              Verified listings · Transparent pricing · Secure digital lease signing
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
