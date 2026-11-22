import './styles/main.css'

document.documentElement.classList.add('js')

const year = document.querySelector('[data-year]')
if (year) year.textContent = String(new Date().getFullYear())

const nav = document.querySelector('[data-nav]')
const navToggle = document.querySelector('[data-nav-toggle]')
const navLinks = document.getElementById('nav-links')

function updateNav() {
  nav?.classList.toggle('is-scrolled', window.scrollY > 8)
}

function setMenu(open) {
  nav?.classList.toggle('is-open', open)
  navToggle?.setAttribute('aria-expanded', String(open))
  const label = navToggle?.querySelector('.sr-only')
  if (label) label.textContent = open ? 'Close menu' : 'Open menu'
}

updateNav()
window.addEventListener('scroll', updateNav, { passive: true })

navToggle?.addEventListener('click', () => {
  setMenu(!nav?.classList.contains('is-open'))
})

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false)
})

const revealElements = document.querySelectorAll('.reveal')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  )

  revealElements.forEach((element) => revealObserver.observe(element))
}

const viewerRoot = document.querySelector('[data-model-viewer]')

if (viewerRoot) {
  const loadViewer = () => {
    import('./viewer.js')
      .then(({ createModelViewer }) => createModelViewer(viewerRoot))
      .catch(() => {
        const fallback = viewerRoot.querySelector('[data-viewer-fallback]')
        const loading = viewerRoot.querySelector('[data-viewer-loading]')
        if (loading) loading.hidden = true
        if (fallback) fallback.hidden = false
      })
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(loadViewer, { timeout: 1500 })
  } else {
    window.setTimeout(loadViewer, 400)
  }
}

const orderForm = document.querySelector('[data-order-form]')

if (orderForm) {
  const status = orderForm.querySelector('[data-order-status]')
  const submitButton = orderForm.querySelector('button[type="submit"]')
  const defaultLabel = submitButton?.textContent ?? 'Reserve PawClock'

  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!orderForm.reportValidity()) return

    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = 'Reserving…'
    }
    if (status) {
      status.textContent = ''
      status.classList.remove('is-success', 'is-error')
    }

    try {
      const payload = Object.fromEntries(new FormData(orderForm).entries())
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Something went wrong. Please try again.')
      }

      orderForm.reset()
      if (status) {
        status.textContent = `Reserved. Your code is ${result.orderId}.`
        status.classList.add('is-success')
      }
    } catch (error) {
      if (status) {
        status.textContent = error.message
        status.classList.add('is-error')
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false
        submitButton.textContent = defaultLabel
      }
    }
  })
}
