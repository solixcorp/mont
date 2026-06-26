import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react"
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import DashboardLayout from "@/DashboardLayout"
import {
  type Order,
  type Currency,
  StatusBadge,
  formatUSD,
  formatKRW,
} from "@/shared"
import type { Locale } from "@/locale"

// ─── Translations ────────────────────────────────────────────

const translations = {
  en: {
    title: "Overview",
    totalOrders: "Total Orders",
    revenue: "Revenue",
    deliverySuccess: "Delivery Success",
    avgDeliveryTime: "Avg Delivery Time",
    recentOrders: "Recent Orders",
    last6: "Last 6 transactions",
    viewAll: "View all",
    platformSplit: "Platform Split",
    orderDistribution: "Order distribution",
    allInventory: "All Inventory",
    keysRemaining: "Keys remaining",
    all: "All",
    manualRequired: "Manual Required",
    delivered: "Delivered",
    failed: "Failed",
    searchOrders: "Search orders...",
  },
  kr: {
    title: "개요",
    totalOrders: "총 주문",
    revenue: "매출",
    deliverySuccess: "배송 성공률",
    avgDeliveryTime: "평균 배송 시간",
    recentOrders: "최근 주문",
    last6: "최근 6건",
    viewAll: "전체 보기",
    platformSplit: "플랫폼 분포",
    orderDistribution: "주문 분포",
    allInventory: "전체 재고",
    keysRemaining: "남은 키",
    all: "전체",
    manualRequired: "수동 주문 필요",
    delivered: "발송됨",
    failed: "발송실패",
    searchOrders: "주문 검색...",
  },
} as const

// ─── Mock Data ───────────────────────────────────────────────

const sparkDates = ["4/22", "4/23", "4/24", "4/25", "4/26", "4/27", "4/28"]

const sparklineData = {
  orders: [180, 220, 195, 240, 280, 310, 290].map((v, i) => ({ v, date: sparkDates[i] })),
  revenue: [5420, 6180, 5890, 7340, 8120, 9450, 7990].map((v, i) => ({ v, date: sparkDates[i] })),
  success: [99.2, 99.5, 99.3, 99.8, 99.6, 99.9, 99.7].map((v, i) => ({ v, date: sparkDates[i] })),
  delivery: [3.1, 2.8, 2.9, 2.5, 2.6, 2.3, 2.4].map((v, i) => ({ v, date: sparkDates[i] })),
}

const platformData = [
  { name: "네이버 스토어", value: 42, color: "#34A853" },
  { name: "롯데몰", value: 35, color: "#1A73E8" },
  { name: "지마켓", value: 18, color: "#E37400" },
  { name: "쿠팡", value: 5, color: "#918DF6" },
]

const orders: Order[] = [
  { id: "4X7PA", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", phone: "010-9803-2514", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "XXXX-XXXX-7F3M", recipientName: "이정효", recipientPhone: "010-9803-2514", customerMemo: "leolee12@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-7F3M", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "2.1s" } },
  { id: "9K2BM", platform: "롯데몰", storeName: "롯데몰", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", phone: "010-3421-7788", delivery: "Email", deliveryTarget: "g2g_buyer_8821", keyCode: "XXXX-XXXX-A2K9", recipientName: "Alex Turner", recipientPhone: "010-3421-7788", customerMemo: "g2g_buyer_8821", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-A2K9", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.8s", deliveryConfirmed: "3.0s" } },
  { id: "3F8QN", platform: "지마켓", storeName: "지마켓", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", phone: "010-5567-1234", delivery: "SMS", deliveryTarget: "010-5567-1234", keyCode: "XXXX-XXXX-9D1P", recipientName: "김수현", recipientPhone: "010-5567-1234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-9D1P", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.1s" } },
  { id: "7W1DL", platform: "네이버 스토어", storeName: "몽키디지털", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", phone: "010-8812-3390", delivery: "Email", deliveryTarget: "minji_park@naver.com", keyCode: "XXXX-XXXX-QW8E", recipientName: "박민지", recipientPhone: "010-8812-3390", customerMemo: "minji_park@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-QW8E", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "1.5s" } },
  { id: "6R5VC", platform: "롯데몰", storeName: "롯데몰", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", phone: "010-2290-4567", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "XXXX-XXXX-5TN2", recipientName: "James Kim", recipientPhone: "010-2290-4567", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XXXX-XXXX-5TN2", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.1s", deliveryConfirmed: "3.4s" } },
  { id: "2H9TE", platform: "지마켓", storeName: "지마켓", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", phone: "010-7741-9023", delivery: "WhatsApp", deliveryTarget: "+82 10-7741-9023", keyCode: "XXXX-XXXX-0000", recipientName: "최영호", recipientPhone: "010-7741-9023", customerMemo: "g2a_user_7790", adminMemo: "WhatsApp 재발송 필요", errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered.", quantity: 1, items: [{ keyCode: "XXXX-XXXX-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.5s" } },
  { id: "5M3JK", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 34.99, status: "ManualRequired", time: "32분 전", product: "Adobe Creative Cloud 1개월", customer: "한소영", email: "soyoung_h@naver.com", phone: "010-6634-8821", delivery: "Email", deliveryTarget: "soyoung_h@naver.com", keyCode: "", recipientName: "한소영", recipientPhone: "010-6634-8821", customerMemo: "soyoung_h@naver.com", adminMemo: "수동 키 입력 대기", quantity: 1, items: [{ keyCode: "", status: "ManualRequired" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "—", deliverySent: "—" } },
  { id: "8N4WQ", platform: "롯데몰", storeName: "롯데몰", amount: 19.99, status: "Failed", time: "2시간 전", product: "Netflix Gift Card $25", customer: "David Park", email: "g2g_buyer_5512", phone: "010-1199-4400", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "XXXX-XXXX-0000", recipientName: "David Park", recipientPhone: "010-1199-4400", customerMemo: "", adminMemo: "자동 배송 타임아웃", errorStep: "Step 3 — Key Delivery", errorMessage: "Auto-delivery timed out after 60s. Bot unresponsive.", quantity: 1, items: [{ keyCode: "XXXX-XXXX-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "60.0s" } },
  { id: "1P6RZ", platform: "지마켓", storeName: "지마켓", amount: 14.99, status: "ManualRequired", time: "45분 전", product: "Spotify Premium 3개월", customer: "정우진", email: "g2a_user_2281", phone: "010-3345-6677", delivery: "SMS", deliveryTarget: "010-3345-6677", keyCode: "", recipientName: "정우진", recipientPhone: "010-3345-6677", customerMemo: "", adminMemo: "재고 부족 — 수동 키 발급 필요", quantity: 1, items: [{ keyCode: "", status: "ManualRequired" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "—", deliverySent: "—" } },
]

const inventory = [
  { name: "GTA V Premium", remaining: 142, total: 200 },
  { name: "Xbox Game Pass", remaining: 67, total: 150 },
  { name: "PS Plus 12M", remaining: 34, total: 80 },
  { name: "Elden Ring", remaining: 8, total: 100 },
  { name: "Windows 11 Pro", remaining: 3, total: 50 },
  { name: "FIFA 25", remaining: 12, total: 60 },
]

// ─── Sparkline ───────────────────────────────────────────────

function SparklineTooltipContent({
  active,
  payload,
  formatter,
}: {
  active?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: ReadonlyArray<Record<string, any>>
  formatter: (value: number) => string
}) {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  const value = typeof entry.value === "number" ? entry.value : 0
  const date = typeof entry.payload?.date === "string" ? entry.payload.date : ""
  return (
    <div
      className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-2.5 py-1.5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{date}</p>
      <p className="text-[13px] font-semibold tracking-[-0.32px] tabular-nums text-[#181925]">
        {formatter(value)}
      </p>
    </div>
  )
}

function Sparkline({
  data,
  color,
  formatter,
}: {
  data: { v: number; date: string }[]
  color: string
  formatter: (value: number) => string
}) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "#999999", fontFamily: "Plus Jakarta Sans Variable, system-ui, sans-serif" }}
          interval="preserveStartEnd"
        />
        <Tooltip
          content={({ active, payload }) => (
            <SparklineTooltipContent active={active} payload={payload} formatter={formatter} />
          )}
          cursor={false}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace("#", "")})`}
          dot={false}
          activeDot={{ r: 3, stroke: "#ffffff", strokeWidth: 2, fill: color }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ─── Metric Card ─────────────────────────────────────────────

function MetricCard({
  label,
  value,
  change,
  dotColor,
  positive,
  sparkData,
  secondaryValue,
  formatter,
}: {
  label: string
  value: string
  change: string
  dotColor: string
  positive: boolean
  sparkData: { v: number; date: string }[]
  secondaryValue?: string
  formatter: (value: number) => string
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-4 py-3"
      style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
    >
      <div
        className="absolute top-0 bottom-0 left-0 w-[3px]"
        style={{ backgroundColor: dotColor }}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-[14px] font-medium tracking-[-0.32px] text-[#666666]">
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {positive ? (
            <TrendingUp className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
          ) : (
            <TrendingDown className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
          )}
          <span className="text-[14px] font-semibold tracking-[-0.32px] text-[#34A853]">
            {change}
          </span>
        </div>
      </div>
      <p className="mt-1 text-[24px] font-semibold leading-tight tracking-[-0.32px] tabular-nums text-[#181925]">
        {value}
      </p>
      {secondaryValue && (
        <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] tabular-nums text-[#999999]">
          {secondaryValue}
        </p>
      )}
      <div className="mt-1">
        <Sparkline data={sparkData} color={dotColor} formatter={formatter} />
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────

export default function Dashboard({ locale = "en" }: { locale?: Locale }) {
  const navigate = useNavigate()
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [orderTab, setOrderTab] = useState<"all" | "manual" | "delivered" | "failed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const t = translations[locale]

  const filteredOrders = (() => {
    let filtered = orders
    switch (orderTab) {
      case "manual":
        filtered = orders.filter((o) => o.status === "Failed" || o.status === "ManualRequired")
        break
      case "delivered":
        filtered = orders.filter((o) => o.status === "Delivered")
        break
      case "failed":
        filtered = orders.filter((o) => o.status === "Failed")
        break
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter((o) =>
        o.product.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q)
      )
    }
    return filtered
  })()

  return (
    <DashboardLayout
      title={t.title}
      locale={locale}
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
        <div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-4 lg:px-8">
          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label={t.totalOrders}
              value="2,847"
              change="+12.5%"
              dotColor="#1A73E8"
              positive
              sparkData={sparklineData.orders}
              formatter={(v) => `${v.toLocaleString()} orders`}
            />
            <MetricCard
              label={t.revenue}
              value={currency === "KRW" ? "₩70,168,800" : "$48,392"}
              change="+8.2%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.revenue}
              secondaryValue={currency === "KRW" ? "≈ $48,392" : "≈ ₩70,168,800"}
              formatter={(v) => currency === "KRW" ? formatKRW(v) : formatUSD(v)}
            />
            <MetricCard
              label={t.deliverySuccess}
              value="99.7%"
              change="+0.3%"
              dotColor="#34A853"
              positive
              sparkData={sparklineData.success}
              formatter={(v) => `${v}%`}
            />
            <MetricCard
              label={t.avgDeliveryTime}
              value="2.4s"
              change="-0.8s"
              dotColor="#918DF6"
              positive={false}
              sparkData={sparklineData.delivery}
              formatter={(v) => `${v}s`}
            />
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
            <div
              className="flex flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
              style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                    {t.recentOrders}
                  </h2>
                  <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                    {t.last6}
                  </p>
                </div>
                <button
                  onClick={() => navigate("/dashboard/orders")}
                  className="flex items-center gap-1 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6] transition-colors hover:text-[#9580FF]"
                >
                  {t.viewAll}
                  <ArrowRight className="size-3.5" strokeWidth={2} />
                </button>
              </div>
              <div className="flex items-center gap-3 px-5 pb-3">
                <div className="flex shrink-0 rounded-lg border border-[rgba(0,0,0,0.10)] bg-[rgba(0,0,0,0.02)] p-0.5">
                  <button
                    type="button"
                    onClick={() => setOrderTab("all")}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                      orderTab === "all"
                        ? "bg-white text-[#181925] shadow-sm"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    {t.all}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderTab("manual")}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                      orderTab === "manual"
                        ? "bg-white text-[#181925] shadow-sm"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    {t.manualRequired}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderTab("delivered")}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                      orderTab === "delivered"
                        ? "bg-white text-[#181925] shadow-sm"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    {t.delivered}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderTab("failed")}
                    className={`rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-all ${
                      orderTab === "failed"
                        ? "bg-white text-[#181925] shadow-sm"
                        : "text-[#666666] hover:text-[#181925]"
                    }`}
                  >
                    {t.failed}
                  </button>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchOrders}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-3 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 z-10 bg-[#FAFAFA]">
                    <tr className="border-b border-[rgba(0,0,0,0.06)]">
                      <th className="px-5 py-2 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                        {locale === "kr" ? "상품" : "Product"}
                      </th>
                      <th className="px-3 py-2 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                        {locale === "kr" ? "상태" : "Status"}
                      </th>
                      <th className="px-3 py-2 text-left text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                        {locale === "kr" ? "고객" : "Customer"}
                      </th>
                      <th className="px-3 py-2 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                        {locale === "kr" ? "금액" : "Amount"}
                      </th>
                      <th className="px-5 py-2 text-right text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                        {locale === "kr" ? "시간" : "Time"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const isFailed = order.status === "Failed"
                      return (
                        <tr
                          key={order.id}
                          onClick={() => navigate(`/dashboard/orders?order=${order.id}`)}
                          className={`cursor-pointer border-b border-[rgba(0,0,0,0.06)] transition-colors hover:bg-neutral-50 ${
                            isFailed ? "border-l-[3px] border-l-[#D93025] bg-[#D93025]/[0.02]" : ""
                          }`}
                        >
                          <td className="max-w-[200px] px-5 py-3">
                            <span className="block truncate text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                              {order.product}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <StatusBadge status={order.status} locale={locale} />
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-[13px] tracking-[-0.32px] text-[#666666]">
                              {order.customer}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span className="text-[13px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                              {locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="text-[12px] tracking-[-0.32px] text-[#999999]">
                              {order.time}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto">
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 pt-4 pb-5"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {t.platformSplit}
                </h2>
                <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  {t.orderDistribution}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {platformData.map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="w-[80px] shrink-0 text-[14px] tracking-[-0.32px] text-[#666666]">
                        {p.name}
                      </span>
                      <div className="flex-1">
                        <div className="h-[7px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${p.value}%`, backgroundColor: p.color }}
                          />
                        </div>
                      </div>
                      <span className="w-10 shrink-0 text-right text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        {p.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-5 pt-4 pb-5"
                style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
              >
                <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {t.allInventory}
                </h2>
                <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  {t.keysRemaining}
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {inventory.map((item) => {
                    const pct = (item.remaining / item.total) * 100
                    const barColor = pct > 30 ? "#33C758" : pct > 15 ? "#E37400" : "#D93025"
                    return (
                      <div key={item.name}>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] tracking-[-0.32px] text-[#181925]">
                            {item.name}
                          </span>
                          <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                            {item.remaining}
                            <span className="font-normal text-[#999999]">/{item.total}</span>
                          </span>
                        </div>
                        <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.06)]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}
