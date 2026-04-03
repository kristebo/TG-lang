export type Statement =
  | AssignmentStatement
  | InfodeskStatement
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
  | CallExpression

export interface Program {
  type: 'Program'
  body: Statement[]
}

export interface AssignmentStatement {
  type: 'AssignmentStatement'
  name: string
  value: Expression
}

export interface InfodeskStatement {
  type: 'InfodeskStatement'
  expression: Expression
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
  operator: '+' | '-' | '*' | '/' | '==='
  left: Expression
  right: Expression
}

export interface RopExpression {
  type: 'RopExpression'
  /** The inner expression. crew (+) at the top level means string concat of chars. */
  expression: Expression
}

export interface CallExpression {
  type: 'CallExpression'
  callee: Expression
  args: Expression[]
}
