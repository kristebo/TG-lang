'use client'

import { useCallback, useMemo, useState } from 'react'
import type {
  RunOptions,
  RunResult,
  RuntimeDebugEvent,
  RuntimeDebugPhase,
} from '../../src/lang/runtime'

export type TGDebuggerStatus =
  | 'idle'
  | 'running'
  | 'completed'
  | 'stopped'
  | 'error'

export interface TGDebuggerState {
  runId: number | null
  status: TGDebuggerStatus
  phase: RuntimeDebugPhase
  mode: 'text' | 'canvas' | null
  sourceLength: number
  statementCount: number
  javascriptLength: number
  outputLines: number
  pixelCount: number
  canvasResolution: number | null
  lastOutput: string | null
  lastError: string | null
  watchedKey: string | null
  events: RuntimeDebugEvent[]
}

const MAX_DEBUG_EVENTS = 12

const INITIAL_DEBUGGER_STATE: TGDebuggerState = {
  runId: null,
  status: 'idle',
  phase: 'idle',
  mode: null,
  sourceLength: 0,
  statementCount: 0,
  javascriptLength: 0,
  outputLines: 0,
  pixelCount: 0,
  canvasResolution: null,
  lastOutput: null,
  lastError: null,
  watchedKey: null,
  events: [],
}

const mapSessionStatus = (
  status: Extract<RuntimeDebugEvent, { type: 'session' }>['status'],
): TGDebuggerStatus => {
  switch (status) {
    case 'started':
      return 'running'
    case 'completed':
      return 'completed'
    case 'stopped':
      return 'stopped'
    case 'error':
      return 'error'
  }
}

export function useTGDebugger() {
  const [debuggerState, setDebuggerState] =
    useState<TGDebuggerState>(INITIAL_DEBUGGER_STATE)

  const handleDebugEvent = useCallback((event: RuntimeDebugEvent) => {
    setDebuggerState((current) => {
      if (event.type === 'session' && event.status === 'started') {
        return {
          ...INITIAL_DEBUGGER_STATE,
          runId: event.runId,
          status: 'running',
          sourceLength: event.sourceLength,
          events: [event],
        }
      }

      const events = [...current.events, event].slice(-MAX_DEBUG_EVENTS)

      switch (event.type) {
        case 'session':
          return {
            ...current,
            events,
            runId: event.runId,
            status: mapSessionStatus(event.status),
            lastError: event.error ?? current.lastError,
          }
        case 'phase':
          return {
            ...current,
            events,
            phase: event.phase,
            status: event.phase === 'idle' ? current.status : 'running',
          }
        case 'compile':
          return {
            ...current,
            events,
            mode: event.mode,
            canvasResolution: event.resolution,
            statementCount: event.statementCount,
            javascriptLength: event.javascriptLength,
          }
        case 'output':
          return {
            ...current,
            events,
            outputLines: event.lineCount,
            lastOutput: event.line,
          }
        case 'canvas:init':
          return {
            ...current,
            events,
            canvasResolution: event.resolution,
          }
        case 'canvas:pixel':
          return {
            ...current,
            events,
            pixelCount: event.pixelCount,
          }
        case 'kreativia:register':
        case 'kreativia:trigger':
          return {
            ...current,
            events,
            watchedKey: event.key,
          }
      }
    })
  }, [])

  const syncRunResult = useCallback((result: RunResult) => {
    setDebuggerState((current) => ({
      ...current,
      javascriptLength: result.javascript.length || current.javascriptLength,
      status: result.error
        ? 'error'
        : result.stopped
          ? 'stopped'
          : current.status,
      lastError: result.error ?? current.lastError,
    }))
  }, [])

  const captureRuntimeFailure = useCallback((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    setDebuggerState((current) => ({
      ...current,
      status: 'error',
      lastError: message,
    }))
  }, [])

  const debuggerRuntimeOptions = useMemo<Pick<RunOptions, 'onDebugEvent'>>(
    () => ({ onDebugEvent: handleDebugEvent }),
    [handleDebugEvent],
  )

  return {
    debuggerState,
    debuggerRuntimeOptions,
    syncRunResult,
    captureRuntimeFailure,
  }
}
