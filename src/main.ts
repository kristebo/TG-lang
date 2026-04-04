import './style.css'
import { EXAMPLES } from './samples'
import { runTG, stopTG } from './runtime'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main class="shell">
  <header class="hero">
    
    <h1> <img src="/assets/image.png" alt="TG-lang logo" class="logo" /> TG-lang Lab</h1>
    <p class="subtitle">Skriv TG-lang, transpiler, og kjor direkte i nettleseren.</p>
    <p class="subtitle">Useless util TG26 av 1tb</p>
  </header>

  <section class="toolbar">
    <label for="examplePicker">Eksempel:</label>
    <select id="examplePicker"></select>
    <button id="loadExample" type="button">Last inn</button>
    <button id="runButton" type="button" class="run">Run TG-lang</button>
    <button id="stop" type="button" class="stop">Stopp</button>
  </section>

  <section class="grid">
    <article class="panel">
      <h2>Kode</h2>
      <textarea id="editor" spellcheck="false"></textarea>
    </article>

    <article class="panel">
      <h2>Output</h2>
      <pre id="output"></pre>
    </article>

  </section>
</main>
`

const picker = document.querySelector<HTMLSelectElement>('#examplePicker')!
const editor = document.querySelector<HTMLTextAreaElement>('#editor')!
const output = document.querySelector<HTMLPreElement>('#output')!
const loadButton = document.querySelector<HTMLButtonElement>('#loadExample')!
const runButton = document.querySelector<HTMLButtonElement>('#runButton')!
const stopButton = document.querySelector<HTMLButtonElement>('#stop')!

stopButton.disabled = true
for (const example of EXAMPLES) {
  const option = document.createElement('option')
  option.value = example.id
  option.textContent = example.title
  picker.appendChild(option)
}

function loadSelectedExample(): void {
  const chosen = EXAMPLES.find((item) => item.id === picker.value) ?? EXAMPLES[0]
  editor.value = chosen.code
}

loadSelectedExample()

loadButton.addEventListener('click', loadSelectedExample)

stopButton.addEventListener('click', () => {
  const res = stopTG()
  if (!res.success) {
    output.textContent = `Feil ved stopping: ${res.error}`
    return
  }

  output.textContent = 'Kjoring stoppet.'
  stopButton.disabled = true
})

runButton.addEventListener('click', async () => {
  stopButton.disabled = false
  output.textContent = 'Kjorer...'

  const result = await runTG(editor.value)
  stopButton.disabled = true

  if (result.error) {
    output.textContent = `Feil: ${result.error}`
    return
  }

  if (result.stopped) {
    output.textContent = result.output.length > 0 ? `${result.output.join('\n')}\n[stoppet]` : '[stoppet]'
    return
  }

  output.textContent = result.output.length > 0 ? result.output.join('\n') : '(ingen output)'
})
