import type { Program } from './ast'
import { parse } from './parser'
import { tokenize } from './tokenizer'
import { transpile } from './transpiler'

export interface RunResult {
  output: string[]
  javascript: string
  ast?: Program
  error?: string
  stopped?: boolean
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
  keepAlive: {
    promise: Promise<void>
    resolve: () => void
  } | null
  failure: Error | null
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

const createKeepAlive = (run: ActiveRun): Promise<void> => {
  if (!run.keepAlive) {
    let resolve = () => {
      // replaced in executor
    }
    const promise = new Promise<void>((complete) => {
      resolve = complete
    })
    run.keepAlive = { promise, resolve }
  }

  return run.keepAlive.promise
}

const releaseKeepAlive = (run: ActiveRun): void => {
  run.keepAlive?.resolve()
}

const normalizeKeyboardKeyForMatch = (key: string): string => (key.length === 1 ? key.toUpperCase() : key.toLowerCase())

const formatKeyboardKey = (key: string): string => (key.length === 1 ? key.toUpperCase() : key)

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
  releaseKeepAlive(activeRun)
  return { success: true }
}

export async function runTG(source: string, options?: RunOptions): Promise<RunResult> {
  const output: string[] = []
  let javascript = ''
  const run: ActiveRun = {
    id: ++runCounter,
    aborted: false,
    cleanups: [],
    keepAlive: null,
    failure: null,
  }
  activeRun = run

  try {
    const tokens = tokenize(source)
    const ast = parse(tokens)
    javascript = transpile(ast)

    const tgRuntime = {
      ensureActive: () => ensureRunActive(run),
      sleep: (milliseconds: number) => sleepWithAbort(milliseconds, run),
      pall: () => Math.random(),
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
      kreativia: async (rawKey: unknown, handler: unknown) => {
        ensureRunActive(run)
        if (typeof document === 'undefined') return

        if (typeof handler !== 'function') {
          throw new Error('kreativia forventer en funksjon som handler.')
        }

        const expectedKey = formatKeyboardKey(stringifyValue(rawKey))
        const expectedMatchKey = normalizeKeyboardKeyForMatch(expectedKey)
        createKeepAlive(run)

        const listener = async (e: Event) => {
          if (!isRunActive(run)) {
            document.removeEventListener('keypress', listener as EventListener)
            return
          }

          if (!(e instanceof KeyboardEvent)) {
            return
          }

          const actualKey = formatKeyboardKey(e.key)
          if (normalizeKeyboardKeyForMatch(actualKey) !== expectedMatchKey) return

          try {
            ensureRunActive(run)
            await (handler as (...args: unknown[]) => Promise<unknown>)(actualKey)
          } catch (error) {
            if (error instanceof TGStopError) {
              return
            }

            run.failure = error instanceof Error ? error : new Error('Ukjent feil i kreativia-handler.')
            run.aborted = true
            releaseKeepAlive(run)
          }
        }

        document.addEventListener('keypress', listener as EventListener)
        run.cleanups.push(() => document.removeEventListener('keypress', listener as EventListener))
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

    if (run.keepAlive && isRunActive(run)) {
      await run.keepAlive.promise
    }

    if (run.failure) {
      throw run.failure
    }

    return {
      output,
      javascript,
      ast,
      stopped: run.aborted,
    }
  } catch (error) {
    if (error instanceof TGStopError) {
      return {
        output,
        javascript,
        stopped: true,
      }
    }

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
