import Header from "@/components/Header"
import Hero from "@/components/Hero"
import KeyFeatures from "@/components/KeyFeatures"
import Features from "@/components/Features"
import DemoVideo from "@/components/DemoVideo"
import Testimonials from "@/components/Testimonials"
import FAQ from "@/components/FAQ"
import Pricing from "@/components/Pricing"
import Footer from "@/components/Footer"
import UserCount from "@/components/UserCount"
import WhyContractBuddy from "@/components/WhyContractBuddy"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main>
        <Hero />
        <UserCount />
        <WhyContractBuddy />
        <KeyFeatures />
        <Features />
        <DemoVideo />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

