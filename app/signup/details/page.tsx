import SignupDetailsForm from "./SignupDetailsForm";

const validRoles = new Set(["client", "technician", "company"]);

export default async function SignupDetailsPage({
  searchParams,
}: any) {
  const params = await searchParams;
  const role =
    typeof params.role === "string" && validRoles.has(params.role)
      ? (params.role as "client" | "technician" | "company")
      : "technician";

  return <SignupDetailsForm role={role} />;
}
