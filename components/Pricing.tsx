import { Star } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    price: "$5",
    tokens: "500 tokens",
  },
  {
    name: "Basic +",
    price: "$10",
    tokens: "1100 tokens",
  },
  {
    name: "Premium",
    price: "$20",
    tokens: "2500 tokens",
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Simple, Token-Based Pricing</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Purchase tokens and use them to analyze or draft contracts. No subscriptions, no hidden fees, no catch.
          </p>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow overflow-hidden lg:grid lg:grid-cols-3 lg:divide-x lg:divide-gray-200">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`px-6 py-8 lg:px-8 lg:py-12 ${index === 1 ? "bg-gray-50 lg:bg-white" : ""}`}>
              <div className="text-center">
                <h3 className="text-2xl font-medium text-gray-900">{plan.name}</h3>
                <p className="mt-4 text-5xl font-extrabold text-gray-900">{plan.price}</p>
                <p className="mt-4 text-lg text-gray-500">{plan.tokens}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lifetime Access Offer */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-yellow-500">
            <div className="bg-yellow-500 text-white text-center py-2">
              <span className="text-sm font-semibold">LIMITED OFFER - FIRST 50 USERS ONLY</span>
            </div>
            <div className="px-6 py-8 lg:px-8 lg:py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900">Lifetime Access</h3>
                <p className="mt-4 text-5xl font-extrabold text-gray-900">$200</p>
                <p className="mt-4 text-lg text-gray-500">Unlimited Contract-AI tokens forever</p>
                <ul className="mt-6 space-y-4 text-left">
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-base text-gray-700">Unlimited Contract-AI Tokens</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-base text-gray-700">24/7 Premium Support</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="flex-shrink-0 h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-base text-gray-700">Early Access to New Features</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <a
                    href="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Lifetime Access
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

