export function formatXOF(amount: number | string): string {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num) + " XOF";
}

export function cleanDescription(desc?: string | null): string {
  if (!desc) return "";
  return desc.replace(/\[DIRECT_INVITATION:[^\]]+\]/g, "").trim();
}

export function extractDirectInvitation(desc?: string | null): { specialistId?: number; specialistName?: string } | null {
  if (!desc || !desc.includes("DIRECT_INVITATION")) return null;
  const idMatch = desc.match(/specialist_id=([^;\]]+)/);
  const nameMatch = desc.match(/specialist_name=([^;\]]+)/);
  return {
    specialistId: idMatch ? parseInt(idMatch[1]) : undefined,
    specialistName: nameMatch ? decodeURIComponent(nameMatch[1]) : undefined,
  };
}
