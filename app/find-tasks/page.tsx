import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TaskBoard from "@/app/components/TaskBoard";

export default function FindTasksPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "60px", maxWidth: "1400px", margin: "0 auto" }}>
        <TaskBoard />
      </div>
      <Footer />
    </div>
  );
}
