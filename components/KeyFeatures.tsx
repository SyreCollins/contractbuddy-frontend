import { Shield, Zap, DollarSign, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Secure & Confidential",
    description: "Your contracts are encrypted and protected with bank-level security.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get your contract analysis in minutes, not hours or days.",
  },
  {
    icon: DollarSign,
    title: "Cost-Effective",
    description: "Save thousands on legal fees with our AI-powered contract analysis.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Easily share and collaborate on contracts with your team.",
  },
]

export default function KeyFeatures() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Why Choose ContractBuddy?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our AI-powered platform offers unparalleled benefits for all your contract needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="/register"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign That Contract Now
          </a>
        </div>
      </div>
    </section>
  )
}

