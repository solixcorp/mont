import { useState, useRef, useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import {
  Copy,
  Check,
  Search,
  Loader2,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Send,
  X,
  Pencil,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import DashboardLayout from "@/DashboardLayout"
import {
  type Order,
  type Currency,
  StatusBadge,
  DeliveryChannel,
  platformBadges,
  PlatformBadgeIcon,
  deliveryChannels,
  formatUSD,
  formatKRW,
} from "@/shared"
import type { Locale } from "@/locale"

const translations = {
  en: {
    title: "Orders",
    searchPlaceholder: 'Search orders... Try "status:failed" or "sms:010-1234"',
    allOrdersLoaded: (count: number) => `All ${count} orders loaded`,
    ordersLoaded: "orders loaded",
    of: "of",
    orderID: "Order ID",
    product: "Product",
    customer: "Customer",
    platform: "Platform",
    amount: "Amount",
    status: "Status",
    delivery: "Delivery",
    time: "Time",
    overview: "Overview",
    logs: "Logs",
    source: "Source",
    license: "License",
    channel: "Channel",
    productLabel: "PRODUCT",
    buyer: "BUYER",
    name: "Name",
    phone: "Phone",
    email: "Email",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    deliveryDetails: "DELIVERY DETAILS",
    from: "From",
    to: "To",
    channelTarget: "Channel Target",
    delivered: "Delivered",
    pending: "Pending",
    failed: "Failed",
    resendVia: (ch: string) => `Resend via ${ch}`,
    licenseLabel: "LICENSE",
    reassignLicense: "Reassign License",
    retry: "Retry",
    adminMemo: "ADMIN MEMO",
    addNote: "Add a note...",
    saving: "저장 중...",
    autoSaved: "자동 저장됨",
    autoSave: "자동 저장",
    dangerZone: "DANGER ZONE",
    cancelOrder: "Cancel Order",
    deleteOrder: "Delete Order",
    orderCreated: "Order created",
    licenseAssigned: "License assigned",
    licenseAssignmentFailed: "License assignment failed",
    deliverySent: "Delivery sent",
    deliveryFailed: "Delivery failed",
    deliveryPending: "Delivery pending",
    deliveryConfirmed: "Delivery confirmed",
    totalTime: "총 소요 시간:",
    normalDelivery: "✓ 정상 전달 완료",
    recipient: "받는 사람:",
    showRawData: "Show Raw Data",
    hideRawData: "Hide Raw Data",
    field: "Field",
    value: "Value",
    goToMerchants: "Go to Merchants",
    viewOn: (platform: string) => `View on ${platform}`,
    orderIdLabel: "Order ID",
    customerLabel: "Customer",
    amountLabel: "Amount",
    orderReceived: "Order received",
    licenseDetails: "License Details",
    retryAssignment: "Retry Assignment",
    viewInInventory: "View in Inventory",
    assignedAt: "Assigned at",
    deliveryLabel: "Delivery",
    statusLabel: "Status",
    sentAt: "Sent at",
    confirmedAt: "Confirmed at",
    resend: "재발송하기",
    viewMessage: "보낸 메시지 원문 보기",
    viewRawData: "Raw Data 보기",
    messageTitle: "보낸 메시지 원문",
    noMessage: "No delivery message available.",
    resendConfirmTitle: "재발송하시겠습니까?",
    resendConfirmDesc: "아래 채널로 메시지를 다시 발송합니다.",
    resending: "재발송중...",
    resendingDesc: "채널로 메시지를 발송하고 있습니다...",
    resendingChannel: (ch: string) => `${ch}로 발송중...`,
    resendComplete: "재발송 완료",
    resendCompleteDesc: "메시지가 성공적으로 재발송되었습니다.",
    resendFailedTitle: "재발송 실패",
    resendFailedDesc: "메시지 재발송에 실패했습니다. 다시 시도해주세요.",
    sendComplete: "발송 완료",
    sendFailed: "발송 실패",
    sendCompleteDesc: (target: string) => `${target}으로 재발송되었습니다.`,
    channelError: "채널 연결 오류가 발생했습니다.",
    recipientLabel: "받는 사람",
    targetLabel: "대상",
    productShort: "상품",
    keyLabel: "키",
    cancelBtn: "취소",
    resendBtn: "재발송",
    confirm: "확인",
    retryComplete: "Retry Complete",
    retrying: "Retrying...",
    retryLicenseAssignment: "Retry License Assignment",
    retryCompleteDesc: "The license assignment workflow has been re-executed.",
    retryingDesc: "Re-running the license assignment step...",
    retryDesc: "This will re-execute the license assignment step of the delivery workflow. Only the license assignment will be retried — other steps are not affected.",
    assigningLicense: "Assigning license...",
    licenseAssignedSuccess: "License assigned successfully",
    duration: "Duration",
    done: "Done",
    retryNow: "Retry Now",
    licenseReassigned: "License Reassigned",
    reassignLicenseTitle: "Reassign License",
    reassignedDesc: (count: number) => `${count} license(s) have been assigned to this order.`,
    selectLicenses: (id: string) => `Select available licenses to assign to order #${id}.`,
    reassigned: (count: number) => `${count} license(s) reassigned`,
    availableKeys: (count: number) => `AVAILABLE KEYS (${count})`,
    added: "Added",
    currentKeyWarning: (key: string) => `The current key (${key}) will be released back to inventory.`,
    assign: (count: number) => count > 0 ? `Assign ${count} Key(s)` : "Assign Selected Keys",
    keyPlaceholderWarning: "⚠ Key ends with 0000 — may be a placeholder",
    licenses: (qty: number) => `${qty}개 라이선스`,
  },
  kr: {
    title: "주문",
    searchPlaceholder: '주문 검색... "status:failed" 또는 "sms:010-1234"',
    allOrdersLoaded: (count: number) => `전체 ${count}건 로드 완료`,
    ordersLoaded: "건 로드됨",
    of: "/",
    orderID: "주문 ID",
    product: "상품",
    customer: "고객",
    platform: "플랫폼",
    amount: "금액",
    status: "상태",
    delivery: "배송 방법",
    time: "시간",
    overview: "개요",
    logs: "로그",
    source: "출처",
    license: "라이선스",
    channel: "채널",
    productLabel: "상품",
    buyer: "구매자",
    name: "이름",
    phone: "전화번호",
    email: "이메일",
    edit: "수정",
    cancel: "취소",
    save: "저장",
    deliveryDetails: "배송 상세",
    from: "보내는 곳",
    to: "받는 사람",
    channelTarget: "채널 대상",
    delivered: "배송 완료",
    pending: "대기 중",
    failed: "실패",
    resendVia: (ch: string) => `${ch}로 재발송`,
    licenseLabel: "라이선스",
    reassignLicense: "라이선스 재할당",
    retry: "재시도",
    adminMemo: "관리자 메모",
    addNote: "메모 추가...",
    saving: "저장 중...",
    autoSaved: "자동 저장됨",
    autoSave: "자동 저장",
    dangerZone: "위험 구역",
    cancelOrder: "주문 취소",
    deleteOrder: "주문 삭제",
    orderCreated: "주문 생성",
    licenseAssigned: "라이선스 할당",
    licenseAssignmentFailed: "라이선스 할당 실패",
    deliverySent: "배송 발송",
    deliveryFailed: "배송 실패",
    deliveryPending: "배송 대기",
    deliveryConfirmed: "배송 확인",
    totalTime: "총 소요 시간:",
    normalDelivery: "✓ 정상 전달 완료",
    recipient: "받는 사람:",
    showRawData: "Raw Data 보기",
    hideRawData: "Raw Data 숨기기",
    field: "필드",
    value: "값",
    goToMerchants: "판매처 이동",
    viewOn: (platform: string) => `${platform}에서 보기`,
    orderIdLabel: "주문 ID",
    customerLabel: "고객",
    amountLabel: "금액",
    orderReceived: "주문 접수",
    licenseDetails: "라이선스 상세",
    retryAssignment: "재할당 시도",
    viewInInventory: "재고에서 보기",
    assignedAt: "할당 시간",
    deliveryLabel: "배송",
    statusLabel: "상태",
    sentAt: "발송 시간",
    confirmedAt: "확인 시간",
    resend: "재발송하기",
    viewMessage: "보낸 메시지 원문 보기",
    viewRawData: "Raw Data 보기",
    messageTitle: "보낸 메시지 원문",
    noMessage: "배송 메시지가 없습니다.",
    resendConfirmTitle: "재발송하시겠습니까?",
    resendConfirmDesc: "아래 채널로 메시지를 다시 발송합니다.",
    resending: "재발송중...",
    resendingDesc: "채널로 메시지를 발송하고 있습니다...",
    resendingChannel: (ch: string) => `${ch}로 발송중...`,
    resendComplete: "재발송 완료",
    resendCompleteDesc: "메시지가 성공적으로 재발송되었습니다.",
    resendFailedTitle: "재발송 실패",
    resendFailedDesc: "메시지 재발송에 실패했습니다. 다시 시도해주세요.",
    sendComplete: "발송 완료",
    sendFailed: "발송 실패",
    sendCompleteDesc: (target: string) => `${target}으로 재발송되었습니다.`,
    channelError: "채널 연결 오류가 발생했습니다.",
    recipientLabel: "받는 사람",
    targetLabel: "대상",
    productShort: "상품",
    keyLabel: "키",
    cancelBtn: "취소",
    resendBtn: "재발송",
    confirm: "확인",
    retryComplete: "재시도 완료",
    retrying: "재시도 중...",
    retryLicenseAssignment: "라이선스 재할당 시도",
    retryCompleteDesc: "라이선스 할당 워크플로우가 다시 실행되었습니다.",
    retryingDesc: "라이선스 할당 단계를 재실행 중...",
    retryDesc: "배송 워크플로우의 라이선스 할당 단계만 재실행합니다. 다른 단계에는 영향이 없습니다.",
    assigningLicense: "라이선스 할당 중...",
    licenseAssignedSuccess: "라이선스 할당 완료",
    duration: "소요 시간",
    done: "완료",
    retryNow: "지금 재시도",
    licenseReassigned: "라이선스 재할당 완료",
    reassignLicenseTitle: "라이선스 재할당",
    reassignedDesc: (count: number) => `${count}개 라이선스가 이 주문에 할당되었습니다.`,
    selectLicenses: (id: string) => `주문 #${id}에 할당할 라이선스를 선택하세요.`,
    reassigned: (count: number) => `${count}개 라이선스 재할당됨`,
    availableKeys: (count: number) => `사용 가능한 키 (${count})`,
    added: "추가일",
    currentKeyWarning: (key: string) => `현재 키 (${key})는 재고로 반환됩니다.`,
    assign: (count: number) => count > 0 ? `${count}개 키 할당` : "선택한 키 할당",
    keyPlaceholderWarning: "⚠ 키가 0000으로 끝남 — 임시 키일 수 있음",
    licenses: (qty: number) => `${qty}개 라이선스`,
  },
} as const

type SearchOperator = ">" | "<" | ">=" | "<="

type SearchFilter = {
  field: string
  value: string
  operator?: SearchOperator
}

type SearchFieldConfig = {
  key: string
  label: string
  description: string
  example: string
  values?: string[]
}

type SearchSuggestion = {
  id: string
  kind: "field" | "value"
  label: string
  description: string
  example: string
  replacement: string
  fieldKey: string
  value?: string
}

const searchFields: SearchFieldConfig[] = [
  { key: "id", label: "Order ID", description: "Search by order ID", example: "id:4X7PA" },
  { key: "product", label: "Product", description: "Search by product name", example: 'product:"Steam Wallet"' },
  { key: "customer", label: "Customer", description: "Search by customer name", example: "customer:이정효" },
  { key: "email", label: "Email", description: "Search by email address", example: "email:leolee12@naver.com" },
  { key: "phone", label: "Phone", description: "Search by phone number", example: "phone:010-3821" },
  { key: "sms", label: "SMS", description: "Search by SMS delivery target", example: "sms:010-3821" },
  {
    key: "platform",
    label: "Platform",
    description: "Filter by platform",
    example: "platform:naver",
    values: ["네이버 스토어", "롯데몰", "지마켓", "쿠팡"],
  },
  {
    key: "status",
    label: "Status",
    description: "Filter by order status",
    example: "status:failed",
    values: ["Delivered", "Processing", "Failed", "ManualRequired"],
  },
  {
    key: "channel",
    label: "Channel",
    description: "Filter by delivery channel",
    example: "channel:telegram",
    values: ["Telegram", "Email", "SMS", "WhatsApp"],
  },
  { key: "to", label: "Delivery Target", description: "Search by delivery target", example: "to:@mont_delivery_bot" },
  { key: "key", label: "Key Code", description: "Search by license key", example: "key:CNVA-PRO1" },
  { key: "store", label: "Store", description: "Search by store name", example: "store:몽키디지털" },
  { key: "memo", label: "Admin Memo", description: "Search in admin memos", example: "memo:VIP" },
  { key: "from", label: "From", description: "Search by source platform/store", example: "from:naver" },
  { key: "amount", label: "Amount", description: "Filter by amount (supports >, <)", example: "amount:>50" },
  { key: "qty", label: "Quantity", description: "Filter by quantity", example: "qty:2" },
]

const searchFieldMap = new Map(searchFields.map((field) => [field.key, field]))

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase()
}

function tokenizeSearchQuery(query: string) {
  const tokens: string[] = []
  let current = ""
  let inQuotes = false

  for (const char of query) {
    if (char === '"') {
      inQuotes = !inQuotes
      current += char
      continue
    }

    if (/\s/.test(char) && !inQuotes) {
      if (current) {
        tokens.push(current)
        current = ""
      }
      continue
    }

    current += char
  }

  if (current) tokens.push(current)

  return tokens
}

function stripWrappingQuotes(value: string) {
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  return value
}

function quoteIfNeeded(value: string) {
  return /\s/.test(value) ? `"${value}"` : value
}

function parseSearchQuery(query: string): SearchFilter[] {
  return tokenizeSearchQuery(query).map((token) => {
    const separatorIndex = token.indexOf(":")
    if (separatorIndex <= 0) {
      return { field: "_text", value: stripWrappingQuotes(token) }
    }

    const rawField = token.slice(0, separatorIndex).toLowerCase()
    const rawValue = stripWrappingQuotes(token.slice(separatorIndex + 1).trim())

    if (!searchFieldMap.has(rawField) || !rawValue) {
      return { field: "_text", value: stripWrappingQuotes(token) }
    }

    if (rawField === "amount") {
      const operatorMatch = rawValue.match(/^(>=|<=|>|<)(.+)$/)
      if (operatorMatch) {
        return {
          field: rawField,
          operator: operatorMatch[1] as SearchOperator,
          value: operatorMatch[2].trim(),
        }
      }
    }

    return { field: rawField, value: rawValue }
  })
}

function includesNormalized(value: string | undefined, query: string) {
  if (!value) return false
  return normalizeSearchValue(value).includes(normalizeSearchValue(query))
}

function matchesNumericFilter(actual: number | undefined, filter: SearchFilter) {
  if (actual === undefined) return false

  const numericValue = Number(filter.value)
  if (Number.isNaN(numericValue)) return false

  switch (filter.operator) {
    case ">":
      return actual > numericValue
    case "<":
      return actual < numericValue
    case ">=":
      return actual >= numericValue
    case "<=":
      return actual <= numericValue
    default:
      return actual === numericValue
  }
}

function matchesFilter(order: Order, filter: SearchFilter) {
  const value = filter.value.trim()
  if (!value) return true

  switch (filter.field) {
    case "_text":
      return [order.id, order.product, order.customer].some((entry) => includesNormalized(entry, value))
    case "id":
      return includesNormalized(order.id, value)
    case "product":
      return includesNormalized(order.product, value)
    case "customer":
      return includesNormalized(order.customer, value)
    case "email":
      return includesNormalized(order.email, value)
    case "phone":
      return includesNormalized(order.phone, value)
    case "sms":
      return includesNormalized(order.phone, value) || (order.delivery === "SMS" && includesNormalized(order.deliveryTarget, value))
    case "platform":
      return includesNormalized(order.platform, value)
    case "status":
      return includesNormalized(order.status, value)
    case "channel":
      return includesNormalized(order.delivery, value)
    case "to":
      return includesNormalized(order.deliveryTarget, value)
    case "key":
      return includesNormalized(order.keyCode, value) || (order.items?.some((item) => includesNormalized(item.keyCode, value)) ?? false)
    case "store":
      return includesNormalized(order.storeName, value)
    case "memo":
      return includesNormalized(order.adminMemo, value)
    case "from":
      return includesNormalized(order.platform, value) || includesNormalized(order.storeName, value)
    case "amount":
      return matchesNumericFilter(order.amount, filter)
    case "qty":
      return matchesNumericFilter(order.quantity ?? 1, filter)
    default:
      return [order.id, order.product, order.customer].some((entry) => includesNormalized(entry, value))
  }
}

function formatFilterToken(filter: SearchFilter) {
  if (filter.field === "_text") return quoteIfNeeded(filter.value)
  const formattedValue = `${filter.operator ?? ""}${filter.value}`
  return `${filter.field}:${quoteIfNeeded(formattedValue)}`
}

function rebuildSearchQuery(filters: SearchFilter[]) {
  return filters.map(formatFilterToken).join(" ")
}

function getActiveTokenBounds(query: string) {
  const end = query.length
  let start = end

  while (start > 0 && !/\s/.test(query[start - 1])) {
    start -= 1
  }

  return {
    start,
    end,
    token: query.slice(start, end),
  }
}

function replaceActiveToken(query: string, replacement: string) {
  const { start, end } = getActiveTokenBounds(query)
  const prefix = query.slice(0, start)
  const suffix = query.slice(end)
  return `${prefix}${replacement}${suffix}`
}

function getSearchSuggestions(query: string): SearchSuggestion[] {
  const { token } = getActiveTokenBounds(query)
  const tokenValue = token.trim()

  if (!tokenValue) {
    return searchFields.map((field) => ({
      id: `field-${field.key}`,
      kind: "field",
      label: `${field.key}:`,
      description: field.description,
      example: field.example,
      replacement: `${field.key}:`,
      fieldKey: field.key,
    }))
  }

  const separatorIndex = tokenValue.indexOf(":")
  if (separatorIndex >= 0) {
    const fieldKey = tokenValue.slice(0, separatorIndex).toLowerCase()
    const currentValue = stripWrappingQuotes(tokenValue.slice(separatorIndex + 1))
    const field = searchFieldMap.get(fieldKey)

    if (!field?.values) return []

    return field.values
      .filter((value) => includesNormalized(value, currentValue))
      .map((value) => ({
        id: `value-${field.key}-${value}`,
        kind: "value",
        label: `${field.key}: ${value}`,
        description: field.description,
        example: field.example,
        replacement: `${field.key}:${quoteIfNeeded(value)} `,
        fieldKey: field.key,
        value,
      }))
  }

  return searchFields
    .filter((field) => field.key.includes(tokenValue.toLowerCase()) || field.label.toLowerCase().includes(tokenValue.toLowerCase()))
    .map((field) => ({
      id: `field-${field.key}`,
      kind: "field",
      label: `${field.key}:`,
      description: field.description,
      example: field.example,
      replacement: `${field.key}:`,
      fieldKey: field.key,
    }))
}

function getChipClasses(filter: SearchFilter) {
  if (filter.field === "status") {
    const value = normalizeSearchValue(filter.value)
    if (value.includes("delivered")) return "border-[#34A853]/20 bg-[#34A853]/10 text-[#34A853]"
    if (value.includes("processing")) return "border-[#E37400]/20 bg-[#E37400]/10 text-[#E37400]"
    if (value.includes("failed")) return "border-[#D93025]/20 bg-[#D93025]/10 text-[#D93025]"
  }

  if (filter.field === "channel") {
    const hasChannelMatch = Object.keys(deliveryChannels).some(
      (name) => normalizeSearchValue(name) === normalizeSearchValue(filter.value),
    )
    if (hasChannelMatch) return "border-transparent"
  }

  return "border-[#918DF6]/15 bg-[#918DF6]/10 text-[#6E69E8]"
}

const allOrders: Order[] = [
  { id: "4X7PA", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 29.99, status: "Delivered", time: "2분 전", product: "캔바 프로 Canva PRO 12개월", customer: "이정효", email: "leolee12@naver.com", phone: "010-3821-4756", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CNVA-PRO1-7F3M", recipientName: "이정효", recipientPhone: "010-3821-4756", customerMemo: "leolee12@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "CNVA-PRO1-7F3M", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "3.5s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: 캔바 프로 Canva PRO 12개월\n키: CNVA-PRO1-7F3M\n\n감사합니다!" },
  { id: "9K2BM", platform: "롯데몰", storeName: "롯데몰", amount: 42.99, status: "Delivered", time: "8분 전", product: "Steam Wallet $50 Gift Card", customer: "Alex Turner", email: "g2g_buyer_8821", phone: "010-5534-2198", delivery: "Email", deliveryTarget: "g2g_buyer_8821", keyCode: "STMW-50GC-A2K9", recipientName: "Alex Turner", recipientPhone: "010-5534-2198", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "STMW-50GC-A2K9", status: "Delivered" }, { keyCode: "STMW-50GC-B3R7", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.8s", deliveryConfirmed: "4.2s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Steam Wallet $50 Gift Card\nKey: STMW-50GC-A2K9\n\nThank you!" },
  { id: "3F8QN", platform: "지마켓", storeName: "지마켓", amount: 12.99, status: "Processing", time: "15분 전", product: "Xbox Game Pass Ultimate 1개월", customer: "김수현", email: "g2a_user_3347", phone: "010-7741-9023", delivery: "SMS", deliveryTarget: "010-7741-9023", keyCode: "XGPU-1MON-9D1P", recipientName: "김수현", recipientPhone: "010-7741-9023", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "XGPU-1MON-9D1P", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.1s" } },
  { id: "7W1DL", platform: "네이버 스토어", storeName: "몽키디지털", amount: 24.99, status: "Delivered", time: "23분 전", product: "Windows 11 Pro Key", customer: "박민지", email: "minji_park@naver.com", phone: "010-2293-6847", delivery: "Email", deliveryTarget: "minji_park@naver.com", keyCode: "W11P-RKEY-QW8E", recipientName: "박민지", recipientPhone: "010-2293-6847", customerMemo: "minji_park@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "W11P-RKEY-QW8E", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.8s" } },
  { id: "6R5VC", platform: "롯데몰", storeName: "롯데몰", amount: 59.99, status: "Delivered", time: "41분 전", product: "Elden Ring Shadow of the Erdtree DLC", customer: "James Kim", email: "g2g_buyer_1204", phone: "010-8812-3374", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "ERNG-DLCX-5TN2", recipientName: "James Kim", recipientPhone: "010-8812-3374", customerMemo: "", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "ERNG-DLCX-5TN2", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.5s", deliveryConfirmed: "3.9s" } },
  { id: "2H9TE", platform: "지마켓", storeName: "지마켓", amount: 49.99, status: "Failed", time: "1시간 전", product: "FIFA 25 Ultimate Edition", customer: "최영호", email: "g2a_user_7790", phone: "010-4467-8231", delivery: "WhatsApp", deliveryTarget: "+82 10-4467-8231", keyCode: "FIFA-25UE-0000", recipientName: "최영호", recipientPhone: "010-4467-8231", customerMemo: "", adminMemo: "WhatsApp 전송 실패 — 수신자 연결 불가. 키 미전달 상태.", quantity: 1, items: [{ keyCode: "FIFA-25UE-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "3.2s" }, errorStep: "Step 3 — Key Delivery", errorMessage: "WhatsApp API timeout: recipient unreachable after 3 retries. Key reserved but not delivered." },
  { id: "8M3KP", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 34.99, status: "Delivered", time: "1시간 전", product: "Adobe Creative Cloud 1개월", customer: "정하은", email: "haeun_j@naver.com", phone: "010-9923-5512", delivery: "Email", deliveryTarget: "haeun_j@naver.com", keyCode: "ADCC-1MON-R4TZ", recipientName: "정하은", recipientPhone: "010-9923-5512", customerMemo: "haeun_j@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "ADCC-1MON-R4TZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.6s" } },
  { id: "1Q6WJ", platform: "롯데몰", storeName: "롯데몰", amount: 19.99, status: "Delivered", time: "2시간 전", product: "Minecraft Java Edition", customer: "David Park", email: "g2g_buyer_5512", phone: "010-6634-7809", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "MNCR-JAVA-K8PL", recipientName: "David Park", recipientPhone: "010-6634-7809", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "MNCR-JAVA-K8PL", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.1s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Minecraft Java Edition\nKey: MNCR-JAVA-K8PL\n\nThank you!" },
  { id: "5T4NR", platform: "쿠팡", storeName: "쿠팡", amount: 89.99, status: "Delivered", time: "2시간 전", product: "Cyberpunk 2077 Ultimate Bundle", customer: "이서연", email: "seoyeon@gmail.com", phone: "010-1178-4423", delivery: "Email", deliveryTarget: "seoyeon@gmail.com", keyCode: "CP77-ULTB-M3VX", recipientName: "이서연", recipientPhone: "010-1178-4423", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "CP77-ULTB-M3VX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.3s" } },
  { id: "0L8FD", platform: "지마켓", storeName: "지마켓", amount: 15.99, status: "Processing", time: "3시간 전", product: "Netflix Gift Card $25", customer: "Tom Wilson", email: "g2a_user_4421", phone: "010-3356-8814", delivery: "SMS", deliveryTarget: "010-3356-8814", keyCode: "NFLX-25GC-W7HN", recipientName: "Tom Wilson", recipientPhone: "010-3356-8814", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "NFLX-25GC-W7HN", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.9s" } },
  { id: "4Y2GH", platform: "네이버 스토어", storeName: "디지털라운지", amount: 44.99, status: "Delivered", time: "3시간 전", product: "PS Plus Premium 3개월", customer: "한지민", email: "jimin_han@naver.com", phone: "010-7723-1956", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "PSPP-3MON-B5QA", recipientName: "한지민", recipientPhone: "010-7723-1956", customerMemo: "jimin_han@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "PSPP-3MON-B5QA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.6s", deliveryConfirmed: "4.0s" } },
  { id: "7N9XC", platform: "롯데몰", storeName: "롯데몰", amount: 27.50, status: "Failed", time: "4시간 전", product: "Valorant Points 2050 VP", customer: "Sarah Lee", email: "g2g_buyer_9903", phone: "010-5589-2341", delivery: "Email", deliveryTarget: "g2g_buyer_9903", keyCode: "VLRN-2050-0000", recipientName: "Sarah Lee", recipientPhone: "010-5589-2341", customerMemo: "", adminMemo: "결제 분쟁 발생 — 은행 측 거래 취소 처리됨.", quantity: 1, items: [{ keyCode: "VLRN-2050-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.8s", deliverySent: "2.4s" }, errorStep: "Step 2 — Payment Verification", errorMessage: "Payment disputed by buyer's bank. Transaction reversed." },
  { id: "3K1MZ", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 39.99, status: "Delivered", time: "4시간 전", product: "Spotify Premium 6개월", customer: "오준서", email: "junseo_oh@naver.com", phone: "010-2214-7763", delivery: "SMS", deliveryTarget: "010-2214-7763", keyCode: "SPTF-6MON-J2YD", recipientName: "오준서", recipientPhone: "010-2214-7763", customerMemo: "junseo_oh@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "SPTF-6MON-J2YD", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.9s" } },
  { id: "6P5BA", platform: "지마켓", storeName: "지마켓", amount: 54.99, status: "Delivered", time: "5시간 전", product: "Hogwarts Legacy Deluxe", customer: "김태현", email: "g2a_user_6678", phone: "010-8845-3127", delivery: "WhatsApp", deliveryTarget: "+82 10-8845-3127", keyCode: "HWLG-DLXE-T9FC", recipientName: "김태현", recipientPhone: "010-8845-3127", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "HWLG-DLXE-T9FC", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.7s", deliveryConfirmed: "3.8s" } },
  { id: "9D7QL", platform: "롯데몰", storeName: "롯데몰", amount: 22.00, status: "Delivered", time: "5시간 전", product: "Roblox Gift Card $25", customer: "Emily Chen", email: "g2g_buyer_3345", phone: "010-4412-6698", delivery: "Email", deliveryTarget: "g2g_buyer_3345", keyCode: "RBLX-25GC-N4WP", recipientName: "Emily Chen", recipientPhone: "010-4412-6698", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "RBLX-25GC-N4WP", status: "Delivered" }, { keyCode: "RBLX-25GC-M5XQ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.0s", deliveryConfirmed: "4.5s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Roblox Gift Card $25\nKey: RBLX-25GC-N4WP\n\nThank you!" },
  { id: "2V0SE", platform: "쿠팡", storeName: "쿠팡", amount: 69.99, status: "Processing", time: "6시간 전", product: "Baldur's Gate 3 Digital Deluxe", customer: "박성민", email: "sungmin@vexora.team", phone: "010-6671-4489", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "BG3D-DLXE-H6RA", recipientName: "박성민", recipientPhone: "010-6671-4489", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "BG3D-DLXE-H6RA", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.8s" } },
  { id: "8F3TK", platform: "네이버 스토어", storeName: "몽키디지털", amount: 18.99, status: "Delivered", time: "7시간 전", product: "YouTube Premium 3개월", customer: "윤서아", email: "seoa_yoon@naver.com", phone: "010-3398-5521", delivery: "Email", deliveryTarget: "seoa_yoon@naver.com", keyCode: "YTPM-3MON-C1GX", recipientName: "윤서아", recipientPhone: "010-3398-5521", customerMemo: "seoa_yoon@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "YTPM-3MON-C1GX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.7s" } },
  { id: "5J9WN", platform: "롯데몰", storeName: "롯데몰", amount: 32.50, status: "Delivered", time: "8시간 전", product: "Diablo IV Standard Edition", customer: "Michael Cho", email: "g2g_buyer_7721", phone: "010-9967-1234", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "D4SE-STND-P8LZ", recipientName: "Michael Cho", recipientPhone: "010-9967-1234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "D4SE-STND-P8LZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.4s", deliveryConfirmed: "3.3s" } },
  { id: "1R4HP", platform: "지마켓", storeName: "지마켓", amount: 11.99, status: "Delivered", time: "9시간 전", product: "Discord Nitro 1개월", customer: "강예진", email: "g2a_user_2234", phone: "010-1145-8876", delivery: "SMS", deliveryTarget: "010-1145-8876", keyCode: "DCNT-1MON-V5KB", recipientName: "강예진", recipientPhone: "010-1145-8876", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "DCNT-1MON-V5KB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.4s" } },
  { id: "0X6CM", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 74.99, status: "Delivered", time: "10시간 전", product: "GTA V Premium + Whale Shark Card", customer: "이동현", email: "donghyun_lee@naver.com", phone: "010-7756-3312", delivery: "Email", deliveryTarget: "donghyun_lee@naver.com", keyCode: "GTAV-PWSC-S3QE", recipientName: "이동현", recipientPhone: "010-7756-3312", customerMemo: "donghyun_lee@naver.com", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "GTAV-PWSC-S3QE", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.5s", deliveryConfirmed: "3.6s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: GTA V Premium + Whale Shark Card\n키: GTAV-PWSC-S3QE\n\n감사합니다!" },
  { id: "2A3RF", platform: "롯데몰", storeName: "롯데몰", amount: 14.99, status: "Delivered", time: "10시간 전", product: "League of Legends 1380 RP", customer: "Chris Yang", email: "g2g_buyer_4410", phone: "010-4423-9981", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "LOL1-380R-P7KM", recipientName: "Chris Yang", recipientPhone: "010-4423-9981", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "LOL1-380R-P7KM", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "3.0s" } },
  { id: "8B7WQ", platform: "네이버 스토어", storeName: "디지털라운지", amount: 59.99, status: "Delivered", time: "11시간 전", product: "Microsoft 365 Family 1년", customer: "김나연", email: "nayeon_k@naver.com", phone: "010-8834-2267", delivery: "Email", deliveryTarget: "nayeon_k@naver.com", keyCode: "M365-FAM1-Y2NB", recipientName: "김나연", recipientPhone: "010-8834-2267", customerMemo: "nayeon_k@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "M365-FAM1-Y2NB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.2s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Microsoft 365 Family 1년\n키: M365-FAM1-Y2NB\n\n감사합니다!" },
  { id: "5C4XE", platform: "지마켓", storeName: "지마켓", amount: 39.99, status: "Processing", time: "11시간 전", product: "Starfield Standard Edition", customer: "Daniel Kwon", email: "g2a_user_5589", phone: "010-6612-4453", delivery: "SMS", deliveryTarget: "010-6612-4453", keyCode: "STRF-STND-Q4WC", recipientName: "Daniel Kwon", recipientPhone: "010-6612-4453", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "STRF-STND-Q4WC", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "2.3s" } },
  { id: "3D9LP", platform: "쿠팡", storeName: "쿠팡", amount: 9.99, status: "Delivered", time: "12시간 전", product: "Notion Plus 1개월", customer: "송유진", email: "yujin_song@gmail.com", phone: "010-2278-6634", delivery: "Email", deliveryTarget: "yujin_song@gmail.com", keyCode: "NOTN-PLUS-F8RV", recipientName: "송유진", recipientPhone: "010-2278-6634", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "NOTN-PLUS-F8RV", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.7s", deliveryConfirmed: "2.1s" } },
  { id: "7E2HN", platform: "롯데몰", storeName: "롯데몰", amount: 84.99, status: "Delivered", time: "12시간 전", product: "Call of Duty MW3 Vault Edition", customer: "Ryan Park", email: "g2g_buyer_6632", phone: "010-5541-7723", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CODM-W3VE-L5TA", recipientName: "Ryan Park", recipientPhone: "010-5541-7723", customerMemo: "", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "CODM-W3VE-L5TA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.6s", deliveryConfirmed: "4.1s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Call of Duty MW3 Vault Edition\nKey: CODM-W3VE-L5TA\n\nThank you!" },
  { id: "1F6JT", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 16.99, status: "Failed", time: "13시간 전", product: "ChatGPT Plus 1개월", customer: "임수빈", email: "subin_lim@naver.com", phone: "010-9912-3345", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CGPT-PLUS-0000", recipientName: "임수빈", recipientPhone: "010-9912-3345", customerMemo: "subin_lim@naver.com", adminMemo: "재고 소진으로 키 발급 실패 — 환불 처리 필요.", quantity: 1, items: [{ keyCode: "CGPT-PLUS-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "1.2s", deliverySent: "3.8s" }, errorStep: "Step 1 — Key Generation", errorMessage: "Inventory depleted. No available keys for this product." },
  { id: "4G8KV", platform: "지마켓", storeName: "지마켓", amount: 29.99, status: "Delivered", time: "13시간 전", product: "EA Play Pro 1개월", customer: "Jason Lim", email: "g2a_user_8812", phone: "010-3367-5598", delivery: "Email", deliveryTarget: "g2a_user_8812", keyCode: "EAPL-PRO1-D3MX", recipientName: "Jason Lim", recipientPhone: "010-3367-5598", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "EAPL-PRO1-D3MX", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.8s" } },
  { id: "6H1MR", platform: "롯데몰", storeName: "롯데몰", amount: 45.00, status: "Delivered", time: "14시간 전", product: "PlayStation Store $50 Card", customer: "Olivia Kang", email: "g2g_buyer_2278", phone: "010-7789-4412", delivery: "SMS", deliveryTarget: "010-7789-4412", keyCode: "PSN5-0GCR-W9BN", recipientName: "Olivia Kang", recipientPhone: "010-7789-4412", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "PSN5-0GCR-W9BN", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.4s", deliveryConfirmed: "3.4s" } },
  { id: "9J5NW", platform: "네이버 스토어", storeName: "몽키디지털", amount: 21.99, status: "Delivered", time: "14시간 전", product: "Figma Professional 1개월", customer: "조은서", email: "eunseo_cho@naver.com", phone: "010-1156-8823", delivery: "Email", deliveryTarget: "eunseo_cho@naver.com", keyCode: "FGMA-PRO1-K7QZ", recipientName: "조은서", recipientPhone: "010-1156-8823", customerMemo: "eunseo_cho@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "FGMA-PRO1-K7QZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.5s" } },
  { id: "0K3PY", platform: "쿠팡", storeName: "쿠팡", amount: 119.99, status: "Delivered", time: "15시간 전", product: "Adobe Photoshop + Lightroom 1년", customer: "이하준", email: "hajun@vexora.team", phone: "010-4489-7756", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "ADPL-1YAR-G4HS", recipientName: "이하준", recipientPhone: "010-4489-7756", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "ADPL-1YAR-G4HS", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.2s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Adobe Photoshop + Lightroom 1년\n키: ADPL-1YAR-G4HS\n\n감사합니다!" },
  { id: "2L8QA", platform: "지마켓", storeName: "지마켓", amount: 7.99, status: "Delivered", time: "15시간 전", product: "Spotify Gift Card $10", customer: "Amy Zhang", email: "g2a_user_1156", phone: "010-6623-1187", delivery: "Email", deliveryTarget: "g2a_user_1156", keyCode: "SPTF-10GC-N2VD", recipientName: "Amy Zhang", recipientPhone: "010-6623-1187", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "SPTF-10GC-N2VD", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.8s", deliveryConfirmed: "2.0s" } },
  { id: "5M4RB", platform: "롯데몰", storeName: "롯데몰", amount: 37.50, status: "Processing", time: "16시간 전", product: "Apex Legends 4350 Coins", customer: "Kevin Shin", email: "g2g_buyer_7743", phone: "010-8891-2234", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "APEX-4350-C8WF", recipientName: "Kevin Shin", recipientPhone: "010-8891-2234", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "APEX-4350-C8WF", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "2.2s" } },
  { id: "8N7SC", platform: "네이버 스토어", storeName: "프리미엄키샵", amount: 49.99, status: "Delivered", time: "16시간 전", product: "Nintendo eShop $50 Card", customer: "황지우", email: "jiwoo_hwang@naver.com", phone: "010-3345-9967", delivery: "SMS", deliveryTarget: "010-3345-9967", keyCode: "NESH-50GC-J6XP", recipientName: "황지우", recipientPhone: "010-3345-9967", customerMemo: "jiwoo_hwang@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "NESH-50GC-J6XP", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.1s" } },
  { id: "1P2TD", platform: "지마켓", storeName: "지마켓", amount: 64.99, status: "Delivered", time: "17시간 전", product: "Red Dead Redemption 2 Ultimate", customer: "최민호", email: "g2a_user_9945", phone: "010-5578-3312", delivery: "WhatsApp", deliveryTarget: "+82 10-5578-3312", keyCode: "RDR2-ULTE-B1YQ", recipientName: "최민호", recipientPhone: "010-5578-3312", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "RDR2-ULTE-B1YQ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.7s", deliveryConfirmed: "3.9s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Red Dead Redemption 2 Ultimate\nKey: RDR2-ULTE-B1YQ\n\nThank you!" },
  { id: "4Q9UE", platform: "롯데몰", storeName: "롯데몰", amount: 19.50, status: "Failed", time: "17시간 전", product: "Fortnite V-Bucks 2800", customer: "Sophia Yoo", email: "g2g_buyer_5501", phone: "010-2234-6678", delivery: "Email", deliveryTarget: "g2g_buyer_5501", keyCode: "FNVB-2800-0000", recipientName: "Sophia Yoo", recipientPhone: "010-2234-6678", customerMemo: "", adminMemo: "통화 불일치로 결제 실패 — EUR 결제, USD 필요. 환불 진행 중.", quantity: 1, items: [{ keyCode: "FNVB-2800-0000", status: "Failed" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.9s", deliverySent: "2.7s" }, errorStep: "Step 2 — Payment Verification", errorMessage: "Currency mismatch: buyer paid in EUR, expected USD. Refund initiated." },
  { id: "7R6VF", platform: "네이버 스토어", storeName: "디지털라운지", amount: 32.99, status: "Delivered", time: "18시간 전", product: "Zoom Pro 1개월", customer: "배수현", email: "suhyun_bae@naver.com", phone: "010-9934-5521", delivery: "Email", deliveryTarget: "suhyun_bae@naver.com", keyCode: "ZOOM-PRO1-A5ZR", recipientName: "배수현", recipientPhone: "010-9934-5521", customerMemo: "suhyun_bae@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "ZOOM-PRO1-A5ZR", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.2s", deliveryConfirmed: "2.9s" } },
  { id: "3S1WG", platform: "쿠팡", storeName: "쿠팡", amount: 44.99, status: "Delivered", time: "18시간 전", product: "Cursor Pro IDE 1개월", customer: "정우진", email: "woojin@vexora.team", phone: "010-4456-8891", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "CRSR-PRO1-M8LS", recipientName: "정우진", recipientPhone: "010-4456-8891", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "CRSR-PRO1-M8LS", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.2s", deliverySent: "0.9s", deliveryConfirmed: "2.4s" } },
  { id: "6T5XH", platform: "롯데몰", storeName: "롯데몰", amount: 26.99, status: "Delivered", time: "19시간 전", product: "Overwatch 2 Battle Pass", customer: "Nathan Kim", email: "g2g_buyer_3389", phone: "010-7712-4456", delivery: "SMS", deliveryTarget: "010-7712-4456", keyCode: "OW2B-PASS-E4NT", recipientName: "Nathan Kim", recipientPhone: "010-7712-4456", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "OW2B-PASS-E4NT", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.3s", deliveryConfirmed: "3.0s" } },
  { id: "9U8YJ", platform: "지마켓", storeName: "지마켓", amount: 17.99, status: "Delivered", time: "19시간 전", product: "Crunchyroll Premium 3개월", customer: "안서윤", email: "g2a_user_6623", phone: "010-1189-7734", delivery: "Email", deliveryTarget: "g2a_user_6623", keyCode: "CRNC-3MON-H7PU", recipientName: "안서윤", recipientPhone: "010-1189-7734", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "CRNC-3MON-H7PU", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.1s", deliveryConfirmed: "2.7s" } },
  { id: "0V2ZK", platform: "네이버 스토어", storeName: "건렬이의 디지털스토어", amount: 89.99, status: "Delivered", time: "20시간 전", product: "Parallels Desktop Pro 1년", customer: "문재현", email: "jaehyun_moon@naver.com", phone: "010-6645-3378", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "PRLL-PRO1-R3GW", recipientName: "문재현", recipientPhone: "010-6645-3378", customerMemo: "jaehyun_moon@naver.com", adminMemo: "VIP 고객", quantity: 1, items: [{ keyCode: "PRLL-PRO1-R3GW", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.6s", deliveryConfirmed: "4.3s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: Parallels Desktop Pro 1년\n키: PRLL-PRO1-R3GW\n\n감사합니다!" },
  { id: "3W7AL", platform: "롯데몰", storeName: "롯데몰", amount: 55.00, status: "Delivered", time: "20시간 전", product: "Steam Wallet $60 Gift Card", customer: "Grace Choi", email: "g2g_buyer_8854", phone: "010-2267-9945", delivery: "Email", deliveryTarget: "g2g_buyer_8854", keyCode: "STMW-60GC-V9KX", recipientName: "Grace Choi", recipientPhone: "010-2267-9945", customerMemo: "", adminMemo: "", quantity: 2, items: [{ keyCode: "STMW-60GC-V9KX", status: "Delivered" }, { keyCode: "STMW-60GC-W1AZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.6s", deliverySent: "1.9s", deliveryConfirmed: "4.4s" }, deliveryMessage: "🎉 Your order is complete!\n\nProduct: Steam Wallet $60 Gift Card\nKey: STMW-60GC-V9KX\n\nThank you!" },
  { id: "6X4BM", platform: "지마켓", storeName: "지마켓", amount: 34.99, status: "Processing", time: "21시간 전", product: "Palworld Early Access", customer: "신예은", email: "g2a_user_4478", phone: "010-8823-6612", delivery: "WhatsApp", deliveryTarget: "+82 10-8823-6612", keyCode: "PLWL-EACC-T2DY", recipientName: "신예은", recipientPhone: "010-8823-6612", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "PLWL-EACC-T2DY", status: "Processing" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.7s", deliverySent: "2.5s" } },
  { id: "9Y1CN", platform: "쿠팡", storeName: "쿠팡", amount: 149.99, status: "Delivered", time: "21시간 전", product: "JetBrains All Products Pack 1년", customer: "권도윤", email: "doyun@vexora.team", phone: "010-5512-8867", delivery: "Email", deliveryTarget: "doyun@vexora.team", keyCode: "JBAP-1YAR-U6FZ", recipientName: "권도윤", recipientPhone: "010-5512-8867", customerMemo: "", adminMemo: "팀 내부 주문", quantity: 1, items: [{ keyCode: "JBAP-1YAR-U6FZ", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.3s", deliverySent: "1.0s", deliveryConfirmed: "2.6s" }, deliveryMessage: "🎉 주문이 완료되었습니다!\n\n상품: JetBrains All Products Pack 1년\n키: JBAP-1YAR-U6FZ\n\n감사합니다!" },
  { id: "2Z6DP", platform: "네이버 스토어", storeName: "몽키디지털", amount: 27.99, status: "Delivered", time: "22시간 전", product: "Midjourney Standard 1개월", customer: "유하린", email: "harin_yu@naver.com", phone: "010-3378-1156", delivery: "SMS", deliveryTarget: "010-3378-1156", keyCode: "MDJR-STD1-I8QA", recipientName: "유하린", recipientPhone: "010-3378-1156", customerMemo: "harin_yu@naver.com", adminMemo: "", quantity: 1, items: [{ keyCode: "MDJR-STD1-I8QA", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.4s", deliverySent: "1.4s", deliveryConfirmed: "3.3s" } },
  { id: "5A9EQ", platform: "롯데몰", storeName: "롯데몰", amount: 41.50, status: "Delivered", time: "23시간 전", product: "Monster Hunter Wilds", customer: "Brandon Lee", email: "g2g_buyer_1167", phone: "010-9901-4423", delivery: "Telegram", deliveryTarget: "@mont_delivery_bot", keyCode: "MHWL-STND-W4LB", recipientName: "Brandon Lee", recipientPhone: "010-9901-4423", customerMemo: "", adminMemo: "", quantity: 1, items: [{ keyCode: "MHWL-STND-W4LB", status: "Delivered" }], flowTiming: { orderCreated: "0.0s", licenseAssigned: "0.5s", deliverySent: "1.5s", deliveryConfirmed: "3.7s" } },
]

const TOTAL_ORDERS = 156

function parseRelativeTime(relTime: string): Date {
  const now = new Date()
  const match = relTime.match(/(\d+)\s*(분|시간)/)
  if (!match) return now
  const value = parseInt(match[1], 10)
  const unit = match[2]
  if (unit === "분") now.setMinutes(now.getMinutes() - value)
  else if (unit === "시간") now.setHours(now.getHours() - value)
  return now
}

function formatStepTime(orderTime: string, stepSeconds: string): string {
  if (!stepSeconds || stepSeconds === "—") return "—"
  const sec = parseFloat(stepSeconds)
  if (Number.isNaN(sec)) return "—"
  const base = parseRelativeTime(orderTime)
  base.setSeconds(base.getSeconds() + Math.round(sec))
  const h = base.getHours()
  const m = base.getMinutes()
  const period = h < 12 ? "오전" : "오후"
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${period} ${h12}:${String(m).padStart(2, "0")}`
}

export default function Orders({ locale = "en" }: { locale?: Locale }) {
  const t = translations[locale]
  const [searchParams, setSearchParams] = useSearchParams()
  const [currency, setCurrency] = useState<Currency>("KRW")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"overview" | "logs">("overview")
  const [channelExpanded, setChannelExpanded] = useState(false)
  const [showRawData, setShowRawData] = useState(false)
  const [messagePopupOpen, setMessagePopupOpen] = useState(false)
  const [rawDataPopupOpen, setRawDataPopupOpen] = useState(false)
  const [copiedItemIdx, setCopiedItemIdx] = useState<number | null>(null)
  const [memoFocused, setMemoFocused] = useState(false)
  const [memoSaveStatus, setMemoSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const memoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [copiedRawData, setCopiedRawData] = useState(false)
  const [buyerEditing, setBuyerEditing] = useState(false)
  const [channelResendConfirm, setChannelResendConfirm] = useState(false)
  const [resendRunning, setResendRunning] = useState(false)
  const [resendDone, setResendDone] = useState<"success" | "failed" | null>(null)
  const [statusEditing, setStatusEditing] = useState(false)
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false)
  const [retryDialogOpen, setRetryDialogOpen] = useState(false)
  const [retryRunning, setRetryRunning] = useState(false)
  const [retryDone, setRetryDone] = useState(false)
  const [reassignRunning, setReassignRunning] = useState(false)
  const [reassignDone, setReassignDone] = useState(false)
  const [reassignSelectedKey, setReassignSelectedKey] = useState<string[]>([])
  const [sourcePopupOpen, setSourcePopupOpen] = useState(false)
  const [licensePopupOpen, setLicensePopupOpen] = useState(false)
  const [copiedLicenseKey, setCopiedLicenseKey] = useState(false)
  const [advancedResendOpen, setAdvancedResendOpen] = useState(false)
  const [resendChannel, setResendChannel] = useState<string>("")
  const [resendTarget, setResendTarget] = useState("")
  const PAGE_SIZE = 10
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleMemoChange = useCallback(() => {
    setMemoSaveStatus("saving")
    if (memoSaveTimerRef.current) clearTimeout(memoSaveTimerRef.current)
    memoSaveTimerRef.current = setTimeout(() => {
      setMemoSaveStatus("saved")
      memoSaveTimerRef.current = setTimeout(() => setMemoSaveStatus("idle"), 2000)
    }, 1000)
  }, [])

  const handleCopyKey = (key: string, idx: number) => {
    void navigator.clipboard.writeText(key)
    setCopiedItemIdx(idx)
    setTimeout(() => setCopiedItemIdx(null), 1500)
  }

  const handleCopyRawData = (text: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedRawData(true)
    setTimeout(() => setCopiedRawData(false), 1500)
  }

  const filters = parseSearchQuery(searchQuery)
  const structuredFilters = filters.filter((filter) => filter.field !== "_text")
  const suggestions = searchFocused && searchQuery.trim() ? getSearchSuggestions(searchQuery) : []
  const showSuggestions = suggestions.length > 0
  const filtered = allOrders.filter((o) => filters.every((filter) => matchesFilter(o, filter)))

  const applySuggestion = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery((current) => replaceActiveToken(current, suggestion.replacement))
    setSearchFocused(true)
    setSuggestionIndex(0)
    requestAnimationFrame(() => {
      const input = searchInputRef.current
      if (!input) return
      input.focus()
      const nextValue = replaceActiveToken(input.value, suggestion.replacement)
      input.setSelectionRange(nextValue.length, nextValue.length)
    })
  }, [])

  const removeFilterChip = useCallback((filterToRemove: SearchFilter) => {
    const nextFilters = [...filters]
    const index = nextFilters.findIndex(
      (filter) =>
        filter.field === filterToRemove.field &&
        filter.value === filterToRemove.value &&
        filter.operator === filterToRemove.operator,
    )

    if (index === -1) return

    nextFilters.splice(index, 1)
    setSearchQuery(rebuildSearchQuery(nextFilters))
  }, [filters])

  useEffect(() => {
    setDisplayCount(PAGE_SIZE)
  }, [searchQuery])

  useEffect(() => {
    if (!showSuggestions) {
      setSuggestionIndex(0)
      return
    }

    setSuggestionIndex((current) => Math.min(current, suggestions.length - 1))
  }, [showSuggestions, suggestions])

  const visibleOrders = filtered.slice(0, displayCount)
  const allLoaded = displayCount >= filtered.length

  const loadMore = useCallback(() => {
    if (loading || allLoaded) return
    setLoading(true)
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length))
      setLoading(false)
    }, 600)
  }, [loading, allLoaded, filtered.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  useEffect(() => {
    const orderParam = searchParams.get("order")
    if (orderParam && !selectedOrder) {
      const match = allOrders.find((o) => o.id === orderParam)
      if (match) {
        setSelectedOrder(match)
        setSearchParams({}, { replace: true })
      }
    }
  }, [searchParams, selectedOrder, setSearchParams])

  const getOrderDialogData = (order: Order) => {
    const pBadge = platformBadges[order.platform]
    const ch = deliveryChannels[order.delivery]
    const items = order.items ?? [{ keyCode: order.keyCode, status: order.status }]
    const qty = order.quantity ?? 1
    const statusDot =
      order.status === "Delivered"
        ? "bg-[#34A853]"
        : order.status === "Processing"
          ? "bg-[#E37400]"
          : "bg-[#D93025]"
    const rawJson = JSON.stringify(order, null, 2)

    return { pBadge, ch, items, qty, statusDot, rawJson }
  }

  return (
    <DashboardLayout
      title={t.title}
      locale={locale}
      currency={currency}
      onCurrencyToggle={() => setCurrency(currency === "USD" ? "KRW" : "USD")}
    >
      <div className="flex flex-1 flex-col overflow-hidden px-6 pt-4 pb-4 lg:px-8">
        <div
          className="flex flex-1 flex-col overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white"
          style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.06)" }}
        >
          {/* Filters */}
          <div className="shrink-0 border-b border-[rgba(0,0,0,0.08)] px-5 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#999999]" strokeWidth={2} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSuggestionIndex(0)
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  window.setTimeout(() => setSearchFocused(false), 120)
                }}
                onKeyDown={(e) => {
                  if (!showSuggestions) {
                    if (e.key === "Escape") setSearchFocused(false)
                    return
                  }

                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setSuggestionIndex((current) => (current + 1) % suggestions.length)
                    return
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setSuggestionIndex((current) => (current - 1 + suggestions.length) % suggestions.length)
                    return
                  }

                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault()
                    const suggestion = suggestions[suggestionIndex]
                    if (suggestion) applySuggestion(suggestion)
                    return
                  }

                  if (e.key === "Escape") {
                    e.preventDefault()
                    setSearchFocused(false)
                  }
                }}
                placeholder={t.searchPlaceholder}
                className="h-9 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white pl-9 pr-3 text-[13px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none"
              />

              {showSuggestions && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white shadow-[0_12px_40px_rgba(24,25,37,0.12)]">
                  <div className="max-h-80 overflow-y-auto py-1.5">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => applySuggestion(suggestion)}
                        className={`flex w-full items-start justify-between gap-4 px-3 py-2.5 text-left transition-colors ${
                          index === suggestionIndex ? "bg-[#918DF6]/10" : "hover:bg-[rgba(0,0,0,0.03)]"
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold tracking-[-0.32px] text-[#181925]">
                              {suggestion.label}
                            </span>
                            <span className="rounded-full bg-[rgba(0,0,0,0.05)] px-2 py-0.5 text-[11px] font-medium tracking-[-0.24px] text-[#666666]">
                              {suggestion.kind === "field" ? t.field : t.value}
                            </span>
                          </div>
                          <p className="text-[12px] tracking-[-0.24px] text-[#666666]">{suggestion.description}</p>
                        </div>
                        <span className="shrink-0 text-[12px] tracking-[-0.24px] text-[#999999]">{suggestion.example}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {structuredFilters.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {structuredFilters.map((filter, index) => {
                  const chipClassName = getChipClasses(filter)
                  const channelStyle = filter.field === "channel"
                    ? Object.entries(deliveryChannels).find(([name]) => normalizeSearchValue(name) === normalizeSearchValue(filter.value))?.[1]
                    : undefined

                  return (
                    <button
                      key={`${filter.field}-${filter.value}-${filter.operator ?? "eq"}-${index}`}
                      type="button"
                      onClick={() => removeFilterChip(filter)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-medium tracking-[-0.24px] transition-colors hover:opacity-80 ${chipClassName}`}
                      style={channelStyle ? { backgroundColor: channelStyle.bg, color: channelStyle.color } : undefined}
                    >
                      <span>
                        {filter.field}: {`${filter.operator ?? ""}${filter.value}`}
                      </span>
                      <X className="size-3" strokeWidth={2.4} />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-[rgba(0,0,0,0.08)]">
                  <th className="px-5 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.orderID}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.product}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.customer}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.platform}</th>
                  <th className="px-3 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.amount}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.status}</th>
                  <th className="px-3 py-2.5 text-left text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.delivery}</th>
                  <th className="px-5 py-2.5 text-right text-[13px] font-medium tracking-[-0.32px] text-[#999999]">{t.time}</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map((order) => {
                  const badge = platformBadges[order.platform]
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer border-b border-[rgba(0,0,0,0.05)] transition-colors hover:bg-neutral-50/60 ${
                        order.status === "Failed" ? "bg-[#D93025]/[0.06] border-l-2 border-l-[#D93025]" : ""
                      }`}
                    >
                      <td className="px-5 py-3 text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                        #{order.id}
                      </td>
                      <td className="max-w-[240px] px-3 py-3">
                        <p className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">
                          {order.product}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-[14px] tracking-[-0.32px] text-[#181925]">
                        {order.customer}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {badge && (
                            <span className={`${badge.bg} inline-flex size-4 shrink-0 items-center justify-center rounded font-bold text-white ${badge.textSize}`}>
                              {badge.label}
                            </span>
                          )}
                          <span className="text-[14px] tracking-[-0.32px] text-[#666666]">{order.platform}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <span className="text-[14px] font-semibold tabular-nums tracking-[-0.32px] text-[#181925]">
                          {locale === "kr" ? formatKRW(order.amount) : formatUSD(order.amount)}
                        </span>
                        {locale === "en" && currency === "KRW" && (
                          <p className="text-[12px] font-medium tabular-nums tracking-[-0.32px] text-[#999999]">
                            {formatKRW(order.amount)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={order.status} locale={locale} />
                      </td>
                      <td className="px-3 py-3">
                        <DeliveryChannel channel={order.delivery} locale={locale} />
                      </td>
                      <td className="px-5 py-3 text-right text-[13px] tracking-[-0.32px] text-[#999999]">
                        {order.time}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div ref={sentinelRef} className="h-1 shrink-0" />
          </div>

          <div className="flex shrink-0 items-center justify-center border-t border-[rgba(0,0,0,0.08)] px-5 py-3">
            {loading ? (
              <Loader2 className="size-4 animate-spin text-[#999999]" strokeWidth={2} />
            ) : allLoaded ? (
              <p className="text-[13px] tracking-[-0.32px] text-[#999999]">
                {t.allOrdersLoaded(filtered.length)}
              </p>
            ) : (
              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                <span className="font-medium tabular-nums text-[#181925]">{visibleOrders.length}</span> {t.of}{" "}
                <span className="font-medium tabular-nums text-[#181925]">{TOTAL_ORDERS}</span> {t.ordersLoaded}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (() => {
        const { pBadge, ch, items, qty, statusDot, rawJson } = getOrderDialogData(selectedOrder)

        return (
          <Dialog
            open={selectedOrder !== null && !channelExpanded && !messagePopupOpen && !rawDataPopupOpen && !channelResendConfirm && !sourcePopupOpen && !licensePopupOpen && !retryDialogOpen && !reassignDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedOrder(null)
                setActiveTab("overview")
                setChannelExpanded(false)
                setShowRawData(false)
                setMessagePopupOpen(false)
                setRawDataPopupOpen(false)
                setCopiedItemIdx(null)
                setMemoFocused(false)
                setMemoSaveStatus("idle")
                setCopiedRawData(false)
                setBuyerEditing(false)
                setChannelResendConfirm(false)
                setStatusEditing(false)
                setReassignDialogOpen(false)
                setRetryDialogOpen(false)
                setRetryRunning(false)
                setRetryDone(false)
                setReassignRunning(false)
                setReassignDone(false)
                setReassignSelectedKey([])
                setSourcePopupOpen(false)
                setLicensePopupOpen(false)
                setCopiedLicenseKey(false)
              }
            }}
          >
            <DialogContent className="sm:max-w-4xl gap-0 overflow-hidden p-0" showCloseButton={false}>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[rgba(0,0,0,0.08)] px-6 py-4">
              <div>
                <DialogHeader className="p-0 space-y-1">
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-[20px] font-bold tracking-[-0.32px] text-[#181925]">
                      Order #{selectedOrder.id}
                    </DialogTitle>
                    <div className="relative flex items-center gap-1.5">
                      <StatusBadge status={selectedOrder.status} locale={locale} />
                      <button
                        onClick={() => setStatusEditing(!statusEditing)}
                        className="flex size-5 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                      >
                        <Pencil className="size-3 text-[#999999]" strokeWidth={2} />
                      </button>
                      {statusEditing && (
                        <div className="absolute top-full left-0 z-50 mt-1.5 flex flex-col rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1 shadow-lg">
                          {(["Delivered", "Processing", "Failed"] as const).map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatusEditing(false)}
                              className={`flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium tracking-[-0.32px] transition-colors hover:bg-[rgba(0,0,0,0.04)] ${s === selectedOrder.status ? "text-[#181925]" : "text-[#666666]"}`}
                            >
                              <span className={`size-1.5 rounded-full ${s === "Delivered" ? "bg-[#34A853]" : s === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                              {s}
                              {s === selectedOrder.status && <Check className="ml-1 size-3 text-[#181925]" strokeWidth={2.5} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogDescription className="text-[15px] font-medium tracking-[-0.32px] text-[#666666]">
                    {selectedOrder.product}
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setResendChannel(selectedOrder.delivery)
                    setResendTarget(selectedOrder.deliveryTarget || selectedOrder.email || "")
                    setAdvancedResendOpen(true)
                  }}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-[#181925] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d]"
                >
                  <Send className="size-3.5" strokeWidth={2} />
                  {locale === "kr" ? "다시 보내기" : "Resend"}
                </button>
                <button onClick={() => setSelectedOrder(null)} className="mt-0.5 flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[rgba(0,0,0,0.06)]">
                  <X className="size-4 text-[#666666]" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-[rgba(0,0,0,0.08)] px-6">
              {(["overview", "logs"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2.5 pt-3 text-[13px] font-medium tracking-[-0.32px] transition-colors ${activeTab === tab ? "text-[#181925]" : "text-[#999999] hover:text-[#666666]"}`}
                >
                  {tab === "overview" ? t.overview : t.logs}
                  {activeTab === tab && <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-[#181925]" />}
                </button>
              ))}
            </div>

            <div className="max-h-[70vh] overflow-y-auto">
              {activeTab === "overview" ? (
                <>
                  {/* Pipeline Flow Strip */}
                  <div className="bg-[rgba(0,0,0,0.02)] px-6 py-5">
                    <div className="flex items-stretch gap-0">
                      <button
                        onClick={() => setSourcePopupOpen(true)}
                        className="group flex min-w-0 flex-1 flex-col rounded-l-lg border border-[rgba(0,0,0,0.08)] bg-white px-5 py-4 text-left transition-all hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02] hover:shadow-sm"
                      >
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.source}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {pBadge && <PlatformBadgeIcon badge={pBadge} size="size-5" />}
                          <span className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.platform}</span>
                        </div>
                        <p className="mt-1 truncate text-[13px] tracking-[-0.32px] text-[#666666]">{selectedOrder.storeName || selectedOrder.platform}</p>
                        <p className="mt-1 truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.product}</p>
                        <p className="mt-auto pt-3 flex items-center gap-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">
                          {locale === "kr" ? "자세히" : "Details"}
                          <ChevronRight className="size-3" strokeWidth={2.5} />
                        </p>
                      </button>

                      <button
                        onClick={() => setLicensePopupOpen(true)}
                        className="group flex min-w-0 flex-1 flex-col border-y border-[rgba(0,0,0,0.08)] bg-white px-5 py-4 text-left transition-all hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02] hover:shadow-sm"
                      >
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.license}</p>
                        <p className="mt-2 truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.product}</p>
                        <p className="mt-1 truncate font-mono text-[13px] tracking-[-0.32px] text-[#666666]">
                          {qty > 1 ? `${qty}\uAC1C \uB77C\uC774\uC120\uC2A4` : (items[0]?.keyCode || selectedOrder.keyCode)}
                        </p>
                        <p className="mt-auto pt-3 flex items-center gap-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">
                          {locale === "kr" ? "자세히" : "Details"}
                          <ChevronRight className="size-3" strokeWidth={2.5} />
                        </p>
                      </button>

                      <button
                        onClick={() => setChannelExpanded(true)}
                        className={`group flex min-w-0 flex-1 flex-col rounded-r-lg border px-5 py-4 text-left transition-all hover:shadow-sm ${
                          selectedOrder.status === "Failed"
                            ? "border-[#D93025]/30 bg-[#D93025]/[0.03] hover:bg-[#D93025]/[0.06]"
                            : "border-[rgba(0,0,0,0.08)] bg-white hover:border-[#918DF6]/30 hover:bg-[#918DF6]/[0.02]"
                        }`}
                      >
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.channel}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {ch && <span style={{ color: ch.color }}>{ch.icon}</span>}
                          <span className="truncate text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.delivery}</span>
                          <span className={`size-2 shrink-0 rounded-full ${statusDot}`} />
                        </div>
                        <p className="mt-1 truncate text-[13px] tracking-[-0.32px] text-[#666666]">{selectedOrder.deliveryTarget || "—"}</p>
                        {selectedOrder.status === "Failed" && selectedOrder.errorMessage && (
                          <div className="mt-2 rounded-md border border-[#D93025]/15 bg-[#D93025]/[0.06] px-2.5 py-2">
                            <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">{selectedOrder.errorStep}</p>
                            <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{selectedOrder.errorMessage}</p>
                          </div>
                        )}
                        <p className="mt-auto pt-3 flex items-center gap-0.5 text-[12px] font-medium tracking-[-0.32px] text-[#918DF6]">
                          {locale === "kr" ? "자세히" : "Details"}
                          <ChevronRight className="size-3" strokeWidth={2.5} />
                        </p>
                      </button>
                    </div>
                  </div>

                   {/* Two-column layout */}
                  <div className="grid grid-cols-2 gap-0 divide-x divide-[rgba(0,0,0,0.08)]">
                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-5 p-6">
                      {/* Product */}
                      <div>
                         <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.productLabel}</p>
                        <p className="mt-2.5 text-[15px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.product}</p>
                        <div className="mt-2 flex items-center gap-4 text-[13px] tabular-nums tracking-[-0.32px]">
                          <div>
                            <span className="text-[#999999]">{locale === "kr" ? "판매금액" : "Sale"} </span>
                            <span className="font-semibold text-[#181925]">
                              {locale === "kr" ? formatKRW(selectedOrder.amount) : formatUSD(selectedOrder.amount)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#999999]">{locale === "kr" ? "순수익" : "Profit"} </span>
                            <span className="font-semibold text-[#34A853]">
                              {locale === "kr" ? formatKRW(selectedOrder.amount * 0.3) : formatUSD(selectedOrder.amount * 0.3)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                      {/* Buyer */}
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.buyer}</p>
                          {!buyerEditing && (
                            <button onClick={() => setBuyerEditing(true)} className="text-[12px] font-medium tracking-[-0.32px] text-[#918DF6] hover:underline">{t.edit}</button>
                          )}
                        </div>
                        {buyerEditing ? (
                          <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.name}</p>
                              <input defaultValue={selectedOrder.customer} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" />
                            </div>
                            <div>
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.phone}</p>
                              <input defaultValue={selectedOrder.phone || ""} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" />
                            </div>
                            <div className="col-span-2">
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.email}</p>
                              <input defaultValue={selectedOrder.email} className="mt-0.5 h-7 w-full rounded-md border border-[rgba(0,0,0,0.12)] bg-white px-2 text-[13px] tracking-[-0.32px] text-[#181925] outline-none" />
                            </div>
                            <div className="col-span-2 flex justify-end gap-2">
                              <button onClick={() => setBuyerEditing(false)} className="h-7 rounded-lg px-2.5 text-[11px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancel}</button>
                              <button onClick={() => setBuyerEditing(false)} className="h-7 rounded-lg bg-[#181925] px-2.5 text-[11px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3a]">{t.save}</button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
                            <div>
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.name}</p>
                              <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.customer}</p>
                            </div>
                            <div>
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.phone}</p>
                              <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.phone || "\u2014"}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.email}</p>
                              <p className="mt-0.5 truncate text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.email}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                      {/* Delivery Details */}
                      <div>
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.deliveryDetails}</p>
                        <div className="mt-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.015)]">
                          <div className="flex items-center gap-3 border-b border-[rgba(0,0,0,0.06)] px-4 py-3.5">
                            {ch && <span className="text-lg" style={{ color: ch.color }}>{ch.icon}</span>}
                            <div className="flex-1">
                              <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{selectedOrder.delivery}</p>
                              <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{selectedOrder.deliveryTarget || "\u2014"}</p>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.06)] bg-white px-2.5 py-1">
                              <span className={`size-2 rounded-full ${statusDot}`} />
                              <span className="text-[12px] font-medium tracking-[-0.32px] text-[#181925]">
                                {selectedOrder.status === "Delivered" ? t.delivered : selectedOrder.status === "Processing" ? t.pending : t.failed}
                              </span>
                            </div>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-[13px] tracking-[-0.32px] text-[#666666]">
                              <span className="font-medium text-[#181925]">{selectedOrder.recipientName || selectedOrder.customer}</span>
                              {" · "}
                              {selectedOrder.time}
                              {" · "}
                              {selectedOrder.storeName || selectedOrder.platform}
                            </p>
                          </div>
                          {selectedOrder.status === "Failed" && selectedOrder.errorMessage && (
                            <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-3">
                              <div className="rounded-md border border-[#D93025]/15 bg-[#D93025]/[0.04] px-3 py-2.5">
                                <p className="text-[12px] font-semibold tracking-[-0.32px] text-[#D93025]">{selectedOrder.errorStep}</p>
                                <p className="mt-1 text-[12px] leading-relaxed tracking-[-0.32px] text-[#666666]">{selectedOrder.errorMessage}</p>
                              </div>
                            </div>
                          )}
                          <div className="border-t border-[rgba(0,0,0,0.06)] px-4 py-3">
                            <button onClick={() => setChannelResendConfirm(true)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3.5 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]">
                              <RotateCcw className="size-3.5" strokeWidth={2} />
                              {t.resendVia(selectedOrder.delivery)}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-5 p-6">
                      {/* License */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.licenseLabel}</p>
                          {qty > 1 && <span className="rounded-full bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-[11px] font-semibold tabular-nums tracking-[-0.32px] text-[#666666]">{qty}</span>}
                        </div>
                        <div className="mt-2.5 flex flex-col gap-1.5">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] px-3 py-2"
                            >
                              <span className={`size-1.5 shrink-0 rounded-full ${item.status === "Delivered" ? "bg-[#34A853]" : item.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                              <span className="flex-1 truncate font-mono text-[12px] tracking-[-0.32px] text-[#181925]">{item.keyCode}</span>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleCopyKey(item.keyCode, idx)
                                }}
                                className="flex size-6 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                              >
                                {copiedItemIdx === idx ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}
                              </button>
                            </div>
                          ))}
                        </div>
                        {selectedOrder.keyCode.endsWith("0000") && (
                          <p className="mt-2 text-[11px] tracking-[-0.32px] text-[#E37400]">{t.keyPlaceholderWarning}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => { setReassignSelectedKey([]); setReassignRunning(false); setReassignDone(false); setReassignDialogOpen(true) }}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                          >
                            {t.reassignLicense}
                          </button>
                          <button
                            onClick={() => { setRetryRunning(false); setRetryDone(false); setRetryDialogOpen(true) }}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                          >
                            <RotateCcw className="size-3.5" strokeWidth={2} />
                            {t.retry}
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                      {/* Admin Memo */}
                      <div>
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.adminMemo}</p>
                        <textarea
                          defaultValue={selectedOrder.adminMemo || ""}
                          placeholder={t.addNote}
                          rows={memoFocused || (selectedOrder.adminMemo && selectedOrder.adminMemo.length > 0) ? 3 : 1}
                          onFocus={() => setMemoFocused(true)}
                          onBlur={() => setMemoFocused(false)}
                          onChange={handleMemoChange}
                          className="mt-2 w-full resize-none rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 py-2 text-[12px] tracking-[-0.32px] text-[#181925] placeholder:text-[#999999] outline-none transition-all"
                        />
                        <div className="mt-1 flex items-center gap-1.5">
                          {memoSaveStatus === "saving" && (
                            <div className="flex items-center gap-1">
                              <Loader2 className="size-3 animate-spin text-[#999999]" strokeWidth={2} />
                              <p className="text-[10px] tracking-[-0.32px] text-[#999999]">{t.saving}</p>
                            </div>
                          )}
                          {memoSaveStatus === "saved" && (
                            <div className="flex items-center gap-1">
                              <Check className="size-3 text-[#34A853]" strokeWidth={2.5} />
                              <p className="text-[10px] tracking-[-0.32px] text-[#34A853]">{t.autoSaved}</p>
                            </div>
                          )}
                          {memoSaveStatus === "idle" && (
                            <p className="text-[10px] tracking-[-0.32px] text-[#999999]">{t.autoSave}</p>
                          )}
                        </div>
                      </div>

                      <div className="h-px bg-[rgba(0,0,0,0.08)]" />

                      {/* Danger Zone */}
                      <div>
                        <p className="text-[13px] font-semibold tracking-[-0.32px] text-[#999999]">{t.dangerZone}</p>
                        <div className="mt-3 flex gap-2">
                          <button className="inline-flex h-9 items-center rounded-lg border border-[rgba(0,0,0,0.08)] px-4 text-[13px] font-medium tracking-[-0.32px] text-[#D93025] transition-colors hover:bg-[#D93025]/[0.04]">
                            {t.cancelOrder}
                          </button>
                          <button className="inline-flex h-9 items-center rounded-lg bg-[#D93025] px-4 text-[13px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#c12b20]">
                            {t.deleteOrder}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Logs Tab */
                <div className="p-6">
                  {/* Timeline */}
                  <div className="relative flex flex-col">
                    <div className="absolute left-[7px] top-2.5 bottom-2.5 w-px bg-[rgba(0,0,0,0.10)]" />

                    {/* Order created */}
                    <div className="relative flex items-start gap-3 pb-5">
                      <span className="relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] border-[#1A73E8] bg-white" />
                      <div>
                        <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{t.orderCreated}</p>
                        <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                          {formatStepTime(selectedOrder.time, selectedOrder.flowTiming?.orderCreated || "0")} · {selectedOrder.storeName || selectedOrder.platform}
                        </p>
                      </div>
                    </div>

                    {/* License assigned */}
                    <div className="relative flex items-start gap-3 pb-5">
                      <span className={`relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] bg-white ${
                        selectedOrder.status === "Failed" && selectedOrder.errorStep?.includes("Key")
                          ? "border-[#D93025]"
                          : "border-[#34A853]"
                      }`} />
                      <div>
                        <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {selectedOrder.status === "Failed" && selectedOrder.errorStep?.includes("Key") ? t.licenseAssignmentFailed : t.licenseAssigned}
                        </p>
                        <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                          {formatStepTime(selectedOrder.time, selectedOrder.flowTiming?.licenseAssigned || "—")}
                          {items.length > 0 && ` · ${items[0].keyCode}`}
                        </p>
                        {selectedOrder.status === "Failed" && selectedOrder.errorStep?.includes("Key") && selectedOrder.errorMessage && (
                          <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#D93025]">{selectedOrder.errorMessage}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery sent */}
                    <div className="relative flex items-start gap-3 pb-5">
                      <span className={`relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] bg-white ${
                        selectedOrder.status === "Failed"
                          ? "border-[#D93025]"
                          : selectedOrder.status === "Processing"
                            ? "border-[#E37400]"
                            : "border-[#34A853]"
                      }`} />
                      <div>
                        <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">
                          {selectedOrder.status === "Failed" ? t.deliveryFailed : selectedOrder.status === "Processing" ? t.deliveryPending : t.deliverySent}
                        </p>
                        <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                          {formatStepTime(selectedOrder.time, selectedOrder.flowTiming?.deliverySent || "—")} · {selectedOrder.delivery} → {selectedOrder.deliveryTarget || "—"}
                        </p>
                        {selectedOrder.status === "Failed" && selectedOrder.errorMessage && !selectedOrder.errorStep?.includes("Key") && (
                          <p className="mt-1 text-[13px] tracking-[-0.32px] text-[#D93025]">{selectedOrder.errorMessage}</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery confirmed */}
                    {selectedOrder.status === "Delivered" && selectedOrder.flowTiming?.deliveryConfirmed && (
                      <div className="relative flex items-start gap-3">
                        <span className="relative z-10 mt-0.5 size-[14px] shrink-0 rounded-full border-[2.5px] border-[#34A853] bg-white" />
                        <div>
                          <p className="text-[15px] font-semibold tracking-[-0.32px] text-[#181925]">{t.deliveryConfirmed}</p>
                          <p className="mt-0.5 text-[13px] tracking-[-0.32px] text-[#999999]">
                            {formatStepTime(selectedOrder.time, selectedOrder.flowTiming.deliveryConfirmed)} · {t.totalTime} {selectedOrder.flowTiming.deliveryConfirmed}
                          </p>
                          <p className="mt-0.5 text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.normalDelivery}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Raw Data collapsible */}
                  <div className="mt-6 border-t border-[rgba(0,0,0,0.08)] pt-4">
                    <button
                      onClick={() => setShowRawData(!showRawData)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                    >
                      <ChevronDown className={`size-3 transition-transform ${showRawData ? "rotate-180" : ""}`} strokeWidth={2} />
                      {showRawData ? t.hideRawData : t.showRawData}
                    </button>
                    {showRawData && (
                      <div className="relative mt-3">
                        <pre className="max-h-60 overflow-auto rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-4 font-mono text-[11px] leading-relaxed text-[#666666] whitespace-pre-wrap">
                          {rawJson}
                        </pre>
                        <button
                          onClick={() => handleCopyRawData(rawJson)}
                          className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-white border border-[rgba(0,0,0,0.08)] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                        >
                          {copiedRawData ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && sourcePopupOpen && (() => {
        const { pBadge } = getOrderDialogData(selectedOrder)

        return (
          <Dialog open={sourcePopupOpen} onOpenChange={(open) => {
            if (!open) setSourcePopupOpen(false)
          }}>
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  {pBadge && (
                    <PlatformBadgeIcon badge={pBadge} size="size-9" />
                  )}
                  <div>
                    <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {selectedOrder.platform}
                    </DialogTitle>
                    <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">
                      {selectedOrder.storeName || selectedOrder.platform}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2.5 rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.orderIdLabel}</span>
                    <span className="font-mono text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">#{selectedOrder.id}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.customerLabel}</span>
                    <span className="text-[13px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.amountLabel}</span>
                    <span className="text-[13px] font-medium tabular-nums tracking-[-0.32px] text-[#181925]">{locale === "kr" ? formatKRW(selectedOrder.amount) : formatUSD(selectedOrder.amount)}</span>
                  </div>
                  {selectedOrder.flowTiming && (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.orderReceived}</span>
                      <span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{selectedOrder.flowTiming.orderCreated}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSourcePopupOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    {t.goToMerchants}
                  </button>
                  <button
                    onClick={() => setSourcePopupOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                  >
                    {t.viewOn(selectedOrder.platform)}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && licensePopupOpen && (() => {
        const { items, qty } = getOrderDialogData(selectedOrder)

        return (
          <Dialog open={licensePopupOpen} onOpenChange={(open) => {
            if (!open) {
              setLicensePopupOpen(false)
              setCopiedLicenseKey(false)
            }
          }}>
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {t.licenseDetails}
                </DialogTitle>
                <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">
                  {selectedOrder.product}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-3">
                {items.map((item, idx) => (
                  <div key={item.keyCode} className="flex items-center justify-between rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3">
                    <div className="min-w-0 flex-1">
                      {qty > 1 && <p className="text-[11px] font-medium tracking-[-0.32px] text-[#999999]">Key {idx + 1}</p>}
                      <p className="truncate font-mono text-[14px] font-medium tracking-[0.3px] text-[#181925]">{item.keyCode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${item.status === "Delivered" ? "bg-[#34A853]" : item.status === "Processing" ? "bg-[#E37400]" : "bg-[#D93025]"}`} />
                      <button
                        onClick={() => {
                          void navigator.clipboard.writeText(item.keyCode)
                          setCopiedLicenseKey(true)
                          setTimeout(() => setCopiedLicenseKey(false), 1500)
                        }}
                        className="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-[rgba(0,0,0,0.06)]"
                      >
                        {copiedLicenseKey ? <Check className="size-4 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-4 text-[#999999]" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>
                ))}
                {selectedOrder.flowTiming && (
                  <div className="flex flex-col gap-2.5 rounded-lg bg-[rgba(0,0,0,0.02)] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assignedAt}</span>
                      <span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{selectedOrder.flowTiming.licenseAssigned}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setLicensePopupOpen(false)
                      setRetryDialogOpen(true)
                    }}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#918DF6] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    <RotateCcw className="size-4" strokeWidth={2} />
                    {t.retryAssignment}
                  </button>
                  <button
                    onClick={() => {
                      setLicensePopupOpen(false)
                      setReassignDialogOpen(true)
                    }}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                  >
                    {t.reassignLicense}
                  </button>
                  <button
                    onClick={() => setLicensePopupOpen(false)}
                    className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[14px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                  >
                    {t.viewInInventory}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && channelExpanded && (() => {
        const { ch } = getOrderDialogData(selectedOrder)

        return (
          <Dialog open={channelExpanded} onOpenChange={(open) => {
            if (!open) setChannelExpanded(false)
          }}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <div className="flex items-center gap-2.5">
                  {ch && <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ch.color}18`, color: ch.color }}>{ch.icon}</span>}
                  <div>
                    <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                      {selectedOrder.delivery} Delivery
                    </DialogTitle>
                    <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                      {selectedOrder.deliveryTarget || "—"}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between rounded-lg bg-[rgba(0,0,0,0.02)] px-3.5 py-2.5">
                  <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.statusLabel}</span>
                  <StatusBadge status={selectedOrder.status} locale={locale} />
                </div>
                {selectedOrder.flowTiming && (
                  <div className="flex flex-col gap-2 rounded-lg bg-[rgba(0,0,0,0.02)] px-3.5 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.sentAt}</span>
                      <span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#181925]">{selectedOrder.flowTiming.deliverySent}</span>
                    </div>
                    {selectedOrder.flowTiming.deliveryConfirmed && (
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.confirmedAt}</span>
                        <span className="font-mono text-[13px] tabular-nums tracking-[-0.32px] text-[#34A853]">{selectedOrder.flowTiming.deliveryConfirmed}</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setChannelExpanded(false)
                      setChannelResendConfirm(true)
                    }}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-medium tracking-[-0.32px] text-white transition-colors"
                    style={{ backgroundColor: ch?.color || "#181925" }}
                  >
                    <Send className="size-3.5" strokeWidth={2} />
                    {t.resend}
                  </button>
                  <button
                    onClick={() => {
                      setChannelExpanded(false)
                      setMessagePopupOpen(true)
                    }}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                  >
                    {t.viewMessage}
                  </button>
                  <button
                    onClick={() => {
                      setChannelExpanded(false)
                      setRawDataPopupOpen(true)
                    }}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full border border-[rgba(0,0,0,0.08)] text-[13px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.03)]"
                  >
                    {t.viewRawData}
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && messagePopupOpen && (() => {
        return (
          <Dialog open={messagePopupOpen} onOpenChange={setMessagePopupOpen}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">{t.messageTitle}</DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">#{selectedOrder.id} · {selectedOrder.delivery}</DialogDescription>
              </DialogHeader>
              <pre className="max-h-60 overflow-auto rounded-lg bg-[rgba(0,0,0,0.03)] p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-[#181925]">
                {selectedOrder.deliveryMessage || t.noMessage}
              </pre>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && rawDataPopupOpen && (() => {
        const { rawJson } = getOrderDialogData(selectedOrder)

        return (
          <Dialog open={rawDataPopupOpen} onOpenChange={setRawDataPopupOpen}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">Raw Data</DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">Order #{selectedOrder.id}</DialogDescription>
              </DialogHeader>
              <div className="relative">
                <pre className="max-h-80 overflow-auto rounded-lg bg-[rgba(0,0,0,0.03)] p-4 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-[#666666]">
                  {rawJson}
                </pre>
                <button
                  onClick={() => handleCopyRawData(rawJson)}
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.08)] bg-white transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                >
                  {copiedRawData ? <Check className="size-3 text-[#34A853]" strokeWidth={2.5} /> : <Copy className="size-3 text-[#999999]" strokeWidth={2} />}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && channelResendConfirm && (() => {
        const { ch, statusDot } = getOrderDialogData(selectedOrder)

        return (
          <Dialog open={channelResendConfirm} onOpenChange={(open) => {
            if (!open) {
              setChannelResendConfirm(false)
              setResendRunning(false)
              setResendDone(null)
            }
          }}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {resendDone === "success" ? t.resendComplete : resendDone === "failed" ? t.resendFailedTitle : resendRunning ? t.resending : t.resendConfirmTitle}
                </DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#999999]">
                  {resendDone === "success" ? t.resendCompleteDesc : resendDone === "failed" ? t.resendFailedDesc : resendRunning ? t.resendingDesc : t.resendConfirmDesc}
                </DialogDescription>
              </DialogHeader>

              {resendRunning && !resendDone && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader2 className="size-8 animate-spin" style={{ color: ch?.color || "#918DF6" }} strokeWidth={2} />
                  <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.resendingChannel(selectedOrder.delivery)}</p>
                </div>
              )}

              {resendDone === "success" && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(52,168,83,0.1)]">
                    <Check className="size-6 text-[#34A853]" strokeWidth={2} />
                  </span>
                  <div className="text-center">
                    <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{t.sendComplete}</p>
                    <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">{t.sendCompleteDesc(selectedOrder.deliveryTarget || "")}</p>
                  </div>
                </div>
              )}

              {resendDone === "failed" && (
                <div className="flex flex-col items-center gap-3 py-6">
                  <span className="flex size-12 items-center justify-center rounded-full bg-[rgba(217,48,37,0.1)]">
                    <X className="size-6 text-[#D93025]" strokeWidth={2} />
                  </span>
                  <div className="text-center">
                    <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{t.sendFailed}</p>
                    <p className="mt-1 text-[12px] tracking-[-0.32px] text-[#666666]">{t.channelError}</p>
                  </div>
                </div>
              )}

              {!resendRunning && !resendDone && (
                <>
                  <div className="flex flex-col gap-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[rgba(0,0,0,0.02)] p-4">
                    <div className="flex items-center gap-2">
                      {ch && <span style={{ color: ch.color }}>{ch.icon}</span>}
                      <span className="text-[15px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.delivery}</span>
                      <span className={`size-2 rounded-full ${statusDot}`} />
                    </div>
                    <div className="flex flex-col gap-2 text-[14px] tracking-[-0.32px] text-[#666666]">
                      <div className="flex justify-between gap-3">
                        <span className="text-[#999999]">{t.recipientLabel}</span>
                        <span className="font-medium text-[#181925]">{selectedOrder.customer}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-[#999999]">{t.targetLabel}</span>
                        <span className="font-medium text-[#181925]">{selectedOrder.deliveryTarget || "—"}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-[#999999]">{t.productShort}</span>
                        <span className="max-w-[200px] truncate font-medium text-[#181925]">{selectedOrder.product}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span className="text-[#999999]">{t.keyLabel}</span>
                        <span className="font-mono font-medium text-[#181925]">{selectedOrder.keyCode}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={() => setChannelResendConfirm(false)} className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]">{t.cancelBtn}</button>
                    <button
                      onClick={() => {
                        setResendRunning(true)
                        setTimeout(() => {
                          setResendRunning(false)
                          setResendDone(Math.random() > 0.2 ? "success" : "failed")
                        }, 2000)
                      }}
                      className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors"
                      style={{ backgroundColor: ch?.color || "#181925" }}
                    >
                      {t.resendBtn}
                    </button>
                  </div>
                </>
              )}

              {resendDone && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => { setChannelResendConfirm(false); setResendRunning(false); setResendDone(null) }}
                    className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors bg-[#918DF6] hover:bg-[#7B77E0]"
                  >
                    {t.confirm}
                  </button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && retryDialogOpen && (() => {
        return (
          <Dialog open={retryDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setRetryDialogOpen(false)
              setRetryRunning(false)
              setRetryDone(false)
            }
          }}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {retryDone ? t.retryComplete : retryRunning ? t.retrying : t.retryLicenseAssignment}
                </DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#666666]">
                  {retryDone
                    ? t.retryCompleteDesc
                    : retryRunning
                      ? t.retryingDesc
                      : t.retryDesc}
                </DialogDescription>
              </DialogHeader>
              {retryRunning && !retryDone && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2} />
                  <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assigningLicense}</p>
                </div>
              )}
              {retryDone && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check className="size-4 text-[#34A853]" strokeWidth={2.5} />
                      <p className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.licenseAssignedSuccess}</p>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                      <div className="flex justify-between gap-3">
                        <span>{t.product}</span>
                        <span className="font-medium text-[#181925]">{selectedOrder.product}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>{t.keyLabel}</span>
                        <span className="font-mono font-medium text-[#181925]">{selectedOrder.keyCode}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>{t.duration}</span>
                        <span className="font-medium text-[#181925]">0.4s</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                {retryDone ? (
                  <button
                    onClick={() => {
                      setRetryDialogOpen(false)
                      setRetryRunning(false)
                      setRetryDone(false)
                    }}
                    className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    {t.done}
                  </button>
                ) : retryRunning ? null : (
                  <>
                    <button
                      onClick={() => setRetryDialogOpen(false)}
                      className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        setRetryRunning(true)
                        setTimeout(() => {
                          setRetryRunning(false)
                          setRetryDone(true)
                        }, 2000)
                      }}
                      className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                    >
                      <span className="flex items-center gap-1.5">
                        <RotateCcw className="size-3" strokeWidth={2} />
                        {t.retryNow}
                      </span>
                    </button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && reassignDialogOpen && (() => {
        const mockAvailableKeys = [
          { code: `${selectedOrder.product.slice(0, 4).toUpperCase()}-NEW1-X8K2`, addedDate: "Apr 28, 2026" },
          { code: `${selectedOrder.product.slice(0, 4).toUpperCase()}-NEW2-M4P7`, addedDate: "Apr 27, 2026" },
          { code: `${selectedOrder.product.slice(0, 4).toUpperCase()}-NEW3-R9T1`, addedDate: "Apr 26, 2026" },
        ]

        return (
          <Dialog open={reassignDialogOpen} onOpenChange={(open) => {
            if (!open) {
              setReassignDialogOpen(false)
              setReassignRunning(false)
              setReassignDone(false)
              setReassignSelectedKey([])
            }
          }}>
            <DialogContent className="sm:max-w-sm" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[16px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {reassignDone ? t.licenseReassigned : t.reassignLicenseTitle}
                </DialogTitle>
                <DialogDescription className="text-[13px] tracking-[-0.32px] text-[#666666]">
                  {reassignDone
                    ? t.reassignedDesc(reassignSelectedKey.length)
                    : t.selectLicenses(selectedOrder.id)}
                </DialogDescription>
              </DialogHeader>
              {reassignRunning && !reassignDone && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="size-8 animate-spin text-[#918DF6]" strokeWidth={2} />
                  <p className="text-[13px] tracking-[-0.32px] text-[#666666]">{t.assigningLicense}</p>
                </div>
              )}
              {reassignDone && (
                <div className="rounded-lg border border-[#34A853]/15 bg-[#34A853]/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-[#34A853]" strokeWidth={2.5} />
                    <p className="text-[13px] font-medium tracking-[-0.32px] text-[#34A853]">{t.reassigned(reassignSelectedKey.length)}</p>
                  </div>
                  <div className="mt-2 flex flex-col gap-1 text-[12px] tracking-[-0.32px] text-[#666666]">
                    {reassignSelectedKey.map((key) => (
                      <div key={key} className="flex justify-between gap-3">
                        <span>{t.keyLabel}</span>
                        <span className="font-mono font-medium text-[#181925]">{key}</span>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3">
                      <span>{t.product}</span>
                      <span className="font-medium text-[#181925]">{selectedOrder.product}</span>
                    </div>
                  </div>
                </div>
              )}
              {!reassignRunning && !reassignDone && (
                <div className="flex flex-col gap-3">
                  <p className="text-[11px] font-semibold tracking-[-0.32px] text-[#999999]">{t.availableKeys(mockAvailableKeys.length)}</p>
                  <div className="flex flex-col gap-1.5">
                    {mockAvailableKeys.map((key) => (
                      <button
                        key={key.code}
                        type="button"
                        onClick={() => setReassignSelectedKey((prev) => prev.includes(key.code) ? prev.filter((k) => k !== key.code) : [...prev, key.code])}
                        className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          reassignSelectedKey.includes(key.code)
                            ? "border-[#918DF6] bg-[#918DF6]/[0.04]"
                            : "border-[rgba(0,0,0,0.08)] hover:bg-[rgba(0,0,0,0.02)]"
                        }`}
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-[#34A853]" />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[12px] tracking-[-0.32px] text-[#181925]">{key.code}</p>
                          <p className="text-[11px] tracking-[-0.32px] text-[#999999]">{t.added} {key.addedDate}</p>
                        </div>
                        {reassignSelectedKey.includes(key.code) && (
                          <Check className="size-4 shrink-0 text-[#918DF6]" strokeWidth={2.5} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="rounded-lg border border-[rgba(227,116,0,0.15)] bg-[rgba(227,116,0,0.04)] px-3 py-2">
                    <p className="text-[11px] tracking-[-0.32px] text-[#E37400]">
                      {t.currentKeyWarning(selectedOrder.keyCode)}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                {reassignDone ? (
                  <button
                    onClick={() => {
                      setReassignDialogOpen(false)
                      setReassignRunning(false)
                      setReassignDone(false)
                      setReassignSelectedKey([])
                    }}
                    className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0]"
                  >
                    {t.done}
                  </button>
                ) : reassignRunning ? null : (
                  <>
                    <button
                      onClick={() => setReassignDialogOpen(false)}
                      className="h-8 rounded-lg px-3 text-[12px] font-medium tracking-[-0.32px] text-[#666666] transition-colors hover:bg-[rgba(0,0,0,0.04)]"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={() => {
                        if (reassignSelectedKey.length === 0) return
                        setReassignRunning(true)
                        setTimeout(() => {
                          setReassignRunning(false)
                          setReassignDone(true)
                        }, 1500)
                      }}
                      disabled={reassignSelectedKey.length === 0}
                      className="h-8 rounded-lg bg-[#918DF6] px-4 text-[12px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#7B77E0] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.assign(reassignSelectedKey.length)}
                    </button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}

      {selectedOrder && advancedResendOpen && (() => {
        const channels = [
          { id: "Telegram", label: locale === "kr" ? "텔레그램" : "Telegram", icon: deliveryChannels.Telegram?.icon, color: "#2AABEE" },
          { id: "SMS", label: locale === "kr" ? "문자" : "SMS", icon: deliveryChannels.SMS?.icon, color: "#33C758" },
          { id: "Email", label: locale === "kr" ? "이메일" : "Email", icon: deliveryChannels.Email?.icon, color: "#2C78FC" },
          { id: "WhatsApp", label: "WhatsApp", icon: deliveryChannels.WhatsApp?.icon, color: "#25D366" },
        ]

        return (
          <Dialog open={advancedResendOpen} onOpenChange={(open) => {
            if (!open) setAdvancedResendOpen(false)
          }}>
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-[18px] font-semibold tracking-[-0.32px] text-[#181925]">
                  {locale === "kr" ? "다시 보내기" : "Resend"}
                </DialogTitle>
                <DialogDescription className="text-[14px] tracking-[-0.32px] text-[#999999]">
                  {locale === "kr" ? "채널과 받는 사람을 선택하세요" : "Choose channel and recipient"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                    {locale === "kr" ? "보낼 메시지" : "Message"}
                  </p>
                  <div className="mt-2 rounded-lg border border-[#E37400]/30 bg-[#E37400]/[0.04] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg" style={{ backgroundColor: deliveryChannels[selectedOrder.delivery]?.bg, color: deliveryChannels[selectedOrder.delivery]?.color }}>
                        {deliveryChannels[selectedOrder.delivery]?.icon}
                      </span>
                      <div>
                        <p className="text-[14px] font-medium tracking-[-0.32px] text-[#181925]">{selectedOrder.product}</p>
                        <p className="text-[12px] tracking-[-0.32px] text-[#999999]">{selectedOrder.delivery}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                    {locale === "kr" ? "받는 사람" : "Recipient"}
                  </p>
                  <input
                    type="text"
                    value={resendTarget}
                    onChange={(e) => setResendTarget(e.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-4 text-[14px] tracking-[-0.32px] text-[#181925] outline-none transition-colors focus:border-[#918DF6]"
                  />
                  <p className="mt-1.5 text-[12px] tracking-[-0.32px] text-[#999999]">
                    {locale === "kr" ? "받는 번호를 바꿔서 보낼 수 있어요." : "You can change the recipient."}
                  </p>
                </div>

                <div>
                  <p className="text-[13px] font-medium tracking-[-0.32px] text-[#666666]">
                    {locale === "kr" ? "채널 선택" : "Channel"}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {channels.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setResendChannel(ch.id)}
                        className={`flex h-11 items-center justify-center gap-2 rounded-lg border text-[14px] font-medium tracking-[-0.32px] transition-all ${
                          resendChannel === ch.id
                            ? "border-[#181925] bg-[#181925] text-white"
                            : "border-[rgba(0,0,0,0.08)] bg-white text-[#181925] hover:bg-[rgba(0,0,0,0.02)]"
                        }`}
                      >
                        <span style={{ color: resendChannel === ch.id ? "white" : ch.color }}>{ch.icon}</span>
                        {ch.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAdvancedResendOpen(false)
                    setChannelResendConfirm(true)
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#181925] text-[14px] font-medium tracking-[-0.32px] text-white transition-colors hover:bg-[#2a2b3d]"
                >
                  <Send className="size-4" strokeWidth={2} />
                  {locale === "kr" ? `${resendChannel === "SMS" ? "문자" : resendChannel === "Email" ? "이메일" : resendChannel === "Telegram" ? "텔레그램" : resendChannel}로 보내기` : `Send via ${resendChannel}`}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )
      })()}
    </DashboardLayout>
  )
}
