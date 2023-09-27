export function sum(...n: number[]): number {
  return n.reduce((acc, v) => acc + v);
}
