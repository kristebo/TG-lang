import type { ColorChannel } from '../constants'
import type { Expression } from './expressions'

export type Statement =
  | AssignmentStatement
  | IndexedAssignmentStatement
  | InfodeskStatement
  | PixelStatement
  | ColorRegisterStatement
  | ConditionalStatement
  | FunctionDeclaration
  | ReturnStatement
  | SleepStatement
  | ThrowStatement
  | ExpressionStatement
  | KreativaStatement

export interface AssignmentStatement {
  type: 'AssignmentStatement'
  name: string
  value: Expression
}

export interface IndexedAssignmentStatement {
  type: 'IndexedAssignmentStatement'
  name: string
  index: Expression
  value: Expression
}

export interface InfodeskStatement {
  type: 'InfodeskStatement'
  expression: Expression
}

export interface PixelStatement {
  type: 'PixelStatement'
  x: Expression
  y: Expression
}

export interface ColorRegisterStatement {
  type: 'ColorRegisterStatement'
  channel: ColorChannel
  value: Expression
}

export interface ConditionalStatement {
  type: 'ConditionalStatement'
  condition: Expression
  thenBody: Statement[]
  elseBody: Statement[] | null
}

export interface FunctionDeclaration {
  type: 'FunctionDeclaration'
  name: string | null
  params: string[]
  body: Statement[]
}

export interface ReturnStatement {
  type: 'ReturnStatement'
  expression: Expression
}

export interface SleepStatement {
  type: 'SleepStatement'
  duration: Expression
}

export interface ThrowStatement {
  type: 'ThrowStatement'
  expression: Expression
}

export interface ExpressionStatement {
  type: 'ExpressionStatement'
  expression: Expression
}

export interface KreativaStatement {
  type: 'KreativaStatement'
  key: Expression
  handler: Expression
}
