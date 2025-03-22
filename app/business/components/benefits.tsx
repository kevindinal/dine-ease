import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Benefits() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Benefits that drive results</h2>
          <p className="text-lg text-gray-600">
            See how DineEase helps restaurants increase revenue, improve efficiency, and enhance guest experiences.
          </p>
        </div>

        <div className="space-y-24">
          {/* Benefit 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 mb-4">
                INCREASE REVENUE
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Maximize your table utilization and boost profits
              </h3>
              <p className="text-gray-600 mb-6">
                Our intelligent table management system helps you optimize seating arrangements, reduce wait times, and
                turn tables more efficiently, resulting in increased revenue per service.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Reduce no-shows by up to 40% with automated reminders",
                  "Increase table turnover by 20% with optimized scheduling",
                  "Boost average check size through guest preference data",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 via-white to-red-100 rounded-xl blur-xl opacity-70"></div>
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Revenue Dashboard"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 via-white to-red-100 rounded-xl blur-xl opacity-70"></div>
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Guest Experience"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 mb-4">
                ENHANCE GUEST EXPERIENCE
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Create memorable dining experiences that keep guests coming back
              </h3>
              <p className="text-gray-600 mb-6">
                Our comprehensive guest management tools help you personalize service, remember preferences, and build
                lasting relationships with your customers.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Store guest preferences and dietary requirements",
                  "Send personalized offers based on dining history",
                  "Streamline check-in process for faster seating",
                  "Collect and respond to feedback efficiently",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3 mt-1">
                      <svg className="h-3 w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

