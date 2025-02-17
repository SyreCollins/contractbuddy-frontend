"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Coins, Zap, Shield, CheckCircle, CreditCard, Star, ArrowLeft } from "lucide-react"
import { PaystackButton } from "react-paystack"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { motion } from "framer-motion"

// Exchange rate (1 USD to NGN)
const EXCHANGE_RATE = 1600

export default function PurchaseCoins() {
  const { supabase, session } = useSupabase()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [userTokens, setUserTokens] = useState(0)
  const [showNaira, setShowNaira] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: "", description: "" })

  useEffect(() => {
    if (!session) {
      console.log("No session found in PurchaseCoins component")
      router.push("/login")
    } else {
      console.log("Session found in PurchaseCoins component:", session)
      fetchUserTokens()
    }
  }, [session, router])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for payment status in URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const status = urlParams.get("status")
      const reference = urlParams.get("reference")

      if (status === "success") {
        setModalContent({
          title: "Payment Successful",
          description: `Your payment (ref: ${reference}) was successful. Tokens will be added to your account shortly.`,
        })
        setShowModal(true)
      } else if (status === "cancelled") {
        setModalContent({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. No tokens have been added to your account.",
        })
        setShowModal(true)
      }

      // Clear the URL parameters
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Auto-close modal after 5 seconds
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showModal])

  const fetchUserTokens = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from("users").select("tokens").eq("id", session?.user.id).single()

      if (error) {
        if (error.code === "PGRST116") {
          // User not found, insert a new record
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({ id: session?.user.id, tokens: 0 })
            .single()

          if (insertError) {
            console.error("Error creating user record:", insertError)
            return
          }

          setUserTokens(0)
        } else {
          console.error("Error fetching user tokens:", error)
        }
      } else {
        setUserTokens(data?.tokens || 0)
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaystackSuccess = async (response: any) => {
    const { reference, status } = response

    if (status === "success") {
      try {
        // Assuming the token amount is stored in the transaction reference
        const tokenAmount = Number.parseInt(reference.split("-")[1], 10)
        const plan = reference.split("-")[2]

        const { data, error } = await supabase
          .from("users")
          .update({ tokens: userTokens + tokenAmount })
          .eq("id", session?.user.id)

        if (error) throw error

        setUserTokens((prevTokens) => prevTokens + tokenAmount)

        // Redirect to the same page with success status
        router.push(`/purchase-coins?status=success&reference=${reference}`)
      } catch (error) {
        console.error("Purchase error:", error)
        setError("An error occurred during the purchase. Please try again.")
      }
    }
  }

  const handlePaystackClose = () => {
    // Redirect to the same page with cancelled status
    router.push("/purchase-coins?status=cancelled")
  }

  const config = {
    reference: (plan: string, tokens: number) => `${new Date().getTime()}-${tokens}-${plan}`,
    email: session?.user.email || "",
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  }

  const formatPrice = (priceUSD: number, plan: string) => {
    if (plan === "Lifetime") {
      return "∞"
    }
    if (showNaira) {
      return `₦${(priceUSD * EXCHANGE_RATE).toLocaleString()}`
    }
    return `$${priceUSD}`
  }

  const renderPaystackButton = (plan: string, priceUSD: number, tokens: number) => {
    const borderColorClass =
      plan === "Basic"
        ? "border-blue-500"
        : plan === "Basic+"
          ? "border-green-500"
          : plan === "Premium"
            ? "border-purple-500"
            : plan === "Lifetime"
              ? "border-yellow-500"
              : ""

    return (
      <PaystackButton
        {...config}
        amount={priceUSD * EXCHANGE_RATE * 100}
        currency="NGN"
        reference={config.reference(plan, tokens)}
        text={`Purchase ${plan}`}
        onSuccess={handlePaystackSuccess}
        onClose={handlePaystackClose}
      >
        <Button className={`w-full border-2 ${borderColorClass}`}>
          <CreditCard className="w-5 h-5 mr-2" />
          Purchase {plan}
        </Button>
      </PaystackButton>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Image
                src="https://syrecollins.github.io/static/dist/images/logo-light.svg"
                alt="Contract AI Logo"
                width={32}
                height={32}
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Contract AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Purchase Coins</h1>

          <div className="max-w-3xl mx-auto mb-12 text-center">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              Boost your Contract AI experience with our coin packages. More coins mean more power to analyze and
              generate contracts!
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Switch id="currency-toggle" checked={showNaira} onCheckedChange={setShowNaira} />
              <Label htmlFor="currency-toggle" className="text-gray-700 dark:text-gray-300">
                Show prices in {showNaira ? "Dollars" : "Naira"}
              </Label>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coins className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-center">Basic</CardTitle>
                  <CardDescription className="text-center">
                    Get started with essential Contract-AI tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    {formatPrice(5, "Basic")}
                  </p>
                  <ul className="mb-8 space-y-2">
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">500 Contract-AI tokens</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">Basic support</span>
                    </li>
                  </ul>
                  {renderPaystackButton("Basic", 5, 500)}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-2 border-blue-500 dark:border-blue-400 hover:shadow-lg transition-shadow duration-300">
                <div className="bg-blue-500 text-white text-center py-2">
                  <span className="text-sm font-semibold">MOST POPULAR</span>
                </div>
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-center">Basic+</CardTitle>
                  <CardDescription className="text-center">Perfect for growing needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    {formatPrice(10, "Basic+")}
                  </p>
                  <ul className="mb-8 space-y-2">
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">1100 Contract-AI Tokens</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">Priority support</span>
                    </li>
                  </ul>
                  {renderPaystackButton("Basic+", 10, 1100)}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-center">Premium</CardTitle>
                  <CardDescription className="text-center">For power users and businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                    {formatPrice(20, "Premium")}
                  </p>
                  <ul className="mb-8 space-y-2">
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">2500 Contract-AI Tokens</span>
                    </li>
                    <li className="flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">Priority support</span>
                    </li>
                  </ul>
                  {renderPaystackButton("Premium", 20, 2500)}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <Card className="md:col-span-3 border-2 border-yellow-500 dark:border-yellow-400 hover:shadow-lg transition-shadow duration-300">
              <div className="bg-yellow-500 text-white text-center py-2">
                <span className="text-sm font-semibold">LIMITED OFFER - FIRST 50 USERS ONLY</span>
              </div>
              <CardHeader>
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-center">Lifetime Access</CardTitle>
                <CardDescription className="text-center">Unlimited Contract-AI tokens forever</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                  {formatPrice(200, "Lifetime")}
                </p>
                <ul className="mb-8 space-y-2">
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Unlimited Contract-AI Tokens</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">24/7 Premium Support</span>
                  </li>
                  <li className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-400">Early Access to New Features</span>
                  </li>
                </ul>
                {renderPaystackButton("Lifetime", 200, 10000000)} {/* Using a large number for "unlimited" */}
              </CardContent>
            </Card>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-center text-red-600 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2024 Contract AI. All rights reserved.
          </p>
        </div>
      </footer>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
            <DialogDescription>{modalContent.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

