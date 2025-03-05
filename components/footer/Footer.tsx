import { Send } from "lucide-react"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="bg-accent-darkest text-white py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold">DineEase</h3>
                        <p className="text-gray-400">
                            Revolutionizing the dining experience with smart technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {['About', 'Features', 'Restaurants', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-400 hover:text-primary-light transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-gray-400 hover:text-primary-light transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Newsletter</h4>
                        <p className="text-gray-400">
                            Stay updated with our latest features and restaurants.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-accent-darker text-white placeholder:text-gray-400"
                            />
                            <button className="bg-accent hover:bg-primary text-white">
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-accent-darker mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} DineEase. All rights reserved.</p>
                </div>
            </div>
        </footer>


          // <footer className="bg-[#1a0a0a] text-gray-300">
        //     <div className="container mx-auto px-4 py-12">
        //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        //             {/* Brand Section */}
        //             <div>
        //                 <h2 className="text-white text-2xl font-bold mb-4">
        //                     DineEase
        //                 </h2>
        //                 <p className="text-gray-400">Revolutionizing the dining experience with smart technology.</p>
        //             </div>

        //             {/* Quick Links */}
        //             <div>
        //                 <h3 className="text-white text-xl font-medium mb-4">Quick Links</h3>
        //                 <ul className="space-y-2">
        //                     <li>
        //                         <Link href="/about" className="hover:text-white transition-colors">
        //                             About
        //                         </Link>
        //                     </li>
        //                     <li>
        //                         <Link href="/features" className="hover:text-white transition-colors">
        //                             Features
        //                         </Link>
        //                     </li>
        //                     <li>
        //                         <Link href="/restaurants" className="hover:text-white transition-colors">
        //                             Restaurants
        //                         </Link>
        //                     </li>
        //                     <li>
        //                         <Link href="/contact" className="hover:text-white transition-colors">
        //                             Contact
        //                         </Link>
        //                     </li>
        //                 </ul>
        //             </div>

        //             {/* Legal */}
        //             <div>
        //                 <h3 className="text-white text-xl font-medium mb-4">Legal</h3>
        //                 <ul className="space-y-2">
        //                     <li>
        //                         <Link 
        //                             href="/privacy-policy"
        //                             className="hover:text-white transition-colors"
        //                         >
        //                             Privacy Policy
        //                         </Link>
        //                     </li>
        //                     <li>
        //                         <Link
        //                             href="/terms-of-service"
        //                             className="hover:text-white transition-colors"
        //                         >
        //                             Terms of Service
        //                         </Link>
        //                     </li>
        //                     <li>
        //                         <Link
        //                             href="/cookie-policy" 
        //                             className="hover:text-white transition-colors"
        //                         >
        //                             Cookie Policy
        //                         </Link>
        //                     </li>
        //                 </ul>
        //             </div>

        //             {/* Newsletter */}
        //             <div>
        //                 <h3 className="text-white text-xl font-medium mb-4">
        //                     Newsletter
        //                     </h3>
        //                 <p className="text-gray-400 mb-4">
        //                     Stay updated with our latest features and restaurants.
        //                 </p>
        //                 <div className="flex">
        //                     <input 
        //                         type="email"
        //                         placeholder="Enter your email"
        //                         className="bg-[#3a1a1a] text-white rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-red-500"
        //                         aria-label="Email for newsletter" 
        //                     />
        //                     <button
        //                         type="submit"
        //                         className="bg-red-600 hover:bg-red-700 text-white rounded-r-lg p-2 transition-colors"
        //                         aria-label="Subscribe to newsletter"
        //                     >
        //                         <Send className="h5 w-5"/>
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>

        //         {/* Divider */}
        //         <div className="border-t border-gray-800 my-8"></div>

        //         {/* Copyright */}
        //         <div className="text-center text-gray-500">
        //             <p>© {new Date().getFullYear()} DineEase. All rights reserved.</p>
        //         </div>
        //     </div>
        // </footer>

    )
}
