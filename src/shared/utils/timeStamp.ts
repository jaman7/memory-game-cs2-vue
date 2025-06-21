export function getTimeStamp(date: string): number {
  return date ? Date.now() - new Date(date).getTime() : 0;
}
