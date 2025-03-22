import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
  {
    content:
      "DineEase has completely transformed how we manage our reservations. We've reduced no-shows by 35% and increased our table turnover significantly.",
    author: "Sarah Johnson",
    role: "General Manager",
    company: "The Coastal Kitchen",
    rating: 5,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    content:
      "The analytics tools have given us insights we never had before. We can now make data-driven decisions that have improved our profitability by 20%.",
    author: "Michael Chen",
    role: "Owner",
    company: "Fusion Bistro",
    rating: 5,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    content:
      "Our guests love the seamless reservation experience, and our staff appreciates how easy the system is to use. It's a win-win for everyone.",
    author: "Emily Rodriguez",
    role: "Operations Director",
    company: "Harvest Table Group",
    rating: 5,
    image: "/placeholder.svg?height=64&width=64",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by restaurants worldwide</h2>
          <p className="text-lg text-gray-600">See what restaurant owners and managers are saying about DineEase</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? "fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap justify-center gap-8 items-center">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
              <Image
                src={`/placeholder.svg?height=40&width=${80 + index * 10}`}
                alt={`Client logo ${index + 1}`}
                width={80 + index * 10}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

