import { defineConfig } from 'vite'
import { validateOrder } from './api/order.js'

function devOrderApi() {
  return {
    name: 'dev-order-api',
    configureServer(server) {
      server.middlewares.use('/api/order', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
          return
        }

        let raw = ''
        req.on('data', (chunk) => {
          raw += chunk
          if (raw.length > 10000) req.destroy()
        })
        req.on('end', () => {
          let body = {}
          try {
            body = JSON.parse(raw || '{}')
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ ok: false, error: 'Invalid JSON body' }))
            return
          }
          const result = validateOrder(body)
          res.statusCode = result.status
          res.end(JSON.stringify(result.body))
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [devOrderApi()],
  server: {
    port: 5173
  },
  build: {
    target: 'es2020'
  }
})
