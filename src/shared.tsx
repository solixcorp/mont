import type React from "react"

// ─── Platform Icons ──────────────────────────────────────────

const NaverIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-full">
    <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
  </svg>
)

// ─── Constants ───────────────────────────────────────────────

export const KRW_RATE = 1450

// ─── Types ───────────────────────────────────────────────────

export type OrderStatus = "Delivered" | "Processing" | "Failed" | "ManualRequired"

export type OrderItem = {
  keyCode: string
  status: OrderStatus
}

export type FlowTiming = {
  orderCreated: string
  licenseAssigned: string
  deliverySent: string
  deliveryConfirmed?: string
}

export type Order = {
  id: string
  platform: string
  storeName?: string
  amount: number
  quantity?: number
  status: OrderStatus
  time: string
  product: string
  customer: string
  email: string
  phone?: string
  delivery: string
  deliveryTarget?: string
  keyCode: string
  items?: OrderItem[]
  recipientName?: string
  recipientPhone?: string
  customerMemo?: string
  adminMemo?: string
  flowTiming?: FlowTiming
  deliveryMessage?: string
  errorStep?: string
  errorMessage?: string
}

export type Currency = "USD" | "KRW"

// ─── Formatters ──────────────────────────────────────────────

export function formatUSD(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function formatKRW(n: number) {
  return `₩${Math.round(n * KRW_RATE).toLocaleString("ko-KR")}`
}

// ─── Platform Badges ─────────────────────────────────────────

export const platformBadges: Record<string, { bg: string; label: string; textSize: string; icon?: React.FC }> = {
  "네이버 스토어": { bg: "bg-[#03C75A]", label: "N", textSize: "text-[9px]", icon: NaverIcon },
  "롯데몰": { bg: "bg-[#E40046]", label: "L", textSize: "text-[9px]" },
  "지마켓": { bg: "bg-[#00A650]", label: "G", textSize: "text-[9px]" },
  "쿠팡": { bg: "bg-[#E31837]", label: "C", textSize: "text-[9px]" },
}

export function PlatformBadgeIcon({ badge, size = "size-4" }: { badge: typeof platformBadges[string]; size?: string }) {
  const Icon = badge.icon
  return (
    <span className={`${badge.bg} inline-flex ${size} shrink-0 items-center justify-center rounded p-0.5 font-bold text-white ${badge.textSize}`}>
      {Icon ? <Icon /> : badge.label}
    </span>
  )
}

// ─── Status Badge ────────────────────────────────────────────

const statusLabelsKR: Record<string, string> = {
  Delivered: "발송 완료",
  Processing: "발송 준비중",
  Failed: "발송 실패",
  ManualRequired: "수동 발송 필요",
}

export function StatusBadge({ status, locale = "en" }: { status: OrderStatus; locale?: "en" | "kr" }) {
  const styles = {
    Delivered: "bg-[#34A853] text-white",
    Processing: "bg-[#E37400] text-white",
    Failed: "bg-[#D93025] text-white",
    ManualRequired: "bg-[#1A73E8] text-white",
  }
  const label = locale === "kr" ? statusLabelsKR[status] : (status === "ManualRequired" ? "Manual Required" : status)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold ${styles[status]}`}>
      {status === "Processing" && (
        <svg className="size-3 animate-spin" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M6 1a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </span>
  )
}

// ─── Delivery Channels ───────────────────────────────────────

export const deliveryChannels: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Telegram: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>,
    color: "#2AABEE",
    bg: "rgba(42,171,238,0.15)",
  },
  Email: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    color: "#2C78FC",
    bg: "rgba(44,120,252,0.15)",
  },
  SMS: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    color: "#33C758",
    bg: "rgba(51,199,88,0.15)",
  },
  WhatsApp: {
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
    color: "#25D366",
    bg: "rgba(37,211,102,0.15)",
  },
}

const channelLabelsKR: Record<string, string> = {
  Telegram: "텔레그램",
  Email: "이메일",
  SMS: "문자",
  WhatsApp: "왓츠앱",
}

export function DeliveryChannel({ channel, locale = "en" }: { channel: string; locale?: "en" | "kr" }) {
  const ch = deliveryChannels[channel]
  if (!ch) return null
  const label = locale === "kr" ? (channelLabelsKR[channel] ?? channel) : channel
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-semibold tracking-[-0.32px]"
      style={{ backgroundColor: ch.bg, color: ch.color }}
    >
      {ch.icon}
      {label}
    </span>
  )
}

// ─── Delivery Channel Plugins ────────────────────────────────

export type DeliveryPluginType = "builtin" | "plugin"

export type DeliveryPlugin = {
  id: string
  name: string
  author: string
  description: string
  pluginType: DeliveryPluginType
  iconBg: string
  iconLabel: string
  endpointLabel: string
  installs: number
  installed: boolean
}

export const deliveryPlugins: DeliveryPlugin[] = [
  {
    id: "email",
    name: "Email",
    author: "Linko",
    description: "Deliver product keys via email",
    pluginType: "builtin",
    iconBg: "#2C78FC",
    iconLabel: "Em",
    endpointLabel: "Email address",
    installs: 0,
    installed: true,
  },
  {
    id: "telegram",
    name: "Telegram",
    author: "Linko",
    description: "Send keys through Telegram bot",
    pluginType: "builtin",
    iconBg: "#2AABEE",
    iconLabel: "Tg",
    endpointLabel: "Bot Token",
    installs: 0,
    installed: true,
  },
  {
    id: "sms",
    name: "SMS",
    author: "Linko",
    description: "Deliver keys via SMS text message",
    pluginType: "builtin",
    iconBg: "#33C758",
    iconLabel: "Sm",
    endpointLabel: "Phone Number",
    installs: 0,
    installed: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    author: "Linko",
    description: "Send keys through WhatsApp messaging",
    pluginType: "builtin",
    iconBg: "#25D366",
    iconLabel: "Wa",
    endpointLabel: "Phone Number",
    installs: 0,
    installed: true,
  },
  {
    id: "webhook",
    name: "Webhook",
    author: "Linko",
    description: "Deliver via custom webhook endpoint",
    pluginType: "builtin",
    iconBg: "#E37400",
    iconLabel: "Wh",
    endpointLabel: "Webhook URL",
    installs: 0,
    installed: true,
  },
  {
    id: "discord",
    name: "Discord",
    author: "@discorddev",
    description: "Deliver keys via Discord DM using a custom bot",
    pluginType: "plugin",
    iconBg: "#5865F2",
    iconLabel: "D",
    endpointLabel: "Discord User ID",
    installs: 1800,
    installed: false,
  },
  {
    id: "kakao",
    name: "KakaoTalk",
    author: "@kakaodev",
    description: "Send product keys through KakaoTalk messaging",
    pluginType: "plugin",
    iconBg: "#FEE500",
    iconLabel: "Kt",
    endpointLabel: "Phone Number",
    installs: 2600,
    installed: true,
  },
  {
    id: "line",
    name: "LINE",
    author: "@linedev",
    description: "Deliver digital products via LINE messenger",
    pluginType: "plugin",
    iconBg: "#06C755",
    iconLabel: "L",
    endpointLabel: "LINE User ID",
    installs: 540,
    installed: false,
  },
  {
    id: "slack",
    name: "Slack",
    author: "@slackint",
    description: "Send delivery notifications to Slack channels",
    pluginType: "plugin",
    iconBg: "#4A154B",
    iconLabel: "Sl",
    endpointLabel: "Slack Webhook URL",
    installs: 320,
    installed: false,
  },
]
