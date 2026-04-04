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

export type Expression =
  | NumberLiteral
  | Identifier
  | BinaryExpression
  | RopExpression
  | LordagExpression
  | PallExpression
  | PiExpression
  | TrigExpression
  | SeatingExpression
  | NucExpression
  | CallExpression

export interface Program {
  type: 'Program'
  mode: 'text' | 'canvas'
  resolution: number | null
  body: Statement[]
}

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
  channel: 'onsdag' | 'torsdag' | 'fredag'
  value: Expression
}

export interface ConditionalStatement {
  type: 'ConditionalStatement'
  condition: Expression
  thenBody: Statement[]
  elseBody: Statement[] | null
}

export interface AttentiongrabStatement {
  type: 'AttentiongrabStatement'
  expression: Expression
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

export interface NumberLiteral {
  type: 'NumberLiteral'
  value: number
}

export interface Identifier {
  type: 'Identifier'
  name: string
}

export interface BinaryExpression {
  type: 'BinaryExpression'
  operator: '+' | '-' | '*' | '/' | '%' | '<' | '>' | '=='
  left: Expression
  right: Expression
}

export interface RopExpression {
  type: 'RopExpression'
  /** The inner expression. crew (+) at the top level means string concat of chars. */
  expression: Expression
}

export interface LordagExpression {
  type: 'LordagExpression'
  expression: Expression
}

export interface PallExpression {
  type: 'PallExpression'
}

export interface PiExpression {
  type: 'PiExpression'
}

export interface TrigExpression {
  type: 'TrigExpression'
  fn: 'sin' | 'tan'
  angle: Expression
}

export interface SeatingExpression {
  type: 'SeatingExpression'
  length: Expression
  elements: Expression[]
}

export interface NucExpression {
  type: 'NucExpression'
  target: Expression
  index: Expression
}

export interface CallExpression {
  type: 'CallExpression'
  callee: Expression
  args: Expression[]
}
