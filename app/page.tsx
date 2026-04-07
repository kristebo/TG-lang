'use client'

import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_CANVAS_RESOLUTION } from '../src/lang/constants'
import { runTG } from '../src/lang/runtime'
import { EXAMPLES } from '../src/samples'
import { AppFooter } from './components/AppFooter'
import { AppHeader } from './components/AppHeader'
import { DebuggerPanel } from './components/DebuggerPanel'
import { DocumentationPanel } from './components/DocumentationPanel'
import { EditorPanel } from './components/EditorPanel'
import { ProgramOutputPanel } from './components/ProgramOutputPanel'
import { VikingskipCanvasPanel } from './components/VikingskipCanvasPanel'
import { useTGDebugger } from './hooks/useTGDebugger'
import { useTGProgramStop } from './hooks/useTGProgramStop'

type Pixel = {
  x: number
  y: number
  r: number
  g: number
  b: number
}

export default function Home() {
  const [exampleId, setExampleId] = useState<string>(EXAMPLES[0]?.id ?? '')
  const [source, setSource] = useState<string>(EXAMPLES[0]?.code ?? '')
  const [output, setOutput] = useState<string>('(ingen output)')
  const [javascript, setJavascript] = useState<string>('')
  const [running, setRunning] = useState<boolean>(false)
  const [canvasResolution, setCanvasResolution] = useState<number | null>(null)
  const [pixels, setPixels] = useState<Pixel[]>([])
  const {
    debuggerState,
    debuggerRuntimeOptions,
    syncRunResult,
    captureRuntimeFailure,
  } = useTGDebugger()
  const { canStop, stopActiveSession } = useTGProgramStop({
    active: running || debuggerState.status === 'running',
    debugging: debuggerState.status === 'running',
  })
  const isVikingskipMode = /^\s*vikingskip\b/m.test(source)
  const visibleCanvasResolution = isVikingskipMode ? (canvasResolution ?? DEFAULT_CANVAS_RESOLUTION) : null

  useEffect(() => {
    const search = new URLSearchParams(window.location.search).get('example')
    if (search) {
      const example = EXAMPLES.find((item) => item.id === search)
      if (example) {
        setExampleId(example.id)
        setSource(example.code)
      }
    }
  }, [])

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
    setRunning(true)
    setOutput('Kjorer...')
    setJavascript('')
    setCanvasResolution(isVikingskipMode ? DEFAULT_CANVAS_RESOLUTION : null)
    setPixels([])

    try {
      const result = await runTG(source, {
        ...debuggerRuntimeOptions,
        onOutput: (_line, allLines) => {
          setOutput(allLines.join('\n'))
        },
        onCanvasInit: (resolution) => {
          setCanvasResolution(resolution)
        },
        onPixel: (x, y, r, g, b) => {
          setPixels((current) => [...current, { x, y, r, g, b }])
        },
      })

      syncRunResult(result)
      setJavascript(result.javascript)

      if (result.error) {
        setOutput(`Feil: ${result.error}`)
        return
      }

      if (result.stopped) {
        setOutput(result.output.length > 0 ? `${result.output.join('\n')}\n[stoppet]` : '[stoppet]')
        return
      }

      setOutput(result.output.length > 0 ? result.output.join('\n') : '(ingen output)')
    } catch (error) {
      captureRuntimeFailure(error)
      setOutput(`Feil: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setRunning(false)
    }
  }

  async function stopCode(): Promise<void> {
    const stopped = await stopActiveSession()
    if (!stopped.success && stopped.error) {
      setOutput(`Feil: ${stopped.error}`)
      return
    }

    setOutput((current) =>
      current.includes('[stoppet]') ? current : `${current}\n[stoppet]`,
    )
  }

  return (
    <main id="app">
      <section className="shell">
        <AppHeader />

        <section className="workspace-grid">
          <EditorPanel
            examples={EXAMPLES}
            exampleId={exampleId}
            onExampleChange={setExampleId}
            onLoadExample={loadExample}
            onRun={runCode}
            onStop={stopCode}
            running={running || canStop}
            source={source}
            onSourceChange={setSource}
          />

          <section className="runtime-stack">
            <VikingskipCanvasPanel
              isActive={isVikingskipMode}
              resolution={visibleCanvasResolution}
              pixels={pixels}
            />
            <ProgramOutputPanel output={output} javascript={javascript} />
            <DebuggerPanel state={debuggerState} />
          </section>
        </section>

        <DocumentationPanel />
        <AppFooter />
      </section>
    </main>
  )
}
