type ProgramOutputPanelProps = {
  output: string
  javascript: string
}

export function ProgramOutputPanel({ output, javascript }: ProgramOutputPanelProps) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <h2>Program output</h2>
        <p className="panel-meta">Konsoll og transpileringsresultat.</p>
      </div>

      <pre id="output">{output}</pre>

      <h2>Generert JavaScript</h2>
      <pre id="generated">{javascript || '(ingen JavaScript generert)'}</pre>
    </article>
  )
}
