import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";

import { Trash2 } from "lucide-react"
const SummaryPage = () => {
  return (
    <Card className="p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
          Edit
        </Button>
      </div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Date</span>
          <span className="font-medium">Friday, Dec 15, 2023</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Time</span>
          <span className="font-medium">7:30 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Guests</span>
          <span className="font-medium">4 people</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Table</span>
          <span className="font-medium">Table 12</span>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium mb-4">Pre-ordered Items</h3>
        <div className="space-y-4">
          {[
            { name: "Beef Bourguignon", price: 64.00, quantity: 2, image: "/placeholder.svg" },
            { name: "Coq au Vin", price: 28.00, quantity: 1, image: "/placeholder.svg" },
            { name: "Ratatouille", price: 24.00, quantity: 1, image: "/placeholder.svg" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium">${item.price.toFixed(2)}</span>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
export default SummaryPage