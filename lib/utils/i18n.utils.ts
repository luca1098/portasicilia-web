export const interpolate = (text: string, values: Record<string, string | number>) => {
  return text.replace(/{{(\w+)}}/g, (match, key) => values[key]?.toString() || match)
}
