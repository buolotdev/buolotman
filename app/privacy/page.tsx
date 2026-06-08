const policies = [
  {
    title: "Data we collect",
    body:
      "We collect account information, task and service data, message content, payment records, device and usage metadata, and verification documents where applicable.",
  },
  {
    title: "How we use data",
    body:
      "We use data to operate the marketplace, process payments, verify users, prevent abuse, resolve disputes, and improve product reliability and performance.",
  },
  {
    title: "Sharing and disclosure",
    body:
      "We share only the information required to complete tasks, process payments, comply with the law, or support trusted infrastructure providers such as hosting, storage, messaging, or analytics services.",
  },
  {
    title: "Retention and security",
    body:
      "We retain records for as long as needed for business, legal, and compliance purposes and protect data with access controls, transport security, and operational safeguards.",
  },
  {
    title: "Your choices",
    body:
      "You can review and update certain profile information, request account deletion where permitted, and manage communication preferences through the platform.",
  },
];

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#f8fafc" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" }}>
        <p style={{ margin: 0, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Legal</p>
        <h1 style={{ margin: "8px 0 16px" }}>Privacy Policy</h1>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          This is a practical privacy policy summary for the working product. It should be replaced with jurisdiction-specific legal text before production launch.
        </p>
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {policies.map((policy) => (
            <section key={policy.title} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 20, background: "#f8fafc" }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{policy.title}</h2>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{policy.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
