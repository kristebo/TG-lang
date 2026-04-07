import { TG_COLOR_CHANNEL_MAX } from '../constants'
import {
  createKeepAlive,
  ensureRunActive,
  isRunActive,
  sleepWithAbort,
  stopRun,
  TGStopError,
} from './control'
import type {
  ActiveRun,
  RunOptions,
  RuntimeApi,
  RuntimeDebugEvent,
  SandboxConsole,
} from './types'

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

const normalizeKeyboardKeyForMatch = (key: string): string =>
  key.length === 1 ? key.toUpperCase() : key.toLowerCase()

const formatKeyboardKey = (key: string): string =>
  key.length === 1 ? key.toUpperCase() : key

const clampChannelValue = (value: number): number =>
  Math.min(TG_COLOR_CHANNEL_MAX, Math.max(0, Math.floor(value)))

const emitRuntimeDebugEvent = (
  options: RunOptions | undefined,
  event: RuntimeDebugEvent,
): void => {
  options?.onDebugEvent?.(event)
}

export function createSandboxConsole(
  run: ActiveRun,
  output: string[],
  options?: RunOptions,
): SandboxConsole {
  return {
    log: (...args: unknown[]) => {
      ensureRunActive(run)
      const line = args.map((arg) => stringifyValue(arg)).join(' ')
      output.push(line)
      options?.onOutput?.(line, [...output])
      emitRuntimeDebugEvent(options, {
        type: 'output',
        line,
        lineCount: output.length,
        timestamp: Date.now(),
      })
    },
  }
}

async function registerKreativiaHandler(
  run: ActiveRun,
  rawKey: unknown,
  handler: unknown,
  options?: RunOptions,
): Promise<void> {
  ensureRunActive(run)
  if (typeof document === 'undefined') {
    return
  }

  if (typeof handler !== 'function') {
    throw new Error('kreativia forventer en funksjon som handler.')
  }

  const expectedKey = formatKeyboardKey(stringifyValue(rawKey))
  const expectedMatchKey = normalizeKeyboardKeyForMatch(expectedKey)
  createKeepAlive(run)
  emitRuntimeDebugEvent(options, {
    type: 'kreativia:register',
    key: expectedKey,
    timestamp: Date.now(),
  })

  const listener = async (event: Event) => {
    if (!isRunActive(run)) {
      document.removeEventListener('keypress', listener as EventListener)
      return
    }

    if (!(event instanceof KeyboardEvent)) {
      return
    }

    const actualKey = formatKeyboardKey(event.key)
    if (normalizeKeyboardKeyForMatch(actualKey) !== expectedMatchKey) {
      return
    }

    emitRuntimeDebugEvent(options, {
      type: 'kreativia:trigger',
      key: actualKey,
      timestamp: Date.now(),
    })

    try {
      ensureRunActive(run)
      await (handler as (...args: unknown[]) => Promise<unknown>)(actualKey)
    } catch (error) {
      if (error instanceof TGStopError) {
        return
      }

      run.failure =
        error instanceof Error
          ? error
          : new Error('Ukjent feil i kreativia-handler.')
      stopRun(run)
    }
  }

  document.addEventListener('keypress', listener as EventListener)
  run.cleanups.push(() =>
    document.removeEventListener('keypress', listener as EventListener),
  )
}

export function createRuntimeApi(
  run: ActiveRun,
  options?: RunOptions,
): RuntimeApi {
  let pixelCount = 0

  return {
    ensureActive: () => ensureRunActive(run),
    sleep: (milliseconds: number) => sleepWithAbort(milliseconds, run),
    pall: () => Math.random(),
    initCanvas: async (resolution: number) => {
      ensureRunActive(run)
      const safeResolution = Math.max(
        1,
        Math.floor(Number.isFinite(resolution) ? resolution : 1),
      )
      options?.onCanvasInit?.(safeResolution)
      emitRuntimeDebugEvent(options, {
        type: 'canvas:init',
        resolution: safeResolution,
        timestamp: Date.now(),
      })
    },
    putPixel: async (x: number, y: number, r = 0, g = 0, b = 0) => {
      ensureRunActive(run)
      const safeX = Math.floor(x)
      const safeY = Math.floor(y)
      const safeR = clampChannelValue(r)
      const safeG = clampChannelValue(g)
      const safeB = clampChannelValue(b)
      pixelCount += 1

      options?.onPixel?.(safeX, safeY, safeR, safeG, safeB)
      emitRuntimeDebugEvent(options, {
        type: 'canvas:pixel',
        x: safeX,
        y: safeY,
        r: safeR,
        g: safeG,
        b: safeB,
        pixelCount,
        timestamp: Date.now(),
      })
    },
    kreativia: async (rawKey: unknown, handler: unknown) =>
      registerKreativiaHandler(run, rawKey, handler, options),
  }
}

export async function executeTranspiledProgram(
  javascript: string,
  tgRuntime: RuntimeApi,
  sandboxConsole: SandboxConsole,
): Promise<void> {
  const execute = new AsyncFunction('console', '__tg', `"use strict";\n${javascript}`)
  await execute(sandboxConsole, tgRuntime)
}
