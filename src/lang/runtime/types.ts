import type { Program } from '../ast'

export type RuntimeDebugPhase =
  | 'tokenize'
  | 'parse'
  | 'transpile'
  | 'execute'
  | 'idle'

export type RuntimeDebugSessionStatus =
  | 'started'
  | 'completed'
  | 'stopped'
  | 'error'

export interface RunResult {
  output: string[]
  javascript: string
  ast?: Program
  error?: string
  stopped?: boolean
}

export type RuntimeDebugEvent =
  | {
      type: 'session'
      runId: number
      status: RuntimeDebugSessionStatus
      sourceLength: number
      error?: string
      timestamp: number
    }
  | {
      type: 'phase'
      phase: RuntimeDebugPhase
      timestamp: number
    }
  | {
      type: 'compile'
      mode: Program['mode']
      resolution: number | null
      statementCount: number
      javascriptLength: number
      timestamp: number
    }
  | {
      type: 'output'
      line: string
      lineCount: number
      timestamp: number
    }
  | {
      type: 'canvas:init'
      resolution: number
      timestamp: number
    }
  | {
      type: 'canvas:pixel'
      x: number
      y: number
      r: number
      g: number
      b: number
      pixelCount: number
      timestamp: number
    }
  | {
      type: 'kreativia:register'
      key: string
      timestamp: number
    }
  | {
      type: 'kreativia:trigger'
      key: string
      timestamp: number
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
