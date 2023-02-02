export function cls(...names: (string | false | undefined)[]): string {
  return names.filter(Boolean).join(" ");
}
