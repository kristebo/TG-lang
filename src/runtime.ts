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

export async function runTG(source: string): Promise<RunResult> {
  const output: string[] = []
  let javascript = ''

  try {
    const tokens = tokenize(source)
    const ast = parse(tokens)
    javascript = transpile(ast)

    const sandboxConsole = {
      log: (...args: unknown[]) => {
        output.push(args.map((arg) => stringifyValue(arg)).join(' '))
      },
    }

    const run = new AsyncFunction('console', 'setTimeout', `"use strict";\n${javascript}`)
    await run(sandboxConsole, setTimeout)

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
  }
}
