export function formatXOF(amount: number | string): string {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num) + " XOF";
}
