import type {
  AssignmentStatement,
  BinaryExpression,
  CallExpression,
  ConditionalStatement,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  InfodeskStatement,
  NumberLiteral,
  PallExpression,
  PixelStatement,
  Program,
  ReturnStatement,
  RopExpression,
  SleepStatement,
  Statement,
  ThrowStatement,
} from './ast'
import type { Token } from './tokenizer'

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

const RESERVED = new Set([
  'vikingskip',
  'hovedscene',
  'piksel',
  'innsjekk',
  'søndag',
  'arne',
  'rop',
  'infodesk',
  'crew',
  'deltager',
  'kandu',
  'kandustyre',
  'medic',
  'foam',
  'maof',
  'kanalseks',
  'secbua',
  'ombud',
  'hylle',
  'tech',
  'sovetelt',
  'attentiongrab',
  'pall',
])

class Parser {
  private index = 0
  private readonly tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parseProgram(): Program {
    let mode: 'text' | 'canvas' = 'text'
    let resolution: number | null = null

    this.consumeNewlines()

    if (this.matchWord('vikingskip')) {
      mode = 'canvas'
      this.consumeNewlines()
    }

    this.expectWord('innsjekk')
    this.consumeNewlines()

    if (mode === 'canvas' && this.matchWord('hovedscene')) {
      resolution = this.parseArneOnlyValue()
      this.consumeNewlines()
    }

    const body: Statement[] = []
    while (!this.isWord('søndag') && !this.isType('EOF')) {
      body.push(this.parseStatement())
      this.consumeNewlines()
    }

    this.expectWord('søndag')
    this.consumeNewlines()
    this.expectType('EOF')

    return { type: 'Program', mode, resolution, body }
  }

  private parseStatement(): Statement {
    if (this.isWord('infodesk')) {
      return this.parseInfodesk()
    }

    if (this.isWord('piksel')) {
      return this.parsePixel()
    }

    if (this.isWord('secbua')) {
      return this.parseConditional()
    }

    if (this.isWord('hylle')) {
      return this.parseFunctionDeclaration()
    }

    if (this.isWord('tech')) {
      return this.parseReturn()
    }

    if (this.isWord('sovetelt')) {
      return this.parseSleep()
    }

    if (this.isWord('attentiongrab')) {
      return this.parseThrow()
    }

    if (this.isType('WORD') && this.peek(1).type === 'EQUALS') {
      return this.parseAssignment()
    }

    const expressionStatement: ExpressionStatement = {
      type: 'ExpressionStatement',
      expression: this.parseExpression(),
    }
    return expressionStatement
  }

  private parseAssignment(): AssignmentStatement {
    const nameToken = this.expectType('WORD')
    if (RESERVED.has(nameToken.value)) {
      throw this.error(nameToken, `Ugyldig variabelnavn '${nameToken.value}'.`)
    }

    this.expectType('EQUALS')

    return {
      type: 'AssignmentStatement',
      name: nameToken.value,
      value: this.parseExpression(),
    }
  }

  private parseInfodesk(): InfodeskStatement {
    this.expectWord('infodesk')

    let expression: Expression
    if (this.matchType('LPAREN')) {
      expression = this.parseExpression()
      this.expectType('RPAREN')
    } else {
      expression = this.parseExpression()
    }

    return { type: 'InfodeskStatement', expression }
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    this.expectWord('hylle')

    let name: string | null = null
    if (this.isType('WORD') && this.peek(1).type === 'LPAREN') {
      const nameToken = this.expectType('WORD')
      if (nameToken.value !== '_' && RESERVED.has(nameToken.value)) {
        throw this.error(nameToken, `Ugyldig funksjonsnavn '${nameToken.value}'.`)
      }
      name = nameToken.value === '_' ? null : nameToken.value
    }

    this.expectType('LPAREN')
    const params: string[] = []
    while (!this.isType('RPAREN')) {
      const paramToken = this.expectType('WORD')
      if (RESERVED.has(paramToken.value)) {
        throw this.error(paramToken, `Ugyldig parameter '${paramToken.value}'.`)
      }

      params.push(paramToken.value)
      this.matchType('COMMA')
    }
    this.expectType('RPAREN')

    this.expectType('ARROW')
    const body = this.parseBlock('Funksjonsblokk ble ikke avsluttet med }.')
    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body,
    }
  }

  private parsePixel(): PixelStatement {
    this.expectWord('piksel')
    this.expectType('LPAREN')
    const x = this.parseExpression()
    this.expectType('COMMA')
    const y = this.parseExpression()
    this.expectType('RPAREN')

    return {
      type: 'PixelStatement',
      x,
      y,
    }
  }

  private parseConditional(): ConditionalStatement {
    this.expectWord('secbua')
    this.expectType('LPAREN')
    const condition = this.parseExpression()
    this.expectType('RPAREN')

    const thenBody = this.parseBlock('secbua-blokk ble ikke avsluttet med }.')

    let elseBody: Statement[] | null = null
    if (this.matchWord('ombud')) {
      elseBody = this.parseBlock('ombud-blokk ble ikke avsluttet med }.')
    }

    return {
      type: 'ConditionalStatement',
      condition,
      thenBody,
      elseBody,
    }
  }

  private parseReturn(): ReturnStatement {
    this.expectWord('tech')
    return {
      type: 'ReturnStatement',
      expression: this.parseExpression(),
    }
  }

  private parseSleep(): SleepStatement {
    this.expectWord('sovetelt')
    this.expectType('LPAREN')
    const duration = this.parseExpression()
    this.expectType('RPAREN')

    if (this.matchType('LBRACE')) {
      this.consumeNewlines()
      this.expectType('RBRACE')
    }

    return {
      type: 'SleepStatement',
      duration,
    }
  }

  private parseThrow(): ThrowStatement {
    this.expectWord('attentiongrab')
    this.expectType('LPAREN')
    const expression = this.parseExpression()
    this.expectType('RPAREN')
    return {
      type: 'ThrowStatement',
      expression,
    }
  }

  private parseExpression(): Expression {
    return this.parseEquality()
  }

  private parseEquality(): Expression {
    let left = this.parseComparison()

    while (this.matchWord('kanalseks')) {
      const right = this.parseComparison()
      const node: BinaryExpression = {
        type: 'BinaryExpression',
        operator: '===',
        left,
        right,
      }
      left = node
    }

    return left
  }

  private parseComparison(): Expression {
    let left = this.parseAdditive()

    while (this.isWord('foam') || this.isWord('maof')) {
      const word = this.expectType('WORD').value
      const operator = word === 'foam' ? '<' : '>'
      const right = this.parseAdditive()
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      }
    }

    return left
  }

  private parseAdditive(): Expression {
    let left = this.parseMultiplicative()

    while (this.isWord('crew') || this.isWord('deltager')) {
      const operator = this.expectType('WORD').value === 'crew' ? '+' : '-'
      const right = this.parseMultiplicative()
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      }
    }

    return left
  }

  private parseMultiplicative(): Expression {
    let left = this.parsePrimary()

    while (this.isWord('kandu') || this.isWord('medic') || this.isWord('kandustyre')) {
      const word = this.expectType('WORD').value
      const operator = word === 'kandu' ? '*' : word === 'medic' ? '/' : '%'
      const right = this.parsePrimary()
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      }
    }

    return left
  }

  private parsePrimary(): Expression {
    if (this.isWord('rop')) {
      return this.parseRopExpression()
    }

    if (this.isWord('pall')) {
      return this.parsePallExpression()
    }

    if (this.isWord('arne')) {
      return this.parseArneSequence()
    }

    if (this.matchType('LPAREN')) {
      const expr = this.parseExpression()
      this.expectType('RPAREN')
      return expr
    }

    if (this.isType('WORD')) {
      const identifierToken = this.expectType('WORD')
      if (RESERVED.has(identifierToken.value)) {
        throw this.error(identifierToken, `Uventet keyword '${identifierToken.value}' i uttrykk.`)
      }

      let expression: Expression = {
        type: 'Identifier',
        name: identifierToken.value,
      }

      while (this.matchType('LPAREN')) {
        const args: Expression[] = []
        while (!this.isType('RPAREN')) {
          args.push(this.parseExpression())
          this.matchType('COMMA')
        }
        this.expectType('RPAREN')

        const call: CallExpression = {
          type: 'CallExpression',
          callee: expression,
          args,
        }
        expression = call
      }

      return expression
    }

    throw this.error(this.peek(), `Uventet token '${this.peek().value || this.peek().type}' i uttrykk.`)
  }

  private parseArneSequence(): NumberLiteral {
    let count = 0
    while (this.isWord('arne')) {
      this.expectWord('arne')
      count += 1
    }

    return {
      type: 'NumberLiteral',
      value: count,
    }
  }

  private parseArneOnlyValue(): number {
    if (!this.isWord('arne')) {
      throw this.error(this.peek(), 'hovedscene ma vaere en arne-sekvens.')
    }

    const value = this.parseArneSequence().value

    if (this.isType('WORD')) {
      throw this.error(this.peek(), 'hovedscene kan kun inneholde arne.')
    }

    return value
  }

  private parseRopExpression(): RopExpression {
    const ropToken = this.expectWord('rop')
    if (!this.isWord('arne') && !this.isType('LPAREN')) {
      throw this.error(ropToken, 'rop forventer en arne-sekvens eller uttrykk.')
    }

    return {
      type: 'RopExpression',
      expression: this.parseAdditive(),
    }
  }

  private parsePallExpression(): PallExpression {
    this.expectWord('pall')
    return {
      type: 'PallExpression',
    }
  }

  private parseBlock(eofErrorMessage: string): Statement[] {
    this.expectType('LBRACE')
    this.consumeNewlines()

    const body: Statement[] = []
    while (!this.isType('RBRACE')) {
      if (this.isType('EOF')) {
        throw new ParseError(eofErrorMessage)
      }

      body.push(this.parseStatement())
      this.consumeNewlines()
    }
    this.expectType('RBRACE')

    return body
  }

  private consumeNewlines(): void {
    while (this.matchType('NEWLINE')) {
      // noop
    }
  }

  private peek(offset = 0): Token {
    return this.tokens[Math.min(this.index + offset, this.tokens.length - 1)]
  }

  private matchType(type: Token['type']): boolean {
    if (this.peek().type === type) {
      this.index += 1
      return true
    }
    return false
  }

  private matchWord(word: string): boolean {
    if (this.isWord(word)) {
      this.index += 1
      return true
    }
    return false
  }

  private expectType(type: Token['type']): Token {
    const token = this.peek()
    if (token.type !== type) {
      throw this.error(token, `Forventet ${type}, fikk ${token.type}.`)
    }

    this.index += 1
    return token
  }

  private expectWord(word: string): Token {
    const token = this.peek()
    if (token.type !== 'WORD' || token.value !== word) {
      throw this.error(token, `Forventet keyword '${word}'.`)
    }

    this.index += 1
    return token
  }

  private isType(type: Token['type']): boolean {
    return this.peek().type === type
  }

  private isWord(word: string): boolean {
    const token = this.peek()
    return token.type === 'WORD' && token.value === word
  }

  private error(token: Token, message: string): ParseError {
    return new ParseError(`${message} (linje ${token.line}, kolonne ${token.column})`)
  }
}

export function parse(tokens: Token[]): Program {
  return new Parser(tokens).parseProgram()
}
