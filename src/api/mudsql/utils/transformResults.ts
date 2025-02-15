import { PostQResponse } from "../generated";

export function transformResult(
  data: PostQResponse["result"]
): Record<string, string>[] {
  const results = data.shift();
  const header = results?.shift();
  if (!results || !header) {
    return [];
  }
  return results.map((row) => {
    const obj: Record<string, string> = {};
    header.forEach((key, index) => {
      if (row[index] !== undefined) {
        obj[key] = row[index];
      }
    });
    return obj;
  });
}