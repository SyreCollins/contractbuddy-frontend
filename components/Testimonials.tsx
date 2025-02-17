"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Vanessa Ndikom",
    role: "Web3 Technical Writer",
    content:
      "Just got referred to the product by a friend. I love the professionalism of the whole thing! It's an awesome product.",
    rating: 5,
  },
  {
    name: "BuTaSkOcH",
    role: "Music Artiste",
    content:
      "I see so much potential in what you have been able to create in Contract-AI and I deeply respect it. The UI is friendly and contract analysis and drafting process was done with so much ease.",
    rating: 5,
  },
  {
    name: "theyouecosystem",
    role: "Business newsletter",
    content: "The site looks clean and easy to navigate, absolutely love it.",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">What Our Users Say</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Don't just take our word for it. Here's what our users have to say about ContractBuddy.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.content}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
                    }`}
                    fill={i < testimonial.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Read More Reviews
          </a>
        </div>
      </div>
    </section>
  )
}

