import { parse } from '../parser'
import { tokenize } from '../tokenizer'
import { transpile } from '../transpiler'
import type { CompiledProgram, RuntimeDebugEvent } from './types'

export function compileTG(
  source: string,
  notifyPhase?: (phase: RuntimeDebugEvent['phase']) => void,
): CompiledProgram {
  notifyPhase?.('tokenize')
  const tokens = tokenize(source)

  notifyPhase?.('parse')
  const ast = parse(tokens)

  notifyPhase?.('transpile')
  return {
    ast,
    javascript: transpile(ast),
  }
}
