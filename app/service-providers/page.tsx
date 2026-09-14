import { redirect } from "next/navigation";

export default function ServiceProvidersRedirect() {
  redirect("/search?tab=technician");
}
