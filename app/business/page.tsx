import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navbar } from "./components/navbar"
import { Features } from "@/app/business/components/features"
import { Testimonials } from "./components/testimonials"
import { Benefits } from "@/app/business/components/benefits"
import { Footer } from "./components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white">
          <div className="absolute inset-0 bg-[url('/dots-pattern.svg')] bg-repeat opacity-10"></div>
          <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="mb-6 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                FOR RESTAURANTS, F&B GROUPS, HOTELS
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Grow your Restaurant
                <br />
                with <span className="text-red-600">DineEase</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                The end-to-end dining experience solution: reservation management, marketing, review, payment suite &
                much more...
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-md">
                  Start for free <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-6 rounded-md"
                >
                  Request Demo
                </Button>
              </div>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-md">
                <Image
                  src="/placeholder.svg?height=30&width=120"
                  alt="Trustpilot"
                  width={120}
                  height={30}
                  className="h-6 w-auto"
                />
                <div className="h-4 w-px bg-gray-200"></div>
                <p className="text-sm font-medium text-gray-700">"Voted best reservation system for ease of use"</p>
              </div>
            </div>

            <div className="mt-16 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 via-white to-red-100 rounded-xl blur-xl opacity-70"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="DineEase Dashboard"
                  width={1200}
                  height={600}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Benefits Section */}
        <Benefits />

        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-500 py-16 sm:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to transform your restaurant business?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of restaurants worldwide that trust DineEase to manage their operations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 px-8 py-6 rounded-md">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-red-700 px-8 py-6 rounded-md"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

