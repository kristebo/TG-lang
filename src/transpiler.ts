import type { Expression, Program, Statement } from './ast'

interface TranspileContext {
  declaredVariables: Set<string>
  indentLevel: number
}

const INDENT = '  '

const renderIndent = (level: number): string => INDENT.repeat(level)

export function transpile(program: Program): string {
  const context: TranspileContext = {
    declaredVariables: new Set<string>(),
    indentLevel: 0,
  }

  const lines = program.body.flatMap((statement) => transpileStatement(statement, context))
  return lines.join('\n')
}

function transpileStatement(statement: Statement, context: TranspileContext): string[] {
  const pad = renderIndent(context.indentLevel)

  switch (statement.type) {
    case 'AssignmentStatement': {
      const declaration = context.declaredVariables.has(statement.name) ? '' : 'let '
      context.declaredVariables.add(statement.name)
      return [`${pad}${declaration}${statement.name} = ${transpileExpression(statement.value)};`]
    }
    case 'InfodeskStatement':
      return [`${pad}console.log(${transpileExpression(statement.expression)});`]
    case 'FunctionDeclaration': {
      const signature = `(${statement.params.join(', ')}) => {`
      const start = statement.name
        ? `${pad}const ${statement.name} = ${signature}`
        : `${pad}${signature}`

      const nestedContext: TranspileContext = {
        declaredVariables: new Set<string>(),
        indentLevel: context.indentLevel + 1,
      }

      const bodyLines =
        statement.body.length > 0
          ? statement.body.flatMap((inner) => transpileStatement(inner, nestedContext))
          : [`${renderIndent(context.indentLevel + 1)}/* empty */`]

      const end = statement.name ? `${pad}};` : `${pad}}`
      return [start, ...bodyLines, end]
    }
    case 'ReturnStatement':
      return [`${pad}return ${transpileExpression(statement.expression)};`]
    case 'SleepStatement':
      return [
        `${pad}await new Promise((resolve) => setTimeout(resolve, (${transpileExpression(
          statement.duration,
        )}) * 1000));`,
      ]
    case 'ThrowStatement':
      return [`${pad}throw new Error(String(${transpileExpression(statement.expression)}));`]
    case 'ExpressionStatement':
      return [`${pad}${transpileExpression(statement.expression)};`]
  }
}

function transpileExpression(expression: Expression): string {
  switch (expression.type) {
    case 'NumberLiteral':
      return `${expression.value}`
    case 'Identifier':
      return expression.name
    case 'BinaryExpression':
      return `(${transpileExpression(expression.left)} ${expression.operator} ${transpileExpression(expression.right)})`
    case 'RopExpression':
      return transpileRop(expression.expression)
    case 'CallExpression':
      return `${transpileExpression(expression.callee)}(${expression.args.map((arg) => transpileExpression(arg)).join(', ')})`
  }
}

/**
 * Recursively transpile a rop-inner expression:
 * - crew (+) at any level => string concatenation between two chars/groups
 * - any other binary op   => numeric computation, then one fromCharCode
 * - NumberLiteral          => String.fromCharCode(n + 64)
 */
function transpileRop(expression: Expression): string {
  if (expression.type === 'NumberLiteral') {
    return `String.fromCharCode(${expression.value} + 64)`
  }
  if (expression.type === 'BinaryExpression' && expression.operator === '+') {
    return `(${transpileRop(expression.left)} + ${transpileRop(expression.right)})`
  }
  // Any other expression (kandu, medic, deltager, identifiers, calls, …):
  // compute the numeric result first, then convert to a single char.
  return `(${transpileExpression(expression)})`
}
