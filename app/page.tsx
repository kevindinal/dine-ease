import PaymentForm from "@/components/payment/PaymentForm";
import SummaryPage from "@/components/payment/SummaryPage";
import PaymentPage from "./(payments)/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
     
      <PaymentPage/>
    </div>
  );
}
