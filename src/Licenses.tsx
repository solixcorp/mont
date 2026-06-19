import { useState, useRef, useEffect, useCallback } from "react"
import {
  KeyRound,
  Upload,
  Link as LinkIcon,
  FileText,
  ImageIcon,
  RefreshCw,
  Plus,
  Package,
  Clock,
  TrendingUp,
  Check,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"
import type { Locale } from "@/locale"

const translations = {
  en: {
    title: "License Charging",
    subtitle: "Add and manage license keys for your products",
    successBanner: "Keys added successfully",
    product: "Product",
    selectProduct: "Select a product...",
    searchProducts: "Search products...",
    noProductsFound: "No products found",
    keyType: "Key Type",
    keyCodes: "Key Codes",
    urls: "URLs",
    fileUpload: "File Upload",
    imageUpload: "Image Upload",
    subscriptionDetails: "Subscription Details",
    keyEntered: "key",
    keysEntered: "keys",
    urlEntered: "URL",
    urlsEntered: "URLs",
    fileSelected: "file",
    filesSelected: "files",
    keyCodePlaceholder: "Enter one key per line...\nXXXX-ABCD-1234-EFGH\nXXXX-IJKL-5678-MNOP",
    linkPlaceholder: "Enter one URL per line...\nhttps://example.com/redeem/abc123\nhttps://example.com/redeem/def456",
    dropFiles: "Drop files here",
    dropImages: "Drop images here",
    orClickToBrowse: "or click to browse from your computer",
    browseFiles: "Browse Files",
    subscriptionName: "Subscription Name",
    subscriptionNamePlaceholder: "e.g. Xbox Game Pass Ultimate",
    plan: "Plan",
    planPlaceholder: "e.g. 1 Month",
    price: "Price",
    pricePlaceholder: "e.g. $12.99",
    startDate: "Start Date",
    endDate: "End Date",
    preview: "Preview",
    more: "more",
    addKey: "Add Key",
    addKeys: "Add Keys",
    addUrl: "Add URL",
    addUrls: "Add URLs",
    addSubscription: "Add Subscription",
    uploadFiles: "Upload Files",
    uploadImages: "Upload Images",
    today: "Today",
    thisWeek: "This Week",
    top: "Top",
    recentCharges: "Recent Charges",
    entriesLoaded: "entries loaded",
    allEntriesLoaded: "All {count} entries loaded",
    of: "of",
    keyTypeKeyCode: "Key Code",
    keyTypeLink: "Link",
    keyTypeFile: "File",
    keyTypeImage: "Image",
    keyTypeSubscription: "Subscription",
  },
  kr: {
    title: "라이선스 충전",
    subtitle: "상품의 라이선스 키를 추가하고 관리하세요",
    successBanner: "키가 성공적으로 추가되었습니다",
    product: "상품",
    selectProduct: "상품을 선택하세요...",
    searchProducts: "상품 검색...",
    noProductsFound: "상품을 찾을 수 없습니다",
    keyType: "키 유형",
    keyCodes: "키 코드",
    urls: "URL",
    fileUpload: "파일 업로드",
    imageUpload: "이미지 업로드",
    subscriptionDetails: "구독 정보",
    keyEntered: "개 키",
    keysEntered: "개 키",
    urlEntered: "개 URL",
    urlsEntered: "개 URL",
    fileSelected: "개 파일",
    filesSelected: "개 파일",
    keyCodePlaceholder: "한 줄에 하나의 키를 입력하세요...\nXXXX-ABCD-1234-EFGH\nXXXX-IJKL-5678-MNOP",
    linkPlaceholder: "한 줄에 하나의 URL을 입력하세요...\nhttps://example.com/redeem/abc123\nhttps://example.com/redeem/def456",
    dropFiles: "여기에 파일을 놓으세요",
    dropImages: "여기에 이미지를 놓으세요",
    orClickToBrowse: "또는 클릭하여 컴퓨터에서 선택하세요",
    browseFiles: "파일 찾아보기",
    subscriptionName: "구독 이름",
    subscriptionNamePlaceholder: "예: Xbox Game Pass Ultimate",
    plan: "플랜",
    planPlaceholder: "예: 1개월",
    price: "가격",
    pricePlaceholder: "예: $12.99",
    startDate: "시작일",
    endDate: "종료일",
    preview: "미리보기",
    more: "개 더",
    addKey: "키 추가",
    addKeys: "키 추가",
    addUrl: "URL 추가",
    addUrls: "URL 추가",
    addSubscription: "구독 추가",
    uploadFiles: "파일 업로드",
    uploadImages: "이미지 업로드",
    today: "오늘",
    thisWeek: "이번 주",
    top: "인기",
    recentCharges: "최근 충전 내역",
    entriesLoaded: "건 로드됨",
    allEntriesLoaded: "전체 {count}건 로드 완료",
    of: "/",
    keyTypeKeyCode: "키 코드",
    keyTypeLink: "링크",
    keyTypeFile: "파일",
    keyTypeImage: "이미지",
    keyTypeSubscription: "구독",
  },
} as const

// ─── Types ───────────────────────────────────────────────────

type KeyType = "key" | "link" | "file" | "image" | "subscription"
type SourceTag = "Manual Upload" | "API Fetch" | "Bulk Import" | "Partner Supply"

type ChargeHistoryItem = {
  id: string
  productName: string
  keysAdded: number
  keyType: KeyType
  source: SourceTag
  timestamp: string
  addedBy: string
}

// ─── Mock Data ───────────────────────────────────────────────

const products = [
  { id: "P001", name: "Steam Wallet $50 Gift Card", color: "#1B2838" },
  { id: "P002", name: "Xbox Game Pass Ultimate 1M", color: "#107C10" },
  { id: "P003", name: "PlayStation Plus Premium 3M", color: "#003087" },
  { id: "P005", name: "Elden Ring Shadow of the Erdtree", color: "#C4A44A" },
  { id: "P006", name: "Adobe Creative Cloud 1M", color: "#FF0000" },
  { id: "P007", name: "Spotify Premium 6M", color: "#1DB954" },
  { id: "P008", name: "Windows 11 Pro Key", color: "#0078D4" },
  { id: "P009", name: "Cyberpunk 2077 Ultimate Bundle", color: "#FCE300" },
  { id: "P011", name: "Microsoft 365 Family 1Y", color: "#D83B01" },
  { id: "P013", name: "YouTube Premium 3M", color: "#FF0000" },
  { id: "P015", name: "Roblox Gift Card $25", color: "#E2231A" },
  { id: "P016", name: "Monster Hunter Wilds", color: "#2D5016" },
]

const keyTypes: { label: string; value: KeyType; icon: typeof KeyRound }[] = [
  { label: "Key Code", value: "key", icon: KeyRound },
  { label: "Link", value: "link", icon: LinkIcon },
  { label: "File", value: "file", icon: FileText },
  { label: "Image", value: "image", icon: ImageIcon },
  { label: "Subscription", value: "subscription", icon: RefreshCw },
]


const chargeHistory: ChargeHistoryItem[] = [
  { id: "CH001", productName: "Steam Wallet $50 Gift Card", keysAdded: 50, keyType: "key", source: "Bulk Import", timestamp: "2026-04-29 09:12", addedBy: "You" },
  { id: "CH002", productName: "Windows 11 Pro Key", keysAdded: 25, keyType: "key", source: "API Fetch", timestamp: "2026-04-29 08:45", addedBy: "You" },
  { id: "CH003", productName: "Xbox Game Pass Ultimate 1M", keysAdded: 10, keyType: "link", source: "Manual Upload", timestamp: "2026-04-29 07:30", addedBy: "You" },
  { id: "CH004", productName: "Spotify Premium 6M", keysAdded: 15, keyType: "subscription", source: "Partner Supply", timestamp: "2026-04-28 22:15", addedBy: "You" },
  { id: "CH005", productName: "Adobe Creative Cloud 1M", keysAdded: 8, keyType: "key", source: "Manual Upload", timestamp: "2026-04-28 18:40", addedBy: "You" },
  { id: "CH006", productName: "Steam Wallet $50 Gift Card", keysAdded: 100, keyType: "key", source: "Bulk Import", timestamp: "2026-04-28 14:20", addedBy: "You" },
  { id: "CH007", productName: "Roblox Gift Card $25", keysAdded: 30, keyType: "image", source: "Partner Supply", timestamp: "2026-04-28 11:05", addedBy: "You" },
  { id: "CH008", productName: "PlayStation Plus Premium 3M", keysAdded: 12, keyType: "key", source: "API Fetch", timestamp: "2026-04-27 16:50", addedBy: "You" },
  { id: "CH009", productName: "Monster Hunter Wilds", keysAdded: 20, keyType: "file", source: "Manual Upload", timestamp: "2026-04-27 10:30", addedBy: "You" },
  { id: "CH010", productName: "Cyberpunk 2077 Ultimate Bundle", keysAdded: 5, keyType: "key", source: "Partner Supply", timestamp: "2026-04-26 21:15", addedBy: "You" },
  { id: "CH011", productName: "Microsoft 365 Family 1Y", keysAdded: 40, keyType: "link", source: "API Fetch", timestamp: "2026-04-26 15:30", addedBy: "You" },
  { id: "CH012", productName: "YouTube Premium 3M", keysAdded: 18, keyType: "subscription", source: "Partner Supply", timestamp: "2026-04-26 09:45", addedBy: "You" },
  { id: "CH013", productName: "Elden Ring Shadow of the Erdtree", keysAdded: 10, keyType: "key", source: "Manual Upload", timestamp: "2026-04-25 20:10", addedBy: "You" },
  { id: "CH014", productName: "Steam Wallet $50 Gift Card", keysAdded: 75, keyType: "key", source: "Bulk Import", timestamp: "2026-04-25 14:55", addedBy: "You" },
  { id: "CH015", productName: "Xbox Game Pass Ultimate 1M", keysAdded: 20, keyType: "link", source: "API Fetch", timestamp: "2026-04-25 08:20", addedBy: "You" },
  { id: "CH016", productName: "Adobe Creative Cloud 1M", keysAdded: 12, keyType: "key", source: "Partner Supply", timestamp: "2026-04-24 19:40", addedBy: "You" },
  { id: "CH017", productName: "Roblox Gift Card $25", keysAdded: 45, keyType: "image", source: "Bulk Import", timestamp: "2026-04-24 13:15", addedBy: "You" },
  { id: "CH018", productName: "PlayStation Plus Premium 3M", keysAdded: 8, keyType: "key", source: "Manual Upload", timestamp: "2026-04-24 07:50", addedBy: "You" },
  { id: "CH019", productName: "Windows 11 Pro Key", keysAdded: 30, keyType: "key", source: "API Fetch", timestamp: "2026-04-23 22:30", addedBy: "You" },
  { id: "CH020", productName: "Spotify Premium 6M", keysAdded: 22, keyType: "subscription", source: "Partner Supply", timestamp: "2026-04-23 16:05", addedBy: "You" },
  { id: "CH021", productName: "Monster Hunter Wilds", keysAdded: 15, keyType: "file", source: "Manual Upload", timestamp: "2026-04-23 10:40", addedBy: "You" },
  { id: "CH022", productName: "Steam Wallet $50 Gift Card", keysAdded: 60, keyType: "key", source: "Bulk Import", timestamp: "2026-04-22 21:20", addedBy: "You" },
  { id: "CH023", productName: "Cyberpunk 2077 Ultimate Bundle", keysAdded: 8, keyType: "key", source: "Partner Supply", timestamp: "2026-04-22 15:00", addedBy: "You" },
  { id: "CH024", productName: "Microsoft 365 Family 1Y", keysAdded: 25, keyType: "link", source: "API Fetch", timestamp: "2026-04-22 09:35", addedBy: "You" },
  { id: "CH025", productName: "Xbox Game Pass Ultimate 1M", keysAdded: 35, keyType: "link", source: "Bulk Import", timestamp: "2026-04-21 18:50", addedBy: "You" },
]

const keyTypeBadgeStyles: Record<KeyType, string> = {
  key: "text-[#918DF6] bg-[#918DF6]/10",
  link: "text-[#2C78FC] bg-[#2C78FC]/10",
  file: "text-[#E37400] bg-[#E37400]/10",
  image: "text-[#34A853] bg-[#34A853]/10",
  subscription: "text-[#D93025] bg-[#D93025]/10",
}

const keyTypeLabels: Record<KeyType, string> = {
  key: "Key Code",
  link: "Link",
  file: "File",
  image: "Image",
  subscription: "Subscription",
}

// ─── Component ───────────────────────────────────────────────

export default function Licenses({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale]
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [keyType, setKeyType] = useState<KeyType>("key")
  const [inputValue, setInputValue] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  // Product dropdown
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [productSearch, setProductSearch] = useState("")
  const productDropdownRef = useRef<HTMLDivElement>(null)

  // File upload
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Subscription fields
  const [subName, setSubName] = useState("")
  const [subPlan, setSubPlan] = useState("")
  const [subPrice, setSubPrice] = useState("")
  const [subStart, setSubStart] = useState("")
  const [subEnd, setSubEnd] = useState("")

  const CHARGE_PAGE_SIZE = 5
  const [chargeDisplayCount, setChargeDisplayCount] = useState(CHARGE_PAGE_SIZE)
  const [chargeLoading, setChargeLoading] = useState(false)
  const chargeSentinelRef = useRef<HTMLDivElement>(null)

  const visibleCharges = chargeHistory.slice(0, chargeDisplayCount)
  const allChargesLoaded = chargeDisplayCount >= chargeHistory.length

  const loadMoreCharges = useCallback(() => {
    if (chargeLoading || allChargesLoaded) return
    setChargeLoading(true)
    setTimeout(() => {
      setChargeDisplayCount((prev) => Math.min(prev + CHARGE_PAGE_SIZE, chargeHistory.length))
      setChargeLoading(false)
    }, 400)
  }, [chargeLoading, allChargesLoaded])

  useEffect(() => {
    const sentinel = chargeSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMoreCharges() },
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMoreCharges])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (productDropdownRef.current && !productDropdownRef.current.contains(e.target as Node)) {
        setProductDropdownOpen(false)
        setProductSearch("")
      }
    }
    if (productDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [productDropdownOpen])

  const selectedProductData = products.find((p) => p.id === selectedProduct)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()),
  )

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    setUploadedFiles((prev) => [...prev, ...Array.from(files)])
  }

  const lineCount =
    keyType === "key" || keyType === "link"
      ? inputValue
          .split("\n")
          .filter((line) => line.trim().length > 0).length
      : 0

  const canSubmit =
    selectedProduct.length > 0 &&
    (keyType === "key" || keyType === "link"
      ? lineCount > 0
      : keyType === "file" || keyType === "image"
        ? uploadedFiles.length > 0
        : subName.trim().length > 0)

  function handleSubmit() {
    if (!canSubmit) return
    setShowSuccess(true)
    setInputValue("")
    setUploadedFiles([])
    setSubName("")
    setSubPlan("")
    setSubPrice("")
    setSubStart("")
    setSubEnd("")
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <DashboardLayout
      title={t.title}
      locale={locale}
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        {/* Subtitle */}
        <p className="mb-5 text-[13px] tracking-[-0.32px] text-[#999999]">
          {t.subtitle}
        </p>

        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-[#34A853]/20 bg-[#34A853]/[0.06] px-4 py-3">
            <Check className="size-4 text-[#34A853]" strokeWidth={2.5} />
            <p className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">
              {t.successBanner}
            </p>
          </div>
        )}

        {/* 2-column layout */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          {/* ─── Left Column: Add Keys Form ─── */}
          <div className="flex flex-col gap-5">
            {/* Product Selector */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                {t.product}
              </label>
              <div className="relative" ref={productDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProductDropdownOpen((prev) => !prev)
                    setProductSearch("")
                  }}
                  className="flex h-10 w-full items-center gap-2 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white pl-3 pr-3 text-[13px] tracking-[-0.32px] outline-none transition-colors focus:border-[#918DF6]"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <Package className="size-4 shrink-0 text-[#999999]" strokeWidth={1.8} />
                  {selectedProductData ? (
                    <span className="min-w-0 flex-1 truncate text-left text-[#181925]">
                      {selectedProductData.name}
                    </span>
                  ) : (
                    <span className="min-w-0 flex-1 text-left text-[#CCCCCC]">{t.selectProduct}</span>
                  )}
                  <ChevronDown
                    className={`size-4 shrink-0 text-[#999999] transition-transform ${productDropdownOpen ? "rotate-180" : ""}`}
                    strokeWidth={1.8}
                  />
                </button>

                {productDropdownOpen && (
                  <div
                    className="absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-1"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
                  >
                    <div className="px-2 pb-1 pt-1.5">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder={t.searchProducts}
                        autoFocus
                        className="h-8 w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-2.5 text-[12px] tracking-[-0.32px] text-[#181925] placeholder:text-[#CCCCCC] outline-none focus:border-[#918DF6]"
                      />
                    </div>
                    <div className="max-h-[240px] overflow-y-auto">
                      {filteredProducts.length === 0 ? (
                        <p className="px-3 py-3 text-center text-[12px] tracking-[-0.32px] text-[#999999]">
                          {t.noProductsFound}
                        </p>
                      ) : (
                        filteredProducts.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProduct(p.id)
                              setProductDropdownOpen(false)
                              setProductSearch("")
                            }}
                            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                          >
                            <span
                              className="size-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: p.color }}
                            />
                            <span className="min-w-0 flex-1 truncate text-[13px] tracking-[-0.32px] text-[#181925]">
                              {p.name}
                            </span>
                            {selectedProduct === p.id && (
                              <Check className="size-3.5 shrink-0 text-[#918DF6]" strokeWidth={2.5} />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Type Selector */}
            <div>
              <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                {t.keyType}
              </label>
              <div
                className="flex gap-1 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-1"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                {keyTypes.map((kt) => {
                  const Icon = kt.icon
                  const active = keyType === kt.value
                  return (
                    <button
                      key={kt.value}
                      onClick={() => {
                        setKeyType(kt.value)
                        setInputValue("")
                      }}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[12px] font-medium tracking-[-0.32px] transition-colors ${
                        active
                          ? "bg-[#918DF6]/[0.1] text-[#918DF6]"
                          : "text-[#666666] hover:text-[#181925]"
                      }`}
                    >
                      <Icon className="size-3.5" strokeWidth={active ? 2.2 : 1.8} />
                      <span className="hidden sm:inline">{locale === "en" ? kt.label : { key: t.keyTypeKeyCode, link: t.keyTypeLink, file: t.keyTypeFile, image: t.keyTypeImage, subscription: t.keyTypeSubscription }[kt.value]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input Area — varies by key type */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[12px] font-medium tracking-[-0.32px] text-[#999999]">
                  {keyType === "key"
                    ? t.keyCodes
                    : keyType === "link"
                      ? t.urls
                      : keyType === "file"
                        ? t.fileUpload
                        : keyType === "image"
                          ? t.imageUpload
                          : t.subscriptionDetails}
                </label>
                {(keyType === "key" || keyType === "link") && lineCount > 0 && (
                  <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#918DF6]">
                    {lineCount} {lineCount === 1 ? (keyType === "key" ? t.keyEntered : t.urlEntered) : (keyType === "key" ? t.keysEntered : t.urlsEntered)}{locale === "en" ? " entered" : " 입력됨"}
                  </span>
                )}
                {(keyType === "file" || keyType === "image") && uploadedFiles.length > 0 && (
                  <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#918DF6]">
                    {uploadedFiles.length} {uploadedFiles.length === 1 ? t.fileSelected : t.filesSelected}{locale === "en" ? " selected" : " 선택됨"}
                  </span>
                )}
              </div>

              {(keyType === "key" || keyType === "link") && (
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    keyType === "key"
                      ? t.keyCodePlaceholder
                      : t.linkPlaceholder
                  }
                  rows={8}
                  className="w-full resize-none rounded-xl border border-[rgba(0,0,0,0.12)] bg-white px-4 py-3 font-mono text-[13px] leading-relaxed tracking-[-0.32px] text-[#181925] placeholder:text-[#CCCCCC] outline-none transition-colors focus:border-[#918DF6]"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                />
              )}

              {(keyType === "file" || keyType === "image") && (
                <div className="flex flex-col gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={keyType === "image" ? "image/*" : undefined}
                    className="sr-only"
                    tabIndex={-1}
                    onChange={(e) => {
                      handleFiles(e.target.files)
                      e.target.value = ""
                    }}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInputRef.current?.click() } }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragOver(true)
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsDragOver(false)
                      handleFiles(e.dataTransfer.files)
                    }}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition-colors ${
                      isDragOver
                        ? "border-[#918DF6] bg-[#918DF6]/[0.04]"
                        : "border-[rgba(0,0,0,0.12)] bg-white hover:border-[#918DF6]/40 hover:bg-[#918DF6]/[0.02]"
                    }`}
                    onClick={() => { fileInputRef.current?.click() }}
                  >
                    {keyType === "file" ? (
                      <FileText className="size-10 text-[#999999]" strokeWidth={1.2} />
                    ) : (
                      <ImageIcon className="size-10 text-[#999999]" strokeWidth={1.2} />
                    )}
                    <div className="text-center">
                      <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                        {keyType === "file" ? t.dropFiles : t.dropImages}
                      </p>
                      <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#999999]">
                        {t.orClickToBrowse}
                      </p>
                    </div>
                    <span
                      className="flex items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.12)] px-4 py-2 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                    >
                      <Upload className="size-3.5" strokeWidth={2} />
                      {t.browseFiles}
                    </span>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {uploadedFiles.map((file, i) => (
                        <div
                          key={`${file.name}-${file.size}-${i}`}
                          className="flex items-center gap-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 py-2"
                        >
                          {keyType === "image" ? (
                            <ImageIcon className="size-3.5 shrink-0 text-[#999999]" strokeWidth={1.8} />
                          ) : (
                            <FileText className="size-3.5 shrink-0 text-[#999999]" strokeWidth={1.8} />
                          )}
                          <span className="min-w-0 flex-1 truncate text-[12px] tracking-[-0.32px] text-[#181925]">
                            {file.name}
                          </span>
                          <span className="text-[11px] tabular-nums text-[#999999]">
                            {formatFileSize(file.size)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setUploadedFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="flex size-6 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                          >
                            <X className="size-3 text-[#999999]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {keyType === "subscription" && (
                <div
                  className="flex flex-col gap-3 rounded-xl border border-[rgba(0,0,0,0.12)] bg-white p-4"
                  style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
                >
                  <div>
                    <label className="mb-1 block text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                      {t.subscriptionName}
                    </label>
                    <input
                      type="text"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      placeholder={t.subscriptionNamePlaceholder}
                      className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#CCCCCC] outline-none transition-colors focus:border-[#918DF6]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                        {t.plan}
                      </label>
                      <input
                        type="text"
                        value={subPlan}
                        onChange={(e) => setSubPlan(e.target.value)}
                        placeholder={t.planPlaceholder}
                        className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#CCCCCC] outline-none transition-colors focus:border-[#918DF6]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                        {t.price}
                      </label>
                      <input
                        type="text"
                        value={subPrice}
                        onChange={(e) => setSubPrice(e.target.value)}
                        placeholder={t.pricePlaceholder}
                        className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#CCCCCC] outline-none transition-colors focus:border-[#918DF6]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                        {t.startDate}
                      </label>
                      <input
                        type="date"
                        value={subStart}
                        onChange={(e) => setSubStart(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors focus:border-[#918DF6]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-medium tracking-[-0.32px] text-[#999999]">
                        {t.endDate}
                      </label>
                      <input
                        type="date"
                        value={subEnd}
                        onChange={(e) => setSubEnd(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] outline-none transition-colors focus:border-[#918DF6]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            {(keyType === "key" || keyType === "link") && lineCount > 0 && (
              <div className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-4">
                <p className="mb-2 text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">
                  {t.preview}
                </p>
                <div className="flex flex-col gap-1">
                  {inputValue
                    .split("\n")
                    .filter((line) => line.trim().length > 0)
                    .slice(0, 5)
                    .map((line, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-[rgba(0,0,0,0.06)]"
                      >
                        <KeyRound className="size-3 shrink-0 text-[#918DF6]" strokeWidth={2} />
                        <code className="min-w-0 flex-1 truncate text-[12px] tabular-nums tracking-[-0.32px] text-[#181925]">
                          {line.trim()}
                        </code>
                      </div>
                    ))}
                  {lineCount > 5 && (
                    <p className="mt-1 text-center text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                      +{lineCount - 5} {t.more}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Add Keys Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#918DF6] text-[14px] font-medium text-white transition-colors hover:bg-[#7D79E8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-4" strokeWidth={2} />
              {keyType === "key" || keyType === "link"
                ? locale === "en"
                  ? `Add ${lineCount > 0 ? lineCount : ""} ${keyType === "key" ? (lineCount === 1 ? "Key" : "Keys") : (lineCount === 1 ? "URL" : "URLs")}`.trim()
                  : `${lineCount > 0 ? lineCount + "개 " : ""}${keyType === "key" ? "키 추가" : "URL 추가"}`
                : keyType === "subscription"
                  ? t.addSubscription
                  : keyType === "file" ? t.uploadFiles : t.uploadImages}
            </button>
          </div>

          {/* ─── Right Column: Recent Activity ─── */}
          <div className="flex flex-col gap-5">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-[#999999]" strokeWidth={2} />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{t.today}</p>
                </div>
                <p className="mt-1 text-[20px] font-bold tabular-nums tracking-[-0.32px] text-[#181925]">
                  24
                </p>
              </div>
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="size-3 text-[#999999]" strokeWidth={2} />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{t.thisWeek}</p>
                </div>
                <p className="mt-1 text-[20px] font-bold tabular-nums tracking-[-0.32px] text-[#181925]">
                  156
                </p>
              </div>
              <div
                className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
              >
                <div className="flex items-center gap-1.5">
                  <Package className="size-3 text-[#999999]" strokeWidth={2} />
                  <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">{t.top}</p>
                </div>
                <p className="mt-1 truncate text-[12px] font-semibold tracking-[-0.32px] text-[#181925]">
                  Steam Wallet $50
                </p>
              </div>
            </div>

            {/* Charge History */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#999999]">
                  {t.recentCharges}
                </p>
                <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                  {visibleCharges.length} {t.of} {chargeHistory.length} {t.entriesLoaded}
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
                {visibleCharges.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-[rgba(0,0,0,0.08)] bg-white p-3 transition-all hover:border-[rgba(0,0,0,0.14)] hover:shadow-sm"
                    style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.06)" }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {item.productName}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[12px] font-semibold tabular-nums tracking-[-0.32px] text-[#918DF6]">
                            +{item.keysAdded} {locale === "en" ? "keys" : "개"}
                          </span>
                          <span className="text-[#CCCCCC]">·</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${keyTypeBadgeStyles[item.keyType]}`}>
                            {locale === "en" ? keyTypeLabels[item.keyType] : { key: t.keyTypeKeyCode, link: t.keyTypeLink, file: t.keyTypeFile, image: t.keyTypeImage, subscription: t.keyTypeSubscription }[item.keyType]}
                          </span>
                          <span className="text-[#CCCCCC]">·</span>
                          <span className="text-[11px] tracking-[-0.32px] text-[#999999]">
                            {item.source}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                          {item.timestamp}
                        </p>
                        <p className="mt-0.5 text-[10px] tracking-[-0.32px] text-[#CCCCCC]">
                          {item.addedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chargeSentinelRef} className="h-1 shrink-0" />
                {chargeLoading && (
                  <div className="flex justify-center py-2">
                    <Loader2 className="size-4 animate-spin text-[#999999]" strokeWidth={2} />
                  </div>
                )}
                {allChargesLoaded && (
                  <p className="py-2 text-center text-[11px] tracking-[-0.32px] text-[#999999]">
                    {t.allEntriesLoaded.replace("{count}", String(chargeHistory.length))}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
