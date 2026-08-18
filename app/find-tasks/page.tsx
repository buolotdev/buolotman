import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import TaskBoard from "@/app/components/TaskBoard";

export default function FindTasksPage() {
  return (
    <div style={{ background: "#f4f6fa", minHeight: "100vh" }}>
      <Header />
      <div style={{ padding: "28px 40px 56px", maxWidth: "1360px", margin: "0 auto" }}>
        <TaskBoard />
      </div>
      <Footer />
    </div>
  );
}
