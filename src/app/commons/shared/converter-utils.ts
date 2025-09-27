export function enumToArray<T>(e: any): { key: string, value: T }[] {
  return Object.keys(e)
    .filter(k => isNaN(Number(k)))
    .map(k => ({ key: k, value: e[k] }));
}