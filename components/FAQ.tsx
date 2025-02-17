"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "What exactly does ContractBuddy do?",
    answer:
      "ContractBuddy uses advanced AI to analyze legal contracts, providing easy-to-understand summaries and highlighting important clauses or potential issues. It can also help draft simple contracts based on your inputs.",
  },
  {
    question: "Do I need any legal knowledge to use ContractBuddy?",
    answer:
      "Not at all! ContractBuddy is designed for non-lawyers. It breaks down complex legal language into simple terms anyone can understand.",
  },
  {
    question: "How accurate is ContractBuddy?",
    answer:
      "While ContractBuddy is highly accurate, it's important to remember that it's an AI tool. For really critical or complex matters, we always recommend consulting with a qualified attorney after analysis.",
  },
  {
    question: "How do tokens work?",
    answer:
      "Tokens are used to pay for ContractBuddy's services. Each analysis or draft uses a certain number of tokens, depending on the complexity and length of the contract. You can purchase tokens in bundles and use them as needed.",
  },
  {
    question: "Do you have any other questions?",
    answer:
      "If you've got any other questions, please don't hesitate to send a mail to me directly on <a href='mailto:therealcollins45@gmail.com' class='text-blue-600 hover:underline'>my personal email</a>. I'm always happy to help!",
  },
]

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Got questions? We've got answers.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              style={{ animationDelay: `${0.2 * (index + 1)}s` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full px-4 py-5 sm:p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp className="h-6 w-6 text-gray-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                  <p className="text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

