import type { Expression, Program, Statement } from './ast'

interface TranspileContext {
  localBindings: Set<string>
  indentLevel: number
  canvasMode: boolean
}

const INDENT = '  '

const renderIndent = (level: number): string => INDENT.repeat(level)

export function transpile(program: Program): string {
  const context: TranspileContext = {
    localBindings: new Set<string>(),
    indentLevel: 0,
    canvasMode: program.mode === 'canvas',
  }

  const prelude: string[] = ['const __tgVars = Object.create(null);']
  if (program.mode === 'canvas') {
    const resolution = Math.max(1, program.resolution ?? 16)
    prelude.push('__tg.ensureActive();')
    prelude.push(`await __tg.initCanvas(${resolution});`)
    prelude.push('__tgVars.__tgColorR = 0;')
    prelude.push('__tgVars.__tgColorG = 0;')
    prelude.push('__tgVars.__tgColorB = 0;')
    prelude.push('const __tgClampChannel = (value) => Math.min(15, Math.max(0, Math.floor(value)));')
  }

  const lines = [...prelude, ...program.body.flatMap((statement) => transpileStatement(statement, context))]
  return lines.join('\n')
}

function transpileStatement(statement: Statement, context: TranspileContext): string[] {
  const pad = renderIndent(context.indentLevel)
  const guard = `${pad}__tg.ensureActive();`

  switch (statement.type) {
    case 'AssignmentStatement': {
      const target = context.localBindings.has(statement.name) ? statement.name : `__tgVars.${statement.name}`
      return [guard, `${pad}${target} = ${transpileExpression(statement.value, context)};`]
    }
    case 'IndexedAssignmentStatement': {
      const target = context.localBindings.has(statement.name) ? statement.name : `__tgVars.${statement.name}`
      return [guard, `${pad}${target}[Math.floor(${transpileExpression(statement.index, context)} - 1)] = ${transpileExpression(statement.value, context)};`]
    }
    case 'InfodeskStatement':
      return [guard, `${pad}console.log(${transpileExpression(statement.expression, context)});`]
    case 'PixelStatement': {
      if (!context.canvasMode) {
        throw new Error('piksel krever vikingskip-modus.')
      }
      return [
        guard,
        `${pad}await __tg.putPixel(${transpileExpression(statement.x, context)}, ${transpileExpression(statement.y, context)}, __tgVars.__tgColorR, __tgVars.__tgColorG, __tgVars.__tgColorB);`,
        `${pad}__tgVars.__tgColorR = 0;`,
        `${pad}__tgVars.__tgColorG = 0;`,
        `${pad}__tgVars.__tgColorB = 0;`,
      ]
    }
    case 'ColorRegisterStatement': {
      if (!context.canvasMode) {
        throw new Error('onsdag/torsdag/fredag krever vikingskip-modus.')
      }
      const channelVariable =
        statement.channel === 'onsdag' ? '__tgVars.__tgColorR' : statement.channel === 'torsdag' ? '__tgVars.__tgColorG' : '__tgVars.__tgColorB'
      return [guard, `${pad}${channelVariable} = __tgClampChannel(${transpileExpression(statement.value, context)});`]
    }
    case 'ConditionalStatement': {
      const nestedContext: TranspileContext = {
        localBindings: context.localBindings,
        indentLevel: context.indentLevel + 1,
        canvasMode: context.canvasMode,
      }

      const thenLines =
        statement.thenBody.length > 0
          ? statement.thenBody.flatMap((inner) => transpileStatement(inner, nestedContext))
          : [`${renderIndent(context.indentLevel + 1)}/* empty */`]

      const lines = [guard, `${pad}if (${transpileExpression(statement.condition, context)}) {`, ...thenLines, `${pad}}`]

      if (statement.elseBody) {
        const elseLines =
          statement.elseBody.length > 0
            ? statement.elseBody.flatMap((inner) => transpileStatement(inner, nestedContext))
            : [`${renderIndent(context.indentLevel + 1)}/* empty */`]
        lines[lines.length - 1] = `${pad}} else {`
        lines.push(...elseLines, `${pad}}`)
      }

      return lines
    }
    case 'FunctionDeclaration': {
      const signature = `async (${statement.params.join(', ')}) => {`
      const start = statement.name
        ? `${pad}__tgVars.${statement.name} = ${signature}`
        : `${pad}${signature}`

      const nestedContext: TranspileContext = {
        localBindings: new Set<string>(statement.params),
        indentLevel: context.indentLevel + 1,
        canvasMode: context.canvasMode,
      }

      const bodyLines =
        statement.body.length > 0
          ? statement.body.flatMap((inner) => transpileStatement(inner, nestedContext))
          : [`${renderIndent(context.indentLevel + 1)}/* empty */`]

      const end = statement.name ? `${pad}};` : `${pad}}`
      return [guard, start, ...bodyLines, end]
    }
    case 'ReturnStatement':
      return [guard, `${pad}return ${transpileExpression(statement.expression, context)};`]
    case 'SleepStatement':
      return [
        guard,
        `${pad}await __tg.sleep((${transpileExpression(statement.duration, context)}) * 1000);`,
      ]
    case 'ThrowStatement':
      return [guard, `${pad}throw new Error(String(${transpileExpression(statement.expression, context)}));`]
    case 'ExpressionStatement':
      return [guard, `${pad}await ${transpileExpression(statement.expression, context)};`]
    case 'KreativaStatement':
      return [
        guard,
        `${pad}await __tg.kreativia(${transpileExpression(statement.key, context)}, ${transpileExpression(statement.handler, context)});`,
      ]
  }
}

function transpileExpression(expression: Expression, context: TranspileContext): string {
  switch (expression.type) {
    case 'NumberLiteral':
      return `${expression.value}`
    case 'Identifier':
      return context.localBindings.has(expression.name) ? expression.name : `__tgVars.${expression.name}`
    case 'BinaryExpression':
      return `(${transpileExpression(expression.left, context)} ${expression.operator} ${transpileExpression(expression.right, context)})`
    case 'RopExpression':
      return transpileRop(expression.expression, context)
    case 'LordagExpression':
      return `(${transpileExpression(expression.expression, context)}).join('')`
    case 'PallExpression':
      return `__tg.pall()`
    case 'PiExpression':
      return `Math.PI`
    case 'TrigExpression':
      return expression.fn === 'sin'
        ? `Math.sin(${transpileExpression(expression.angle, context)})`
        : `Math.tan(${transpileExpression(expression.angle, context)})`
    case 'SeatingExpression':
      return `(() => {
  const __tgLength = Math.max(0, Math.floor(${transpileExpression(expression.length, context)}))
  const __tgValues = [${expression.elements.map((element) => transpileExpression(element, context)).join(', ')}]
  const __tgArray = Array(__tgLength)
  __tgValues.slice(0, __tgLength).forEach((__tgValue, __tgIndex) => {
    __tgArray[__tgIndex] = __tgValue
  })
  return __tgArray
})()`
    case 'NocExpression':
      return `(() => {
  const __tgTarget = ${transpileExpression(expression.target, context)}
  const __tgIndex = Math.max(0, Math.floor(${transpileExpression(expression.index, context)}) - 1)
  return typeof __tgTarget === 'string' ? __tgTarget.charAt(__tgIndex) : __tgTarget?.[__tgIndex]
})()`
    case 'CallExpression':
      return `(await ${transpileExpression(expression.callee, context)}(${expression.args
        .map((arg) => transpileExpression(arg, context))
        .join(', ')}))`
  }
}

/**
 * Recursively transpile a rop-inner expression:
 * - crew (+) at any level => string concatenation between two chars/groups
 * - any other binary op   => numeric computation, then one fromCharCode
 * - NumberLiteral          => String.fromCharCode(n + 64)
 */
function transpileRop(expression: Expression, context: TranspileContext): string {
  if (expression.type === 'NumberLiteral') {
    return `String.fromCharCode(${expression.value} + 64)`
  }
  if (expression.type === 'BinaryExpression' && expression.operator === '+') {
    return `(${transpileRop(expression.left, context)} + ${transpileRop(expression.right, context)})`
  }
  return `(${transpileExpression(expression, context)})`
}
