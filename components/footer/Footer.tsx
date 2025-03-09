import { Send } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

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
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-accent-darker text-white placeholder:text-gray-400"
                />
                <Button className="bg-accent hover:bg-primary text-white">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-accent-darker mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} DineEase. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

    //    <footer className="bg-accent-darkest text-white py-16">
    //     <div className="container mx-auto px-4">
    //       <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    //         <div className="space-y-4">
    //           <h3 className="text-2xl font-bold">DineEase</h3>
    //           <p className="text-gray-400">
    //             Revolutionizing the dining experience with smart technology.
    //           </p>
    //         </div>
            
    //         <div>
    //           <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
    //           <ul className="space-y-2">
    //             {['About', 'Features', 'Restaurants', 'Contact'].map((item) => (
    //               <li key={item}>
    //                 <a
    //                   href={`#${item.toLowerCase()}`}
    //                   className="text-gray-400 hover:text-primary-light transition-colors"
    //                 >
    //                   {item}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
            
    //         <div>
    //           <h4 className="text-lg font-semibold mb-4">Legal</h4>
    //           <ul className="space-y-2">
    //             {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
    //               <li key={item}>
    //                 <a
    //                   href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
    //                   className="text-gray-400 hover:text-primary-light transition-colors"
    //                 >
    //                   {item}
    //                 </a>
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
            
    //         <div className="space-y-4">
    //           <h4 className="text-lg font-semibold">Newsletter</h4>
    //           <p className="text-gray-400">
    //             Stay updated with our latest features and restaurants.
    //           </p>
    //           <div className="flex gap-2">
    //             <input
    //               type="email"
    //               placeholder="Enter your email"
    //               className="bg-accent-darker text-white placeholder:text-gray-400"
    //             />
    //             <button className="bg-accent hover:bg-primary text-white">
    //               <Send className="h-4 w-4" />
    //             </button>
    //           </div>
    //         </div>
    //       </div>
          
    //       <div className="border-t border-accent-darker mt-12 pt-8 text-center text-gray-400">
    //         <p>&copy; {new Date().getFullYear()} DineEase. All rights reserved.</p>
    //       </div>
    //     </div>
    //   </footer>
