export function toFormData(values: Record<string, unknown>, fileKeys?: string[]): FormData {
  const fd = new FormData()

  function append(prefix: string, value: unknown) {
    if (value == null) return
    if (value instanceof File) {
      fd.append(prefix, value)
    } else if (fileKeys?.includes(prefix)) {
      return
    } else if (Array.isArray(value)) {
      for (const item of value) {
        fd.append(prefix, String(item))
      }
    } else if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        append(`${prefix}[${k}]`, v)
      }
    } else {
      fd.append(prefix, String(value))
    }
  }

  for (const [key, value] of Object.entries(values)) {
    append(key, value)
  }
  return fd
}
