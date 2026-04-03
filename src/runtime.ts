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
}

interface ActiveRun {
  id: number
  aborted: boolean
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
  }
  activeRun = run

  try {
    const tokens = tokenize(source)
    const ast = parse(tokens)
    javascript = transpile(ast)

    const tgRuntime = {
      ensureActive: () => ensureRunActive(run),
      sleep: (milliseconds: number) => sleepWithAbort(milliseconds, run),
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
  }
}
