"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-semibold">ContractBuddy</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Tabs defaultValue="analyze" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
          <TabsList>
            <TabsTrigger value="analyze">
              <FileText className="mr-2 h-4 w-4" />
              Analyze Contract
            </TabsTrigger>
            <TabsTrigger value="draft">
              <PenTool className="mr-2 h-4 w-4" />
              Draft Contract
            </TabsTrigger>
            <TabsTrigger value="share">
              <Share2 className="mr-2 h-4 w-4" />
              Share Tokens
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analyze" className="space-y-6">
            <AnalyzeContract />
          </TabsContent>
          <TabsContent value="draft" className="space-y-6">
            <DraftContract />
          </TabsContent>
          <TabsContent value="share" className="space-y-6">
            <ShareTokens />
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        © 2024 ContractBuddy. All rights reserved.
      </footer>
    </div>
  )
}

