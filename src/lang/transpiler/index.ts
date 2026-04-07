import type { Program } from '../ast'
import { DEFAULT_CANVAS_RESOLUTION, TG_COLOR_CHANNEL_MAX } from '../constants'
import { createRootContext } from './context'
import { transpileStatement } from './statements'

const emitPrelude = (program: Program): string[] => {
  const prelude = ['const __tgVars = Object.create(null);']

  if (program.mode !== 'canvas') {
    return prelude
  }

  const resolution = Math.max(1, program.resolution ?? DEFAULT_CANVAS_RESOLUTION)
  prelude.push('__tg.ensureActive();')
  prelude.push(`await __tg.initCanvas(${resolution});`)
  prelude.push('__tgVars.__tgColorR = 0;')
  prelude.push('__tgVars.__tgColorG = 0;')
  prelude.push('__tgVars.__tgColorB = 0;')
  prelude.push(`const __tgClampChannel = (value) => Math.min(${TG_COLOR_CHANNEL_MAX}, Math.max(0, Math.floor(value)));`)

  return prelude
}

export function transpile(program: Program): string {
  const context = createRootContext(program)
  const lines = [...emitPrelude(program), ...program.body.flatMap((statement) => transpileStatement(statement, context))]
  return lines.join('\n')
}
