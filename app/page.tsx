import PaymentForm from "@/components/PaymentForm";
import SummaryPage from "@/components/SummaryPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <PaymentForm />
      <SummaryPage />
    </div>
  );
}
