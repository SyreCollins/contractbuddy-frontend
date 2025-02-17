"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCopy, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export function DraftContract() {
  const [contractType, setContractType] = useState("")
  const [partyA, setPartyA] = useState("")
  const [partyB, setPartyB] = useState("")
  const [terms, setTerms] = useState("")
  const [result, setResult] = useState("")
  const [isDrafting, setIsDrafting] = useState(false)
  const { toast } = useToast()
  const { session } = useSupabase()

  const handleContractDrafting = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsDrafting(true)
    setResult("")

    const formData = new FormData()
    formData.append("contract_type", contractType)
    formData.append("party_details", JSON.stringify({ partyA, partyB }))
    formData.append("terms", terms)
    formData.append("user_id", session?.user.id || "")

    try {
      const response = await fetch("https://contractbuddy.onrender.com/draft_contract/", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) {
        console.error("Drafting error:", result)
        throw new Error(result.message || "An error occurred during contract drafting")
      } else {
        setResult(result.contract_text)
        toast({
          title: "Success",
          description: "Contract drafted successfully.",
        })
      }
    } catch (error) {
      console.error("Drafting error:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unexpected error occurred while drafting the contract.",
        variant: "destructive",
      })
    } finally {
      setIsDrafting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Draft a Contract</CardTitle>
          <CardDescription>Fill in the details to generate a contract draft.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleContractDrafting} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contract-type">Contract Type</Label>
              <Select value={contractType} onValueChange={setContractType}>
                <SelectTrigger id="contract-type">
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employment">Employment Contract</SelectItem>
                  <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
                  <SelectItem value="service">Service Agreement</SelectItem>
                  <SelectItem value="sales">Sales Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="party-a">Party A</Label>
              <Input
                id="party-a"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                placeholder="Enter name of Party A"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="party-b">Party B</Label>
              <Input
                id="party-b"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                placeholder="Enter name of Party B"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="terms">Terms and Conditions</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter contract terms and conditions"
              />
            </div>
            <Button type="submit" disabled={isDrafting}>
              {isDrafting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Drafting...
                </>
              ) : (
                "Generate Contract"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Draft Result</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(result)
                toast({
                  title: "Copied",
                  description: "Contract text copied to clipboard",
                })
              }}
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setResult("")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const blob = new Blob([result], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = "contract_draft.txt"
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea value={result} readOnly className="min-h-[200px]" />
        </CardContent>
      </Card>
    </div>
  )
}

