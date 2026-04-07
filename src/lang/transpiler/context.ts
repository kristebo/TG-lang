import type { Program } from '../ast'

export interface TranspileContext {
  localBindings: Set<string>
  indentLevel: number
  canvasMode: boolean
}

const INDENT = '  '

export const renderIndent = (level: number): string => INDENT.repeat(level)

export const createRootContext = (program: Program): TranspileContext => ({
  localBindings: new Set<string>(),
  indentLevel: 0,
  canvasMode: program.mode === 'canvas',
})

export const createChildContext = (
  context: TranspileContext,
  localBindings = context.localBindings,
): TranspileContext => ({
  localBindings,
  indentLevel: context.indentLevel + 1,
  canvasMode: context.canvasMode,
})

export const emitGuard = (context: TranspileContext): string =>
  `${renderIndent(context.indentLevel)}__tg.ensureActive();`

export const resolveBinding = (name: string, context: TranspileContext): string =>
  context.localBindings.has(name) ? name : `__tgVars.${name}`
