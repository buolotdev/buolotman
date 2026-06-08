export function toArray<T>(data: T | { results?: T } | null | undefined): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as any;
  if (typeof data === "object" && "results" in (data as any)) return (data as any).results || [];
  return [];
}
