import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WhyContractBuddy() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Why I Built ContractBuddy
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                Hey there! I'm Michael, the creator of ContractBuddy. Let me tell you a story about why I built this
                tool.
              </p>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                Back in early 2024, I was working as a freelancer when I ran into a classic problem. A client kept
                adding more and more feature requests on top of what we'd initially agreed on. The kicker? They refused
                to consider increasing my pay, even though I was putting in way more hours than expected.
              </p>
              <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                A friend gave me some solid advice: always tie your clients down with a contract. That way, they can't
                go against what was agreed on. Brilliant, right? But here's the catch – I couldn't keep up with the cost
                of having a lawyer write and read all my contracts for every project.
              </p>
              <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                That's when the idea for ContractBuddy struck me. I thought, "What if there was a tool that could help
                freelancers and non-legal folks get the best out of any contract they want to sign, without the hassle
                and expense of looking for a lawyer?" And boom – ContractBuddy was born!
              </p>
              <div className="text-center">
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
                    Start Protecting Your Work Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

