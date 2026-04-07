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
import type { RunOptions, RunResult, RuntimeDebugEvent } from './types'

const emitDebugPhase = (
  options: RunOptions | undefined,
  phase: RuntimeDebugEvent['phase'],
): void => {
  options?.onDebugEvent?.({ type: 'phase', phase })
}

export { compileTG } from './compiler'
export type { RunOptions, RunResult, RuntimeDebugEvent } from './types'

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

  try {
    const compiled = compileTG(source, (phase) => emitDebugPhase(options, phase))
    const { ast } = compiled
    javascript = compiled.javascript

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
    emitDebugPhase(options, 'idle')
    finalizeRun(run)
  }
}
