import { Zap, FileText, PenTool } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Understand",
    description:
      "Get clear summaries of your contracts without the legal jargon. Know exactly what you're agreeing to.",
  },
  {
    icon: Zap,
    title: "Analyze",
    description: "Spot risks, loopholes, and unfair terms. Contract-AI highlights everything you need to know.",
  },
  {
    icon: PenTool,
    title: "Draft & Manage",
    description:
      "Easily draft simple contracts without breaking the bank. Keep all your contracts organized, never lose track of important details.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why ContractBuddy?</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            ContractBuddy is here to make your life easier. We break down complex legal contracts into simple,
            easy-to-understand terms. No legal expertise needed, Perfect for freelancers!
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="feature-card bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

