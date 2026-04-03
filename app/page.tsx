'use client'

import { useMemo, useState } from 'react'
import { runTG } from '../src/runtime'
import { EXAMPLES } from '../src/samples'

export default function Home() {
  const [exampleId, setExampleId] = useState<string>(EXAMPLES[0]?.id ?? '')
  const [source, setSource] = useState<string>(EXAMPLES[0]?.code ?? '')
  const [output, setOutput] = useState<string>('(ingen output)')

  const selected = useMemo(
    () => EXAMPLES.find((item) => item.id === exampleId) ?? EXAMPLES[0],
    [exampleId],
  )

  function loadExample(): void {
    if (!selected) {
      return
    }
    setSource(selected.code)
  }

  async function runCode(): Promise<void> {
    setOutput('Kjorer...')
    const result = await runTG(source)

    if (result.error) {
      setOutput(`Feil: ${result.error}`)
      return
    }

    setOutput(result.output.length > 0 ? result.output.join('\n') : '(ingen output)')
  }

  return (
    <main id="app">
      <section className="shell">
        <header className="hero">
          <p className="kicker">TG-lang MVP</p>
          <h1>TG-lang Lab</h1>
          <p className="subtitle">Skriv TG-lang, transpiler, og kjor direkte i nettleseren.</p>
          <p className="subtitle">Useless util TG26 av 1tb</p>
        </header>

        <section className="toolbar">
          <label htmlFor="examplePicker">Eksempel:</label>
          <select id="examplePicker" value={exampleId} onChange={(event) => setExampleId(event.target.value)}>
            {EXAMPLES.map((example) => (
              <option key={example.id} value={example.id}>
                {example.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={loadExample}>
            Last inn
          </button>
          <button type="button" className="run" onClick={runCode}>
            Run TG-lang
          </button>
        </section>

        <section className="grid">
          <article className="panel">
            <h2>Kode</h2>
            <textarea id="editor" spellCheck={false} value={source} onChange={(event) => setSource(event.target.value)} />
          </article>

          <article className="panel">
            <h2>Output</h2>
            <pre id="output">{output}</pre>
          </article>
        </section>
      </section>
    </main>
  )
}
