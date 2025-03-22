import type React from "react"
import Image from "next/image"
import { Calendar, Users, BarChart4, CreditCard, MessageSquare, Settings } from "lucide-react"

const features = [
  {
    name: "Reservation Management",
    description:
      "Streamline your booking process with our intuitive reservation system that reduces no-shows and maximizes table utilization.",
    icon: Calendar,
  },
  {
    name: "Table Management",
    description:
      "Visualize your floor plan in real-time and optimize seating arrangements to improve turnover and guest experience.",
    icon: Users,
  },
  {
    name: "Analytics & Reporting",
    description:
      "Gain valuable insights into your business performance with comprehensive analytics and customizable reports.",
    icon: BarChart4,
  },
  {
    name: "Payment Processing",
    description:
      "Securely process payments, manage deposits, and handle cancellation fees all in one integrated platform.",
    icon: CreditCard,
  },
  {
    name: "Guest Communication",
    description:
      "Engage with your guests through automated confirmations, reminders, and personalized marketing messages.",
    icon: MessageSquare,
  },
  {
    name: "Customizable Settings",
    description: "Tailor the system to your specific needs with flexible configuration options and integrations.",
    icon: Settings,
  },
]

export function Features() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            All the tools you need to manage your restaurant
          </h2>
          <p className="text-lg text-gray-600">
            Our comprehensive platform provides everything from reservation management to guest analytics, all in one
            place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 lg:mt-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful reservation management that grows your business
              </h2>
              <ul className="space-y-4">
                {[
                  "Reduce no-shows with automated reminders",
                  "Optimize table turnover with smart scheduling",
                  "Collect guest data for personalized experiences",
                  "Integrate with your website and social media",
                  "Access insights to improve your operations",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Check className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-100 via-white to-red-100 rounded-xl blur-xl opacity-70"></div>
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Reservation Management Dashboard"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

