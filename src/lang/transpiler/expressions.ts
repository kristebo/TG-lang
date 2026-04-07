import type { Expression } from '../ast'
import type { TranspileContext } from './context'
import { resolveBinding } from './context'

export function transpileExpression(expression: Expression, context: TranspileContext): string {
  switch (expression.type) {
    case 'NumberLiteral':
      return `${expression.value}`
    case 'Identifier':
      return resolveBinding(expression.name, context)
    case 'BinaryExpression':
      return `(${transpileExpression(expression.left, context)} ${expression.operator} ${transpileExpression(expression.right, context)})`
    case 'RopExpression':
      return transpileRop(expression.expression, context)
    case 'LordagExpression':
      return `(${transpileExpression(expression.expression, context)}).join('')`
    case 'PallExpression':
      return '__tg.pall()'
    case 'PiExpression':
      return 'Math.PI'
    case 'TrigExpression':
      return expression.fn === 'sin'
        ? `Math.sin(${transpileExpression(expression.angle, context)})`
        : `Math.tan(${transpileExpression(expression.angle, context)})`
    case 'SeatingExpression':
      return emitSeatingExpression(expression, context)
    case 'NocExpression':
      return emitNocExpression(expression, context)
    case 'CallExpression':
      return emitCallExpression(expression, context)
  }
}

function emitSeatingExpression(
  expression: Extract<Expression, { type: 'SeatingExpression' }>,
  context: TranspileContext,
): string {
  return `(() => {
  const __tgLength = Math.max(0, Math.floor(${transpileExpression(expression.length, context)}))
  const __tgValues = [${expression.elements.map((element) => transpileExpression(element, context)).join(', ')}]
  const __tgArray = Array(__tgLength)
  __tgValues.slice(0, __tgLength).forEach((__tgValue, __tgIndex) => {
    __tgArray[__tgIndex] = __tgValue
  })
  return __tgArray
})()`
}

function emitNocExpression(
  expression: Extract<Expression, { type: 'NocExpression' }>,
  context: TranspileContext,
): string {
  return `(() => {
  const __tgTarget = ${transpileExpression(expression.target, context)}
  const __tgIndex = Math.max(0, Math.floor(${transpileExpression(expression.index, context)}) - 1)
  return typeof __tgTarget === 'string' ? __tgTarget.charAt(__tgIndex) : __tgTarget?.[__tgIndex]
})()`
}

function emitCallExpression(
  expression: Extract<Expression, { type: 'CallExpression' }>,
  context: TranspileContext,
): string {
  return `(await ${transpileExpression(expression.callee, context)}(${expression.args
    .map((arg) => transpileExpression(arg, context))
    .join(', ')}))`
}

function transpileRop(expression: Expression, context: TranspileContext): string {
  if (expression.type === 'NumberLiteral') {
    return `String.fromCharCode(${expression.value} + 64)`
  }

  if (expression.type === 'BinaryExpression' && expression.operator === '+') {
    return `(${transpileRop(expression.left, context)} + ${transpileRop(expression.right, context)})`
  }

  return `(${transpileExpression(expression, context)})`
}
