
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Menu, X } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)

        // Initial check in case page is loaded scrolled down
        handleScroll()

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-red-600 shadow-md" : "bg-transparent"
                }`}
        >
            {/* Background overlay with image - only visible when not scrolled */}
            {!scrolled && (
                <div className="absolute inset-0 bg-black/50 -z-10">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
                            filter: "brightness(0.4) blur(2px)",
                        }}
                    />
                </div>
            )}

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-white text-2xl md:text-3xl font-bold">
                            DineEase
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden">
                        <button onClick={toggleMenu} className="text-white hover:bg-white/10 p-2 rounded-md">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            <span className="sr-only">Toggle menu</span>
                        </button>
                    </div>


                    {/* Desktop navigation */}
                    <nav className="hidden md:flex items-center justify-center flex-1">
                        <ul className="flex space-x-8">
                            {["Home", "Features", "Restaurants", "Reservations", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={`/${item.toLowerCase()}`}
                                        className="text-white hover:text-red-200 font-medium hover:font-semibold transition-all"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Sign In button */}
                    <div className="hidden md:block">
                        <button
                            className={`text-white rounded-full px-6 ${scrolled ? "bg-red-700 hover:bg-red-800" : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            <User className="mr-2 h-4 w-4" />
                            Sign In
                        </button>

                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden absolute w-full transition-all duration-300 ease-in-out z-20 
        ${scrolled ? "bg-red-700" : "bg-black/90"} 
        ${isMenuOpen ? "max-h-[400px] py-4" : "max-h-0 overflow-hidden"}`}
            >

                <nav className="container mx-auto px-4">
                    <ul className="flex flex-col space-y-4">
                        {["Home", "Features", "Restaurants", "Reservations", "Contact"].map((item) => (
                            <li key={item}>
                                <Link
                                    href={`/${item.toLowerCase()}`}
                                    className="text-white hover:text-red-200 font-medium hover:font-semibold text-lg block py-2 transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2">
                            <button
                                className={`text-white rounded-full w-full 
                ${scrolled ? "bg-red-800 hover:bg-red-900" : "bg-red-500 hover:bg-red-600"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="mr-2 h-4 w-4" />
                                Sign In
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}


// "use client";

// import { useState, useEffect } from "react";
// import { Menu, X, User } from "lucide-react";
// import Link from "next/link";


// const Navbar = () => {
//     const [isScrolled, setIsScrolled] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     useEffect(() => {
//         const handleScroll = () => {
//             const offset = window.scrollY;
//             setIsScrolled(offset > 50);
//         };

//         window.addEventListener('scroll', handleScroll);
//         return () => window.removeEventListener('scroll', handleScroll);
//     }, []);

//     const navLinks = [
//         { title: 'Home', href: '/home-main' },
//         { title: 'Restaurants', href: '#restaurants'},
//         { title: 'Contact', href: '#contact'},


//     ];

//     return (
//         <nav
//             className={`fixed w-full z-50 transition-all duration-300 ${
//                 isScrolled
//                     ? 'bg-accent py-2'
//                     : 'bg-transparent py-4'
//             }`}
//         >
//             <div className="container mx-auto px-4">
//                 <div className="flex justify-between items-center">
//                     <Link
//                         href="/home-main"
//                         className="text-2xl font-bold text-white transition-all duration-300"
//                     >
//                         DineEase
//                     </Link>

//                     {/* Desktop Navigation */}
//                     <div className="hidden md:flex iems-center space-x-8">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.title}
//                                 href={link.href}
//                                 className="text-white hover:text-primary-light transition-color duration-200"
//                             >
//                                 {link.title}
//                             </Link>
//                         ))}
//                         <button
//                             className="bg-primary hover:bg-primary-hover text-white transition-all duration-200"
//                         >
//                             <User className="mr-2 h-4 w-4" />
//                             Sign in
//                         </button>
//                     </div>

//                     {/* Mobile Menu Button */}
//                     <button
//                         className="md:hidden text-white"
//                         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                     >
//                         {isMobileMenuOpen ? <X /> : <Menu />}
//                     </button>
//                 </div>

//                 {/* Mobile Navigation */}
//                 {isMobileMenuOpen && (
//                     <div className="md:hidden mt-4 bg-accent-dark rounded-lg p-4 animate-fade-in">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.title}
//                                 href={link.href}
//                                 className="block py-2 text-white hover:text-primary-light"
//                             >
//                                 {link.title}
//                             </Link>
//                         ))}
//                         <button
//                             className="w-full mt-4 bg-primary hover:bg-primary-hover tetx-white"
//                         >
//                             <User className="mr-2 h-4 w-4" />
//                             Sign in
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
