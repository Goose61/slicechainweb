/** Normalize business tax / registration IDs — accepts any reasonable printable input. */
export function normalizeTaxId(raw: string | null | undefined): string {
  return String(raw ?? "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isValidTaxId(raw: string | null | undefined): boolean {
  const normalized = normalizeTaxId(raw);
  return normalized.length >= 1 && normalized.length <= 100;
}
