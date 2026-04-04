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
    id: 'vikingskip-fargetegning',
    title: 'Vikingskip fargetegning',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

full = arne arne arne arne kandu arne arne arne arne deltager arne
halv = full medic arne arne

onsdag full
piksel(arne arne, arne arne)

torsdag full
piksel(arne arne arne, arne arne)

fredag full
piksel(arne arne arne arne, arne arne)

onsdag full
torsdag full
piksel(arne arne arne arne arne, arne arne)

onsdag halv
torsdag halv
fredag full
piksel(arne arne arne, arne arne arne)

onsdag full
fredag halv
piksel(arne arne arne arne, arne arne arne)

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
  },
  {
    "id": "Mandelbrot-vikingskip",
    "title": "Mandelbrot i vikingskip",
    "code": `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

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
tjuefire = tjue crew fire
tretti = ti kandu tre
forti = tjue kandu to
seksti = tretti kandu to
atti = forti kandu to
hundre = ti kandu ti
hundretjue = hundre crew tjue
hundrenitten = hundretjue deltager en

skala = forti
maksiter = tjuefire

xmin = l deltager atti
ymin = l deltager seksti

xsteg = en
ysteg = en

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

hylle p(sx sy cx cy) => {
  onsdag seksten deltager arne
  torsdag seksten medic arne arne
  fredag arne deltager arne
  m = mandel(cx, cy, l, l, maksiter)
  secbua (m) {
    piksel(sx, sy)
  } ombud {
  }
}

hylle rad(x sx sy cx cy) => {
  secbua (hundretjue maof x) {
    p(sx, sy, cx, cy)
    rad(x crew en, sx crew en, sy, cx crew xsteg, cy)
  } ombud {
  }
}

hylle render(y sy cy) => {
  secbua (hundretjue maof y) {
    rad(l, l, sy, xmin, cy)
    render(y crew en, sy crew en, cy crew ysteg)
  } ombud {
  }
}

render(l, l, ymin)

søndag`
  },
  {
    "id": "Julia-sett vikingskip",
    "title": "Julia-sett i vikingskip",
    "code": `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

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
tjueatte = tjue crew atte
tjuefire = tjue crew fire
tretti = ti kandu tre
forti = tjue kandu to
seksti = tretti kandu to
atti = forti kandu to
hundre = ti kandu ti
hundretjue = hundre crew tjue

skala = forti
maksiter = tjuefire

xmin = l deltager seksti
ymin = l deltager seksti

xsteg = en
ysteg = en

juliax = l deltager tjueatte
juliay = tolv

hylle mul(a b) => {
  tech a kandu b medic skala
}

hylle julia(zx zy cx cy left) => {
  xx = mul(zx, zx)
  yy = mul(zy, zy)
  mag = xx crew yy

  secbua (mag maof (fire kandu skala)) {
    tech l
  } ombud {
    secbua (left) {
      nyzx = xx deltager yy crew cx
      nyzy = mul(to kandu zx, zy) crew cy
      tech julia(nyzx, nyzy, cx, cy, left deltager en)
    } ombud {
      tech en
    }
  }
}

hylle p(sx sy px py) => {
  m = julia(px, py, juliax, juliay, maksiter)
  secbua (m) {
    piksel(sx, sy)
  } ombud {
  }
}

hylle rad(x sx sy px py) => {
  secbua (hundretjue maof x) {
    p(sx, sy, px, py)
    rad(x crew en, sx crew en, sy, px crew xsteg, py)
  } ombud {
  }
}

hylle render(y sy py) => {
  secbua (hundretjue maof y) {
    rad(l, l, sy, xmin, py)
    render(y crew en, sy crew en, py crew ysteg)
  } ombud {
  }
}

render(l, l, ymin)

søndag`
  },
  {
    "id": "Snake vikingskip",
    "title": "Snake i vikingskip",
    "code": `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

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
trettini = forti deltager en

hylle snake(x y dir) => {
  secbua (y foam forti) {
    piksel(x, y)
    sovetelt(en medic ti)

    secbua (dir) {
      secbua (x foam trettini) {
        snake(x crew en, y, dir)
      } ombud {
        snake(x, y crew en, l)
      }
    } ombud {
      secbua (x maof l) {
        snake(x deltager en, y, dir)
      } ombud {
        snake(x, y crew en, en)
      }
    }
  } ombud {
  }
}

snake(l, l, en)

søndag`
  }
]
