import { useState } from "react"
import {
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  Truck,
  KeyRound,
  Trash2,
  Crown,
  Users,
  Minus,
  Mail,
  BarChart3,
  Plus,
  UserPlus,
  Tag,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import type { Currency } from "@/shared"
import type { Locale } from "@/locale"

const translations = {
  en: {
    title: "Workspace",
    save: "Save",
    saved: "Saved!",
    saveChanges: "Save Changes",
    deliverySettings: "Delivery Settings",
    deliverySettingsDesc: "Default delivery behavior for new orders",
    defaultDeliveryChannel: "Default delivery channel",
    autoRetryFailed: "Auto-retry failed deliveries",
    autoRetryFailedDesc: "Automatically retry when delivery fails",
    retryCount: "Retry count",
    deliveryTimeout: "Delivery timeout (seconds)",
    apiKeys: "API Keys",
    apiKeysDesc: "Manage your API credentials",
    copyKey: "Copy key",
    regenerate: "Regenerate",
    regenerated: "Regenerated!",
    planManagement: "Plan Management",
    planManagementDesc: "Manage your subscription and billing",
    currentPlan: "Current Plan",
    nextBilling: "Next billing:",
    monthlyCost: "Monthly cost",
    changePlan: "Change Plan",
    paymentMethod: "Payment method",
    visaEnding: "Visa ending in 4242",
    change: "Change",
    team: "Team",
    teamDesc: "Manage members and invitations",
    memberSeats: "Member seats",
    seatsUsed: "of 5 seats used",
    nameCol: "Name",
    emailCol: "Email",
    roleCol: "Role",
    inviteMember: "Invite Member",
    inviteMemberDesc: "Add a new member to your workspace.",
    emailInvite: "Email Invite",
    guestUser: "Guest User",
    emailAddress: "Email address",
    role: "Role",
    cancel: "Cancel",
    sendInvite: "Send Invite",
    username: "Username",
    password: "Password",
    guestRoleDesc: "Guest users have limited access and cannot manage workspace settings.",
    createGuest: "Create Guest",
    inviteSent: "Invite Sent",
    inviteSentDesc: "An invitation email has been sent to",
    pendingAcceptance: "Pending acceptance",
    inviteExpireNote: "The invite link will expire in 7 days. You can resend it from the members list.",
    inviteAnother: "Invite Another",
    done: "Done",
    guestAccountCreated: "Guest Account Created",
    guestAccountCreatedDesc: "Share the login details below with the guest user.",
    loginDetails: "LOGIN DETAILS",
    loginUrl: "Login URL",
    usernameLabel: "Username",
    passwordLabel: "Password",
    credentialWarning: "Make sure to save or share these credentials now. The password cannot be retrieved later.",
    createAnother: "Create Another",
    status: "Status",
    usageQuota: "Usage & Quota",
    usageQuotaDesc: "Resource consumption this billing cycle",
    ordersProcessed: "Orders processed",
    keysDelivered: "Keys delivered",
    apiCalls: "API calls",
    storage: "Storage",
    dangerZone: "Danger Zone",
    dangerZoneDesc: "Irreversible actions",
    deleteWorkspace: "Delete workspace",
    deleteWorkspaceDesc: "Permanently delete this workspace and all its data",
    deleteWorkspaceBtn: "Delete Workspace",
    deleteWorkspaceTitle: "Delete Workspace",
    deleteWorkspaceWarning: "This action is permanent and cannot be undone. All data, API keys, and delivery history will be lost.",
    typeToConfirm: "Type",
    toConfirm: "to confirm",
    deleteConfirmText: "delete my workspace",
    removeMember: "Remove Member",
    removeConfirmDesc: "'s access to this workspace. This action cannot be undone.",
    thisWillRevoke: "This will revoke",
    changeRole: "Change Role",
    changeRoleDesc: "'s role in this workspace",
    updateRole: "Update",
    currentRole: "Current role",
    newRole: "New role",
    monthly: "Monthly",
    yearly: "Yearly",
    save20: "Save 20%",
    choosePlan: "Choose the plan that fits your business",
    current: "Current",
    upgrade: "Upgrade",
    downgrade: "Downgrade",
    contactSales: "Contact Sales",
    havePromoCode: "Have a promo code?",
    enterCode: "Enter code",
    apply: "Apply",
    applied: "applied — 30% off",
    workspaceName: "Workspace name",
    liveApiKey: "Live API Key",
    testApiKey: "Test API Key",
  },
  kr: {
    title: "워크스페이스",
    save: "저장",
    saved: "저장됨!",
    saveChanges: "변경사항 저장",
    deliverySettings: "배송 설정",
    deliverySettingsDesc: "신규 주문의 기본 배송 동작",
    defaultDeliveryChannel: "기본 배송 채널",
    autoRetryFailed: "실패한 배송 자동 재시도",
    autoRetryFailedDesc: "배송 실패 시 자동으로 재시도합니다",
    retryCount: "재시도 횟수",
    deliveryTimeout: "배송 타임아웃 (초)",
    apiKeys: "API 키",
    apiKeysDesc: "API 인증 정보를 관리합니다",
    copyKey: "키 복사",
    regenerate: "재생성",
    regenerated: "재생성됨!",
    planManagement: "플랜 관리",
    planManagementDesc: "구독 및 결제를 관리합니다",
    currentPlan: "현재 플랜",
    nextBilling: "다음 결제일:",
    monthlyCost: "월 비용",
    changePlan: "플랜 변경",
    paymentMethod: "결제 수단",
    visaEnding: "Visa ****4242",
    change: "변경",
    team: "팀",
    teamDesc: "멤버 및 초대를 관리합니다",
    memberSeats: "멤버 좌석",
    seatsUsed: "/ 5석 사용 중",
    nameCol: "이름",
    emailCol: "이메일",
    roleCol: "역할",
    inviteMember: "멤버 초대",
    inviteMemberDesc: "워크스페이스에 새 멤버를 추가합니다.",
    emailInvite: "이메일 초대",
    guestUser: "게스트 사용자",
    emailAddress: "이메일 주소",
    role: "역할",
    cancel: "취소",
    sendInvite: "초대 보내기",
    username: "사용자명",
    password: "비밀번호",
    guestRoleDesc: "게스트 사용자는 제한된 접근 권한을 가지며 워크스페이스 설정을 관리할 수 없습니다.",
    createGuest: "게스트 생성",
    inviteSent: "초대 발송됨",
    inviteSentDesc: "초대 이메일이 발송되었습니다",
    pendingAcceptance: "수락 대기 중",
    inviteExpireNote: "초대 링크는 7일 후 만료됩니다. 멤버 목록에서 재발송할 수 있습니다.",
    inviteAnother: "다른 멤버 초대",
    done: "완료",
    guestAccountCreated: "게스트 계정 생성됨",
    guestAccountCreatedDesc: "아래 로그인 정보를 게스트 사용자에게 공유하세요.",
    loginDetails: "로그인 정보",
    loginUrl: "로그인 URL",
    usernameLabel: "사용자명",
    passwordLabel: "비밀번호",
    credentialWarning: "이 인증 정보를 지금 저장하거나 공유하세요. 비밀번호는 나중에 다시 확인할 수 없습니다.",
    createAnother: "다른 계정 생성",
    status: "상태",
    usageQuota: "사용량 & 할당량",
    usageQuotaDesc: "이번 결제 주기의 리소스 사용량",
    ordersProcessed: "처리된 주문",
    keysDelivered: "배송된 키",
    apiCalls: "API 호출",
    storage: "스토리지",
    dangerZone: "위험 영역",
    dangerZoneDesc: "되돌릴 수 없는 작업",
    deleteWorkspace: "워크스페이스 삭제",
    deleteWorkspaceDesc: "이 워크스페이스와 모든 데이터를 영구적으로 삭제합니다",
    deleteWorkspaceBtn: "워크스페이스 삭제",
    deleteWorkspaceTitle: "워크스페이스 삭제",
    deleteWorkspaceWarning: "이 작업은 영구적이며 되돌릴 수 없습니다. 모든 데이터, API 키, 배송 이력이 삭제됩니다.",
    typeToConfirm: "확인하려면",
    toConfirm: "을(를) 입력하세요",
    deleteConfirmText: "delete my workspace",
    removeMember: "멤버 제거",
    removeConfirmDesc: "의 워크스페이스 접근 권한을 해제합니다. 이 작업은 되돌릴 수 없습니다.",
    thisWillRevoke: "",
    changeRole: "역할 변경",
    changeRoleDesc: "의 워크스페이스 역할을 변경합니다",
    updateRole: "변경",
    currentRole: "현재 역할",
    newRole: "새 역할",
    monthly: "월간",
    yearly: "연간",
    save20: "20% 절약",
    choosePlan: "비즈니스에 맞는 플랜을 선택하세요",
    current: "현재",
    upgrade: "업그레이드",
    downgrade: "다운그레이드",
    contactSales: "영업팀 문의",
    havePromoCode: "프로모션 코드가 있으신가요?",
    enterCode: "코드 입력",
    apply: "적용",
    applied: "적용됨 — 30% 할인",
    workspaceName: "워크스페이스 이름",
    liveApiKey: "라이브 API 키",
    testApiKey: "테스트 API 키",
  },
} as const

interface Member {
  name: string
  email: string
  role: string
  color: string
  initials: string
}

type ConfirmAction =
  | { type: "remove"; member: Member }
  | { type: "role-change"; member: Member; newRole: string }

type PlanName = "Free" | "Pro" | "Enterprise"

const PLAN_ORDER: PlanName[] = ["Free", "Pro", "Enterprise"]

const deliveryChannels = ["Email", "Telegram", "SMS", "WhatsApp", "KakaoTalk"]

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200"
      style={{ backgroundColor: checked ? "#918DF6" : "rgba(0,0,0,0.15)" }}
    >
      <span
        className="pointer-events-none inline-block size-[18px] rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
      />
    </button>
  )
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  danger,
}: {
  icon: typeof Users
  title: string
  description: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-xl bg-white ${
        danger
          ? "border-2 border-[#D93025]/20 bg-[#D93025]/[0.02]"
          : "border border-[rgba(0,0,0,0.08)]"
      }`}
      style={
        danger
          ? undefined
          : { boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }
      }
    >
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: danger ? "rgba(217,48,37,0.08)" : "rgba(145,141,246,0.08)",
          }}
        >
          <Icon
            className="size-4"
            style={{ color: danger ? "#D93025" : "#918DF6" }}
            strokeWidth={2}
          />
        </span>
        <div>
          <h2 className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{title}</h2>
          <p className="text-[13px] tracking-[-0.32px] text-[#999999]">{description}</p>
        </div>
      </div>
      <div className="h-px bg-[rgba(0,0,0,0.08)]" />
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

export default function Workspace({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale]
  const [currency, setCurrency] = useState<Currency>("KRW")

  const [defaultChannel, setDefaultChannel] = useState("Email")
  const [autoRetry, setAutoRetry] = useState(true)
  const [retryCount, setRetryCount] = useState("3")
  const [deliveryTimeout, setDeliveryTimeout] = useState("30")

  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [apiKeys] = useState([
    { id: "live", label: t.liveApiKey, key: "mont_live_sk_••••••••••••7f3m" },
    { id: "test", label: t.testApiKey, key: "mont_test_sk_••••••••••••a2k9" },
  ])

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const [yearlyBilling, setYearlyBilling] = useState(false)
  const [currentPlan] = useState<PlanName>("Pro")
  const [, setPlanChangeTarget] = useState<PlanName | null>(null)
  const [showPlanPicker, setShowPlanPicker] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoOpen, setPromoOpen] = useState(false)

  const [members, setMembers] = useState<Member[]>([
    { name: "Yuchan", email: "yuchan@vexora.team", role: "Owner", color: "#918DF6", initials: "YC" },
    { name: "Minji", email: "minji@vexora.team", role: "Admin", color: "#F59E0B", initials: "MJ" },
  ])
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [roleChangeSelection, setRoleChangeSelection] = useState("")

  const [workspaceName, setWorkspaceName] = useState("Vexora Store")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Admin")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteTab, setInviteTab] = useState<"email" | "guest">("email")
  const [guestName, setGuestName] = useState("")
  const [guestPassword, setGuestPassword] = useState("")
  const [inviteResult, setInviteResult] = useState<{ type: "email"; email: string; role: string } | { type: "guest"; username: string; password: string; loginUrl: string } | null>(null)
  const [guestRole, setGuestRole] = useState("Viewer")

  const [savedSection, setSavedSection] = useState<string | null>(null)

  const handleSave = (section: string) => {
    setSavedSection(section)
    setTimeout(() => setSavedSection(null), 1500)
  }

  const handleCopyKey = (id: string, key: string) => {
    void navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  return (
    <DashboardLayout
      title={t.title}
      locale={locale}
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#918DF6] to-[#6C63FF] text-[16px] font-bold text-white"
            >
              {workspaceName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-[20px] font-bold tracking-[-0.32px] text-[#181925] outline-none transition-colors placeholder:text-[#999999] hover:border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.02)] focus:border-[#918DF6] focus:bg-white focus:ring-2 focus:ring-[rgba(145,141,246,0.15)]"
                placeholder={t.workspaceName}
              />
              <p className="text-[13px] tracking-[-0.32px] text-[#999999]">vexora.mont.app</p>
            </div>
            <button
              onClick={() => handleSave("workspace-name")}
              className="flex h-8 shrink-0 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
            >
              {savedSection === "workspace-name" ? (
                <span className="flex items-center gap-1.5">
                  <Check className="size-3.5" strokeWidth={2.5} />
                  {t.saved}
                </span>
              ) : (
                t.save
              )}
            </button>
          </div>

          <SectionCard icon={Truck} title={t.deliverySettings} description={t.deliverySettingsDesc}>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                  {t.defaultDeliveryChannel}
                </label>
                <div className="relative">
                  <select
                    value={defaultChannel}
                    onChange={(e) => setDefaultChannel(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                  >
                    {deliveryChannels.map((ch) => (
                      <option key={ch} value={ch}>
                        {ch}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
                </div>
              </div>

              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                    {t.autoRetryFailed}
                  </p>
                  <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                    {t.autoRetryFailedDesc}
                  </p>
                </div>
                <Toggle checked={autoRetry} onChange={setAutoRetry} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    {t.retryCount}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={retryCount}
                    onChange={(e) => setRetryCount(e.target.value)}
                    disabled={!autoRetry}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] outline-none disabled:opacity-40"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                    {t.deliveryTimeout}
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={deliveryTimeout}
                    onChange={(e) => setDeliveryTimeout(e.target.value)}
                    className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tabular-nums tracking-[-0.32px] text-[#181925] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave("delivery")}
                  className="flex h-8 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                >
                  {savedSection === "delivery" ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="size-3.5" strokeWidth={2.5} />
                      {t.saved}
                    </span>
                  ) : (
                    t.saveChanges
                  )}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={KeyRound} title={t.apiKeys} description={t.apiKeysDesc}>
            <div className="flex flex-col gap-3">
              {apiKeys.map((ak) => (
                <div
                  key={ak.id}
                  className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] px-4 py-3"
                >
                  <div>
                    <p className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {ak.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[13px] tracking-[0.5px] text-[#181925]">
                      {ak.key}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyKey(ak.id, ak.key)}
                      className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                      title={t.copyKey}
                    >
                      {copiedKey === ak.id ? (
                        <Check className="size-3.5 text-[#34A853]" strokeWidth={2.5} />
                      ) : (
                        <Copy className="size-3.5 text-[#999999]" strokeWidth={2} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSave(`key-${ak.id}`)}
                      className="flex h-7 items-center gap-1 rounded-full border border-[rgba(0,0,0,0.12)] px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    >
                      <RefreshCw className="size-3" strokeWidth={2} />
                      {savedSection === `key-${ak.id}` ? t.regenerated : t.regenerate}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Crown} title={t.planManagement} description={t.planManagementDesc}>
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{t.currentPlan}</p>
                  <span className="inline-flex items-center rounded-full bg-[rgba(145,141,246,0.1)] px-2.5 py-0.5 text-[12px] font-semibold tracking-[-0.32px] text-[#918DF6]">
                    {currentPlan}
                  </span>
                </div>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  {t.nextBilling} <span className="tabular-nums text-[#666666]">May 28, 2026</span>
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.monthlyCost}</p>
                  <p className="mt-0.5 text-[18px] font-bold tabular-nums tracking-[-0.5px] text-[#181925]">
                    ${yearlyBilling ? 23 : 29}<span className="text-[12px] font-normal tracking-[-0.32px] text-[#999999]">/mo</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowPlanPicker(true)}
                  className="flex h-8 items-center rounded-full border border-[rgba(0,0,0,0.12)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                >
                  {t.changePlan}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)] px-4 py-3">
                <div>
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.paymentMethod}</p>
                  <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#181925]">{t.visaEnding}</p>
                </div>
                <button className="flex h-7 items-center rounded-full border border-[rgba(0,0,0,0.12)] px-2.5 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">
                  {t.change}
                </button>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Users} title={t.team} description={t.teamDesc}>
            <div className="flex flex-col gap-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{t.memberSeats}</p>
                  <p className="text-[12px] tabular-nums tracking-[-0.32px] text-[#666666]">{members.length} {t.seatsUsed}</p>
                </div>
                <div className="h-[6px] w-full rounded-full bg-[rgba(0,0,0,0.06)]">
                  <div className="h-full rounded-full bg-[#918DF6]" style={{ width: `${(members.length / 5) * 100}%` }} />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-x-4 border-b border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.02)] px-4 py-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#999999]">{t.nameCol}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#999999]">{t.emailCol}</span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.5px] text-[#999999]">{t.roleCol}</span>
                  <span className="w-8" />
                </div>
                {members.map((member, idx) => (
                  <div
                    key={member.email}
                    className={`grid grid-cols-[1fr_1fr_auto_auto] items-center gap-x-4 px-4 py-3 ${
                      idx < members.length - 1 ? "border-b border-[rgba(0,0,0,0.06)]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.initials}
                      </div>
                      <span className="truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{member.name}</span>
                    </div>
                    <span className="truncate text-[12px] tracking-[-0.32px] text-[#999999]">{member.email}</span>
                    {member.role === "Owner" ? (
                      <span className="rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 py-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666]">
                        {member.role}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setRoleChangeSelection(member.role)
                          setConfirmAction({ type: "role-change", member, newRole: member.role })
                        }}
                        className="cursor-pointer rounded-full border border-[rgba(0,0,0,0.08)] px-2.5 py-0.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:border-[rgba(0,0,0,0.2)] hover:bg-[rgba(0,0,0,0.03)]"
                      >
                        {member.role}
                      </button>
                    )}
                    {member.role === "Owner" ? (
                      <span className="w-8" />
                    ) : (
                      <button
                        onClick={() => setConfirmAction({ type: "remove", member })}
                        className="flex size-8 items-center justify-center rounded-lg text-[#999999] transition-colors hover:bg-[rgba(217,48,37,0.06)] hover:text-[#D93025]"
                      >
                        <Trash2 className="size-3.5" strokeWidth={2} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setInviteDialogOpen(true); setInviteTab("email") }}
                className="flex h-8 items-center gap-1.5 rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
              >
                <Plus className="size-3.5" strokeWidth={2.5} />
                {t.inviteMember}
              </button>
            </div>
          </SectionCard>

          <Dialog open={inviteDialogOpen} onOpenChange={(open) => { if (!open) { setInviteDialogOpen(false); setInviteEmail(""); setGuestName(""); setGuestPassword(""); setInviteRole("Admin"); setGuestRole("Viewer"); setInviteResult(null) } }}>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {t.inviteMember}
                </DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  {t.inviteMemberDesc}
                </DialogDescription>
              </DialogHeader>

              {inviteResult ? (
                inviteResult.type === "email" ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-5">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#34A853]/10">
                        <Check className="size-5 text-[#34A853]" strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{t.inviteSent}</p>
                        <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                          {t.inviteSentDesc}
                        </p>
                        <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#918DF6]">{inviteResult.email}</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-[rgba(0,0,0,0.02)] px-3 py-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{t.role}</span>
                        <span className="text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{inviteResult.role}</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{t.status}</span>
                        <span className="text-[12px] font-medium tracking-[-0.32px] text-[#E37400]">{t.pendingAcceptance}</span>
                      </div>
                    </div>
                    <p className="text-[11px] tracking-[-0.32px] text-[#999999]">
                      {t.inviteExpireNote}
                    </p>
                    <DialogFooter>
                      <button
                        onClick={() => setInviteResult(null)}
                        className="flex h-9 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                      >
                        {t.inviteAnother}
                      </button>
                      <button
                        onClick={() => { setInviteDialogOpen(false); setInviteResult(null) }}
                        className="flex h-9 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                      >
                        {t.done}
                      </button>
                    </DialogFooter>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-5">
                      <div className="flex size-10 items-center justify-center rounded-full bg-[#34A853]/10">
                        <UserPlus className="size-5 text-[#34A853]" strokeWidth={2} />
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{t.guestAccountCreated}</p>
                        <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                          {t.guestAccountCreatedDesc}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-3">
                      <p className="mb-2 text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{t.loginDetails}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{t.loginUrl}</span>
                          <a href={inviteResult.loginUrl} className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline">{inviteResult.loginUrl}</a>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{t.usernameLabel}</span>
                          <span className="font-mono text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{inviteResult.username}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] tracking-[-0.32px] text-[#666666]">{t.passwordLabel}</span>
                          <span className="font-mono text-[12px] font-medium tracking-[-0.32px] text-[#181925]">{inviteResult.password}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[rgba(227,116,0,0.15)] bg-[rgba(227,116,0,0.04)] px-3 py-2">
                      <p className="text-[11px] tracking-[-0.32px] text-[#E37400]">
                        {t.credentialWarning}
                      </p>
                    </div>
                    <DialogFooter>
                      <button
                        onClick={() => setInviteResult(null)}
                        className="flex h-9 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                      >
                        {t.createAnother}
                      </button>
                      <button
                        onClick={() => { setInviteDialogOpen(false); setInviteResult(null) }}
                        className="flex h-9 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                      >
                        {t.done}
                      </button>
                    </DialogFooter>
                  </div>
                )
              ) : (
              <>
              <div className="flex gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-1">
                <button
                  onClick={() => setInviteTab("email")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                    inviteTab === "email"
                      ? "bg-white text-[#918DF6] shadow-sm"
                      : "text-[#666666] hover:text-[#181925]"
                  }`}
                >
                  <Mail className="size-3.5" strokeWidth={2} />
                  {t.emailInvite}
                </button>
                <button
                  onClick={() => setInviteTab("guest")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium tracking-[-0.32px] transition-colors ${
                    inviteTab === "guest"
                      ? "bg-white text-[#918DF6] shadow-sm"
                      : "text-[#666666] hover:text-[#181925]"
                  }`}
                >
                  <UserPlus className="size-3.5" strokeWidth={2} />
                  {t.guestUser}
                </button>
              </div>

              {inviteTab === "email" ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {t.emailAddress}
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-8 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {t.role}
                    </label>
                    <div className="relative">
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value)}
                        className="h-9 w-full appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Member">Member</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      onClick={() => { setInviteDialogOpen(false); setInviteEmail(""); setInviteRole("Admin") }}
                      className="flex h-9 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        if (!inviteEmail.trim()) return
                        const initials = inviteEmail.slice(0, 2).toUpperCase()
                        const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"]
                        setMembers((prev) => [...prev, { name: inviteEmail.split("@")[0] ?? inviteEmail, email: inviteEmail.trim(), role: inviteRole, color: colors[prev.length % colors.length] ?? "#918DF6", initials }])
                        handleSave("invite")
                        setInviteResult({ type: "email", email: inviteEmail.trim(), role: inviteRole })
                        setInviteEmail("")
                        setInviteRole("Admin")
                      }}
                      disabled={!inviteEmail.trim()}
                      className="flex h-9 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.sendInvite}
                    </button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {t.username}
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. guest_partner"
                      className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {t.password}
                    </label>
                    <input
                      type="text"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      placeholder="Set a password for this account"
                      className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                      {t.role}
                    </label>
                    <div className="relative">
                      <select
                        value={guestRole}
                        onChange={(e) => setGuestRole(e.target.value)}
                        className="h-9 w-full appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Member">Member</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
                    </div>
                    <p className="mt-1.5 text-[11px] tracking-[-0.32px] text-[#999999]">
                      {t.guestRoleDesc}
                    </p>
                  </div>
                  <DialogFooter>
                    <button
                      onClick={() => { setInviteDialogOpen(false); setGuestName(""); setGuestPassword(""); setGuestRole("Viewer") }}
                      className="flex h-9 items-center rounded-full border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        if (!guestName.trim() || !guestPassword.trim()) return
                        const initials = guestName.trim().slice(0, 2).toUpperCase()
                        const guestEmail = `${guestName.trim().toLowerCase().replace(/\s+/g, ".")}@guest.mont.app`
                        const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"]
                        setMembers((prev) => [...prev, { name: guestName.trim(), email: guestEmail, role: guestRole, color: colors[prev.length % colors.length] ?? "#918DF6", initials: initials || "G" }])
                        handleSave("invite")
                        setInviteResult({ type: "guest", username: guestName.trim(), password: guestPassword.trim(), loginUrl: "https://mont.app/login" })
                        setGuestName("")
                        setGuestPassword("")
                        setGuestRole("Viewer")
                      }}
                      disabled={!guestName.trim() || !guestPassword.trim()}
                      className="flex h-9 items-center rounded-full bg-[#918DF6] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.createGuest}
                    </button>
                  </DialogFooter>
                </div>
              )}
              </>
              )}
            </DialogContent>
          </Dialog>

          <SectionCard icon={BarChart3} title={t.usageQuota} description={t.usageQuotaDesc}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {([
                { label: t.ordersProcessed, value: "2,847", limit: "Unlimited", percent: 100 },
                { label: t.keysDelivered, value: "2,831", limit: "Unlimited", percent: 100 },
                { label: t.apiCalls, value: "12,450", limit: "50,000", percent: 24.9 },
                { label: t.storage, value: "1.2 GB", limit: "5 GB", percent: 24 },
              ] as const).map((stat) => {
                const barColor = stat.percent > 80 ? "#D93025" : stat.percent > 50 ? "#F59E0B" : "#34A853"
                return (
                  <div key={stat.label} className="rounded-lg border border-[rgba(0,0,0,0.06)] bg-[rgba(0,0,0,0.015)] px-3.5 py-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[12px] font-medium tracking-[-0.32px] text-[#666666]">{stat.label}</span>
                      <span className="text-[11px] tabular-nums tracking-[-0.32px] text-[#999999]">
                        {stat.percent < 100 ? `${stat.percent}%` : "∞"}
                      </span>
                    </div>
                    <div className="mb-1.5 h-[6px] w-full rounded-full bg-[rgba(0,0,0,0.06)]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(stat.percent, 100)}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <p className="text-[12px] tabular-nums tracking-[-0.32px] text-[#181925]">
                      {stat.value} <span className="text-[#999999]">/ {stat.limit}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          </SectionCard>

          <SectionCard icon={Trash2} title={t.dangerZone} description={t.dangerZoneDesc} danger>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                  {t.deleteWorkspace}
                </p>
                <p className="text-[12px] tracking-[-0.32px] text-[#999999]">
                  {t.deleteWorkspaceDesc}
                </p>
              </div>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex h-8 items-center gap-1.5 rounded-full border border-[#D93025]/25 bg-[#D93025]/[0.06] px-4 text-[13px] font-semibold tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/10"
              >
                <Trash2 className="size-3.5" strokeWidth={2} />
                {t.deleteWorkspaceBtn}
              </button>
            </div>
          </SectionCard>
        </div>
      </div>

      <Dialog
        open={showPlanPicker}
        onOpenChange={(open: boolean) => {
          if (!open) { setShowPlanPicker(false); setPromoCode(""); setPromoApplied(false); setPromoOpen(false) }
        }}
      >
        <DialogContent className="sm:max-w-[640px]" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
              {t.changePlan}
            </DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
              {t.choosePlan}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-center gap-2">
              <span className={`text-[13px] font-medium tracking-[-0.32px] ${!yearlyBilling ? "text-[#181925]" : "text-[#999999]"}`}>{t.monthly}</span>
              <Toggle checked={yearlyBilling} onChange={setYearlyBilling} />
              <span className={`text-[13px] font-medium tracking-[-0.32px] ${yearlyBilling ? "text-[#181925]" : "text-[#999999]"}`}>{t.yearly}</span>
              {yearlyBilling && (
                <span className="ml-1 rounded-full bg-[#34A853]/10 px-2 py-0.5 text-[11px] font-semibold tracking-[-0.32px] text-[#34A853]">
                  {t.save20}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {([
                {
                  name: "Free" as PlanName,
                  price: 0,
                  yearlyPrice: 0,
                  features: [
                    { text: "1 platform", available: true },
                    { text: "100 orders/mo", available: true },
                    { text: "Email delivery only", available: true },
                    { text: "Community support", available: true },
                    { text: "API access", available: false },
                    { text: "Priority support", available: false },
                  ],
                },
                {
                  name: "Pro" as PlanName,
                  price: 29,
                  yearlyPrice: 23,
                  features: [
                    { text: "3 platforms", available: true },
                    { text: "Unlimited orders", available: true },
                    { text: "All delivery channels", available: true },
                    { text: "Priority support", available: true },
                    { text: "API access", available: true },
                    { text: "Custom integrations", available: false },
                  ],
                },
                {
                  name: "Enterprise" as PlanName,
                  price: 99,
                  yearlyPrice: 79,
                  features: [
                    { text: "Unlimited platforms", available: true },
                    { text: "Unlimited orders", available: true },
                    { text: "All channels", available: true },
                    { text: "Dedicated support", available: true },
                    { text: "Custom integrations", available: true },
                    { text: "SLA guarantee", available: true },
                  ],
                },
              ]).map((plan) => {
                const isCurrent = plan.name === currentPlan
                const planIdx = PLAN_ORDER.indexOf(plan.name)
                const currentIdx = PLAN_ORDER.indexOf(currentPlan)
                const isUpgrade = planIdx > currentIdx
                const isDowngrade = planIdx < currentIdx

                return (
                  <div
                    key={plan.name}
                    className={`relative flex flex-col rounded-xl border p-4 ${
                      isCurrent
                        ? "border-[rgba(0,0,0,0.08)] bg-[rgba(145,141,246,0.03)]"
                        : "border-[rgba(0,0,0,0.08)] bg-white"
                    }`}
                    style={isCurrent ? { borderLeftWidth: 3, borderLeftColor: "#918DF6" } : undefined}
                  >
                    <p className="text-[14px] font-semibold tracking-[-0.32px] text-[#181925]">{plan.name}</p>
                    <div className="mt-1 flex items-baseline gap-1">
                      {promoApplied && plan.price > 0 ? (
                        <>
                          <span className="text-[24px] font-bold tabular-nums tracking-[-0.5px] text-[#22C55E]">
                            ${Math.round((yearlyBilling ? plan.yearlyPrice : plan.price) * 0.7)}
                          </span>
                          <span className="text-[14px] tabular-nums tracking-[-0.32px] text-[#999999] line-through">
                            ${yearlyBilling ? plan.yearlyPrice : plan.price}
                          </span>
                          <span className="text-[12px] tracking-[-0.32px] text-[#999999]">/mo</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[24px] font-bold tabular-nums tracking-[-0.5px] text-[#181925]">
                            ${yearlyBilling ? plan.yearlyPrice : plan.price}
                          </span>
                          <span className="text-[12px] tracking-[-0.32px] text-[#999999]">/mo</span>
                        </>
                      )}
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5">
                      {plan.features.map((f) => (
                        <div key={f.text} className="flex items-center gap-2">
                          {f.available ? (
                            <Check className="size-3.5 shrink-0 text-[#34A853]" strokeWidth={2.5} />
                          ) : (
                            <Minus className="size-3.5 shrink-0 text-[#999999]" strokeWidth={2} />
                          )}
                          <span className={`text-[12px] tracking-[-0.32px] ${f.available ? "text-[#181925]" : "text-[#999999]"}`}>
                            {f.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      {isCurrent ? (
                        <button className="flex h-8 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.12)] text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                          <Check className="size-3.5" strokeWidth={2.5} />
                          {t.current}
                        </button>
                      ) : plan.name === "Enterprise" && isUpgrade ? (
                        <button
                          onClick={() => setShowPlanPicker(false)}
                          className="flex h-8 w-full items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                        >
                          {t.contactSales}
                        </button>
                      ) : isUpgrade ? (
                        <button
                          onClick={() => { setPlanChangeTarget(plan.name); setShowPlanPicker(false) }}
                          className="flex h-8 w-full items-center justify-center rounded-full bg-[#918DF6] text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                        >
                          {t.upgrade}
                        </button>
                      ) : isDowngrade ? (
                        <button
                          onClick={() => { setPlanChangeTarget(plan.name); setShowPlanPicker(false) }}
                          className="flex h-8 w-full items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                        >
                          {t.downgrade}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>

            <div>
              {promoApplied ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#22C55E]/[0.08] py-2.5">
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#22C55E]">
                    <Check className="size-2.5 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-[13px] font-medium tracking-[-0.32px] text-[#22C55E]">
                    {promoCode.toUpperCase()} {t.applied}
                  </span>
                </div>
              ) : !promoOpen ? (
                <button
                  type="button"
                  onClick={() => setPromoOpen(true)}
                  className="flex w-full items-center justify-center gap-1.5 py-1 text-[13px] tracking-[-0.32px] text-[#999999] transition-colors hover:text-[#666666]"
                >
                  <Tag className="size-3.5" strokeWidth={2} />
                  {t.havePromoCode}
                </button>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && promoCode.trim()) setPromoApplied(true) }}
                    placeholder={t.enterCode}
                    className="h-9 flex-1 rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                    disabled={!promoCode.trim()}
                    className="h-9 rounded-lg bg-[#181925] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d] disabled:opacity-40"
                  >
                    {t.apply}
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeleteDialog}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setShowDeleteDialog(false)
            setDeleteConfirmText("")
          }
        }}
      >
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
              {t.deleteWorkspaceTitle}
            </DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
              {t.deleteWorkspaceWarning}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 rounded-lg border border-[#D93025]/15 bg-[#D93025]/[0.04] px-3 py-2.5">
              <AlertTriangle className="size-4 shrink-0 text-[#D93025]" strokeWidth={2} />
              <p className="text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">
                {t.typeToConfirm} <span className="font-semibold text-[#D93025]">{t.deleteConfirmText}</span> {t.toConfirm}
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="delete my workspace"
              className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText("") }}
                className="rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
              >
                {t.cancel}
              </button>
              <button
                disabled={deleteConfirmText !== "delete my workspace"}
                onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText("") }}
                className="rounded-full bg-[#D93025] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#C12B20] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {t.deleteWorkspaceBtn}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmAction?.type === "remove"}
        onOpenChange={(open: boolean) => {
          if (!open) setConfirmAction(null)
        }}
      >
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
              {t.removeMember} {confirmAction?.type === "remove" ? confirmAction.member.name : ""}?
            </DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
              {t.thisWillRevoke}{confirmAction?.type === "remove" ? confirmAction.member.name : ""}{t.removeConfirmDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setConfirmAction(null)}
              className="rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
            >
              {t.cancel}
            </button>
            <button
              onClick={() => {
                if (confirmAction?.type === "remove") {
                  setMembers((prev) => prev.filter((m) => m.email !== confirmAction.member.email))
                }
                setConfirmAction(null)
              }}
              className="rounded-full bg-[#D93025] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#C12B20]"
            >
              {t.removeMember}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmAction?.type === "role-change"}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setConfirmAction(null)
            setRoleChangeSelection("")
          }
        }}
      >
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-[18px] font-bold tracking-[-0.32px] text-[#181925]">
              {t.changeRole}
            </DialogTitle>
            <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#666666]">
              {t.updateRole} {confirmAction?.type === "role-change" ? confirmAction.member.name : ""}{t.changeRoleDesc}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                {t.currentRole}
              </label>
              <p className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">
                {confirmAction?.type === "role-change" ? confirmAction.member.role : ""}
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium tracking-[-0.32px] text-[#666666]">
                {t.newRole}
              </label>
              <div className="relative">
                <select
                  value={roleChangeSelection}
                  onChange={(e) => setRoleChangeSelection(e.target.value)}
                  className="h-9 w-full appearance-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 pr-8 text-[13px] tracking-[-0.32px] text-[#181925] outline-none"
                >
                  {["Admin", "Member", "Viewer"].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setConfirmAction(null)
                  setRoleChangeSelection("")
                }}
                className="rounded-full border border-[rgba(0,0,0,0.12)] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
              >
                {t.cancel}
              </button>
              <button
                disabled={confirmAction?.type === "role-change" && roleChangeSelection === confirmAction.member.role}
                onClick={() => {
                  if (confirmAction?.type === "role-change") {
                    setMembers((prev) =>
                      prev.map((m) =>
                        m.email === confirmAction.member.email ? { ...m, role: roleChangeSelection } : m
                      )
                    )
                  }
                  setConfirmAction(null)
                  setRoleChangeSelection("")
                }}
                className="rounded-full bg-[#918DF6] px-4 py-1.5 text-[13px] font-semibold tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.changeRole}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
