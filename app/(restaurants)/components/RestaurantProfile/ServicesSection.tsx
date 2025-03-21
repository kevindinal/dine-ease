"use client"

import { motion } from "framer-motion"
import { Utensils, Bus, CreditCard, Wifi, Wine, Users, Music, Coffee } from "lucide-react"

export default function ServicesSection() {
  const services = [
    { icon: <Utensils className="h-6 w-6" />, name: "Fine Dining", description: "Experience culinary excellence" },
    { icon: <Users className="h-6 w-6" />, name: "Event Catering", description: "Perfect for special occasions" },
    { icon: <Coffee className="h-6 w-6" />, name: "Outdoor Seating", description: "Enjoy the fresh air" },
    { icon: <Wine className="h-6 w-6" />, name: "Private Events", description: "Celebrate in style" },
    { icon: <Music className="h-6 w-6" />, name: "Live Music", description: "Enjoy ambient performances" },
    { icon: <Wifi className="h-6 w-6" />, name: "Free WiFi", description: "Stay connected" },
    { icon: <CreditCard className="h-6 w-6" />, name: "Card Payment", description: "Convenient payment options" },
    { icon: <Bus className="h-6 w-6" />, name: "Valet Parking", description: "Hassle-free arrival" },
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <div className="h-1 w-20 bg-red-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Enjoy our premium amenities designed to enhance your dining experience
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="bg-white rounded-xl shadow-md overflow-hidden group"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

