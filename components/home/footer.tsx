import { MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">CONTACT</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <p>123/7/6F No. 38, Rich Plaza, Colony, Metroply, Hyderabad</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <p>
                  +91 987-654-320
                  <br />
                  +91 123-456-789
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <p>
                  info@example.com
                  <br />
                  info@example.com
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">OUR LINKS</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-lg">HELP CENTER</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Category Filter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 text-sm text-center text-gray-400">Copyright 2024 All rights reserved.</div>
      </div>
    </footer>
  )
}

