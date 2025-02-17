"use client"

import dynamic from "next/dynamic"

const PurchaseCoins = dynamic(() => import("@/components/PurchaseCoins"), { ssr: false })

export default function PurchaseCoinsPage() {
  return <PurchaseCoins />
}

