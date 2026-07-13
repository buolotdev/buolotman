const sections = [
  {
    title: "Use of the platform",
    body:
      "Boulot Man connects clients, technicians, freelancers, and companies for lawful service contracts. You must provide accurate information and only use the platform for legitimate work requests and bids.",
  },
  {
    title: "Accounts and security",
    body:
      "You are responsible for maintaining the confidentiality of your credentials and for all activity on your account. We may suspend access for fraud, abuse, or policy violations.",
  },
  {
    title: "Payments and escrow",
    body:
      "Payments may be held in escrow until work is completed and approved. Refunds, chargebacks, and payout timing are governed by the applicable task or project terms.",
  },
  {
    title: "Disputes",
    body:
      "If a dispute arises, we may request evidence, review task history, and make a platform decision based on the available records and policies.",
  },
  {
    title: "Liability",
    body:
      "We provide the marketplace and supporting tools but do not guarantee every service outcome. To the fullest extent permitted by law, liability is limited to the applicable service fees or other caps stated in the final legal terms.",
  },
];

export default function TermsPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24, background: "#f8fafc" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 24, padding: 32, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" }}>
        <p style={{ margin: 0, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Legal</p>
        <h1 style={{ margin: "8px 0 16px" }}>Terms of Service</h1>
        <p style={{ color: "#475569", lineHeight: 1.7 }}>
          These terms are a working platform policy summary. Replace them with the final legal text reviewed by counsel before public launch in each operating market.
        </p>
        <div style={{ display: "grid", gap: 18, marginTop: 24 }}>
          {sections.map((section) => (
            <section key={section.title} style={{ border: "1px solid #e2e8f0", borderRadius: 18, padding: 20, background: "#f8fafc" }}>
              <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{section.title}</h2>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
