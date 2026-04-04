'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { runTG, stopTG } from '../src/runtime'
import { EXAMPLES } from '../src/samples'

const DEFAULT_CANVAS_RESOLUTION = 16
const COLOR_CHANNEL_MAX = 15

export default function Home() {
  const [exampleId, setExampleId] = useState<string>(EXAMPLES[0]?.id ?? '')
  const [source, setSource] = useState<string>(EXAMPLES[0]?.code ?? '')
  const [output, setOutput] = useState<string>('(ingen output)')
  const [javascript, setJavascript] = useState<string>('')
  const [running, setRunning] = useState<boolean>(false)
  const [canvasResolution, setCanvasResolution] = useState<number | null>(null)
  const [pixels, setPixels] = useState<Array<{ x: number; y: number; r: number; g: number; b: number }>>([])
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isVikingskipMode = /^\s*vikingskip\b/m.test(source)
  const visibleCanvasResolution = isVikingskipMode
    ? (canvasResolution ?? DEFAULT_CANVAS_RESOLUTION)
    : null

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
    const result = await runTG(source, {
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
    setRunning(false)
    setJavascript(result.javascript)

    if (result.error) {
      setOutput(`Feil: ${result.error}`)
      return
    }

    setOutput(result.output.length > 0 ? result.output.join('\n') : '(ingen output)')
  }

  function stopCode(): void {
    const stopped = stopTG()
    if (!stopped.success && stopped.error) {
      setOutput(`Feil: ${stopped.error}`)
      return
    }

    setOutput((current) => `${current}\n[stoppet]`)
    setRunning(false)
  }

  useEffect(() => {
    if (!canvasRef.current || !visibleCanvasResolution) {
      return
    }

    const canvas = canvasRef.current
    const size = visibleCanvasResolution
    const pixelSize = 12
    canvas.width = size * pixelSize
    canvas.height = size * pixelSize

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.fillStyle = '#0f1516'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const pixel of pixels) {
      if (pixel.x < 0 || pixel.y < 0 || pixel.x >= size || pixel.y >= size) {
        continue
      }
      ctx.fillStyle = `rgb(${Math.round((pixel.r / COLOR_CHANNEL_MAX) * 255)}, ${Math.round((pixel.g / COLOR_CHANNEL_MAX) * 255)}, ${Math.round((pixel.b / COLOR_CHANNEL_MAX) * 255)})`
      ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize)
    }
  }, [visibleCanvasResolution, pixels])

  return (
    <main id="app">
      <section className="shell">
        <header className="hero">
          <p className="kicker">TG-lang</p>
          <h1 className="hero-title">
            <img src="/image.png" alt="TG-lang logo" className="logo" />
            TG-lang Lab
          </h1>
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
          <button type="button" onClick={stopCode} disabled={!running}>
            Stopp
          </button>
        </section>

        <section className="grid">
          <article className="panel">
            <h2>Kode</h2>
            <textarea id="editor" spellCheck={false} value={source} onChange={(event) => setSource(event.target.value)} />
          </article>

          <article className="panel">
            {isVikingskipMode ? (
              <>
                <h2>Grafikk</h2>
                <canvas
                  ref={canvasRef}
                  id="tg-canvas"
                  style={{ width: '100%', maxWidth: '360px', border: '1px solid #d5c8a9', borderRadius: '10px' }}
                />
              </>
            ) : (
              <>
                <h2>Output</h2>
                <pre id="output">{output}</pre>
              </>
            )}

            <h2>Generert JavaScript</h2>
            <pre id="generated">{javascript || '(ingen JavaScript generert)'}</pre>
          </article>
        </section>

        <section className="panel spec">
          <h2>TG-lang sprakdefinisjon</h2>
          <a href='https://github.com/kristebo/TG-lang' target='_blank' rel='noopener noreferrer'>Full TG-lang spesifikasjon på GitHub</a>
          <h3>Programstruktur</h3>
          <ul>
            <li>Et program starter med <strong>innsjekk</strong> og avsluttes med <strong>søndag</strong>.</li>
            <li>Valgfri grafikkmodus startes med <strong>vikingskip</strong> på egen linje før <strong>innsjekk</strong>.</li>
            <li>I grafikkmodus settes oppløsning med <strong>hovedscene arne ...</strong>. Hvis ikke oppgitt brukes standard oppløsning 16.</li>
          </ul>

          <h3>Verdier og uttrykk</h3>
          <ul>
            <li><strong>arne</strong> representerer 1. Flere arne i sekvens gir tilsvarende heltall.</li>
            <li><strong>rop</strong> er et uttrykk som konverterer arne-baserte verdier til bokstaver.</li>
            <li><strong>pall</strong> gir en runtime-generert tallverdi der <strong>| 1</strong> brukes pa heltallsdelen, men desimaldelen beholdes.</li>
            <li><strong>rop</strong> støtter uttrykk og konkatenering med <strong>crew</strong>.</li>
            <li>Talltegn er ikke tillatt i kildekoden. Numeriske verdier må uttrykkes med arne-sekvenser.</li>
          </ul>

          <h3>Output</h3>
          <ul>
            <li><strong>infodesk expr</strong> eller <strong>infodesk(expr)</strong> skriver til output.</li>
            <li>I tekstmodus vises output i tekstpanel.</li>
            <li>I vikingskip-modus vises grafisk output i canvas.</li>
          </ul>

          <h3>Operatorer</h3>
          <ul>
            <li><strong>crew</strong> = +</li>
            <li><strong>deltager</strong> = -</li>
            <li><strong>kandu</strong> = *</li>
            <li><strong>medic</strong> = /</li>
            <li><strong>kandustyre</strong> = %</li>
            <li><strong>foam</strong> = &lt;</li>
            <li><strong>maof</strong> = &gt;</li>
            <li><strong>kanalseks</strong> = ===</li>
          </ul>

          <h3>Kontrollflyt</h3>
          <ul>
            <li><strong>secbua (betingelse) &#123; ... &#125;</strong> for if-blokk.</li>
            <li><strong>ombud &#123; ... &#125;</strong> som valgfri else-blokk.</li>
          </ul>

          <h3>Funksjoner</h3>
          <ul>
            <li><strong>hylle navn(a b) =&gt; &#123; ... &#125;</strong> definerer funksjon.</li>
            <li><strong>tech expr</strong> returnerer verdi.</li>
            <li>Funksjonskall awaites automatisk i generert kode, bade pa toppniva og nested.</li>
          </ul>

          <h3>Runtime-kommandoer</h3>
          <ul>
            <li><strong>sovetelt(expr) &#123; &#125;</strong> pauser kjoring i expr sekunder.</li>
            <li><strong>attentiongrab(expr)</strong> kaster en feil.</li>
            <li><strong>piksel(x, y)</strong> setter en piksel i canvas i vikingskip-modus.</li>
            <li><strong>onsdag expr</strong>, <strong>torsdag expr</strong>, <strong>fredag expr</strong> setter r, g og b i fargeregisteret.</li>
            <li>Fargedybde per kanal er <strong>arne arne arne arne kandu arne arne arne arne</strong> (0 til 15).</li>
            <li>Etter hver <strong>piksel</strong> resettes fargeregisteret til <strong>rgb(0, 0, 0)</strong>.</li>
          </ul>

          <h3>Avbrytelse</h3>
          <ul>
            <li>Stopp-knappen avbryter bare den aktive TG-kjoringen.</li>
            <li>Avbrytelse virker ogsa under venting i <strong>sovetelt</strong> og i rekursive kjoringer.</li>
          </ul>
        </section>
      </section>
    </main>
  )
}
