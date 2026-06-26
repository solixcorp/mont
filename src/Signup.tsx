import { useState, useRef, useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Mail, ArrowLeft, Zap, User, Lock, Eye, EyeOff, Store, ChevronDown, Check, Tag } from "lucide-react"

const ease = [0.22, 1, 0.36, 1] as const

type Step = "initial" | "verify" | "profile" | "store" | "plan"

const STEPS: Step[] = ["initial", "verify", "profile", "store", "plan"]

const translations = {
  en: {
    createAccount: "Create your account",
    startSelling: "Start selling digital products on autopilot",
    continueGoogle: "Continue with Google",
    continueTelegram: "Continue with Telegram",
    or: "or",
    email: "Email",
    continueEmail: "Continue with email",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    backToHome: "Back to home",
    home: "Home",
    checkEmail: "Check your email",
    weSentCode: "We sent a 6-digit code to",
    verifyAndContinue: "Verify and continue",
    didntReceive: "Didn\u2019t receive the code?",
    resend: "Resend",
    changeEmail: "Change email",
    setupProfile: "Set up your profile",
    tellUs: "Tell us a bit about yourself",
    fullName: "Full name",
    yourFullName: "Your full name",
    password: "Password",
    minChars: "Min. 8 characters",
    confirmPassword: "Confirm password",
    repeatPassword: "Repeat your password",
    atLeast8: "At least 8 characters",
    oneLowercase: "One lowercase letter",
    oneNumber: "One number",
    oneSpecial: "One special character (!@#$...)",
    passwordsMatch: "Passwords match",
    passwordsDontMatch: "Passwords don\u2019t match",
    continue_: "Continue",
    back: "Back",
    setupStore: "Set up your store",
    configureStore: "Configure your storefront basics",
    storeName: "Store name",
    myAwesomeStore: "My awesome store",
    defaultCurrency: "Default currency",
    choosePlan: "Choose your plan",
    canChangeLater: "You can always change this later",
    starter: "Starter",
    forGettingStarted: "For getting started",
    pro: "Pro",
    forGrowing: "For growing businesses",
    enterprise: "Enterprise",
    forLargeScale: "For large-scale operations",
    mostPopular: "Most popular",
    select: "Select",
    contactUs: "Contact us",
    havePromo: "Have a promo code?",
    enterCode: "Enter code",
    apply: "Apply",
    appliedDiscount: "applied \u2014 30% off",
    startSellingBtn: "Start selling",
    freeToStart: "Free to start \u2014 no credit card required",
    autoDelivery: "Auto-delivery across all platforms",
    realtimeSync: "Real-time inventory sync",
    noCoding: "No coding required",
    brandHeading: "Start selling in",
    brandHeading2: "under 5 minutes.",
    brandDesc: "Connect your platforms, upload your inventory, and let Linko handle every order automatically.",
    launchStep1: "Opening your market...",
    launchStep2: "Preparing product catalog...",
    launchStep3: "Connecting payment system...",
    launchStep4: "Almost there!",
    featureOrders100: "Up to 100 orders/mo",
    feature1Platform: "1 platform",
    featureEmailOnly: "Email delivery only",
    featureUnlimited: "Unlimited orders",
    featureAllPlatforms: "All platforms",
    featureAllChannels: "All delivery channels",
    featurePriority: "Priority support",
    featureCustomLimits: "Custom limits",
    featureDedicated: "Dedicated support",
    featureSLA: "SLA guarantee",
    featureFullAPI: "Full API access",
  },
  kr: {
    createAccount: "계정 만들기",
    startSelling: "디지털 상품 자동 판매를 시작하세요",
    continueGoogle: "Google로 계속하기",
    continueTelegram: "Telegram으로 계속하기",
    or: "또는",
    email: "이메일",
    continueEmail: "이메일로 계속하기",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    signIn: "로그인",
    backToHome: "홈으로 돌아가기",
    home: "홈",
    checkEmail: "이메일을 확인하세요",
    weSentCode: "6자리 인증 코드를 전송했습니다:",
    verifyAndContinue: "인증 후 계속하기",
    didntReceive: "코드를 받지 못하셨나요?",
    resend: "재전송",
    changeEmail: "이메일 변경",
    setupProfile: "프로필 설정",
    tellUs: "간단한 정보를 입력해주세요",
    fullName: "이름",
    yourFullName: "이름을 입력하세요",
    password: "비밀번호",
    minChars: "최소 8자",
    confirmPassword: "비밀번호 확인",
    repeatPassword: "비밀번호를 다시 입력하세요",
    atLeast8: "8자 이상",
    oneLowercase: "소문자 1개 이상",
    oneNumber: "숫자 1개 이상",
    oneSpecial: "특수문자 1개 이상 (!@#$...)",
    passwordsMatch: "비밀번호가 일치합니다",
    passwordsDontMatch: "비밀번호가 일치하지 않습니다",
    continue_: "계속하기",
    back: "뒤로",
    setupStore: "스토어 설정",
    configureStore: "스토어 기본 정보를 설정하세요",
    storeName: "스토어 이름",
    myAwesomeStore: "나의 스토어",
    defaultCurrency: "기본 통화",
    choosePlan: "플랜을 선택하세요",
    canChangeLater: "나중에 언제든 변경할 수 있습니다",
    starter: "스타터",
    forGettingStarted: "시작하기",
    pro: "프로",
    forGrowing: "성장하는 비즈니스를 위해",
    enterprise: "엔터프라이즈",
    forLargeScale: "대규모 운영을 위해",
    mostPopular: "인기",
    select: "선택",
    contactUs: "문의하기",
    havePromo: "프로모 코드가 있으신가요?",
    enterCode: "코드 입력",
    apply: "적용",
    appliedDiscount: "적용 완료 — 30% 할인",
    startSellingBtn: "판매 시작",
    freeToStart: "무료로 시작 — 신용카드 불필요",
    autoDelivery: "모든 플랫폼에서 자동 배송",
    realtimeSync: "실시간 재고 동기화",
    noCoding: "코딩 필요 없음",
    brandHeading: "Start selling in",
    brandHeading2: "under 5 minutes.",
    brandDesc: "Connect your platforms, upload your inventory, and let Linko handle every order automatically.",
    launchStep1: "마켓을 열고 있습니다...",
    launchStep2: "상품 카탈로그를 준비하고 있습니다...",
    launchStep3: "결제 시스템을 연결하고 있습니다...",
    launchStep4: "거의 다 됐습니다!",
    featureOrders100: "월 100건 주문",
    feature1Platform: "1개 플랫폼",
    featureEmailOnly: "이메일 배송만",
    featureUnlimited: "무제한 주문",
    featureAllPlatforms: "모든 플랫폼",
    featureAllChannels: "모든 배송 채널",
    featurePriority: "우선 지원",
    featureCustomLimits: "맞춤 한도",
    featureDedicated: "전담 지원",
    featureSLA: "SLA 보장",
    featureFullAPI: "전체 API 접근",
  },
} as const

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "KRW", label: "KRW — Korean Won" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "JPY", label: "JPY — Japanese Yen" },
]

type PromoPhase = "idle" | "rocket" | "explode" | "slash" | "done"

const EXPLOSION_PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2
  const dist = 80 + Math.random() * 100
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.5 + 0.5,
    color: ["#918DF6", "#F59E0B", "#22C55E", "#3B82F6", "#EC4899", "#EF4444"][i % 6],
    shape: i % 3 === 0 ? "rounded-full" : i % 3 === 1 ? "rounded-sm" : "rounded-none",
    delay: Math.random() * 0.1,
  }
})

const ROCKET_SPARKS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  xOff: (Math.random() - 0.5) * 16,
  delay: i * 0.06,
  size: Math.random() * 3 + 2,
  color: ["#F59E0B", "#EF4444", "#918DF6", "#F59E0B"][i % 4],
}))

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export default function Signup({ locale = "en" }: { locale?: "en" | "kr" }) {
  const [step, setStep] = useState<Step>("initial")
  const [email, setEmail] = useState("")

  const t = translations[locale]
  const prefix = locale === "kr" ? "/kr" : ""

  const LAUNCH_STEPS = [t.launchStep1, t.launchStep2, t.launchStep3, t.launchStep4] as const

  function getFeatures(planId: string): string[] {
    if (planId === "free") return [t.featureOrders100, t.feature1Platform, t.featureEmailOnly]
    if (planId === "pro") return [t.featureUnlimited, t.featureAllPlatforms, t.featureAllChannels, t.featurePriority]
    return [t.featureCustomLimits, t.featureDedicated, t.featureSLA, t.featureFullAPI]
  }

  const PLANS = [
    {
      id: "free",
      name: t.starter,
      desc: t.forGettingStarted,
      price: "$0",
      period: "/mo",
      features: getFeatures("free"),
      badge: null as string | null,
      cta: t.select,
    },
    {
      id: "pro",
      name: t.pro,
      desc: t.forGrowing,
      price: "$29",
      period: "/mo",
      features: getFeatures("pro"),
      badge: t.mostPopular,
      cta: t.select,
    },
    {
      id: "enterprise",
      name: t.enterprise,
      desc: t.forLargeScale,
      price: "Custom",
      period: "",
      features: getFeatures("enterprise"),
      badge: null as string | null,
      cta: t.contactUs,
    },
  ]

  function StepIndicator({ current }: { current: Step }) {
    const idx = STEPS.indexOf(current)
    return (
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <motion.div
            key={s}
            initial={false}
            animate={{
              width: i === idx ? 24 : 8,
              backgroundColor: i <= idx ? "#918DF6" : "rgba(0,0,0,0.12)",
            }}
            transition={{ duration: 0.3, ease }}
            className="h-2 rounded-full"
          />
        ))}
      </div>
    )
  }

  function BrandPanel() {
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
          <Link to={`${prefix}/`} className="inline-flex items-center gap-2">
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
            {t.brandHeading}
            <br />
            {t.brandHeading2}
          </h2>
          <p className="mt-4 max-w-[320px] text-sm leading-relaxed tracking-[-0.32px] text-[#999999]">
            {t.brandDesc}
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {[
              t.autoDelivery,
              t.realtimeSync,
              t.noCoding,
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease }}
                className="flex items-center gap-2.5"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#918DF6]/15">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5L4 7.5L8 3" stroke="#918DF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span className="text-sm tracking-[-0.32px] text-[#999999]">{item}</span>
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
            {t.freeToStart}
          </span>
        </motion.div>
      </div>
    )
  }

  function MobileBrandHeader() {
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
        <div className="relative z-10 flex items-center justify-between">
          <Link to={`${prefix}/`} className="inline-flex items-center gap-2">
            <span className="relative flex size-7 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
              <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white">Linko</span>
          </Link>
          <Link
            to={`${prefix}/`}
            className="flex items-center gap-1 text-xs tracking-[-0.32px] text-[#999999] transition-colors hover:text-white"
          >
            <ArrowLeft className="size-3" />
            {t.home}
          </Link>
        </div>
        <p className="relative z-10 mt-4 text-lg font-medium tracking-[-0.32px] text-white">
          {t.createAccount}
        </p>
        <p className="relative z-10 mt-1 text-sm tracking-[-0.32px] text-[#999999]">
          {t.startSelling}
        </p>
      </motion.div>
    )
  }

  function VerificationCodeInput({ onBack, email: inputEmail, onVerified }: { onBack: () => void; email: string; onVerified: () => void }) {
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return
      const next = [...code]
      next[index] = value.slice(-1)
      setCode(next)
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
      if (!pasted) return
      const next = [...code]
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i]
      }
      setCode(next)
      const focusIndex = Math.min(pasted.length, 5)
      inputRefs.current[focusIndex]?.focus()
    }

    return (
      <motion.div
        key="verify"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
        >
          <ArrowLeft className="size-3.5" />
          {t.changeEmail}
        </button>

        <div className="mb-2">
          <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
            {t.checkEmail}
          </h2>
          <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
            {t.weSentCode}{" "}
            <span className="font-medium text-[#181925]">{inputEmail}</span>
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (code.every((d) => d !== "")) onVerified() }} className="mt-8 flex flex-col gap-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="size-12 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white text-center text-lg font-semibold tracking-[-0.32px] text-[#181925] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              />
            ))}
          </div>

          <Button
            type="submit"
            className="h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
          >
            {t.verifyAndContinue}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm tracking-[-0.32px] text-[#666666]">
          {t.didntReceive}{" "}
          <button
            type="button"
            onClick={() => console.log("Resend code")}
            className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
          >
            {t.resend}
          </button>
        </p>
      </motion.div>
    )
  }

  function ProfileStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const [showPw, setShowPw] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const rules = [
      { label: t.atLeast8, met: password.length >= 8 },
      { label: t.oneLowercase, met: /[a-z]/.test(password) },
      { label: t.oneNumber, met: /\d/.test(password) },
      { label: t.oneSpecial, met: /[^A-Za-z0-9]/.test(password) },
    ]

    const allRulesMet = rules.every((r) => r.met)
    const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
    const confirmTouched = confirm.length > 0
    const valid = name.trim().length > 0 && allRulesMet && passwordsMatch

    return (
      <motion.div
        key="profile"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
        >
          <ArrowLeft className="size-3.5" />
          {t.back}
        </button>

        <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
          {t.setupProfile}
        </h2>
        <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
          {t.tellUs}
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) onContinue() }}
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="fullname" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
              {t.fullName}
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
              <input
                id="fullname"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.yourFullName}
                autoComplete="name"
                className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
              {t.password}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
              <input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.minChars}
                autoComplete="new-password"
                className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-10 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
              >
                {showPw ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2 flex flex-col gap-1.5">
                {rules.map((rule) => (
                  <div key={rule.label} className="flex items-center gap-2">
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                        rule.met ? "bg-[#33C758]" : "bg-[rgba(0,0,0,0.08)]"
                      }`}
                    >
                      {rule.met && <Check className="size-2.5 text-white" strokeWidth={3} />}
                    </span>
                    <span
                      className={`text-xs tracking-[-0.32px] transition-colors ${
                        rule.met ? "text-[#33C758]" : "text-[#999999]"
                      }`}
                    >
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
              {t.confirmPassword}
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder={t.repeatPassword}
                autoComplete="new-password"
                className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-10 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#999999] transition-colors hover:text-[#666666]"
              >
                {showConfirm ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
              </button>
            </div>
            {confirmTouched && (
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full transition-colors ${
                    passwordsMatch ? "bg-[#33C758]" : "bg-[#FF2F00]"
                  }`}
                >
                  {passwordsMatch ? (
                    <Check className="size-2.5 text-white" strokeWidth={3} />
                  ) : (
                    <span className="text-[9px] font-bold text-white">✕</span>
                  )}
                </span>
                <span
                  className={`text-xs tracking-[-0.32px] ${
                    passwordsMatch ? "text-[#33C758]" : "text-[#FF2F00]"
                  }`}
                >
                  {passwordsMatch ? t.passwordsMatch : t.passwordsDontMatch}
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={!valid}
            className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.continue_}
          </Button>
        </form>
      </motion.div>
    )
  }

  function StoreStep({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
    const [storeName, setStoreName] = useState("")
    const [currency, setCurrency] = useState("USD")

    const slug = useMemo(() => slugify(storeName), [storeName])
    const valid = storeName.trim().length > 0

    return (
      <motion.div
        key="store"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease }}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
        >
          <ArrowLeft className="size-3.5" />
          {t.back}
        </button>

        <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
          {t.setupStore}
        </h2>
        <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
          {t.configureStore}
        </p>

        <form
          onSubmit={(e) => { e.preventDefault(); if (valid) onContinue() }}
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="storename" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
              {t.storeName}
            </label>
            <div className="relative">
              <Store className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
              <input
                id="storename"
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder={t.myAwesomeStore}
                className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              />
            </div>
            {slug && (
              <p className="text-xs tracking-[-0.32px] text-[#999999]">
                <span className="font-medium text-[#918DF6]">{slug}</span>.mont.app
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="currency" className="text-sm font-semibold tracking-[-0.32px] text-[#181925]">
              {t.defaultCurrency}
            </label>
            <div className="relative">
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 w-full appearance-none rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-4 pr-10 text-sm tracking-[-0.32px] text-[#181925] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-[18px] -translate-y-1/2 text-[#999999]" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!valid}
            className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.continue_}
          </Button>
        </form>
      </motion.div>
    )
  }

  function PlanStep({ onBack }: { onBack: () => void }) {
    const [selected, setSelected] = useState<string>("pro")
    const [promoOpen, setPromoOpen] = useState(false)
    const [promoCode, setPromoCode] = useState("")
    const [promoPhase, setPromoPhase] = useState<PromoPhase>("idle")
    const [launching, setLaunching] = useState(false)
    const [launchStep, setLaunchStep] = useState(0)
    const navigate = useNavigate()

    const promoApplied = promoPhase === "done"
    const isAnimating = promoPhase !== "idle" && promoPhase !== "done"

    function handleApply() {
      if (!promoCode.trim() || isAnimating) return
      setPromoPhase("rocket")
      setTimeout(() => setPromoPhase("explode"), 800)
      setTimeout(() => setPromoPhase("slash"), 1300)
      setTimeout(() => setPromoPhase("done"), 2400)
    }

    function getPrice(plan: (typeof PLANS)[number]) {
      if (promoPhase !== "slash" && promoPhase !== "done") return null
      if (plan.id === "pro") return "$20"
      return null
    }

    function handleLaunch() {
      if (!selected || launching) return
      setLaunching(true)
      setLaunchStep(0)
      setTimeout(() => setLaunchStep(1), 800)
      setTimeout(() => setLaunchStep(2), 1600)
      setTimeout(() => setLaunchStep(3), 2400)
      setTimeout(() => navigate("/dashboard"), 3400)
    }

    return (
      <motion.div
        key="plan"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease }}
        className="relative"
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-1.5 text-sm tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
        >
          <ArrowLeft className="size-3.5" />
          {t.back}
        </button>

        <h2 className="text-[26px] font-semibold tracking-[-0.32px] text-[#181925]">
          {t.choosePlan}
        </h2>
        <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
          {t.canChangeLater}
        </p>

        <motion.div
          className="-mx-4 mt-8 sm:-mx-16 lg:-mx-24"
          animate={
            promoPhase === "explode"
              ? { x: [0, -3, 3, -2, 2, -1, 1, 0] }
              : { x: 0 }
          }
          transition={
            promoPhase === "explode"
              ? { duration: 0.35, delay: 0.05 }
              : { duration: 0 }
          }
        >
          <div className="flex flex-col items-stretch gap-3 px-4 sm:flex-row sm:px-0">
            {PLANS.map((plan, i) => {
              const isSelected = selected === plan.id
              const isPro = plan.id === "pro"
              const isEnterprise = plan.id === "enterprise"
              const discountedPrice = getPrice(plan)
              const showEnterpriseBadge = (promoPhase === "slash" || promoPhase === "done") && isEnterprise
              return (
                <motion.button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    promoPhase === "slash"
                      ? { opacity: 1, y: 0, scale: [1, 1.02, 1] }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={
                    promoPhase === "slash"
                      ? { duration: 0.3, delay: 0.05 * i }
                      : { duration: 0.4, delay: 0.08 * i, ease }
                  }
                  className={`relative flex flex-1 flex-col rounded-2xl border-2 p-6 text-left transition-all duration-200 ${
                    isPro
                      ? isSelected
                        ? "border-[#918DF6] bg-[#181925] shadow-lg shadow-[#918DF6]/10"
                        : "border-[#181925]/20 bg-[#181925] shadow-lg shadow-black/8 hover:border-[#918DF6]/60"
                      : isSelected
                        ? "border-[#918DF6] bg-[#918DF6]/[0.03]"
                        : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[rgba(0,0,0,0.18)]"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 left-5 rounded-full bg-[#918DF6] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase">
                      {plan.badge}
                    </span>
                  )}

                  {showEnterpriseBadge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.15 }}
                      className="absolute -top-2.5 right-5 rounded-full bg-[#22C55E] px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white uppercase"
                    >
                      30% off
                    </motion.span>
                  )}

                  {isSelected && (
                    <span className="absolute top-5 right-5 flex size-5 items-center justify-center rounded-full bg-[#918DF6]">
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </span>
                  )}

                  <span className={`text-[13px] font-semibold tracking-[-0.32px] ${isPro ? "text-white/70" : "text-[#999999]"}`}>
                    {plan.name}
                  </span>

                  <span className="mt-3 flex items-baseline gap-1.5">
                    <AnimatePresence mode="wait">
                      {discountedPrice ? (
                        <motion.span
                          key="discounted"
                          initial={{ opacity: 0, scale: 1.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="flex items-baseline gap-1.5"
                        >
                          <span className="text-[28px] font-bold tracking-[-0.5px] leading-none text-[#22C55E]">
                            {discountedPrice}
                          </span>
                          <span className={`text-sm tracking-[-0.32px] line-through ${isPro ? "text-white/30" : "text-[#999999]"}`}>
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className={`text-sm tracking-[-0.32px] ${isPro ? "text-white/40" : "text-[#999999]"}`}>
                              {plan.period}
                            </span>
                          )}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="original"
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-baseline gap-0.5"
                        >
                          <span className={`${plan.price === "Custom" ? "text-[22px]" : "text-[28px]"} font-bold tracking-[-0.5px] leading-none ${isPro ? "text-white" : "text-[#181925]"}`}>
                            {plan.price}
                          </span>
                          {plan.period && (
                            <span className={`text-sm tracking-[-0.32px] ${isPro ? "text-white/40" : "text-[#999999]"}`}>
                              {plan.period}
                            </span>
                          )}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>

                  <span className={`mt-1.5 text-[11px] tracking-[-0.2px] ${isPro ? "text-white/50" : "text-[#999999]"}`}>
                    {plan.desc}
                  </span>

                  <div className={`my-4 h-px ${isPro ? "bg-white/10" : "bg-black/6"}`} />

                  <ul className="flex flex-col gap-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2.5 text-[12px] tracking-[-0.2px] ${isPro ? "text-white/70" : "text-[#666666]"}`}>
                        <span className={`mt-px flex size-4 shrink-0 items-center justify-center rounded-full ${isPro ? "bg-[#918DF6]/25" : "bg-[#918DF6]/10"}`}>
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5.5L4 7.5L8 3" stroke={isPro ? "#c4c2ff" : "#918DF6"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <AnimatePresence>
          {promoPhase === "rocket" && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
              <motion.div
                initial={{ bottom: -10, left: "50%", x: "-50%", opacity: 1 }}
                animate={{ bottom: "100%", opacity: [1, 1, 0.8] }}
                transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
                className="absolute text-5xl"
                style={{ filter: "drop-shadow(0 0 12px rgba(245,158,11,0.7))" }}
              >
                🚀
              </motion.div>
              {ROCKET_SPARKS.map((spark) => (
                <motion.div
                  key={spark.id}
                  initial={{ bottom: -10, left: "50%", x: spark.xOff, opacity: 0.9, scale: 1 }}
                  animate={{ bottom: "100%", opacity: [0, 0.9, 0.6, 0], scale: [0.5, 1, 0.3] }}
                  transition={{ duration: 0.75, delay: spark.delay, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute rounded-full"
                  style={{
                    width: spark.size,
                    height: spark.size,
                    backgroundColor: spark.color,
                    filter: `blur(${spark.size > 3.5 ? 1 : 0}px)`,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {promoPhase === "explode" && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8">
                <motion.div
                  initial={{ opacity: 0.9, scale: 0 }}
                  animate={{ opacity: [0.9, 0.4, 0], scale: [0, 3.5] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="size-16 rounded-full border-2 border-[#F59E0B]"
                  style={{ boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
                />
                <motion.div
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{ opacity: [1, 0], scale: [0, 2] }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 m-auto size-8 rounded-full bg-white"
                  style={{ filter: "blur(8px)" }}
                />
                {EXPLOSION_PARTICLES.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                    animate={{
                      x: p.x,
                      y: p.y,
                      opacity: [1, 1, 0],
                      scale: [0, p.scale, 0],
                      rotate: p.rotate,
                    }}
                    transition={{ duration: 0.7, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute left-1/2 top-1/2 size-2.5 ${p.shape}`}
                    style={{ backgroundColor: p.color }}
                  />
                ))}
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <AnimatePresence mode="wait">
            {promoApplied ? (
              <motion.div
                key="promo-applied"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#22C55E]/8 py-2.5"
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-[#22C55E]">
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-[13px] font-medium tracking-[-0.32px] text-[#22C55E]">
                  {promoCode.toUpperCase()} {t.appliedDiscount}
                </span>
              </motion.div>
            ) : (
              <motion.div key="promo-input" layout>
                {!promoOpen ? (
                  <motion.button
                    key="promo-toggle"
                    type="button"
                    onClick={() => setPromoOpen(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex w-full items-center justify-center gap-1.5 py-1 text-[13px] tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                  >
                    <Tag className="size-3.5" />
                    {t.havePromo}
                  </motion.button>
                ) : (
                  <motion.div
                    key="promo-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApply()}
                        placeholder={t.enterCode}
                        disabled={isAnimating}
                        className="h-9 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20 disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={handleApply}
                        disabled={!promoCode.trim() || isAnimating}
                        className="h-9 rounded-lg bg-[#181925] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d] disabled:opacity-40"
                      >
                        {t.apply}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          onClick={handleLaunch}
          disabled={!selected || launching}
          className="mt-5 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.startSellingBtn}
        </Button>

        <AnimatePresence>
          {launching && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D14]"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: "radial-gradient(circle, #918DF6 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1, ease }}
                className="absolute top-10 left-10 z-10 flex items-center gap-2"
              >
                <span className="relative flex size-6 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                  <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-[#0D0D14]" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-white">Linko</span>
              </motion.div>

              <div className="relative z-10 flex flex-col items-center gap-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="relative size-16"
                >
                  <svg viewBox="0 0 64 64" fill="none" className="size-full">
                    <circle cx="32" cy="32" r="28" stroke="#918DF6" strokeWidth="2" opacity="0.15" />
                    <motion.circle
                      cx="32" cy="32" r="28"
                      stroke="#918DF6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="176"
                      initial={{ strokeDashoffset: 176 }}
                      animate={{ strokeDashoffset: [176, 44, 176] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </svg>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease }}
                    className="absolute inset-0 m-auto flex size-8 items-center justify-center rounded-full bg-[#918DF6]/10"
                  >
                    <span className="relative flex size-4 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
                      <span className="absolute top-px right-px size-1.5 rounded-full bg-[#0D0D14]" />
                    </span>
                  </motion.div>
                </motion.div>

                <div className="relative h-10 w-80 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={launchStep}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.3, ease }}
                      className="absolute inset-0 text-center text-xl font-medium tracking-[-0.32px] text-white/80"
                    >
                      {LAUNCH_STEPS[launchStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex gap-2">
                  {LAUNCH_STEPS.map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{
                        width: i === launchStep ? 24 : 6,
                        backgroundColor: i <= launchStep ? "#918DF6" : "rgba(255,255,255,0.12)",
                      }}
                      transition={{ duration: 0.35, ease }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                </div>
              </div>

              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#918DF6]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="flex min-h-svh bg-white">
      <BrandPanel />

      <div className="flex flex-1 flex-col">
        <MobileBrandHeader />

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[13px] leading-relaxed text-amber-700">
              Currently in test mode. No requests are sent to the server.
            </div>
            {step !== "initial" && <StepIndicator current={step} />}
            <AnimatePresence mode="wait">
              {step === "initial" ? (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-8 hidden lg:block"
                  >
                    <Link
                      to={`${prefix}/`}
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
                      {t.createAccount}
                    </h1>
                    <p className="mt-1.5 text-sm tracking-[-0.32px] text-[#666666]">
                      {t.startSelling}
                    </p>
                  </motion.div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => console.log("Google signup")}
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
                      onClick={() => console.log("Telegram signup")}
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
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (email.trim()) setStep("verify")
                    }}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="h-10 w-full rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-10 pr-4 text-sm tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] transition-colors focus:border-[#918DF6] focus:outline-none focus:ring-2 focus:ring-[#918DF6]/20"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="mt-1 h-10 w-full cursor-pointer rounded-full bg-[#918DF6] text-sm font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#9580FF]"
                    >
                      {t.continueEmail}
                    </Button>
                  </form>

                  <p className="mt-8 text-center text-sm tracking-[-0.32px] text-[#666666]">
                    {t.alreadyHaveAccount}{" "}
                    <Link
                      to={`${prefix}/login`}
                      className="font-medium text-[#918DF6] transition-colors hover:text-[#9580FF]"
                    >
                      {t.signIn}
                    </Link>
                  </p>
                </motion.div>
              ) : step === "verify" ? (
                <VerificationCodeInput
                  email={email}
                  onBack={() => setStep("initial")}
                  onVerified={() => setStep("profile")}
                />
              ) : step === "profile" ? (
                <ProfileStep
                  onBack={() => setStep("verify")}
                  onContinue={() => setStep("store")}
                />
              ) : step === "store" ? (
                <StoreStep
                  onBack={() => setStep("profile")}
                  onContinue={() => setStep("plan")}
                />
              ) : (
                <PlanStep onBack={() => setStep("store")} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
