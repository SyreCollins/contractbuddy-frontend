import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(request: Request) {
  try {
    const { userEmail, plan, tokenAmount } = await request.json()

    if (!userEmail || !plan || tokenAmount === undefined) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const { error } = await supabase.auth.admin.sendRawEmail({
      to: userEmail,
      subject: "Purchase Confirmation - Contract AI",
      body: `
        <h1>Thank you for your purchase!</h1>
        <p>Your purchase details:</p>
        <ul>
          <li>Plan: ${plan}</li>
          <li>Tokens: ${plan === "Lifetime" ? "Unlimited" : tokenAmount}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
      `,
    })

    if (error) {
      console.error("Supabase email error:", error)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Confirmation email sent successfully" })
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return NextResponse.json({ success: false, message: "Failed to send confirmation email" }, { status: 500 })
  }
}

