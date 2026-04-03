interface Example {
  id: string
  title: string
  code: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'basic-output',
    title: 'Grunnleggende output',
    code: `innsjekk

a = arne arne
b = arne arne arne

infodesk(a crew b)
infodesk rop arne arne arne

søndag`,
  },
  {
    id: 'function-and-sleep',
    title: 'Funksjon + sovetelt',
    code: `innsjekk

hylle leggsammen(a b) => {
  tech a crew b
}

infodesk(leggsammen(arne arne, arne arne arne))
sovetelt(arne) { }
infodesk rop arne arne arne arne

søndag`,
  },
  {
    id: 'rop-concat',
    title: 'rop med konkatenering',
    code: `innsjekk

infodesk rop arne crew arne arne crew arne arne arne

hylle bokstav(n) => {
  tech n
}

infodesk(bokstav( rop arne arne arne arne) crew bokstav(rop arne arne arne arne arne))

søndag`,
  },
  {
    id: 'banan',
    title: 'Banan',
    code: `innsjekk

a = arne arne
b = arne arne arne

infodesk(a crew b)
infodesk(rop arne arne crew rop arne crew rop arne arne kandu rop arne arne )
søndag`,
  },
  {
    id: 'arne-rop',
    title: 'Arne-rop',
    code: `innsjekk
infodesk(rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne)
søndag`,
  }
]
