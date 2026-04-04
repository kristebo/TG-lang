interface Example {
  id: string
  title: string
  code: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'pall-runtime',
    title: 'pall runtime-verdi',
    code: `innsjekk

infodesk pall
infodesk pall

søndag`,
  },
  {
    id: 'vikingskip-canvas',
    title: 'Vikingskip canvas',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

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
  },
  {
    id: `mandelbrot`,
    title: 'Mandelbrot',
    code: `innsjekk

l = arne deltager arne
en = arne
to = arne arne
tre = arne arne arne
fire = arne arne arne arne
fem = arne arne arne arne arne

seks = tre kandu to
atte = fire kandu to
ti = fem kandu to
tolv = ti crew to
seksten = atte kandu to
tjue = ti kandu to
tretti = ti kandu tre
forti = tjue kandu to
seksti = tretti kandu to
atti = forti kandu to

skala = ti
bredde = atti
hoyde = forti
maksiter = seksten

xmin = l deltager tjue
ymin = l deltager ti

xsteg = en
ysteg = en


xtegn = rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne 

underscore = rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

hylle mul(a b) => {
  tech a kandu b medic skala
}

hylle mandel(cx cy zx zy left) => {

  xx = mul(zx, zx)
  yy = mul(zy, zy)
  mag = xx crew yy

  secbua (mag maof (fire kandu skala)) {
    tech l
  } ombud {

    secbua (left) {

      nyzx = xx deltager yy crew cx
      nyzy = mul(to kandu zx, zy) crew cy

      tech mandel(cx, cy, nyzx, nyzy, left deltager en)

    } ombud {
      tech en
    }
  }
}

hylle p(cx cy) => {
  m = mandel(cx, cy, l, l, maksiter)
  secbua (m) {
    tech xtegn
  } ombud {
    tech underscore
  }
}

hylle rad(count cx cy) => {
  secbua (count kanalseks en) {
    tech p(cx, cy)
  } ombud {
    tech p(cx, cy) crew rad(count deltager en, cx crew xsteg, cy)
  }
}

hylle render(rowsleft cy) => {
  secbua (rowsleft) {
    infodesk(rad(bredde, xmin, cy))
    render(rowsleft deltager en, cy crew ysteg)
  } ombud {
  }
}

render(hoyde, ymin)

søndag`
  }
]
