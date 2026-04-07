import type {
  AssignmentStatement,
  BinaryExpression,
  CallExpression,
  ColorRegisterStatement,
  ConditionalStatement,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  InfodeskStatement,
  IndexedAssignmentStatement,
  KreativaStatement,
  LordagExpression,
  NocExpression,
  NumberLiteral,
  PallExpression,
  PiExpression,
  PixelStatement,
  Program,
  ReturnStatement,
  RopExpression,
  SeatingExpression,
  SleepStatement,
  Statement,
  ThrowStatement,
  TrigExpression,
} from '../ast'
import { BINARY_OPERATOR_WORDS, TG_RESERVED_WORD_SET } from '../constants'
import type { Token } from '../tokenizer'

export class ParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

type BinaryOperatorMap = Partial<Record<string, BinaryExpression['operator']>>

export class Parser {
  private index = 0
  private readonly tokens: Token[]

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parseProgram(): Program {
    let mode: Program['mode'] = 'text'
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
    switch (this.peekWord()) {
      case 'infodesk':
        return this.parseInfodesk()
      case 'onsdag':
      case 'torsdag':
      case 'fredag':
        return this.parseColorRegister()
      case 'piksel':
        return this.parsePixel()
      case 'secbua':
        return this.parseConditional()
      case 'hylle':
        return this.parseFunctionDeclaration()
      case 'tech':
        return this.parseReturn()
      case 'sovetelt':
        return this.parseSleep()
      case 'attentiongrab':
        return this.parseThrow()
      case 'kreativia':
        return this.parseKreativaStatement()
      default:
        if (this.isIndexedAssignmentStart()) {
          return this.parseIndexedAssignment()
        }

        if (this.isType('WORD') && this.peek(1).type === 'EQUALS') {
          return this.parseAssignment()
        }

        return this.parseExpressionStatement()
    }
  }

  private parseExpressionStatement(): ExpressionStatement {
    return {
      type: 'ExpressionStatement',
      expression: this.parseExpression(),
    }
  }

  private parseAssignment(): AssignmentStatement {
    const nameToken = this.expectIdentifier('variabelnavn')
    this.expectType('EQUALS')

    return {
      type: 'AssignmentStatement',
      name: nameToken.value,
      value: this.parseExpression(),
    }
  }

  private parseIndexedAssignment(): IndexedAssignmentStatement {
    const nameToken = this.expectIdentifier('variabelnavn')
    this.expectWord('noc')
    const index = this.parseExpression()
    this.expectType('EQUALS')

    return {
      type: 'IndexedAssignmentStatement',
      name: nameToken.value,
      index,
      value: this.parseExpression(),
    }
  }

  private parseInfodesk(): InfodeskStatement {
    this.expectWord('infodesk')
    return {
      type: 'InfodeskStatement',
      expression: this.parseMaybeParenthesizedExpression(),
    }
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    this.expectWord('hylle')

    let name: string | null = null
    if (this.isType('WORD') && this.peek(1).type === 'LPAREN') {
      const nameToken = this.expectIdentifier('funksjonsnavn', { allowPlaceholder: true })
      name = nameToken.value === '_' ? null : nameToken.value
    }

    this.expectType('LPAREN')
    const params = this.parseParameterList()
    this.expectType('RPAREN')

    this.expectType('ARROW')
    return {
      type: 'FunctionDeclaration',
      name,
      params,
      body: this.parseBlock('Funksjonsblokk ble ikke avsluttet med }.'),
    }
  }

  private parseParameterList(): string[] {
    const params: string[] = []

    while (!this.isType('RPAREN')) {
      params.push(this.expectIdentifier('parameter').value)
      this.matchType('COMMA')
    }

    return params
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

  private parseColorRegister(): ColorRegisterStatement {
    const keyword = this.expectType('WORD')
    const channel = keyword.value
    if (channel !== 'onsdag' && channel !== 'torsdag' && channel !== 'fredag') {
      throw this.error(keyword, `Uventet keyword '${channel}' for fargeregister.`)
    }

    return {
      type: 'ColorRegisterStatement',
      channel,
      value: this.parseExpression(),
    }
  }

  private parseConditional(): ConditionalStatement {
    this.expectWord('secbua')
    this.expectType('LPAREN')
    const condition = this.parseExpression()
    this.expectType('RPAREN')

    const thenBody = this.parseBlock('secbua-blokk ble ikke avsluttet med }.')
    const elseBody = this.matchWord('ombud') ? this.parseBlock('ombud-blokk ble ikke avsluttet med }.') : null

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

  private parseKreativaStatement(): KreativaStatement {
    this.expectWord('kreativia')
    return {
      type: 'KreativaStatement',
      key: this.parseExpression(),
      handler: this.parseExpression(),
    }
  }

  private parseExpression(): Expression {
    return this.parseEquality()
  }

  private parseEquality(): Expression {
    return this.parseLeftAssociative(() => this.parseComparison(), BINARY_OPERATOR_WORDS.equality)
  }

  private parseComparison(): Expression {
    return this.parseLeftAssociative(() => this.parseAdditive(), BINARY_OPERATOR_WORDS.comparison)
  }

  private parseAdditive(): Expression {
    return this.parseLeftAssociative(() => this.parseMultiplicative(), BINARY_OPERATOR_WORDS.additive)
  }

  private parseMultiplicative(): Expression {
    return this.parseLeftAssociative(() => this.parsePostfixExpression(), BINARY_OPERATOR_WORDS.multiplicative)
  }

  private parseLeftAssociative(next: () => Expression, operators: BinaryOperatorMap): Expression {
    let left = next()

    while (this.isType('WORD')) {
      const operator = operators[this.peek().value]
      if (!operator) {
        break
      }

      this.expectType('WORD')
      const right = next()
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right,
      }
    }

    return left
  }

  private parsePostfixExpression(): Expression {
    let expression = this.parseAtomicExpression()

    while (true) {
      if (this.matchType('LPAREN')) {
        expression = this.finishCallExpression(expression)
        continue
      }

      if (this.matchWord('noc')) {
        expression = this.parseNocExpression(expression)
        continue
      }

      return expression
    }
  }

  private finishCallExpression(callee: Expression): CallExpression {
    const args = this.parseExpressionList('RPAREN')
    this.expectType('RPAREN')

    return {
      type: 'CallExpression',
      callee,
      args,
    }
  }

  private parseAtomicExpression(): Expression {
    switch (this.peekWord()) {
      case 'seating':
        return this.parseSeatingExpression()
      case 'lørdag':
        return this.parseLordagExpression()
      case 'rop':
        return this.parseRopExpression()
      case 'pall':
        return this.parsePallExpression()
      case 'premiumparkering':
        return this.parsePiExpression()
      case 'trafikklys':
        return this.parseTrigExpression('tan')
      case 'expo':
        return this.parseTrigExpression('sin')
      case 'arne':
        return this.parseArneSequence()
      default:
        if (this.matchType('LPAREN')) {
          const expression = this.parseExpression()
          this.expectType('RPAREN')
          return expression
        }

        if (this.isType('WORD')) {
          return this.parseIdentifierExpression()
        }

        throw this.error(this.peek(), `Uventet token '${this.peek().value || this.peek().type}' i uttrykk.`)
    }
  }

  private parseIdentifierExpression(): Expression {
    const identifierToken = this.expectType('WORD')
    if (TG_RESERVED_WORD_SET.has(identifierToken.value)) {
      throw this.error(identifierToken, `Uventet keyword '${identifierToken.value}' i uttrykk.`)
    }

    return {
      type: 'Identifier',
      name: identifierToken.value,
    }
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

  private parseLordagExpression(): LordagExpression {
    this.expectWord('lørdag')
    return {
      type: 'LordagExpression',
      expression: this.parsePostfixExpression(),
    }
  }

  private parsePallExpression(): PallExpression {
    this.expectWord('pall')
    return {
      type: 'PallExpression',
    }
  }

  private parsePiExpression(): PiExpression {
    this.expectWord('premiumparkering')
    return {
      type: 'PiExpression',
    }
  }

  private parseTrigExpression(fn: 'sin' | 'tan'): TrigExpression {
    this.expectWord(fn === 'sin' ? 'expo' : 'trafikklys')
    this.expectType('LPAREN')
    const angle = this.parseExpression()
    this.expectType('RPAREN')

    return {
      type: 'TrigExpression',
      fn,
      angle,
    }
  }

  private parseSeatingExpression(): SeatingExpression {
    this.expectWord('seating')
    const length = this.parseSeatingLengthExpression()

    let elements: Expression[] = []
    if (this.matchType('LPAREN')) {
      elements = this.parseExpressionList('RPAREN', { consumeNewlines: true })
      this.expectType('RPAREN')
    }

    return {
      type: 'SeatingExpression',
      length,
      elements,
    }
  }

  private parseSeatingLengthExpression(): Expression {
    let expression = this.parseAtomicExpression()

    while (this.matchWord('noc')) {
      expression = this.parseNocExpression(expression)
    }

    return expression
  }

  private parseNocExpression(target: Expression): NocExpression {
    return {
      type: 'NocExpression',
      target,
      index: this.parsePostfixExpression(),
    }
  }

  private parseExpressionList(endType: 'RPAREN', options?: { consumeNewlines?: boolean }): Expression[] {
    const expressions: Expression[] = []

    if (options?.consumeNewlines) {
      this.consumeNewlines()
    }

    while (!this.isType(endType)) {
      expressions.push(this.parseExpression())
      this.matchType('COMMA')

      if (options?.consumeNewlines) {
        this.consumeNewlines()
      }
    }

    return expressions
  }

  private parseMaybeParenthesizedExpression(): Expression {
    if (!this.matchType('LPAREN')) {
      return this.parseExpression()
    }

    const expression = this.parseExpression()
    this.expectType('RPAREN')
    return expression
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
    const safeIndex = Math.max(0, Math.min(this.index + offset, this.tokens.length - 1))
    return this.tokens[safeIndex]
  }

  private peekWord(): string | null {
    return this.isType('WORD') ? this.peek().value : null
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

  private expectIdentifier(kind: 'variabelnavn' | 'funksjonsnavn' | 'parameter', options?: { allowPlaceholder?: boolean }): Token {
    const token = this.expectType('WORD')
    if ((options?.allowPlaceholder && token.value === '_') || !TG_RESERVED_WORD_SET.has(token.value)) {
      return token
    }

    throw this.error(token, `Ugyldig ${kind} '${token.value}'.`)
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

  private isIndexedAssignmentStart(): boolean {
    const token = this.peek()
    const next = this.peek(1)
    return token.type === 'WORD' && !TG_RESERVED_WORD_SET.has(token.value) && next.type === 'WORD' && next.value === 'noc'
  }
}

export function parse(tokens: Token[]): Program {
  return new Parser(tokens).parseProgram()
}
