import './styles/main.css'
import { MaskedHeading } from './ui/MaskedHeading.js'
import { RitualScrubber } from './ui/RitualScrubber.js'
import { SpotlightCard } from './ui/SpotlightCard.js'

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

  const backToTop = document.getElementById('back-to-top')
  if (backToTop) {
    const toggleBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 500)
    window.addEventListener('scroll', toggleBackToTop, { passive: true })
    backToTop.addEventListener('click', () => {
      const top = document.getElementById('top')
      if (top) top.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  // Interactive product configurator
  const colorChips = document.querySelectorAll('.configurator__chip')
  const configSwatch = document.getElementById('config-swatch')
  const configColorName = document.getElementById('config-color-name')
  const configColorHex = document.getElementById('config-color-hex')
  const configBasePrice = document.getElementById('config-base-price')
  const configRefillRows = document.getElementById('config-refill-rows')
  const configGrandTotal = document.getElementById('config-grand-total')
  const configReserve = document.querySelector('.configurator__reserve')
  const colorwayInput = document.querySelector('input[name="colorway"]')
  const refillsInput = document.querySelector('input[name="refills"]')

  const BASE_PRICE = 34999
  const REFILL_PRICES = { 'broth-pods': 599, 'calming-chews': 499 }

  let selectedColor = 'teal'
  let selectedRefills = new Set()

  function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN')
  }

  function updateConfig() {
    const activeChip = document.querySelector('.configurator__chip--active')
    if (activeChip && configSwatch) {
      configSwatch.style.backgroundColor = activeChip.dataset.hex
      configColorName.textContent = activeChip.dataset.name
      configColorHex.textContent = activeChip.dataset.hex
    }

    configRefillRows.innerHTML = ''
    let monthlyTotal = 0
    const selectedValues = []
    selectedRefills.forEach((value) => {
      const price = REFILL_PRICES[value]
      monthlyTotal += price
      selectedValues.push(value)
      const row = document.createElement('div')
      row.className = 'configurator__total-row configurator__total-row--refills'
      const name = value === 'broth-pods' ? 'Broth Pods (monthly)' : 'Calming Chews (monthly)'
      row.innerHTML = `<span>${name}</span><span>${formatINR(price)}/mo</span>`
      configRefillRows.appendChild(row)
    })
    if (selectedValues.length === 0) {
      const row = document.createElement('div')
      row.className = 'configurator__total-row configurator__total-row--refills'
      row.innerHTML = `<span>Refill subscriptions</span><span>None selected</span>`
      configRefillRows.appendChild(row)
    }

    const grand = BASE_PRICE + monthlyTotal
    configBasePrice.textContent = formatINR(BASE_PRICE)
    configGrandTotal.textContent = formatINR(grand)

    if (colorwayInput) colorwayInput.value = selectedColor
    if (refillsInput) refillsInput.value = selectedValues.join(',')
  }

  colorChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      colorChips.forEach((c) => {
        c.classList.remove('configurator__chip--active')
        c.setAttribute('aria-pressed', 'false')
      })
      chip.classList.add('configurator__chip--active')
      chip.setAttribute('aria-pressed', 'true')
      selectedColor = chip.dataset.color
      updateConfig()
    })
  })

  document.querySelectorAll('.configurator__refill-item input').forEach((cb) => {
    cb.addEventListener('change', () => {
      if (cb.checked) selectedRefills.add(cb.value)
      else selectedRefills.delete(cb.value)
      updateConfig()
    })
  })

  if (configReserve) {
    configReserve.addEventListener('click', () => {
      const reserve = document.getElementById('reserve')
      if (reserve) reserve.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  updateConfig()
  MountMaskedHeading()
  MountRitualScrubber()
  MountApothecary()
  MountSpotlightCard()

  function MountMaskedHeading() {
    const container = document.querySelector('[data-masked-heading]')
    if (container) {
      const text = container.dataset.maskedHeading || ''
      MaskedHeading({ el: container, text, tag: 'h2', background: 'gradient' })
    }
  }

  function MountRitualScrubber() {
    const container = document.querySelector('.ritual-scrubber')
    if (container) {
      RitualScrubber({ el: container })
    }
  }

  function MountApothecary() {
    const container = document.querySelector('.apothecary')
    if (!container) return
    const tabs = container.querySelectorAll('.apothecary__tab')
    const panels = container.querySelectorAll('.apothecary__panel')

    function showScent(scent) {
      tabs.forEach((tab) => {
        const active = tab.dataset.scent === scent
        tab.classList.toggle('apothecary__tab--active', active)
        tab.setAttribute('aria-selected', String(active))
      })
      panels.forEach((panel) => {
        const active = panel.dataset.scent === scent
        panel.classList.toggle('apothecary__panel--active', active)
        panel.setAttribute('hidden', !active)
      })
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => showScent(tab.dataset.scent))
      tab.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          const index = Array.from(tabs).indexOf(tab)
          const step = event.key === 'ArrowLeft' ? -1 : 1
          const next = (index + step + tabs.length) % tabs.length
          tabs[next].focus()
          showScent(tabs[next].dataset.scent)
        }
      })
    })

    showScent(tabs[0].dataset.scent)
  }

  function MountSpotlightCard() {
    SpotlightCard({ selector: '.phase' })
    SpotlightCard({ selector: '.buy__card' })
  }

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
