import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import test from 'node:test'
import ts from 'typescript'

const compiled = ts.transpileModule(fs.readFileSync(new URL('../src/useRollingCarousel.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
}).outputText

function carousel({ reduced = false, width = 1800 } = {}) {
  let now = 0
  let groupWidth = width
  let effect
  let resize
  let scrollLeft = 0
  let writes = 0
  const frames = new Map()
  let nextFrame = 0
  const listeners = new Map()
  const viewport = new EventTarget()
  Object.defineProperty(viewport, 'scrollLeft', {
    get: () => scrollLeft,
    set: (value) => { scrollLeft = Math.round(value); writes++ },
  })
  viewport.getBoundingClientRect = () => ({ left: 0, width: 390 })
  viewport.contains = (element) => element === viewport
  const track = { firstElementChild: { getBoundingClientRect: () => ({ width: groupWidth }) } }
  const window = {
    matchMedia: () => ({ matches: reduced }),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  }
  const document = { activeElement: null, hidden: false }
  let disconnected = false
  const context = vm.createContext({
    exports: {},
    require: () => ({ useRef: (value) => ({ current: value }), useEffect: (callback) => { effect = callback } }),
    window,
    document,
    performance: { now: () => now },
    ResizeObserver: class {
      constructor(callback) { resize = callback }
      observe() {}
      disconnect() { disconnected = true }
    },
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame },
    cancelAnimationFrame: (id) => frames.delete(id),
  })
  vm.runInContext(compiled, context)
  const hook = context.exports.useRollingCarousel()
  hook.viewportRef.current = viewport
  hook.trackRef.current = track
  const cleanup = effect()
  return {
    viewport, document, hook,
    get position() { return scrollLeft },
    get writes() { return writes },
    get disconnected() { return disconnected },
    get frameCount() { return frames.size },
    get windowListenerCount() { return listeners.size },
    tick(ms = 16) {
      now += ms
      const callbacks = [...frames.values()]
      frames.clear()
      for (const callback of callbacks) callback(now)
    },
    run(ms) { for (let elapsed = 0; elapsed < ms; elapsed += 16) this.tick() },
    event(name) { viewport.dispatchEvent(new Event(name)) },
    end() { listeners.get('pointerup')?.() },
    swipeTo(position, dispatch = true) {
      scrollLeft = position
      if (dispatch) viewport.dispatchEvent(new Event('scroll'))
    },
    resize(width) { groupWidth = width; resize() },
    cleanup,
  }
}

test('autoplay advances on a mobile-width viewport, including rounded scroll positions', () => {
  const c = carousel()
  assert.equal(c.position, 1800)
  c.run(1000)
  assert.ok(c.position >= 1838 && c.position <= 1842)
})

test('autoplay scroll events do not pause the animation', () => {
  const c = carousel()
  for (let i = 0; i < 60; i++) { c.tick(); c.event('scroll') }
  assert.ok(c.position > 1835)
})

test('high-refresh displays accumulate subpixel autoplay without stalling', () => {
  const c = carousel()
  for (let i = 0; i < 125; i++) { c.tick(8); c.event('scroll') }
  assert.equal(c.position, 1840)
})

test('a native swipe remains in place while held and resumes autoplay after release', () => {
  const c = carousel()
  c.event('pointerdown')
  c.swipeTo(2050)
  c.run(2500)
  assert.equal(c.position, 2050)
  c.end()
  c.run(1000)
  assert.equal(c.position, 2050)
  c.run(1500)
  assert.ok(c.position > 2050)
})

test('momentum scrolling and scroll changes arriving before their event are preserved', () => {
  const c = carousel()
  c.swipeTo(2100, false)
  c.tick()
  assert.equal(c.position, 2100)
  c.swipeTo(2140)
  c.tick()
  assert.equal(c.position, 2140)
})

test('manual scrolling works with reduced motion while autoplay stays off', () => {
  const c = carousel({ reduced: true })
  c.run(1000)
  assert.equal(c.position, 1800)
  c.swipeTo(2150)
  c.run(3000)
  assert.equal(c.position, 2150)
})

test('both loop boundaries retain the same position within an identical group', () => {
  const c = carousel()
  c.swipeTo(2750)
  c.tick()
  assert.equal(c.position, 950)
  c.swipeTo(850)
  c.tick()
  assert.equal(c.position, 2650)
})

test('resizing preserves relative progress and recalculates the loop width', () => {
  const c = carousel()
  c.swipeTo(2250)
  c.resize(2400)
  assert.equal(c.position, 3000)
})

test('wheel interaction temporarily pauses autoplay', () => {
  const c = carousel()
  c.event('wheel')
  c.run(1000)
  assert.equal(c.position, 1800)
  c.run(1500)
  assert.ok(c.position > 1800)
})

test('focused cards and hidden documents do not keep drifting', () => {
  const c = carousel()
  c.document.activeElement = c.viewport
  c.run(1000)
  assert.equal(c.position, 1800)
  c.document.activeElement = null
  c.document.hidden = true
  c.run(1000)
  assert.equal(c.position, 1800)
})

test('keyboard centering completes while crossing a loop boundary', () => {
  const c = carousel()
  c.swipeTo(2690)
  c.hook.centerItem({ getBoundingClientRect: () => ({ left: 400, width: 280 }) })
  c.run(700)
  assert.ok(Math.abs(c.position - 1235) < 5)
})

test('reduced-motion centering is immediate', () => {
  const c = carousel({ reduced: true })
  c.hook.centerItem({ getBoundingClientRect: () => ({ left: 400, width: 280 }) })
  c.tick()
  assert.equal(c.position, 2145)
})

test('unmount cancels frames and listeners when filtering replaces the carousel', () => {
  const c = carousel()
  c.cleanup()
  const position = c.position
  c.event('scroll')
  c.tick()
  assert.equal(c.position, position)
  assert.equal(c.frameCount, 0)
  assert.equal(c.windowListenerCount, 0)
  assert.equal(c.disconnected, true)
})
