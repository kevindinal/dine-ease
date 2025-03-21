"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react"

type LocationSectionProps = {
  address: string
  location: string
}

export default function LocationSection({ address, location }: LocationSectionProps) {
  // Sample hours
  const hours = [
    { day: "Monday - Thursday", hours: "11:00 AM - 10:00 PM" },
    { day: "Friday - Saturday", hours: "11:00 AM - 11:00 PM" },
    { day: "Sunday", hours: "12:00 PM - 9:00 PM" },
  ]

  return (
    <div className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Find Us</h2>
        <div className="h-1 w-20 bg-red-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">Visit us today and experience exceptional dining</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-xl overflow-hidden shadow-lg h-[300px] sm:h-[400px]"
        >
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            className="w-full h-full border-0"
            title="Restaurant location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Contact Information</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Address</p>
                    <p className="text-gray-600">{address}</p>
                    <p className="text-gray-600">{location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Phone</p>
                    <p className="text-gray-600">+94 77 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-600">reservations@restaurant.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5 sm:pt-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <Clock className="h-5 w-5 text-red-500 mr-2" />
                Opening Hours
              </h3>
              <div className="space-y-2">
                {hours.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <span className="text-gray-600 font-medium">{item.day}</span>
                    <span className="text-gray-800">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-3 sm:mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg flex items-center justify-center transition-all duration-300 w-full sm:w-auto">
              Get Directions <ExternalLink className="ml-2 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

