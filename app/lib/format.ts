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

export function formatTimeAgo(dateStr?: string | number | Date | null, lang: string = "en"): string {
  if (!dateStr) return lang === "fr" ? "Récemment" : "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return lang === "fr" ? "Récemment" : "Recently";

  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 45) {
    return lang === "fr" ? "À l'instant" : "Just now";
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return lang === "fr" ? `Il y a ${diffMin} min` : `${diffMin}m ago`;
  }

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) {
    return lang === "fr" ? `Il y a ${diffHr}h` : `${diffHr}h ago`;
  }

  const diffDays = Math.floor(diffHr / 24);
  if (diffDays === 1) {
    return lang === "fr" ? "Hier" : "Yesterday";
  }
  if (diffDays < 7) {
    return lang === "fr" ? `Il y a ${diffDays}j` : `${diffDays}d ago`;
  }

  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr?: string | number | Date | null, lang: string = "en"): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const datePart = date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${datePart}, ${timePart}`;
}
