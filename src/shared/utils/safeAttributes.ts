export function isValidAttribute(attr: string): boolean {
  if (!attr || typeof attr !== 'string') return false;
  if (attr.trim() === '') return false;
  if (/["<>\\\s]/.test(attr)) return false;
  if (attr.startsWith('"')) return false;
  return true;
}
