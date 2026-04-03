interface Example {
  id: string
  title: string
  code: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'vikingskip-canvas',
    title: 'Vikingskip canvas',
    code: `vikingskip
innsjekk
opplosning arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

piksel(arne, arne)
piksel(arne arne, arne arne)
piksel(arne arne arne, arne arne arne)
piksel(arne arne arne arne, arne arne arne arne)

infodesk rop arne arne arne
søndag`,
  },
    {
    id: 'arne-rop',
    title: 'Arne-rop',
    code: `innsjekk
infodesk(rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne)
søndag`,
  },
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
    id: 'simple-branching',
    title: 'Enkel secbua/ombud branching',
    code: `innsjekk

a = arne arne
b = arne arne

secbua (a kanalseks b) {
  infodesk(rop arne arne arne arne)
} ombud {
  infodesk(rop arne arne arne arne arne)
}

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
    id: 'rekursiv-funksjon',
    title: 'Rekursiv funksjon',
    code: `innsjekk

hylle leggsammen(a) => {
  infodesk a
  sovetelt(arne)
  leggsammen(a crew rop arne)
}
leggsammen(rop arne)

søndag`,
  },
  {
    id: 'arnebanan',
    title: 'Arne Banan (fizz buzz-variant)',
    code: `innsjekk
arnetekst = rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne
banan = rop arne arne crew rop arne crew rop arne arne kandu rop arne arne

hylle arnebanan(a) => {
    secbua (a kandustyre arne arne arne arne arne kanalseks arne deltager arne) {
        secbua (a kandustyre arne arne arne kanalseks arne deltager arne) {
            infodesk(arnetekst crew banan)
        } ombud {
            infodesk(banan)
        }
    } ombud {
        secbua(a kandustyre arne arne arne kanalseks arne deltager arne) {
            infodesk(arnetekst)
        } ombud {
            infodesk(a)
        }
    }

    sovetelt(arne medic arne arne arne arne)
    arnebanan(a crew arne)
}
arnebanan(arne)
søndag`
  }
]
