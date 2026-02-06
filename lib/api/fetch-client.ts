import type { SupportedLocale } from '@/lib/configs/locales'

const BACKEND_URL = process.env.API_URL || 'http://localhost:7002'

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  lang?: SupportedLocale
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(baseUrl: string, endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, lang, params, headers: customHeaders, ...init } = options

  const raw = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`
  const url = new URL(raw, baseUrl.startsWith('http') ? baseUrl : undefined)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
  }

  const headers = new Headers(customHeaders)

  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (lang) {
    headers.set('Accept-Language', lang)
  }

  const response = await fetch(url, {
    ...init,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let data: unknown
    try {
      data = await response.json()
    } catch {
      data = await response.text()
    }
    throw new ApiError(`${response.status} ${response.statusText}`, response.status, data)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

function createApi(baseUrl: string) {
  return {
    get<T>(endpoint: string, options?: Omit<FetchOptions, 'body'>) {
      return request<T>(baseUrl, endpoint, { ...options, method: 'GET' })
    },

    post<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'body'>) {
      return request<T>(baseUrl, endpoint, { ...options, method: 'POST', body })
    },

    put<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'body'>) {
      return request<T>(baseUrl, endpoint, { ...options, method: 'PUT', body })
    },

    patch<T>(endpoint: string, body?: unknown, options?: Omit<FetchOptions, 'body'>) {
      return request<T>(baseUrl, endpoint, { ...options, method: 'PATCH', body })
    },

    delete<T>(endpoint: string, options?: FetchOptions) {
      return request<T>(baseUrl, endpoint, { ...options, method: 'DELETE' })
    },
  }
}

// Client-side: passes through Next.js proxy (no CORS)
export const api = createApi('/api')

// Server-side: hits the backend directly (for Server Components / Server Actions)
export const apiServer = createApi(BACKEND_URL)
