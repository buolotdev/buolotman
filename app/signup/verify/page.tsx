import OtpVerification from "./OtpVerification";

export default async function SignupVerifyPage({
  searchParams,
}: PageProps<"/signup/verify">) {
  const params = await searchParams;

  const phone =
    typeof params.phone === "string" && params.phone.trim().length > 0
      ? params.phone
      : "+1 (555) 019-2834";

  const role = typeof params.role === "string" ? params.role : "technician";

  return <OtpVerification phone={phone} role={role} />;
}
