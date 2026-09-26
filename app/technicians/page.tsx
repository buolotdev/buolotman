import { redirect } from "next/navigation";

export default function TechniciansPage() {
  redirect("/search?tab=technician");
}
