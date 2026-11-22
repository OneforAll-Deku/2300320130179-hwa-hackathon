const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MAX_QUANTITY = 3

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function validateOrder(input = {}) {
  if (input.company) {
    return { status: 200, body: { ok: true, orderId: 'PC-00000', message: 'Reservation received' } }
  }

  const name = clean(input.name, 80)
  const email = clean(input.email, 160).toLowerCase()
  const quantity = Number.parseInt(input.quantity, 10)

  if (name.length < 2) {
    return { status: 422, body: { ok: false, error: 'Please enter your name.' } }
  }
  if (!EMAIL_RE.test(email)) {
    return { status: 422, body: { ok: false, error: 'Please enter a valid email address.' } }
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return { status: 422, body: { ok: false, error: `Choose a quantity between 1 and ${MAX_QUANTITY}.` } }
  }

  const stamp = Date.now().toString(36).toUpperCase().slice(-5)
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
  const orderId = `PC-${stamp}${suffix}`

  return {
    status: 201,
    body: {
      ok: true,
      orderId,
      quantity,
      message: 'Reservation received'
    }
  }
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body' })
    }
  }

  const result = validateOrder(body || {})
  return res.status(result.status).json(result.body)
}
