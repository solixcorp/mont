import { useState, useRef, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Database,
  KeyRound,
  BarChart3,
  Settings,
  Menu,
  ChevronDown,
  Store,
  Check,
  Plus,
  Building2,
  Users,
  Send,
  Unplug,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import GlobalSearch from "@/GlobalSearch"
import type { Currency } from "@/shared"
import { LocaleProvider, type Locale } from "@/locale"

const navItemsEn = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
  { label: "Products", icon: Package, href: "/dashboard/products" },
  { label: "Inventory", icon: Database, href: "/dashboard/inventory" },
  { label: "Licenses", icon: KeyRound, href: "/dashboard/licenses" },
  { label: "Providers", icon: Unplug, href: "/dashboard/providers" },
  { label: "Customers", icon: Users, href: "/dashboard/customers" },
  { label: "Merchants", icon: Store, href: "/dashboard/merchants" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Channels", icon: Send, href: "/dashboard/channels" },
  { label: "Workspace", icon: Building2, href: "/dashboard/workspace" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

const navItemsKr = [
  { label: "개요", icon: LayoutDashboard, href: "/kr/dashboard" },
  { label: "주문", icon: ShoppingCart, href: "/kr/dashboard/orders" },
  { label: "상품", icon: Package, href: "/kr/dashboard/products" },
  { label: "재고", icon: Database, href: "/kr/dashboard/inventory" },
  { label: "라이선스", icon: KeyRound, href: "/kr/dashboard/licenses" },
  { label: "공급사", icon: Unplug, href: "/kr/dashboard/providers" },
  { label: "고객", icon: Users, href: "/kr/dashboard/customers" },
  { label: "판매처", icon: Store, href: "/kr/dashboard/merchants" },
  { label: "분석", icon: BarChart3, href: "/kr/dashboard/analytics" },
  { label: "채널", icon: Send, href: "/kr/dashboard/channels" },
  { label: "워크스페이스", icon: Building2, href: "/kr/dashboard/workspace" },
  { label: "설정", icon: Settings, href: "/kr/dashboard/settings" },
]

type Workspace = {
  id: string
  name: string
  plan: string
  platforms: number
  color: string
}

const workspaces: Workspace[] = [
  { id: "vexora", name: "Vexora Store", plan: "Pro", platforms: 3, color: "#918DF6" },
  { id: "gamekeys", name: "GameKeys KR", plan: "Free", platforms: 1, color: "#1A73E8" },
  { id: "devshop", name: "DevShop", plan: "Pro", platforms: 2, color: "#34A853" },
]

function SidebarContent({ currentPath, activeWorkspace, onWorkspaceChange, allWorkspaces, onCreateWorkspace, locale }: { currentPath: string; activeWorkspace: Workspace; onWorkspaceChange: (ws: Workspace) => void; allWorkspaces: Workspace[]; onCreateWorkspace: () => void; locale: Locale }) {
  const navItems = locale === "kr" ? navItemsKr : navItemsEn
  const mainNav = navItems.slice(0, 7)
  const secondaryNav = navItems.slice(7)
  const [wsOpen, setWsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWsOpen(false)
      }
    }
    if (wsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wsOpen])

  const isActive = (href: string) => {
    const dashPath = locale === "kr" ? "/kr/dashboard" : "/dashboard"
    return href === dashPath ? currentPath === dashPath : currentPath.startsWith(href)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-[rgba(0,0,0,0.08)] px-5 pt-6 pb-5">
        <span className="relative flex size-7 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#918DF6]" />
          <span className="absolute top-0.5 right-0.5 size-3 rounded-full bg-[#F5F5F6]" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
          Linko
        </span>
      </div>

      <nav className="flex flex-1 flex-col px-3 pt-4">
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] transition-colors ${
                  active
                    ? "bg-[#918DF6]/[0.12] text-[#918DF6]"
                    : "text-[#666666] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                }`}
              >
                {active && (
                  <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-[#918DF6]" />
                )}
                <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="mx-3 my-3 h-px bg-[rgba(0,0,0,0.08)]" />

        <div className="flex flex-col gap-0.5">
          {secondaryNav.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium tracking-[-0.32px] transition-colors ${
                  active
                    ? "bg-[#918DF6]/[0.12] text-[#918DF6]"
                    : "text-[#666666] hover:bg-[rgba(0,0,0,0.04)] hover:text-[#181925]"
                }`}
              >
                {active && (
                  <span className="absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-r-full bg-[#918DF6]" />
                )}
                <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-[rgba(0,0,0,0.08)] px-3 py-3">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setWsOpen(!wsOpen)}
            className="flex w-full items-center gap-3 rounded-xl border border-[rgba(0,0,0,0.08)] bg-white px-3 py-3 text-left transition-colors hover:bg-neutral-50"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: activeWorkspace.color }}>
              <span className="absolute top-1 right-1 size-3.5 rounded-full bg-white" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
                {activeWorkspace.name}
              </p>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-[#918DF6]/10 px-2 py-0.5 text-[10px] font-semibold tracking-[-0.32px] text-[#918DF6]">
                  {activeWorkspace.plan}
                </span>
                <span className="text-[11px] tracking-[-0.32px] text-[#999999]">{activeWorkspace.platforms} {locale === "kr" ? "플랫폼" : "platforms"}</span>
              </div>
            </div>
            <ChevronDown className={`size-4 shrink-0 text-[#999999] transition-transform ${wsOpen ? "rotate-180" : ""}`} />
          </button>

          {wsOpen && (
            <div
              className="absolute bottom-full left-0 z-50 mb-2 w-full rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-1.5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.02)" }}
            >
              {allWorkspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { onWorkspaceChange(ws); setWsOpen(false) }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: ws.color }}>
                    <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-white" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">{ws.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium tracking-[-0.32px] text-[#999999]">{ws.plan}</span>
                      <span className="text-[10px] tracking-[-0.32px] text-[#CCCCCC]">·</span>
                      <span className="text-[10px] tabular-nums tracking-[-0.32px] text-[#999999]">{ws.platforms} {locale === "kr" ? "플랫폼" : "platforms"}</span>
                    </div>
                  </div>
                  {ws.id === activeWorkspace.id && (
                    <Check className="size-4 shrink-0 text-[#918DF6]" strokeWidth={2.5} />
                  )}
                </button>
              ))}
              <div className="mx-2 my-1.5 h-px bg-[rgba(0,0,0,0.06)]" />
              <button onClick={() => { onCreateWorkspace(); setWsOpen(false) }} className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-dashed border-[rgba(0,0,0,0.15)] text-[#999999]">
                  <Plus className="size-3.5" strokeWidth={2} />
                </span>
                <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">{locale === "kr" ? "워크스페이스 만들기" : "Create workspace"}</p>
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[rgba(0,0,0,0.03)]">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#918DF6] to-[#6C63FF] text-[12px] font-bold text-white">
            YC
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">
              Yuchan
            </p>
            <p className="truncate text-[12px] tracking-[-0.32px] text-[#999999]">
              yuchan@vexora.team
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
  title,
  currency,
  onCurrencyToggle,
  locale = "en",
}: {
  children: React.ReactNode
  title: string
  currency: Currency
  onCurrencyToggle: () => void
  locale?: Locale
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [allWorkspaces] = useState<Workspace[]>(workspaces)
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(workspaces[0])
  const location = useLocation()

  const navigateTo = useNavigate()

  const handleOpenCreate = () => {
    navigateTo(locale === "kr" ? "/kr/dashboard/quick-setup" : "/dashboard/quick-setup")
  }

  return (
    <LocaleProvider locale={locale}>
    <div className="flex h-svh bg-[#F7F7F8]">
      <aside className="hidden w-[240px] shrink-0 border-r border-[rgba(0,0,0,0.08)] bg-[#F5F5F6] lg:block">
          <SidebarContent currentPath={location.pathname} activeWorkspace={activeWorkspace} onWorkspaceChange={setActiveWorkspace} allWorkspaces={allWorkspaces} onCreateWorkspace={handleOpenCreate} locale={locale} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[260px] bg-[#F5F5F6] p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">{locale === "kr" ? "네비게이션" : "Navigation"}</SheetTitle>
        <SidebarContent currentPath={location.pathname} activeWorkspace={activeWorkspace} onWorkspaceChange={setActiveWorkspace} allWorkspaces={allWorkspaces} onCreateWorkspace={handleOpenCreate} locale={locale} />
        </SheetContent>
      </Sheet>

      <main className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex shrink-0 items-center justify-between border-b border-[rgba(0,0,0,0.08)] bg-[#F7F7F8]/80 px-6 py-3 backdrop-blur-sm lg:px-8"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="lg:hidden"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>
            </Sheet>
            <h1 className="text-[20px] font-bold tracking-[-0.32px] text-[#181925]">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <GlobalSearch />
            <button
              onClick={onCurrencyToggle}
              className={`flex h-8 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold tracking-[-0.32px] transition-colors ${
                currency === "KRW"
                  ? "border-[#918DF6]/30 bg-[#918DF6]/[0.08] text-[#918DF6]"
                  : "border-[rgba(0,0,0,0.08)] bg-white text-[#666666] hover:bg-[rgba(0,0,0,0.02)]"
              }`}
            >
              <span className="tabular-nums">₩</span>
              KRW
            </button>

          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-14 lg:px-24">
          {children}
        </div>
      </main>
    </div>
    </LocaleProvider>
  )
}
