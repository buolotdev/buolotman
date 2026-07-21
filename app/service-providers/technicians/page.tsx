import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import ProviderBoard from "@/app/components/ProviderBoard";

export default function TechniciansPage() {
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Header />
      <div style={{ paddingTop: "20px" }}>
        <ProviderBoard />
      </div>
      <Footer />
    </div>
  );
}
