import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

const MODEL_URL = '/models/pawclock.glb'
const TARGET_SIZE = 2.6

const MATERIAL_RECOLOR = {
  '00bdca': 0x0c5a52,
  '38e0ed': 0x14756b,
  f15f91: 0xb98a3c,
  eddbff: 0xe9dcc7
}

const PHASES = [
  { id: 'phase-lick', name: 'Lick', label: 'Phase 01 · Lick' },
  { id: 'phase-sniff', name: 'Play', label: 'Phase 02 · Play' },
  { id: 'phase-chew', name: 'Chew', label: 'Phase 03 · Chew' },
  { id: 'phase-settle', name: 'Settle', label: 'Phase 04 · Settle' }
]

const PART_INFO = [
  { phase: 0, name: 'Frozen lick-well bowl', desc: 'Food-grade silicone well, freezer-ready, dishwasher-safe.' },
  { phase: 2, name: 'Dental-chew collar', desc: 'Textured ring, replaceable core, treat-stuffable.' },
  { phase: 3, name: 'Sealed damping ring', desc: 'Viscous silicone fluid and vanes for a soft, damped click.' },
  { phase: 1, name: 'Scent chamber housing', desc: 'Translucent amber chamber, sealed from food and paws.' },
  { phase: 0, name: 'Lick-well lid', desc: 'Snap-fit lid keeps the frozen fill in place.' },
  { phase: 3, name: 'Brass chrono movement', desc: 'Machined solid brass timing spindle, 120-minute cycle.' },
  { phase: 1, name: 'Spiral scent labyrinth', desc: 'Polished stainless track, adjustable difficulty.' }
]

const TREAT_INFO = { phase: 1, name: 'Treat reservoir', desc: 'Hidden treat slots along the spiral for foraging.' }
const HIGHLIGHT_COLOR = 0xd9a05b

function createNoiseTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  const image = context.createImageData(size, size)
  for (let index = 0; index < image.data.length; index += 4) {
    const value = 208 + Math.random() * 47
    image.data[index] = value
    image.data[index + 1] = value
    image.data[index + 2] = value
    image.data[index + 3] = 255
  }
  context.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 3)
  return texture
}

function createBrushedTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  context.fillStyle = '#c9c9c9'
  context.fillRect(0, 0, size, size)
  for (let x = 0; x < size; x += 1) {
    const value = Math.round(148 + Math.random() * 92)
    context.fillStyle = `rgb(${value}, ${value}, ${value})`
    context.fillRect(x, 0, 1, size)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 1)
  return texture
}

function createDialTexture(size = 1024) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  const center = size / 2
  const radius = size * 0.49

  context.clearRect(0, 0, size, size)
  context.fillStyle = '#f4ebdc'
  context.beginPath()
  context.arc(center, center, radius, 0, Math.PI * 2)
  context.fill()

  const ringGradient = context.createRadialGradient(center, center, radius * 0.58, center, center, radius)
  ringGradient.addColorStop(0, 'rgba(12, 90, 82, 0)')
  ringGradient.addColorStop(1, 'rgba(12, 90, 82, 0.1)')
  context.fillStyle = ringGradient
  context.beginPath()
  context.arc(center, center, radius, 0, Math.PI * 2)
  context.fill()

  context.strokeStyle = 'rgba(12, 90, 82, 0.35)'
  context.lineWidth = size * 0.003
  context.beginPath()
  context.arc(center, center, radius * 0.93, 0, Math.PI * 2)
  context.stroke()

  for (let tick = 0; tick < 60; tick += 1) {
    const angle = (tick / 60) * Math.PI * 2 - Math.PI / 2
    const major = tick % 5 === 0
    const inner = radius * (major ? 0.84 : 0.88)
    const outer = radius * 0.92
    context.strokeStyle = major ? 'rgba(12, 90, 82, 0.8)' : 'rgba(12, 90, 82, 0.42)'
    context.lineWidth = size * (major ? 0.007 : 0.003)
    context.beginPath()
    context.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner)
    context.lineTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer)
    context.stroke()
  }

  ;[0, 1, 2, 3].forEach((phase) => {
    const angle = (phase / 4) * Math.PI * 2 - Math.PI / 2
    context.fillStyle = '#b98a3c'
    context.beginPath()
    context.arc(center + Math.cos(angle) * radius * 0.73, center + Math.sin(angle) * radius * 0.73, size * 0.009, 0, Math.PI * 2)
    context.fill()
  })

  context.textAlign = 'center'
  context.fillStyle = '#0c5a52'
  context.font = `600 ${Math.round(size * 0.047)}px Manrope, Arial, sans-serif`
  context.fillText('PAWCLOCK', center, center - size * 0.12)
  context.font = `600 ${Math.round(size * 0.019)}px Manrope, Arial, sans-serif`
  context.fillStyle = 'rgba(12, 90, 82, 0.72)'
  context.fillText('4-PHASE CHRONO-FEEDER', center, center - size * 0.072)
  context.fillText('LICK  ·  SNIFF  ·  CHEW  ·  SETTLE', center, center + size * 0.185)
  context.font = `600 ${Math.round(size * 0.024)}px Manrope, Arial, sans-serif`
  context.fillStyle = '#0c5a52'
  context.fillText('120 MIN', center, center + size * 0.145)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function addChronoDial(assembly, lid) {
  if (!assembly || !lid) return

  assembly.updateMatrixWorld(true)
  const lidBox = new THREE.Box3().setFromObject(lid)
  const lidSize = lidBox.getSize(new THREE.Vector3())
  const center = lidBox.getCenter(new THREE.Vector3())
  assembly.worldToLocal(center)
  const top = lidBox.max.y - assembly.getWorldPosition(new THREE.Vector3()).y
  const faceRadius = Math.min(lidSize.x, lidSize.z) * 0.315
  const brass = new THREE.MeshStandardMaterial({
    color: 0xb98a3c,
    metalness: 0.92,
    roughness: 0.28,
    envMapIntensity: 1.45
  })
  const darkBrass = brass.clone()
  darkBrass.color.setHex(0x8c6428)
  darkBrass.roughness = 0.34

  const face = new THREE.Mesh(
    new THREE.CircleGeometry(faceRadius, 96),
    new THREE.MeshStandardMaterial({
      map: createDialTexture(),
      roughness: 0.52,
      metalness: 0.04,
      envMapIntensity: 1.25
    })
  )
  face.rotation.x = -Math.PI / 2
  face.position.set(center.x, top + 0.003, center.z)
  face.receiveShadow = true

  const bezel = new THREE.Mesh(new THREE.TorusGeometry(faceRadius + 0.006, 0.011, 14, 128), brass)
  bezel.rotation.x = Math.PI / 2
  bezel.position.set(center.x, top + 0.012, center.z)
  bezel.castShadow = true

  const cap = new THREE.Mesh(new THREE.CylinderGeometry(faceRadius * 0.15, faceRadius * 0.17, 0.026, 40), darkBrass)
  cap.position.set(center.x, top + 0.021, center.z)
  cap.castShadow = true

  const handShape = new THREE.Shape()
  handShape.moveTo(0, faceRadius * 0.022)
  handShape.lineTo(-faceRadius * 0.6, faceRadius * 0.008)
  handShape.lineTo(-faceRadius * 0.7, 0)
  handShape.lineTo(-faceRadius * 0.6, -faceRadius * 0.008)
  handShape.lineTo(0, -faceRadius * 0.022)
  handShape.closePath()
  const hand = new THREE.Mesh(new THREE.ShapeGeometry(handShape), brass)
  hand.rotation.x = -Math.PI / 2
  hand.position.set(center.x, top + 0.038, center.z)

  const tail = new THREE.Mesh(new THREE.CircleGeometry(faceRadius * 0.035, 24), darkBrass)
  tail.rotation.x = -Math.PI / 2
  tail.position.set(center.x + faceRadius * 0.06, top + 0.037, center.z)

  const dial = new THREE.Group()
  dial.name = 'Chrono dial'
  dial.add(face, bezel, cap, hand, tail)
  assembly.add(dial)
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl'))
    )
  } catch {
    return false
  }
}

export function createModelViewer(root) {
  if (!root) return null

  const loading = root.querySelector('[data-viewer-loading]')
  const progress = root.querySelector('[data-viewer-progress]')
  const hint = root.querySelector('[data-viewer-hint]')
  const fallback = root.querySelector('[data-viewer-fallback]')
  const resetButton = root.querySelector('[data-viewer-reset]')
  const spinButton = root.querySelector('[data-viewer-spin]')
  const tooltip = root.querySelector('[data-viewer-tooltip]')
  const tooltipPhase = root.querySelector('[data-viewer-tooltip-phase]')
  const tooltipName = root.querySelector('[data-viewer-tooltip-name]')
  const phaseButtons = Array.from(document.querySelectorAll('[data-viewer-phase]'))
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  const pickables = []
  const phaseGroups = new Map()
  let hoveredGroup = null
  let chipPhase = null
  let pressPoint = null
  let pressTime = 0
  let dragging = false
  let flashTimer = 0

  function showFallback() {
    root.classList.add('is-fallback')
    if (loading) loading.hidden = true
    if (fallback) fallback.hidden = false
  }

  function registerPart(group, info) {
    if (!phaseGroups.has(info.phase)) phaseGroups.set(info.phase, new Set())
    phaseGroups.get(info.phase).add(group)
    group.traverse((child) => {
      if (!child.isMesh || !child.visible) return
      child.userData.partInfo = info
      child.userData.partGroup = group
      pickables.push(child)
    })
  }

  function setGroupHighlight(group, on) {
    if (!group) return
    group.traverse((child) => {
      if (!child.isMesh) return
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (!material || !material.emissive) return
        if (on) {
          material.emissive.setHex(HIGHLIGHT_COLOR)
          material.emissiveIntensity = 0.4
        } else {
          material.emissive.setHex(material.userData.baseEmissive ?? 0x000000)
          material.emissiveIntensity = material.userData.baseEmissiveIntensity ?? 1
        }
      })
    })
  }

  function setPhaseHighlight(index, on) {
    const groups = phaseGroups.get(index)
    if (!groups) return
    groups.forEach((group) => setGroupHighlight(group, on))
  }

  function pickAt(event) {
    const rect = renderer.domElement.getBoundingClientRect()
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    return raycaster.intersectObjects(pickables, false)[0] ?? null
  }

  function positionTooltip(event) {
    if (!tooltip) return
    const rect = root.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const gap = 14
    let left = x + gap
    let top = y + gap
    if (left + tooltip.offsetWidth > rect.width - 10) left = x - tooltip.offsetWidth - gap
    if (top + tooltip.offsetHeight > rect.height - 10) top = y - tooltip.offsetHeight - gap
    tooltip.style.left = `${Math.max(10, left)}px`
    tooltip.style.top = `${Math.max(10, top)}px`
  }

  function hideTooltip() {
    if (!tooltip) return
    tooltip.classList.remove('is-visible')
    tooltip.setAttribute('aria-hidden', 'true')
  }

  function setHover(hit, event) {
    const group = hit?.object.userData.partGroup ?? null
    if (group === hoveredGroup) {
      if (group && event) positionTooltip(event)
      return
    }

    if (chipPhase !== null) {
      setPhaseHighlight(chipPhase, false)
      chipPhase = null
    }

    setGroupHighlight(hoveredGroup, false)
    hoveredGroup = group
    renderer.domElement.classList.toggle('is-hovering', Boolean(group))

    if (!group) {
      hideTooltip()
      return
    }

    const info = hit.object.userData.partInfo
    if (tooltipPhase) tooltipPhase.textContent = PHASES[info.phase]?.label ?? ''
    if (tooltipName) tooltipName.textContent = info.name
    const desc = tooltip?.querySelector('[data-viewer-tooltip-desc]')
    if (desc) desc.textContent = info.desc ?? ''
    if (tooltip) {
      tooltip.classList.add('is-visible')
      tooltip.setAttribute('aria-hidden', 'false')
    }
    if (event) positionTooltip(event)
  }

  function goToPhase(index) {
    const phase = PHASES[index]
    const target = phase ? document.getElementById(phase.id) : null
    if (!target) return

    if (chipPhase !== null) {
      setPhaseHighlight(chipPhase, false)
      chipPhase = null
    }

    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    document.querySelectorAll('.phase.is-active').forEach((element) => element.classList.remove('is-active'))
    target.classList.add('is-active')
    window.clearTimeout(flashTimer)
    flashTimer = window.setTimeout(() => {
      target.classList.remove('is-active')
      phaseButtons.forEach((button) => button.classList.remove('is-active'))
    }, 2200)
    phaseButtons.forEach((button) => {
      button.classList.toggle('is-active', Number(button.dataset.viewerPhase) === index)
    })
    setHover(null)
  }

  if (!supportsWebGL()) {
    showFallback()
    return null
  }

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
  } catch {
    showFallback()
    return null
  }

  const dprCap = window.matchMedia('(max-width: 720px)').matches ? 1.5 : 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.06
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.className = 'viewer__canvas'
  renderer.domElement.setAttribute('role', 'img')
  renderer.domElement.setAttribute(
    'aria-label',
    'Interactive 3D model of PawClock. Drag to rotate, scroll to zoom, hover parts for details, or tap a part to jump to its phase.'
  )
  root.prepend(renderer.domElement)

  const noiseTexture = createNoiseTexture()
  const brushedTexture = createBrushedTexture()

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
  const initialPosition = new THREE.Vector3(3.6, 2.4, 4.6)
  camera.position.copy(initialPosition)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.075
  controls.enablePan = false
  controls.rotateSpeed = 0.75
  controls.zoomSpeed = 0.65
  controls.minPolarAngle = Math.PI * 0.16
  controls.maxPolarAngle = Math.PI * 0.62
  controls.autoRotateSpeed = 0.9

  let spinEnabled = !reduceMotion
  controls.autoRotate = spinEnabled
  if (spinButton) spinButton.setAttribute('aria-pressed', String(spinEnabled))

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  scene.environment = pmrem.fromScene(room, 0.04).texture
  room.dispose?.()
  pmrem.dispose()

  scene.add(new THREE.HemisphereLight(0xfff4e2, 0x18443f, 0.4))

  const keyLight = new THREE.DirectionalLight(0xfff1da, 3)
  keyLight.position.set(4, 6, 5)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(2048, 2048)
  keyLight.shadow.camera.near = 0.5
  keyLight.shadow.camera.far = 24
  keyLight.shadow.camera.left = -4
  keyLight.shadow.camera.right = 4
  keyLight.shadow.camera.top = 4
  keyLight.shadow.camera.bottom = -4
  keyLight.shadow.bias = -0.0004
  keyLight.shadow.normalBias = 0.02
  scene.add(keyLight)

  const rimLight = new THREE.DirectionalLight(0xffd39a, 1.8)
  rimLight.position.set(-4, 3, -5)
  scene.add(rimLight)

  const fillLight = new THREE.DirectionalLight(0xd8f3ee, 0.6)
  fillLight.position.set(-5, 1, 4)
  scene.add(fillLight)

  let visible = true
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? true
    },
    { threshold: 0.01 }
  )
  visibilityObserver.observe(root)

  function resize() {
    const width = root.clientWidth
    const height = root.clientHeight
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(root)
  resize()

  const loader = new GLTFLoader()
  loader.load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene
      model.traverse((child) => {
        if (!child.isMesh) return
        child.castShadow = true
        child.receiveShadow = true
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        const clones = materials.map((material) => {
          if (!material) return material
          const clone = material.clone()
          const originalHex = clone.color ? clone.color.getHexString() : ''
          if ('envMapIntensity' in clone) clone.envMapIntensity = 1.25
          if ('metalness' in clone && 'roughness' in clone) {
            if (['f15f91', 'ebd880', 'db9b35', 'fbce3b', 'eeb62a'].includes(originalHex)) {
              clone.metalness = 0.9
              clone.roughness = 0.4
              clone.roughnessMap = brushedTexture
              clone.envMapIntensity = 1.6
            } else if (['7c8a9c', '49566d', '607084'].includes(originalHex)) {
              clone.metalness = 0.8
              clone.roughness = 0.42
              clone.roughnessMap = brushedTexture
              clone.envMapIntensity = 1.5
            } else if (originalHex === '38e0ed') {
              clone.metalness = 0.12
              clone.roughness = 0.32
              clone.roughnessMap = noiseTexture
              clone.envMapIntensity = 1.45
            } else if (originalHex === '00bdca') {
              clone.metalness = 0.04
              clone.roughness = 0.6
              clone.roughnessMap = noiseTexture
              clone.bumpMap = noiseTexture
              clone.bumpScale = 0.006
              clone.envMapIntensity = 1.15
            } else if (originalHex === 'eddbff') {
              clone.metalness = 0.04
              clone.roughness = 0.5
              clone.roughnessMap = noiseTexture
              clone.bumpMap = noiseTexture
              clone.bumpScale = 0.004
              clone.envMapIntensity = 1.25
            } else {
              clone.metalness = 0.1
              clone.roughness = 0.5
              clone.roughnessMap = noiseTexture
              clone.envMapIntensity = 1.3
            }
          }
          const recolor = MATERIAL_RECOLOR[originalHex]
          if (recolor !== null && recolor !== undefined) clone.color.setHex(recolor)
          if (clone.transparent && clone.opacity <= 0.05) child.visible = false
          if (clone.emissive) {
            clone.userData.baseEmissive = clone.emissive.getHex()
            clone.userData.baseEmissiveIntensity = clone.emissiveIntensity
          }

          let result = clone
          if (['00bdca', '38e0ed', 'f9fbfc', 'f1fbfd', 'fff7ec', 'eddbff'].includes(originalHex)) {
            const physical = new THREE.MeshPhysicalMaterial()
            THREE.MeshStandardMaterial.prototype.copy.call(physical, clone)
            physical.clearcoat = 0.55
            physical.clearcoatRoughness = 0.35
            physical.userData = clone.userData
            result = physical
          }

          result.needsUpdate = true
          return result
        })
        child.material = Array.isArray(child.material) ? clones : clones[0]
      })

      const assembly = model.getObjectByName('PawClock_4Phase_Assembly')
      const main = assembly?.children?.[0]
      addChronoDial(assembly, main?.children?.[4])
      main?.children.forEach((group, index) => {
        const info = PART_INFO[index]
        if (info) registerPart(group, info)
      })
      const treats = assembly?.children?.[1]
      if (treats) registerPart(treats, TREAT_INFO)

      const group = new THREE.Group()
      group.add(model)
      scene.add(group)

      const box = new THREE.Box3().setFromObject(group)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)

      const maxDimension = Math.max(size.x, size.y, size.z) || 1
      group.scale.setScalar(TARGET_SIZE / maxDimension)

      const fitDistance = (TARGET_SIZE * 0.5) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5))
      const distance = fitDistance * 1.65
      initialPosition
        .set(0.88, 0.88, 1.05)
        .normalize()
        .multiplyScalar(distance)
      camera.position.copy(initialPosition)
      controls.target.set(0, 0, 0)
      controls.minDistance = distance * 0.55
      controls.maxDistance = distance * 2.3
      controls.update()

      const bounds = new THREE.Box3().setFromObject(group)
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 16),
        new THREE.ShadowMaterial({ color: 0x102e2a, opacity: 0.18 })
      )
      ground.rotation.x = -Math.PI / 2
      ground.position.y = bounds.min.y - 0.01
      ground.receiveShadow = true
      scene.add(ground)

      if (loading) loading.hidden = true
      root.classList.add('is-ready')
    },
    (event) => {
      if (!progress || !event.total) return
      const percent = Math.min(100, Math.round((event.loaded / event.total) * 100))
      progress.textContent = `Loading PawClock… ${percent}%`
    },
    (error) => {
      console.error('PawClock model failed to load', error?.stack || error)
      showFallback()
    }
  )

  let resumeTimer = 0
  function pauseSpin() {
    window.clearTimeout(resumeTimer)
    controls.autoRotate = false
  }

  function resumeSpin() {
    if (!spinEnabled) return
    window.clearTimeout(resumeTimer)
    resumeTimer = window.setTimeout(() => {
      controls.autoRotate = true
    }, 2600)
  }

  renderer.domElement.addEventListener('pointerdown', (event) => {
    dragging = true
    pressPoint = { x: event.clientX, y: event.clientY }
    pressTime = performance.now()
    pauseSpin()
    hint?.classList.add('is-hidden')
  })

  renderer.domElement.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || dragging) return
    setHover(pickAt(event), event)
  })

  renderer.domElement.addEventListener('pointerup', (event) => {
    dragging = false
    resumeSpin()

    if (!pressPoint) return
    const moved = Math.hypot(event.clientX - pressPoint.x, event.clientY - pressPoint.y)
    const elapsed = performance.now() - pressTime
    pressPoint = null
    if (moved > 4 || elapsed > 300) return

    const hit = pickAt(event)
    if (hit) {
      event.preventDefault()
      goToPhase(hit.object.userData.partInfo.phase)
    }
  })

  renderer.domElement.addEventListener('pointercancel', () => {
    dragging = false
    pressPoint = null
    resumeSpin()
  })

  renderer.domElement.addEventListener('pointerleave', () => {
    dragging = false
    pressPoint = null
    setHover(null)
    resumeSpin()
  })

  phaseButtons.forEach((button) => {
    const index = Number(button.dataset.viewerPhase)
    const activate = () => {
      setHover(null)
      chipPhase = index
      setPhaseHighlight(index, true)
    }
    const deactivate = () => {
      setPhaseHighlight(index, false)
      if (chipPhase === index) chipPhase = null
    }
    button.addEventListener('pointerenter', activate)
    button.addEventListener('pointerleave', deactivate)
    button.addEventListener('focus', activate)
    button.addEventListener('blur', deactivate)
    button.addEventListener('click', () => goToPhase(index))
  })

  resetButton?.addEventListener('click', () => {
    camera.position.copy(initialPosition)
    controls.target.set(0, 0, 0)
    controls.update()
  })

  spinButton?.addEventListener('click', () => {
    spinEnabled = !spinEnabled
    controls.autoRotate = spinEnabled
    spinButton.setAttribute('aria-pressed', String(spinEnabled))
  })

  const timer = new THREE.Timer()
  timer.start()

  function render() {
    requestAnimationFrame(render)
    if (!visible) return
    controls.update(Math.min(timer.getDelta(), 0.05))
    renderer.render(scene, camera)
  }

  requestAnimationFrame(render)

  if (import.meta.env.DEV) {
    window.__pawclockViewer = { scene, camera, controls, renderer, THREE }
  }

  return {
    reset() {
      camera.position.copy(initialPosition)
      controls.target.set(0, 0, 0)
      controls.update()
    }
  }
}
