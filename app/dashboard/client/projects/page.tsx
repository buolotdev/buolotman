import { redirect } from "next/navigation";

export default function ProjectsIndex() {
  // Redirect to a dummy project ID for now, as we don't have a projects list page yet
  redirect("/dashboard/client/projects/1");
}
