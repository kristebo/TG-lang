import type { Program } from './ast'
import { parse } from './parser'
import { tokenize } from './tokenizer'
import { transpile } from './transpiler'

export interface RunResult {
  output: string[]
  javascript: string
  ast?: Program
  error?: string
}

export interface RunOptions {
  onOutput?: (line: string, allLines: string[]) => void
  onCanvasInit?: (resolution: number) => void
  onPixel?: (x: number, y: number, r: number, g: number, b: number) => void
}

interface ActiveRun {
  id: number
  aborted: boolean
  cleanups: Array<() => void>
}

class TGStopError extends Error {
  constructor(message = 'Kjoring stoppet av bruker.') {
    super(message)
    this.name = 'TGStopError'
  }
}

const AsyncFunction = Object.getPrototypeOf(async function () {
  // noop
}).constructor as new (...args: string[]) => (...args: unknown[]) => Promise<unknown>

function stringifyValue(value: unknown): string {
  if (typeof value === 'string') {
    return value
  }

  if (value === undefined) {
    return 'undefined'
  }

  if (value === null) {
    return 'null'
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return '[object]'
    }
  }

  return String(value)
}

let runCounter = 0
let activeRun: ActiveRun | null = null
const TG_CHANNEL_MAX = 15

const isRunActive = (run: ActiveRun): boolean => activeRun?.id === run.id && !run.aborted

const ensureRunActive = (run: ActiveRun): void => {
  if (!isRunActive(run)) {
    throw new TGStopError()
  }
}

const sleepWithAbort = (milliseconds: number, run: ActiveRun): Promise<void> =>
  new Promise((resolve, reject) => {
    ensureRunActive(run)

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      try {
        ensureRunActive(run)
        resolve()
      } catch (error) {
        reject(error)
      }
    }, Math.max(0, milliseconds))

    const intervalId = setInterval(() => {
      if (!isRunActive(run)) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        reject(new TGStopError())
      }
    }, 25)
  })

export function stopTG(): { success: boolean; error?: string } {
  if (!activeRun || activeRun.aborted) {
    return { success: false, error: 'Ingen TG-kode kjører for øyeblikket.' }
  }

  activeRun.aborted = true
  return { success: true }
}

export async function runTG(source: string, options?: RunOptions): Promise<RunResult> {
  const output: string[] = []
  let javascript = ''
  const run: ActiveRun = {
    id: ++runCounter,
    aborted: false,
    cleanups: [],
  }
  activeRun = run

  try {
    const tokens = tokenize(source)
    const ast = parse(tokens)
    javascript = transpile(ast)

    const tgRuntime = {
      ensureActive: () => ensureRunActive(run),
      sleep: (milliseconds: number) => sleepWithAbort(milliseconds, run),
      pall: () => (globalThis.performance?.now?.() ?? Date.now()) % 1,
      initCanvas: async (resolution: number) => {
        ensureRunActive(run)
        const safeResolution = Math.max(1, Math.floor(Number.isFinite(resolution) ? resolution : 1))
        options?.onCanvasInit?.(safeResolution)
      },
      putPixel: async (x: number, y: number, r = 0, g = 0, b = 0) => {
        ensureRunActive(run)
        options?.onPixel?.(
          Math.floor(x),
          Math.floor(y),
          Math.min(TG_CHANNEL_MAX, Math.max(0, Math.floor(r))),
          Math.min(TG_CHANNEL_MAX, Math.max(0, Math.floor(g))),
          Math.min(TG_CHANNEL_MAX, Math.max(0, Math.floor(b))),
        )
      },
      kreativia: async (rawEventType: unknown, rawKeyCode: unknown, handler: unknown) => {
        ensureRunActive(run)
        if (typeof document === 'undefined') return

        const eventType = Math.floor(Number(rawEventType))
        const keyCode = Math.floor(Number(rawKeyCode))

        const EVENT_NAMES: Record<number, string> = {
          1: 'keydown',
          2: 'keyup',
          3: 'click',
          4: 'mousemove',
          5: 'touchstart',
        }
        const eventName = EVENT_NAMES[eventType] ?? 'keydown'

        const listener = async (e: Event) => {
          if (!isRunActive(run)) {
            document.removeEventListener(eventName, listener as EventListener)
            return
          }

          let eventCode = 0
          if (e instanceof KeyboardEvent) {
            eventCode = e.keyCode
            if (keyCode > 0 && eventCode !== keyCode) return
          } else if (e instanceof MouseEvent) {
            eventCode = e.button + 1
            if (keyCode > 0 && eventCode !== keyCode) return
          }

          try {
            ensureRunActive(run)
            if (typeof handler === 'function') {
              await (handler as (...args: unknown[]) => Promise<unknown>)(eventCode)
            }
          } catch {
            // Silently absorb stop errors fired from event handlers
          }
        }

        document.addEventListener(eventName, listener as EventListener)
        run.cleanups.push(() => document.removeEventListener(eventName, listener as EventListener))
      },
    }

    const sandboxConsole = {
      log: (...args: unknown[]) => {
        ensureRunActive(run)
        const line = args.map((arg) => stringifyValue(arg)).join(' ')
        output.push(line)
        options?.onOutput?.(line, [...output])
      },
    }

    const execute = new AsyncFunction('console', '__tg', `"use strict";\n${javascript}`)
    await execute(sandboxConsole, tgRuntime)

    return {
      output,
      javascript,
      ast,
    }
  } catch (error) {
    return {
      output,
      javascript,
      error: error instanceof Error ? error.message : 'Ukjent feil',
    }
  } finally {
    if (activeRun?.id === run.id) {
      activeRun = null
    }
    for (const cleanup of run.cleanups) {
      try {
        cleanup()
      } catch {
        // ignore cleanup errors
      }
    }
  }
}
