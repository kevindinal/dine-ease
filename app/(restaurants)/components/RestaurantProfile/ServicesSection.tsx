import { FaBus, FaCar, FaCreditCard, FaWifi } from "react-icons/fa6";

export default function ServicesSection() {
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="font-semibold"><FaCar className="text-red-500" /> Fine Dining</h3>
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="font-semibold"><FaBus className="text-red-500" /> Event Catering</h3>
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="font-semibold"><FaCreditCard className="text-red-500" /> Outdoor Seating</h3>
        </div>
        <div className="p-4 bg-white shadow-lg rounded-lg">
          <h3 className="font-semibold"><FaWifi className="text-red-500" /> Private Events</h3>
        </div>
      </div>
    </div>
  );
}