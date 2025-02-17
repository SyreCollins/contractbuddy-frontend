"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCopy, Download, RefreshCw, Upload, File } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"

export function AnalyzeContract() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { session, supabase } = useSupabase()
  //const router = useRouter() // Removed unused import

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
    }
  }

  // Handle contract analysis upload
  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!file) {
      toast({ title: "Error", description: "Please select a file to upload.", variant: "destructive" })
      return
    }

    setIsUploading(true)
    setResult("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("user_id", session?.user.id || "")

    try {
      const response = await fetch("https://contractbuddy.onrender.com/analyze_contract/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (typeof data.analysis === "string") {
        setResult(data.analysis)
      } else if (Array.isArray(data.analysis)) {
        setResult(data.analysis.join("\n\n"))
      } else {
        throw new Error("Invalid API response format")
      }

      toast({ title: "Success", description: "Contract analyzed successfully." })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unexpected error occurred while analyzing the contract.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Your Contract</CardTitle>
          <CardDescription>Upload a contract file for analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contract">Contract File</Label>
              <div className="flex items-center gap-2">
                <Input id="contract" type="file" onChange={handleFileChange} className="hidden" />
                <Label
                  htmlFor="contract"
                  className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md"
                >
                  <File className="h-4 w-4" />
                  {file ? file.name : "Choose file"}
                </Label>
                {file && <span className="text-sm text-muted-foreground truncate max-w-[200px]">{file.name}</span>}
              </div>
            </div>
            <Button type="submit" disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Analyze Contract
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Analysis Result</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(result)}>
              <ClipboardCopy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setResult("")}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const element = document.createElement("a")
                const file = new Blob([result], { type: "text/plain" })
                element.href = URL.createObjectURL(file)
                element.download = "contract_analysis.txt"
                document.body.appendChild(element)
                element.click()
                document.body.removeChild(element)
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

