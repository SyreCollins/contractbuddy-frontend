"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ShareTokens() {
  const { supabase, session } = useSupabase()
  const [recipientEmail, setRecipientEmail] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [tokenAmount, setTokenAmount] = useState("")
  const [isSharing, setIsSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSharing(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const tokens = Number.parseInt(tokenAmount, 10)

      if (isNaN(tokens) || tokens <= 0) {
        throw new Error("Invalid token amount")
      }

      // Check if the recipient exists
      const { data: recipientData, error: recipientError } = await supabase
        .from("users")
        .select("id")
        .eq("id", (await supabase.auth.getUser(recipientEmail)).data.user?.id)
        .single()

      if (recipientError) {
        throw new Error("Recipient not found")
      }

      // Perform the token transfer
      const { data, error } = await supabase.rpc("transfer_tokens", {
        recipient_id: recipientData.id,
        amount: tokens,
      })

      if (error) throw error

      setSuccessMessage(`Successfully shared ${tokens} tokens with ${recipientName}`)
    } catch (error: any) {
      console.error("Error sharing tokens:", error)
      setError(error.message || "An error occurred while sharing tokens. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Tokens</CardTitle>
        <CardDescription>Share your tokens with other users</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email</Label>
            <Input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient-name">Recipient Name</Label>
            <Input
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter recipient's name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token-amount">Token Amount</Label>
            <Input
              id="token-amount"
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="Enter amount of tokens to share"
              required
              min="1"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-800">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              "Share Tokens"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

