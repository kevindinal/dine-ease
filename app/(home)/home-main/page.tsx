import Hero from "@/components/hero"
import SpecialMenu from "@/components/special-menu"
import TodaysMenu from "@/components/todays-menu"
import QualityServices from "@/components/quality-services"
import MenuGallery from "@/components/menu-gallery"
import Reservation from "@/components/reservation"
import CustomerComments from "@/components/customer-comments"
import MasterChefs from "@/components/master-chefs"
import NewsBlog from "@/components/news-blog"
import ContactSection from "@/components/contact-section"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <SpecialMenu />
        <TodaysMenu />
        <QualityServices />
        <MenuGallery />
        <Reservation />
        <CustomerComments />
        <MasterChefs />
        <NewsBlog />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

