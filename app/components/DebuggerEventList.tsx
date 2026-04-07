import type { RuntimeDebugEvent } from '../../src/lang/runtime'

type DebuggerEventListProps = {
  events: RuntimeDebugEvent[]
}

const formatTime = (timestamp: number): string =>
  new Date(timestamp).toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

function getEventTitle(event: RuntimeDebugEvent): string {
  switch (event.type) {
    case 'session':
      return `Session ${event.status}`
    case 'phase':
      return `Fase: ${event.phase}`
    case 'compile':
      return 'Kompilering klar'
    case 'output':
      return `Output #${event.lineCount}`
    case 'canvas:init':
      return 'Canvas initialisert'
    case 'canvas:pixel':
      return `Piksel #${event.pixelCount}`
    case 'kreativia:register':
      return 'Kreativia registrert'
    case 'kreativia:trigger':
      return 'Kreativia trigget'
  }
}

function getEventDetail(event: RuntimeDebugEvent): string {
  switch (event.type) {
    case 'session':
      return event.error ?? `Run #${event.runId}`
    case 'phase':
      return `TG-runtime er i ${event.phase}-fasen.`
    case 'compile':
      return `${event.mode} • ${event.statementCount} statements • ${event.javascriptLength} JS-tegn`
    case 'output':
      return event.line || '(tom linje)'
    case 'canvas:init':
      return `${event.resolution} × ${event.resolution}`
    case 'canvas:pixel':
      return `(${event.x}, ${event.y}) rgb(${event.r}, ${event.g}, ${event.b})`
    case 'kreativia:register':
      return `Lytter på tast ${event.key}`
    case 'kreativia:trigger':
      return `Handler kjørte for ${event.key}`
  }
}

export function DebuggerEventList({ events }: DebuggerEventListProps) {
  if (events.length === 0) {
    return (
      <p className="panel-note">
        Ingen runtime-hendelser enda. Kjor et TG-lang-program for a fylle debuggerloggen.
      </p>
    )
  }

  return (
    <ol className="debugger-events">
      {[...events].reverse().map((event, index) => (
        <li key={`${event.type}-${event.timestamp}-${index}`} className="debugger-event">
          <div className="debugger-event-head">
            <strong>{getEventTitle(event)}</strong>
            <span>{formatTime(event.timestamp)}</span>
          </div>
          <div className="debugger-event-body">{getEventDetail(event)}</div>
        </li>
      ))}
    </ol>
  )
}
