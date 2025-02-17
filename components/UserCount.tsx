"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"

export default function UserCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Simulate fetching user count
    const fetchedCount = 100 // Replace with actual API call
    setCount(fetchedCount)

    // Animate count
    const start = 0
    const end = fetchedCount
    const duration = 2000
    let startTimestamp: number | null = null

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }

    window.requestAnimationFrame(step)
  }, [])

  return (
    <div className="bg-blue-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <Users className="mr-2" />
        <span className="text-lg font-semibold">{count.toLocaleString()}+ users trust ContractBuddy</span>
      </div>
    </div>
  )
}

