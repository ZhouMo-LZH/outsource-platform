import { NextRequest, NextResponse } from 'next/server'

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMITS = {
  default: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
  },
  auth: {
    windowMs: 15 * 60 * 1000,
    maxRequests: 10
  },
  upload: {
    windowMs: 60 * 60 * 1000,
    maxRequests: 20
  },
  email: {
    windowMs: 5 * 60 * 1000,
    maxRequests: 3
  }
}

function checkRateLimit(key: string, limit: typeof RATE_LIMITS.default): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs })
    return true
  }

  if (record.count >= limit.maxRequests) {
    return false
  }

  record.count++
  return true
}

function cleanupRateLimits() {
  const now = Date.now()
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}

setInterval(cleanupRateLimits, 5 * 60 * 1000)

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  /(--|#|\/\*|\*\/)/,
  /(\bEXEC\b|\bEXECUTE\b)/i,
  /('\s*(OR|AND)\s*')/i,
  /(1\s*=\s*1|'\s*=\s*')/i,
  /(\bCONCAT\b|\bCHAR\b|\bASCII\b)/i
]

const XSS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi
]

function detectMaliciousInput(input: string): { isMalicious: boolean; type?: string } {
  for (const pattern of SQL_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return { isMalicious: true, type: 'SQL Injection' }
    }
  }

  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return { isMalicious: true, type: 'XSS' }
    }
  }

  return { isMalicious: false }
}

function checkObject(obj: unknown): { isMalicious: boolean; type?: string } {
  if (typeof obj === 'string') {
    return detectMaliciousInput(obj)
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const keys = Object.keys(obj as Record<string, unknown>)
    for (const key of keys) {
      const result = checkObject((obj as Record<string, unknown>)[key])
      if (result.isMalicious) {
        return result
      }
    }
  }
  
  return { isMalicious: false }
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  if (request.nextUrl.pathname.startsWith('/api/')) {
    const clientIP = getClientIP(request)
    
    let rateLimitKey = `${clientIP}:${request.nextUrl.pathname}`
    let currentLimit = RATE_LIMITS.default

    if (request.nextUrl.pathname.includes('/auth/') || 
        request.nextUrl.pathname.includes('/login') ||
        request.nextUrl.pathname.includes('/register')) {
      rateLimitKey = `auth:${clientIP}`
      currentLimit = RATE_LIMITS.auth
    }

    if (request.nextUrl.pathname.includes('/upload')) {
      rateLimitKey = `upload:${clientIP}`
      currentLimit = RATE_LIMITS.upload
    }

    if (request.nextUrl.pathname.includes('/email') ||
        request.nextUrl.pathname.includes('/verify')) {
      rateLimitKey = `email:${clientIP}`
      currentLimit = RATE_LIMITS.email
    }

    if (!checkRateLimit(rateLimitKey, currentLimit)) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: '请求过于频繁，请稍后再试',
          retryAfter: Math.ceil((rateLimitStore.get(rateLimitKey)?.resetTime || Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': currentLimit.maxRequests.toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }

    if (['POST', 'PUT'].includes(request.method)) {
      try {
        const clone = request.clone()
        const body = clone.json().then((data) => {
          const detectionResult = checkObject(data)
          return detectionResult
        })
      } catch {
        // 无法解析 JSON，跳过检测
      }
    }

    const record = rateLimitStore.get(rateLimitKey)
    if (record) {
      response.headers.set('X-RateLimit-Limit', currentLimit.maxRequests.toString())
      response.headers.set('X-RateLimit-Remaining', Math.max(0, currentLimit.maxRequests - record.count).toString())
    }
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400')

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
