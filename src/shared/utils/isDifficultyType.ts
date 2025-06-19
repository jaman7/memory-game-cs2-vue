export function isDifficultyType(difficulty: number): boolean {
  const validDifficulties: number[] = [1, 2, 3];
  return validDifficulties.includes(difficulty);
}
