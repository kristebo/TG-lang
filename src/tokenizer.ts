export type TokenType =
  | 'WORD'
  | 'LPAREN'
  | 'RPAREN'
  | 'LBRACE'
  | 'RBRACE'
  | 'EQUALS'
  | 'COMMA'
  | 'ARROW'
  | 'NEWLINE'
  | 'EOF'

export interface Token {
  type: TokenType
  value: string
  line: number
  column: number
}

export class TokenizeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TokenizeError'
  }
}

const isWordStart = (char: string): boolean => /[\p{L}_]/u.test(char)
const isWordPart = (char: string): boolean => /[\p{L}_]/u.test(char)
const isDigit = (char: string): boolean => /\p{N}/u.test(char)

export function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let index = 0
  let line = 1
  let column = 1

  const pushToken = (type: TokenType, value: string, tokenLine = line, tokenColumn = column): void => {
    tokens.push({ type, value, line: tokenLine, column: tokenColumn })
  }

  while (index < input.length) {
    const char = input[index]

    if (char === '\r') {
      index += 1
      continue
    }

    if (char === ' ' || char === '\t') {
      index += 1
      column += 1
      continue
    }

    if (char === '\n') {
      pushToken('NEWLINE', '\\n')
      index += 1
      line += 1
      column = 1
      continue
    }

    if (char === '=' && input[index + 1] === '>') {
      pushToken('ARROW', '=>')
      index += 2
      column += 2
      continue
    }

    if (char === '(') {
      pushToken('LPAREN', char)
      index += 1
      column += 1
      continue
    }

    if (char === ')') {
      pushToken('RPAREN', char)
      index += 1
      column += 1
      continue
    }

    if (char === '{') {
      pushToken('LBRACE', char)
      index += 1
      column += 1
      continue
    }

    if (char === '}') {
      pushToken('RBRACE', char)
      index += 1
      column += 1
      continue
    }

    if (char === ',') {
      pushToken('COMMA', char)
      index += 1
      column += 1
      continue
    }

    if (char === '=') {
      pushToken('EQUALS', char)
      index += 1
      column += 1
      continue
    }

    if (isDigit(char)) {
      throw new TokenizeError(`Tall er ikke tillatt i TG-lang. Bruk arne-sekvenser for tallverdier. (linje ${line}, kolonne ${column})`)
    }

    if (isWordStart(char)) {
      const tokenLine = line
      const tokenColumn = column
      let value = ''

      while (index < input.length && isWordPart(input[index])) {
        value += input[index]
        index += 1
        column += 1
      }

      pushToken('WORD', value, tokenLine, tokenColumn)
      continue
    }

    throw new TokenizeError(`Ukjent tegn '${char}' på linje ${line}, kolonne ${column}.`)
  }

  tokens.push({ type: 'EOF', value: '', line, column })
  return tokens
}
