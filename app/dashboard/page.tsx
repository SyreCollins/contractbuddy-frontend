"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnalyzeContract } from "@/components/analyze-contract"
import { DraftContract } from "@/components/draft-contract"
import { ShareTokens } from "@/components/share-tokens"
import { useSupabase } from "@/components/supabase-provider"
import { FileText, PenTool, LayoutDashboard, Share2 } from "lucide-react"

export default function Dashboard() {
  const { session } = useSupabase()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("analyze")

  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  if (!session) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 sm:h-16">
          <div className="flex items-center mb-4 sm:mb-0">
            <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mr-2" />
            <h1 className="text-xl sm:text-2xl font-semibold">ContractBuddy</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        <Select defaultValue="analyze" onValueChange={(value) => setActiveTab(value)}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="analyze">
              <span className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Analyze Contract
              </span>
            </SelectItem>
            <SelectItem value="draft">
              <span className="flex items-center">
                <PenTool className="mr-2 h-4 w-4" />
                Draft Contract
              </span>
            </SelectItem>
            <SelectItem value="share">
              <span className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share Tokens
              </span>
            </SelectItem>
          </SelectContent>
        </Select>
        {activeTab === "analyze" && <AnalyzeContract />}
        {activeTab === "draft" && <DraftContract />}
        {activeTab === "share" && <ShareTokens />}
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2024 ContractBuddy. All rights reserved.
      </footer>
    </div>
  )
}

