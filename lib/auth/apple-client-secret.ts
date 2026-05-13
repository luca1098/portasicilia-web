import { createPrivateKey, createSign } from 'crypto'

const APPLE_AUDIENCE = 'https://appleid.apple.com'
const SECRET_TTL_SECONDS = 60 * 60 * 24 * 180

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function normalizePrivateKey(raw: string): string {
  const withRealNewlines = raw.replace(/\\n/g, '\n').trim()
  if (withRealNewlines.includes('BEGIN PRIVATE KEY')) return withRealNewlines
  const body = withRealNewlines.replace(/\s+/g, '')
  return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`
}

let cached: { secret: string; expiresAt: number } | null = null

export function generateAppleClientSecret(): string {
  const now = Math.floor(Date.now() / 1000)
  if (cached && cached.expiresAt - now > 60 * 60) return cached.secret

  const teamId = process.env.APPLE_TEAM_ID
  const clientId = process.env.APPLE_CLIENT_ID
  const keyId = process.env.APPLE_KEY_ID
  const rawKey = process.env.APPLE_PRIVATE_KEY

  if (!teamId || !clientId || !keyId || !rawKey) {
    throw new Error(
      'Missing Apple OAuth env vars: APPLE_TEAM_ID, APPLE_CLIENT_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY'
    )
  }

  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' }
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + SECRET_TTL_SECONDS,
    aud: APPLE_AUDIENCE,
    sub: clientId,
  }

  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`
  const privateKey = createPrivateKey(normalizePrivateKey(rawKey))
  const signature = createSign('SHA256')
    .update(signingInput)
    .sign({ key: privateKey, dsaEncoding: 'ieee-p1363' })

  const secret = `${signingInput}.${base64url(signature)}`
  cached = { secret, expiresAt: payload.exp }
  return secret
}
