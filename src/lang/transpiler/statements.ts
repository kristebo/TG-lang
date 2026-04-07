import type { Statement } from '../ast'
import type { TranspileContext } from './context'
import { createChildContext, emitGuard, renderIndent, resolveBinding } from './context'
import { transpileExpression } from './expressions'

const renderStatementBody = (statements: Statement[], context: TranspileContext): string[] =>
  statements.length > 0
    ? statements.flatMap((statement) => transpileStatement(statement, context))
    : [`${renderIndent(context.indentLevel)}/* empty */`]

export function transpileStatement(statement: Statement, context: TranspileContext): string[] {
  switch (statement.type) {
    case 'AssignmentStatement':
      return emitAssignmentStatement(statement, context)
    case 'IndexedAssignmentStatement':
      return emitIndexedAssignmentStatement(statement, context)
    case 'InfodeskStatement':
      return emitInfodeskStatement(statement, context)
    case 'PixelStatement':
      return emitPixelStatement(statement, context)
    case 'ColorRegisterStatement':
      return emitColorRegisterStatement(statement, context)
    case 'ConditionalStatement':
      return emitConditionalStatement(statement, context)
    case 'FunctionDeclaration':
      return emitFunctionDeclaration(statement, context)
    case 'ReturnStatement':
      return emitReturnStatement(statement, context)
    case 'SleepStatement':
      return emitSleepStatement(statement, context)
    case 'ThrowStatement':
      return emitThrowStatement(statement, context)
    case 'ExpressionStatement':
      return emitExpressionStatement(statement, context)
    case 'KreativaStatement':
      return emitKreativiaStatement(statement, context)
  }
}

function emitAssignmentStatement(
  statement: Extract<Statement, { type: 'AssignmentStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}${resolveBinding(statement.name, context)} = ${transpileExpression(statement.value, context)};`]
}

function emitIndexedAssignmentStatement(
  statement: Extract<Statement, { type: 'IndexedAssignmentStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  const target = resolveBinding(statement.name, context)
  return [
    emitGuard(context),
    `${pad}${target}[Math.floor(${transpileExpression(statement.index, context)} - 1)] = ${transpileExpression(statement.value, context)};`,
  ]
}

function emitInfodeskStatement(
  statement: Extract<Statement, { type: 'InfodeskStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}console.log(${transpileExpression(statement.expression, context)});`]
}

function emitPixelStatement(
  statement: Extract<Statement, { type: 'PixelStatement' }>,
  context: TranspileContext,
): string[] {
  if (!context.canvasMode) {
    throw new Error('piksel krever vikingskip-modus.')
  }

  const pad = renderIndent(context.indentLevel)
  return [
    emitGuard(context),
    `${pad}await __tg.putPixel(${transpileExpression(statement.x, context)}, ${transpileExpression(statement.y, context)}, __tgVars.__tgColorR, __tgVars.__tgColorG, __tgVars.__tgColorB);`,
    `${pad}__tgVars.__tgColorR = 0;`,
    `${pad}__tgVars.__tgColorG = 0;`,
    `${pad}__tgVars.__tgColorB = 0;`,
  ]
}

function emitColorRegisterStatement(
  statement: Extract<Statement, { type: 'ColorRegisterStatement' }>,
  context: TranspileContext,
): string[] {
  if (!context.canvasMode) {
    throw new Error('onsdag/torsdag/fredag krever vikingskip-modus.')
  }

  const pad = renderIndent(context.indentLevel)
  const channelVariable =
    statement.channel === 'onsdag'
      ? '__tgVars.__tgColorR'
      : statement.channel === 'torsdag'
        ? '__tgVars.__tgColorG'
        : '__tgVars.__tgColorB'

  return [emitGuard(context), `${pad}${channelVariable} = __tgClampChannel(${transpileExpression(statement.value, context)});`]
}

function emitConditionalStatement(
  statement: Extract<Statement, { type: 'ConditionalStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  const nestedContext = createChildContext(context)
  const thenLines = renderStatementBody(statement.thenBody, nestedContext)
  const lines = [emitGuard(context), `${pad}if (${transpileExpression(statement.condition, context)}) {`, ...thenLines, `${pad}}`]

  if (statement.elseBody) {
    lines[lines.length - 1] = `${pad}} else {`
    lines.push(...renderStatementBody(statement.elseBody, nestedContext), `${pad}}`)
  }

  return lines
}

function emitFunctionDeclaration(
  statement: Extract<Statement, { type: 'FunctionDeclaration' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  const signature = `async (${statement.params.join(', ')}) => {`
  const start = statement.name ? `${pad}__tgVars.${statement.name} = ${signature}` : `${pad}${signature}`
  const nestedContext = createChildContext(context, new Set<string>(statement.params))
  const end = statement.name ? `${pad}};` : `${pad}}`

  return [emitGuard(context), start, ...renderStatementBody(statement.body, nestedContext), end]
}

function emitReturnStatement(
  statement: Extract<Statement, { type: 'ReturnStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}return ${transpileExpression(statement.expression, context)};`]
}

function emitSleepStatement(
  statement: Extract<Statement, { type: 'SleepStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}await __tg.sleep((${transpileExpression(statement.duration, context)}) * 1000);`]
}

function emitThrowStatement(
  statement: Extract<Statement, { type: 'ThrowStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}throw new Error(String(${transpileExpression(statement.expression, context)}));`]
}

function emitExpressionStatement(
  statement: Extract<Statement, { type: 'ExpressionStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [emitGuard(context), `${pad}await ${transpileExpression(statement.expression, context)};`]
}

function emitKreativiaStatement(
  statement: Extract<Statement, { type: 'KreativaStatement' }>,
  context: TranspileContext,
): string[] {
  const pad = renderIndent(context.indentLevel)
  return [
    emitGuard(context),
    `${pad}await __tg.kreativia(${transpileExpression(statement.key, context)}, ${transpileExpression(statement.handler, context)});`,
  ]
}
