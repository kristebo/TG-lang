export function DebuggerPanel() {
  return (
    <article className="panel">
      <div className="panel-heading">
        <h2>Debugger</h2>
        <p className="panel-meta">Ikke implementert enda.</p>
      </div>

      <div className="debugger-placeholder">
        <p>Her kommer stepping, variabelvisning og breakpoint-stotte i en senere versjon.</p>
        <ul>
          <li>Ingen aktiv debug-session</li>
          <li>Ingen call stack tilgjengelig</li>
          <li>Ingen watches konfigurert</li>
        </ul>
      </div>
    </article>
  )
}
