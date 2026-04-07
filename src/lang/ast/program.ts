import type { ProgramMode } from '../constants'
import type { Statement } from './statements'

export interface Program {
  type: 'Program'
  mode: ProgramMode
  resolution: number | null
  body: Statement[]
}
