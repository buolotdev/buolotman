import SignupSuccess from "./SignupSuccess";

export default async function SignupSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const role = typeof params.role === "string" ? params.role : "technician";

  return <SignupSuccess role={role} />;
}
