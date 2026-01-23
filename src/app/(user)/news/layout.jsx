import Footer from "@/components/ui/Footer";
import HeaderUser from "@/components/ui/HeaderUser";
import Navbar from "@/components/ui/UserNavbar";

export default function LayoutUserPage({ children }) {
  return (
    <>
      <div className="bg-white text-black">
        {/* NAVBAR */}
        <header className="sticky top-0 z-50 bg-white border-b border-black/10">
          <HeaderUser />
        </header>

        <section className="navbar">
          <Navbar />
        </section>

        <main className="min-h-screen">{children}</main>
        {/* FOOTER tetap */}
        <Footer />
      </div>
      ;
    </>
  );
}
