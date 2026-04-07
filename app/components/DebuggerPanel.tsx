'use client'

import type { TGDebuggerState } from '../hooks/useTGDebugger'
import { useTGStop } from '../providers/TGStopProvider'
import { DebuggerEventList } from './DebuggerEventList'

type DebuggerPanelProps = {
  state: TGDebuggerState
}

const STATUS_LABELS: Record<TGDebuggerState['status'], string> = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Completed',
  stopped: 'Stopped',
  error: 'Error',
}

const formatValue = (value: number | string | null, fallback = '—'): string =>
  value === null || value === '' ? fallback : String(value)

export function DebuggerPanel({ state }: DebuggerPanelProps) {
  const { activeSession, canStop, stopActiveSession } = useTGStop()

  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Debugger</h2>
          <p className="panel-meta">
            Live runtime-hook for TG-lang. Klar for videre stepping og breakpoint-stotte.
          </p>
        </div>
        <div className="debugger-toolbar">
          <span className={`debugger-badge debugger-badge--${state.status}`}>
            {STATUS_LABELS[state.status]}
          </span>
          <button type="button" onClick={() => void stopActiveSession()} disabled={!canStop}>
            Stopp session
          </button>
        </div>
      </div>

      {activeSession ? (
        <p className="panel-meta">
          Aktiv stop-session: <strong>{activeSession.label}</strong>
        </p>
      ) : null}

      <div className="debugger-grid">
        <div className="debugger-stat">
          <span>Fase</span>
          <strong>{formatValue(state.phase)}</strong>
        </div>
        <div className="debugger-stat">
          <span>Mode</span>
          <strong>{formatValue(state.mode)}</strong>
        </div>
        <div className="debugger-stat">
          <span>Run ID</span>
          <strong>{formatValue(state.runId)}</strong>
        </div>
        <div className="debugger-stat">
          <span>Statements</span>
          <strong>{state.statementCount}</strong>
        </div>
        <div className="debugger-stat">
          <span>Outputlinjer</span>
          <strong>{state.outputLines}</strong>
        </div>
        <div className="debugger-stat">
          <span>Piksler</span>
          <strong>{state.pixelCount}</strong>
        </div>
        <div className="debugger-stat">
          <span>Canvas</span>
          <strong>
            {state.canvasResolution
              ? `${state.canvasResolution} × ${state.canvasResolution}`
              : 'ikke aktiv'}
          </strong>
        </div>
        <div className="debugger-stat">
          <span>JS-storrelse</span>
          <strong>{state.javascriptLength}</strong>
        </div>
        <div className="debugger-stat">
          <span>Kildetekst</span>
          <strong>{state.sourceLength} tegn</strong>
        </div>
        <div className="debugger-stat">
          <span>Kreativia</span>
          <strong>{formatValue(state.watchedKey, 'ingen tast')}</strong>
        </div>
      </div>

      {state.lastError ? (
        <p className="debugger-error">
          <strong>Siste feil:</strong> {state.lastError}
        </p>
      ) : state.lastOutput ? (
        <p className="debugger-last-output">
          <strong>Siste output:</strong> {state.lastOutput}
        </p>
      ) : (
        <p className="panel-note">
          Debuggeren viser kompilering, runtime-faser og hendelser mens programmet kjører.
        </p>
      )}

      <h3>Runtime-logg</h3>
      <DebuggerEventList events={state.events} />
    </article>
  )
}
