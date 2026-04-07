import type { ActiveRun } from './types'

export class TGStopError extends Error {
  constructor(message = 'Kjoring stoppet av bruker.') {
    super(message)
    this.name = 'TGStopError'
  }
}

let runCounter = 0
let activeRun: ActiveRun | null = null

export const setActiveRun = (run: ActiveRun | null): void => {
  activeRun = run
}

export const isRunActive = (run: ActiveRun): boolean => activeRun?.id === run.id && !run.aborted

export const createKeepAlive = (run: ActiveRun): Promise<void> => {
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

export const releaseKeepAlive = (run: ActiveRun): void => {
  run.keepAlive?.resolve()
}

export const ensureRunActive = (run: ActiveRun): void => {
  if (!isRunActive(run)) {
    throw new TGStopError()
  }
}

export const sleepWithAbort = (milliseconds: number, run: ActiveRun): Promise<void> =>
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

export function createRun(): ActiveRun {
  return {
    id: ++runCounter,
    aborted: false,
    cleanups: [],
    keepAlive: null,
    failure: null,
  }
}

export function stopRun(run: ActiveRun): void {
  run.aborted = true
  releaseKeepAlive(run)
}

export function stopActiveRun(): { success: boolean; error?: string } {
  if (!activeRun || activeRun.aborted) {
    return { success: false, error: 'Ingen TG-kode kjører for øyeblikket.' }
  }

  stopRun(activeRun)
  return { success: true }
}

export function finalizeRun(run: ActiveRun): void {
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
