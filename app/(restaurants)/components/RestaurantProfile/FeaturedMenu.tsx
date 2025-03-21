"use client"

import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

type MenuItem = {
  name: string
  price: number
  image: string
  description?: string
}

type FeaturedMenuProps = {
  featuredMenu?: MenuItem[]
}

export default function FeaturedMenu({ featuredMenu }: FeaturedMenuProps) {
  // Sample menu items if none provided
  const sampleMenu: MenuItem[] = [
    {
      name: "Grilled Salmon",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      description: "Fresh salmon fillet grilled to perfection with herbs and lemon",
    },
    {
      name: "Beef Wellington",
      price: 32.99,
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80",
      description: "Tender beef wrapped in puff pastry with mushroom duxelles",
    },
    {
      name: "Vegetable Risotto",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      description: "Creamy arborio rice with seasonal vegetables and parmesan",
    },
  ]

  // Use provided menu or sample menu
  const menuToDisplay = featuredMenu && featuredMenu.length > 0 ? featuredMenu : sampleMenu

  return (
    <div className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Featured Menu</h2>
        <div className="h-1 w-20 bg-red-500 mx-auto rounded-full"></div>
        <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto">
          Discover our chef's special selection of exquisite dishes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        {menuToDisplay.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-md overflow-hidden group"
          >
            <div className="relative h-48 sm:h-60 overflow-hidden">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm">{item.description || `Delicious ${item.name} prepared by our expert chefs`}</p>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                {/* <span className="text-red-500 font-bold">${item.price.toFixed(2)}</span> */}
              </div>
              <button className="mt-2 sm:mt-3 text-red-500 font-medium text-sm flex items-center group-hover:text-red-600">
                View Details <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
          View Full Menu
        </button>
      </div>
    </div>
  )
}

