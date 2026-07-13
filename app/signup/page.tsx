import SignupRoleSelector from "./SignupRoleSelector";

const validRoles = new Set(["client", "technician", "company"]);

export default async function SignupPage({
  searchParams,
}: PageProps<"/signup">) {
  const params = await searchParams;
  const role = typeof params.role === "string" && validRoles.has(params.role) ? params.role : "technician";

  return <SignupRoleSelector initialRole={role} />;
}
