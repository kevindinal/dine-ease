// "use client"

// import { useState, useEffect } from "react"
// import { Menu, X, LogOut, Settings } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import Link from "next/link"

// interface NavLink {
//   title: string
//   href: string
// }

// const navLinks: NavLink[] = [
//   { title: "Home", href: "/home-main" },
//   { title: "Restaurants", href: "#restaurants" },
//   { title: "Contact", href: "#contact" },
// ]

// const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false)
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
//   // Add user state - in a real app, this would come from your auth system
//   const [user, setUser] = useState({
//     name: "Lucy",
//     image: "/placeholder.svg?height=32&width=32",
//   })

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 0)
//     }

//     window.addEventListener("scroll", handleScroll)

//   const navLinks = [
//     { title: 'Home', href: '/home-main' },
//     // { title: 'Features', href: '#features' },
//     // { title: 'Restaurants', href: '#restaurants' },
//     { title: 'Reservations', href: '/restaurants' },
//     { title: 'Contact', href: '#contact' },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 left-0 w-full py-4 ${
//         isScrolled ? "bg-red-600 shadow-md" : "bg-red-600/90"
//       } z-50 transition-colors duration-300`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <Link
//             href="/home-main"
//             className="text-2xl font-bold text-white transition-all duration-300 hover:text-white/90 hover:scale-105"
//           >
//             DineEase
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navLinks.map((link) => (
//               <Link key={link.title} href={link.href} className="text-white relative group py-2">
//                 <span className="relative z-10">{link.title}</span>
//                 <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
//               </Link>
//             ))}

//             {/* User Profile Dropdown */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="relative rounded-full bg-white/10 hover:bg-white/20 p-1 transition-all duration-300 hover:scale-105"
//                 >
//                   <div className="flex items-center gap-2 px-2">
//                     <Avatar className="h-8 w-8 border-2 border-white transition-transform duration-300 hover:border-primary">
//                       <AvatarImage src={user.image} alt={user.name} />
//                       <AvatarFallback className="bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
//                     </Avatar>
//                     <span className="text-white font-medium hidden sm:inline">{user.name}</span>
//                   </div>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <DropdownMenuLabel className="font-normal">
//                   <div className="flex flex-col space-y-1">
//                     <p className="text-sm font-medium leading-none">{user.name}</p>
//                     <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-red-50">
//                   <Settings className="mr-2 h-4 w-4" />
//                   <span>Profile Settings</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-red-50">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Log out</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           {/* Mobile Button */}
//           <div className="md:hidden">
//             <Button
//               variant="ghost"
//               className="text-white hover:bg-white/10 transition-colors duration-200 rounded-full"
//               onClick={toggleMobileMenu}
//             >
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden mt-4 bg-red-700 rounded-lg p-4 animate-fade-in">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.title}
//                 href={link.href}
//                 className="block py-2 text-white hover:text-white hover:bg-red-800 px-2 rounded transition-colors duration-200"
//               >
//                 {link.title}
//               </Link>
//             ))}
//             <div className="flex items-center gap-2 mt-4 py-2">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src={user.image} alt={user.name} />
//                 <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
//               </Avatar>
//               <span className="text-white">{user.name}</span>
//             </div>
//             <div className="mt-2 space-y-2">
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200"
//               >
//                 <Settings className="mr-2 h-4 w-4" />
//                 Profile Settings
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200"
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Log out
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   )
// }

// export default Navbar

"use client";

import { useState, useEffect } from "react";
import { Menu, X, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface NavLink {
  title: string;
  href: string;
}

const navLinks: NavLink[] = [
  { title: "Home", href: "/home-main" },
  { title: "Restaurants", href: "/restaurants" },
  { title: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({
    name: "Lucy",
    image: "/placeholder.svg?height=32&width=32",
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full py-4 ${isScrolled ? "bg-red-600 shadow-md" : "bg-red-600/90"} z-50 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/home-main" className="text-2xl font-bold text-white transition-all duration-300 hover:text-white/90 hover:scale-105">
            DineEase
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.title} href={link.href} className="text-white relative group py-2">
                <span className="relative z-10">{link.title}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full bg-white/10 hover:bg-white/20 p-1 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8 border-2 border-white transition-transform duration-300 hover:border-primary">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium hidden sm:inline">{user.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-red-50">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-white hover:bg-white/10 transition-colors duration-200 rounded-full" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-red-700 rounded-lg p-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.title} href={link.href} className="block py-2 text-white hover:text-white hover:bg-red-800 px-2 rounded transition-colors duration-200">
                {link.title}
              </Link>
            ))}
            <div className="flex items-center gap-2 mt-4 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-white">{user.name}</span>
            </div>
            <div className="mt-2 space-y-2">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200">
                <Settings className="mr-2 h-4 w-4" />
                Profile Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-red-800 transition-colors duration-200">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;






