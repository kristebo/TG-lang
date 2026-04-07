import { compileTG } from './compiler'
import {
  createRun,
  finalizeRun,
  isRunActive,
  setActiveRun,
  stopActiveRun,
  TGStopError,
} from './control'
import {
  createRuntimeApi,
  createSandboxConsole,
  executeTranspiledProgram,
} from './sandbox'
import type {
  ActiveRun,
  RunOptions,
  RunResult,
  RuntimeDebugEvent,
  RuntimeDebugPhase,
} from './types'

const emitDebugEvent = (
  options: RunOptions | undefined,
  event: RuntimeDebugEvent,
): void => {
  options?.onDebugEvent?.(event)
}

const emitDebugPhase = (
  options: RunOptions | undefined,
  phase: RuntimeDebugPhase,
): void => {
  emitDebugEvent(options, {
    type: 'phase',
    phase,
    timestamp: Date.now(),
  })
}

const emitSessionEvent = (
  options: RunOptions | undefined,
  run: ActiveRun,
  status: Extract<RuntimeDebugEvent, { type: 'session' }>['status'],
  sourceLength: number,
  error?: string,
): void => {
  emitDebugEvent(options, {
    type: 'session',
    runId: run.id,
    status,
    sourceLength,
    error,
    timestamp: Date.now(),
  })
}

export { compileTG } from './compiler'
export type {
  RunOptions,
  RunResult,
  RuntimeDebugEvent,
  RuntimeDebugPhase,
} from './types'

export function stopTG(): { success: boolean; error?: string } {
  return stopActiveRun()
}

export async function runTG(
  source: string,
  options?: RunOptions,
): Promise<RunResult> {
  const output: string[] = []
  let javascript = ''
  const run = createRun()
  setActiveRun(run)
  emitSessionEvent(options, run, 'started', source.length)

  try {
    const compiled = compileTG(source, (phase) => emitDebugPhase(options, phase))
    const { ast } = compiled
    javascript = compiled.javascript

    emitDebugEvent(options, {
      type: 'compile',
      mode: ast.mode,
      resolution: ast.resolution,
      statementCount: ast.body.length,
      javascriptLength: javascript.length,
      timestamp: Date.now(),
    })

    emitDebugPhase(options, 'execute')
    const tgRuntime = createRuntimeApi(run, options)
    const sandboxConsole = createSandboxConsole(run, output, options)

    await executeTranspiledProgram(javascript, tgRuntime, sandboxConsole)

    if (run.keepAlive && isRunActive(run)) {
      await run.keepAlive.promise
    }

    if (run.failure) {
      throw run.failure
    }

    emitSessionEvent(
      options,
      run,
      run.aborted ? 'stopped' : 'completed',
      source.length,
    )

    return {
      output,
      javascript,
      ast,
      stopped: run.aborted,
    }
  } catch (error) {
    if (error instanceof TGStopError) {
      emitSessionEvent(options, run, 'stopped', source.length)
      return {
        output,
        javascript,
        stopped: true,
      }
    }

    const message = error instanceof Error ? error.message : 'Ukjent feil'
    emitSessionEvent(options, run, 'error', source.length, message)

    return {
      output,
      javascript,
      error: message,
    }
  } finally {
    emitDebugPhase(options, 'idle')
    finalizeRun(run)
  }
}
