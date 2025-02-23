import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

const SummaryPage = () => {
  return (
    <Card className="p-6 shadow-lg rounded-xl border bg-[#FFECEB]">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#FC8C84] pb-4 mb-6">
        <h2 className="text-2xl font-bold text-[#FA4032]">Order Summary</h2>
        <Button variant="ghost" size="sm" className="text-[#FA4032] hover:text-[#FB665B]">
          Edit
        </Button>
      </div>

      {/* Reservation Details */}
      <div className="space-y-4 mb-6 text-gray-700">
        <DetailRow label="Date" value="Friday, Dec 15, 2023" />
        <DetailRow label="Time" value="7:30 PM" />
        <DetailRow label="Guests" value="4 people" />
        <DetailRow label="Table" value="Table 12" />
      </div>

      {/* Pre-Ordered Items */}
      <div className="border-t border-[#FC8C84] pt-6">
        <h3 className="text-lg font-semibold mb-4 text-[#FA4032]">Pre-ordered Items</h3>
        <div className="space-y-4">
          {[
            { name: "Beef Bourguignon", price: 64.0, quantity: 2, image: "/placeholder.svg" },
            { name: "Coq au Vin", price: 28.0, quantity: 1, image: "/placeholder.svg" },
            { name: "Ratatouille", price: 24.0, quantity: 1, image: "/placeholder.svg" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#FEC6C2] rounded-lg shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover" />
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                <Button variant="ghost" size="icon" className="text-[#FA4032] hover:text-[#FB665B]">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Price & Checkout Button */}
      <div className="border-t border-[#FC8C84] pt-6 mt-6 flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-800">Total:</span>
        <span className="text-xl font-bold text-[#FA4032]">$180.00</span>
      </div>

      <Button className="w-full mt-6 bg-[#FA4032] hover:bg-[#FB665B] text-white py-3 rounded-lg text-lg font-semibold">
        Proceed to Payment
      </Button>
    </Card>
  );
};

// Component for reservation details
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-gray-700">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
);

export default SummaryPage;
