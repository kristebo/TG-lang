# TG-lang MVP (TypeScript)

Web-based MVP of TG-lang with:

- Tokenizer
- Recursive-descent parser (AST)
- Transpiler to JavaScript
- Browser runtime execution
- Simple web IDE

## Run

1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev

3. Build for production:
   npm run build

## Implemented Language Features

- `arne` sequence -> numeric value (count of `arne`)
- `rop arne...` -> uppercase ASCII (`String.fromCharCode(count + 64)`)
- `pall` -> runtime-generated number where `| 1` is applied to the integer part and the fractional part is preserved
- `infodesk expr` or `infodesk(expr)` -> `console.log(expr)`
- Operators: `crew`, `deltager`, `kandu`, `medic`
- Equality: `kanalseks` -> `===`
- Conditional branching: `secbua (condition) { ... }` with optional `ombud { ... }`
- Functions: `hylle name(a b) => { ... }`
- Return: `tech expr`
- Sleep: `sovetelt(expr) { }`
- Error: `attentiongrab(expr)`
- Program framing: `innsjekk` ... `søndag`

## Included Examples

The web IDE includes at least two runnable examples:

- Basic output
- Function and sleep
- Error example for validation
