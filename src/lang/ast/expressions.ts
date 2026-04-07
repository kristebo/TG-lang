export type BinaryOperator = '+' | '-' | '*' | '/' | '%' | '<' | '>' | '=='

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
  | NocExpression
  | CallExpression

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
  operator: BinaryOperator
  left: Expression
  right: Expression
}

export interface RopExpression {
  type: 'RopExpression'
  /** crew (+) at the top level means string concatenation between characters or groups. */
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

export interface NocExpression {
  type: 'NocExpression'
  target: Expression
  index: Expression
}

export interface CallExpression {
  type: 'CallExpression'
  callee: Expression
  args: Expression[]
}
