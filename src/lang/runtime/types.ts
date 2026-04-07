import type { Program } from '../ast'

export interface RunResult {
  output: string[]
  javascript: string
  ast?: Program
  error?: string
  stopped?: boolean
}

export interface RuntimeDebugEvent {
  type: 'phase'
  phase: 'tokenize' | 'parse' | 'transpile' | 'execute' | 'idle'
}

export interface RunOptions {
  onOutput?: (line: string, allLines: string[]) => void
  onCanvasInit?: (resolution: number) => void
  onPixel?: (x: number, y: number, r: number, g: number, b: number) => void
  onDebugEvent?: (event: RuntimeDebugEvent) => void
}

export interface ActiveRun {
  id: number
  aborted: boolean
  cleanups: Array<() => void>
  keepAlive: {
    promise: Promise<void>
    resolve: () => void
  } | null
  failure: Error | null
}

export interface CompiledProgram {
  ast: Program
  javascript: string
}

export interface RuntimeApi {
  ensureActive: () => void
  sleep: (milliseconds: number) => Promise<void>
  pall: () => number
  initCanvas: (resolution: number) => Promise<void>
  putPixel: (x: number, y: number, r?: number, g?: number, b?: number) => Promise<void>
  kreativia: (rawKey: unknown, handler: unknown) => Promise<void>
}

export interface SandboxConsole {
  log: (...args: unknown[]) => void
}
