"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSupabase } from "./supabase-provider"
import { useRouter } from "next/navigation"
import { CreditCard, Settings, LogOut, Infinity } from "lucide-react"
import { Coins } from "lucide-react"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export function UserNav() {
  const { supabase, session } = useSupabase()
  const [userTokens, setUserTokens] = useState(0)
  const [hasLifetimePlan, setHasLifetimePlan] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  console.log("Session state:", session)

  useEffect(() => {
    if (session?.user.id) {
      fetchUserTokens()
    }
  }, [session])

  useEffect(() => {
    if (session?.user.id) {
      checkAdminStatus()
    }
  }, [session])

  const fetchUserTokens = async () => {
    try {
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
          setHasLifetimePlan(false)
        } else {
          console.error("Error fetching user tokens:", error)
        }
      } else {
        setUserTokens(data?.tokens || 0)
        // Assume the user has a lifetime plan if they have a very high number of tokens
        setHasLifetimePlan(data?.tokens >= 900000) // Adjust this threshold as needed
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    }
  }

  const checkAdminStatus = async () => {
    const { data, error } = await supabase.from("users").select("is_admin").eq("id", session?.user.id).single()

    if (!error && data?.is_admin) {
      setIsAdmin(true)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const handlePurchaseCoins = () => {
    if (session) {
      router.push("/purchase-coins")
    } else {
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user.user_metadata.avatar_url || ""} alt={session?.user.email || ""} />
            <AvatarFallback>{session?.user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session?.user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{session?.user.user_metadata.name || "User"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handlePurchaseCoins}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Purchase Coins</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Coins className="mr-2 h-4 w-4" />
            <span>
              Tokens:{" "}
              {hasLifetimePlan ? <Infinity className="inline-block ml-1 h-4 w-4 text-yellow-500" /> : userTokens}
            </span>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldAlert className="mr-2 h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

