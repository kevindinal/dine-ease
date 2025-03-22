"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navItems = [
  {
    title: "Features",
    items: [
      { name: "Reservation Management", href: "#" },
      { name: "Table Management", href: "#" },
      { name: "Guest Management", href: "#" },
      { name: "Marketing Tools", href: "#" },
      { name: "Payment Processing", href: "#" },
    ],
  },
  {
    title: "Customers",
    items: [
      { name: "Fine Dining", href: "#" },
      { name: "Casual Dining", href: "#" },
      { name: "Hotels", href: "#" },
      { name: "Cafes", href: "#" },
      { name: "Success Stories", href: "#" },
    ],
  },
  { title: "How it works", href: "#" },
  {
    title: "Resources",
    items: [
      { name: "Blog", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Webinars", href: "#" },
      { name: "API Documentation", href: "#" },
    ],
  },
  { title: "Pricing", href: "#" },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">DineEase</span>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold">D</span>
              </div>
              <span className="text-xl font-bold text-red-600">DineEase</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navItems.map((item) =>
            item.items ? (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-red-600">
                    {item.title}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  {item.items.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link href={subItem.href} className="w-full">
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.title}
                href={item.href || "#"}
                className="text-sm font-medium text-gray-700 hover:text-red-600"
              >
                {item.title}
              </Link>
            ),
          )}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-red-600 mr-6">
            Log in
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              Request Demo
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Try for free</Button>
            <button className="p-2 text-gray-700 hover:text-red-600 ml-2">
              <Globe className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">DineEase</span>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-2">
                    <span className="text-white font-bold">D</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">DineEase</span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navItems.map((item) => (
                    <div key={item.title} className="-mx-3">
                      {item.items ? (
                        <details className="group">
                          <summary className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50">
                            {item.title}
                            <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="mt-1 pl-4 space-y-1">
                            {item.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block rounded-lg py-2 pl-6 pr-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link
                          href={item.href || "#"}
                          className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="py-6 space-y-3">
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-700 hover:bg-gray-50 hover:text-red-600"
                  >
                    Log in
                  </Link>
                  <div className="grid grid-cols-1 gap-3">
                    <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                      Request Demo
                    </Button>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Try for free</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

