'use client'

type EditorPanelProps = {
  examples: Array<{ id: string; title: string }>
  exampleId: string
  onExampleChange: (id: string) => void
  onLoadExample: () => void
  onRun: () => void | Promise<void>
  onStop: () => void | Promise<void>
  running: boolean
  source: string
  onSourceChange: (value: string) => void
}

export function EditorPanel({
  examples,
  exampleId,
  onExampleChange,
  onLoadExample,
  onRun,
  onStop,
  running,
  source,
  onSourceChange,
}: EditorPanelProps) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <h2>Editor</h2>
        <p className="panel-meta">Skriv, last inn eksempler og kjor TG-lang kode.</p>
      </div>

      <section className="toolbar panel-toolbar">
        <label htmlFor="examplePicker">Eksempel:</label>
        <select id="examplePicker" value={exampleId} onChange={(event) => onExampleChange(event.target.value)}>
          {examples.map((example) => (
            <option key={example.id} value={example.id}>
              {example.title}
            </option>
          ))}
        </select>
        <button type="button" onClick={onLoadExample}>
          Last inn
        </button>
        <button type="button" className="run" onClick={onRun}>
          Run TG-lang
        </button>
        <button type="button" onClick={onStop} disabled={!running}>
          Stopp
        </button>
      </section>

      <textarea
        id="editor"
        spellCheck={false}
        value={source}
        onChange={(event) => onSourceChange(event.target.value)}
      />
    </article>
  )
}
