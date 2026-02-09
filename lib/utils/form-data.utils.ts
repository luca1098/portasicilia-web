export function toFormData(values: Record<string, unknown>, fileKeys?: string[]): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(values)) {
    if (value == null) continue
    if (value instanceof File) {
      fd.append(key, value)
    } else if (fileKeys?.includes(key)) {
      continue
    } else {
      fd.append(key, String(value))
    }
  }
  return fd
}
