import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Building2, Globe, Store, Zap } from "lucide-react"

type UserType = "organization" | "guest" | null

const ease = [0.22, 1, 0.36, 1] as const

const translations = {
  en: {
    welcomeBack: "Welcome back",
    signInToAccount: "Sign in to your Linko account",
    howSigningIn: "How are you signing in?",
    organization: "Organization",
    orgDescription: "Sign in as a store owner or team member",
    guest: "Guest",
    guestDescription: "Access a store with its domain",
    continueGoogle: "Continue with Google",
    continueTelegram: "Continue with Telegram",
    or: "or",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    enterPassword: "Enter your password",
    signIn: "Sign in",
    noAccount: "Don\u2019t have an account?",
    createAccount: "Create account",
    backToHome: "Back to home",
    home: "Home",
    storeDomain: "Store domain",
    storeDomainHint: "Enter the store domain you want to access",
    trustedBy: "Trusted by 2,000+ digital sellers",
    sellDigital: "Sell digital products",
    onAutopilot: "on autopilot.",
    autoDelivery: "Auto-delivery in under 3 seconds. Across Naver, G2G, G2A, and your own store \u2014 24/7.",
    delivery: "Delivery",
    uptime: "Uptime",
    successRate: "Success rate",
    testMode: "Currently in test mode. No requests are sent to the server.",
  },
  kr: {
    welcomeBack: "\ub2e4\uc2dc \uc624\uc2e0 \uac83\uc744 \ud658\uc601\ud569\ub2c8\ub2e4",
    signInToAccount: "Linko \uacc4\uc815\uc5d0 \ub85c\uadf8\uc778\ud558\uc138\uc694",
    howSigningIn: "\ub85c\uadf8\uc778 \ubc29\ubc95\uc744 \uc120\ud0dd\ud558\uc138\uc694",
    organization: "\uc870\uc9c1",
    orgDescription: "\uc2a4\ud1a0\uc5b4 \uc624\ub108 \ub610\ub294 \ud300\uc6d0\uc73c\ub85c \ub85c\uadf8\uc778",
    guest: "\uac8c\uc2a4\ud2b8",
    guestDescription: "\uc2a4\ud1a0\uc5b4 \ub3c4\uba54\uc778\uc73c\ub85c \uc811\uc18d",
    continueGoogle: "Google\ub85c \uacc4\uc18d\ud558\uae30",
    continueTelegram: "Telegram\uc73c\ub85c \uacc4\uc18d\ud558\uae30",
    or: "\ub610\ub294",
    email: "\uc774\uba54\uc77c",
    password: "\ube44\ubc00\ubc88\ud638",
    forgotPassword: "\ube44\ubc00\ubc88\ud638\ub97c \uc78a\uc73c\uc168\ub098\uc694?",
    enterPassword: "\ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694",
    signIn: "\ub85c\uadf8\uc778",
    noAccount: "\uacc4\uc815\uc774 \uc5c6\uc73c\uc2e0\uac00\uc694?",
    createAccount: "\uacc4\uc815 \ub9cc\ub4e4\uae30",
    backToHome: "\ud648\uc73c\ub85c \ub3cc\uc544\uac00\uae30",
    home: "\ud648",
    storeDomain: "\uc2a4\ud1a0\uc5b4 \ub3c4\uba54\uc778",
    storeDomainHint: "\uc811\uc18d\ud560 \uc2a4\ud1a0\uc5b4 \ub3c4\uba54\uc778\uc744 \uc785\ub825\ud558\uc138\uc694",
    trustedBy: "2,000\uba85 \uc774\uc0c1\uc758 \ub514\uc9c0\ud138 \uc140\ub7ec\uac00 \uc0ac\uc6a9 \uc911",
    sellDigital: "\ub514\uc9c0\ud138 \uc0c1\ud488 \ud310\ub9e4,",
    onAutopilot: "\uc644\uc804 \uc790\ub3d9\ud654.",
    autoDelivery: "3\ucd08 \uc774\ub0b4 \uc790\ub3d9 \ubc30\uc1a1. \ub124\uc774\ubc84, G2G, G2A \ub4f1 \ubaa8\ub4e0 \ud50c\ub7ab\ud3fc\uc5d0\uc11c 24\uc2dc\uac04 \uc6b4\uc601.",
    delivery: "\ubc30\uc1a1",
    uptime: "\uac00\ub3d9 \uc2dc\uac04",
    successRate: "\uc131\uacf5\ub960",
    testMode: "\ud604\uc7ac \ud14c\uc2a4\ud2b8 \ubaa8\ub4dc\uc785\ub2c8\ub2e4. \uc11c\ubc84\ub85c \uc694\uccad\uc774 \uc804\uc1a1\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4.",
  },
} as const

type Translations = { [K in keyof typeof translations.en]: string }

function BrandPanel({ t, homePath }: { t: Translations; homePath: string }) {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0D0D14] p-10 lg:flex lg:w-[380px] xl:w-[420px] shrink-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10"
      >
        <Link to={homePath} className="inline-flex items-center gap-2">
          <span className="relative flex size-6 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
            <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-white">Linko</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="relative z-10"
      >
        <h2 className="text-[28px] leading-[1.15] font-medium tracking-[-0.32px] text-white">
          {t.sellDigital}
          <br />
          {t.onAutopilot}
        </h2>
        <p className="mt-4 max-w-[320px] text-sm leading-relaxed tracking-[-0.32px] text-[#999999]">
          {t.autoDelivery}
        </p>

        <div className="mt-8 flex items-center gap-6">
          {[
            { value: "< 3s", label: t.delivery },
            { value: "24/7", label: t.uptime },
            { value: "99.9%", label: t.successRate },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease }}
            >
              <span className="block text-lg font-semibold tabular-nums tracking-[-0.32px] text-[#918DF6]">
                {stat.value}
              </span>
              <span className="text-xs tracking-[-0.32px] text-[#666666]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 flex items-center gap-2"
      >
        <Zap className="size-3.5 text-[#918DF6]" strokeWidth={2} />
        <span className="text-xs tracking-[-0.32px] text-[#666666]">
          {t.trustedBy}
        </span>
      </motion.div>
    </div>
  )
}

function MobileBrandHeader({ t, homePath }: { t: Translations; homePath: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
      className="relative overflow-hidden bg-[#0D0D14] px-6 py-8 lg:hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex items-center gap-2">
        <Link to={homePath} className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-white">
          <ArrowLeft className="size-3" />
          {t.home}
        </Link>
      </div>
      <p className="relative z-10 mt-4 text-lg font-medium tracking-[-0.32px] text-white">
        {t.welcomeBack}
      </p>
      <p className="relative z-10 mt-1 text-sm tracking-[-0.32px] text-[#999999]">
        {t.signInToAccount}
      </p>
    </motion.div>
  )
}

export default function Login({ locale = "en" }: { locale?: "en" | "kr" }) {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>(null)

  const t = translations[locale]
  const homePath = locale === "kr" ? "/kr" : "/"
  const signupPath = locale === "kr" ? "/kr/signup" : "/signup"

  return (
    <div className="flex min-h-svh bg-white">
      <BrandPanel t={t} homePath={homePath} />

      <div className="flex flex-1 flex-col">
        <MobileBrandHeader t={t} homePath={homePath} />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[13px] leading-relaxed text-amber-700">
              {t.testMode}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-8 hidden lg:block"
            >
              <Link
                to={homePath}
                className="inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
              >
                <ArrowLeft className="size-4" />
                {t.backToHome}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              className="mb-10 hidden lg:block"
            >
              <h1 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
                {t.welcomeBack}
              </h1>
              <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
                {t.signInToAccount}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {userType === null ? (
                <motion.div
                  key="type-selector"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-col gap-3"
                >
                  <p className="mb-2 text-center text-base tracking-[-0.32px] text-[#666666]">
                    {t.howSigningIn}
                  </p>
                  <button
                    type="button"
                    onClick={() => setUserType("organization")}
                    className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white px-6 py-5 text-left transition-all hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.03] hover:shadow-sm"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#918DF6]/8 text-[#918DF6] transition-colors group-hover:bg-[#918DF6]/12">
                      <Building2 className="size-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.32px] text-[#181925]">{t.organization}</p>
                      <p className="mt-0.5 text-sm tracking-[-0.32px] text-[#999999]">{t.orgDescription}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("guest")}
                    className="group flex w-full cursor-pointer items-center gap-5 rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white px-6 py-5 text-left transition-all hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.03] hover:shadow-sm"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#918DF6]/8 text-[#918DF6] transition-colors group-hover:bg-[#918DF6]/12">
                      <Globe className="size-6" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-base font-semibold tracking-[-0.32px] text-[#181925]">{t.guest}</p>
                      <p className="mt-0.5 text-sm tracking-[-0.32px] text-[#999999]">{t.guestDescription}</p>
                    </div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <button
                    type="button"
                    onClick={() => setUserType(null)}
                    className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                  >
                    <ArrowLeft className="size-3.5" />
                    {userType === "organization" ? t.organization : t.guest}
                  </button>

                  {userType === "guest" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, ease }}
                      className="mb-6 flex flex-col gap-2"
                    >
                      <label
                        htmlFor="store-domain"
                        className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                      >
                        {t.storeDomain}
                      </label>
                      <div className="relative">
                        <Store className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="store-domain"
                          type="text"
                          placeholder="yourstore.mont.app"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                      <p className="text-sm tracking-[-0.32px] text-[#999999]">
                        {t.storeDomainHint}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.12)] bg-white text-sm font-medium tracking-[-0.32px] text-[#181925] transition-colors hover:bg-neutral-50"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                      </svg>
                      {t.continueGoogle}
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#2AABEE] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#229ED9]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z"/>
                      </svg>
                      {t.continueTelegram}
                    </button>
                  </div>

                  <div className="my-7 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                    <span className="text-sm tracking-[-0.32px] text-[#999999]">{t.or}</span>
                    <div className="h-px flex-1 bg-[rgba(0,0,0,0.1)]" />
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                      >
                        {t.email}
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="password"
                          className="text-sm font-semibold tracking-[-0.32px] text-[#181925]"
                        >
                          {t.password}
                        </label>
                        <Link
                          to="#"
                          className="text-sm tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]"
                        >
                          {t.forgotPassword}
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t.enterPassword}
                          autoComplete="current-password"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-11 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="size-[18px]" />
                          ) : (
                            <Eye className="size-[18px]" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                    >
                      {t.signIn}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-8 text-center text-sm tracking-[-0.32px] text-[#666666]"
            >
              {t.noAccount}{" "}
              <Link
                to={signupPath}
                className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
              >
                {t.createAccount}
              </Link>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}
