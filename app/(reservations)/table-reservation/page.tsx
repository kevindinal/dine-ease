import TableReservation from "@/app/(reservations)/table-reservation/components/table-reservation";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/header/Navbar";

export default function TableReservationPage() {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <TableReservation />
        <Footer />
      </div>
    </>
  );
}
