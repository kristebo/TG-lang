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

infodesk a
infodesk b
infodesk a crew b

infodesk rop arne arne arne

søndag`,
  },
  {
    id: 'arne-rop',
    title: 'ARNE',
    code: `innsjekk
infodesk(rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne)
søndag`,
  },
  {
    id: 'banan',
    title: 'Banan',
    code: `innsjekk
infodesk(rop arne arne crew rop arne crew arne kandu rop arne)
søndag`,
  },
  {
    id: 'function-and-sleep',
    title: 'Hylle + Sovetelt',
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
    title: 'Secbua/Ombud (if-else)',
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
    id: 'arnebanan',
    title: 'Arne Banan (fizzbuzz)',
    code: `innsjekk
arnetekst = rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne
banan = rop arne arne crew rop arne crew arne kandu rop arne

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
    id: 'pall-runtime',
    title: 'Pall (tilfeldige tall)',
    code: `innsjekk

hylle tilfeldigArne(min, maks) => {
    tilfeldig = pall
    tilfeldig = (tilfeldig crew arne medic arne arne) kandu (maks deltager min)
    tilfeldig = tilfeldig deltager tilfeldig kandustyre arne
    tech min crew tilfeldig deltager arne
}

infodesk tilfeldigArne(arne, arne arne arne arne)
søndag`,
  },
  {
    id: 'vikingskip-canvas',
    title: 'Vikingskip+Hovedscene (canvas)',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne

arneMaks = arne arne arne arne kandu arne arne arne arne

onsdag arneMaks
piksel(arne, arne)
torsdag arneMaks
piksel(arne arne, arne arne)
fredag arneMaks
piksel(arne arne arne, arne arne arne)
onsdag arneMaks
torsdag arneMaks
fredag arneMaks
piksel(arne arne arne arne, arne arne arne arne)

søndag`,
  },
  {
    id: 'vikingskip-fargetegning',
    title: 'Vikingskip Div. Farger',
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
    id: 'vikingskip-tg-logo',
    title: 'Vikingskip TG-Logo',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

arneHel = arne arne arne arne kandu arne arne arne arne
arneHalv = arne arne arne arne kandu arne arne
arneKvart = arne arne arne arne

arneIngen = arne deltager arne
arneLitt = arne arne
arneMye = arneHel crew arneLitt
arneMasse = arneHel crew arneHalv

arneBak = arne deltager arneLitt

arneBort = arneIngen
arneDit = arneHalv deltager arne

hylle g(x, y) => {
    onsdag arneKvart crew arne
    torsdag arneHalv
    fredag arneHel
    piksel(x crew arneBort, y crew arneDit)
}

hylle skrå(x, y, arner, arneHvor, onsdager, torsdager, fredager) => {
    secbua (arner kanalseks arneIngen) {
        tech arne
    }

    onsdag onsdager
    torsdag torsdager
    fredag fredager

    piksel(x crew arneBort, y crew arneDit)
    
    secbua(arner kandustyre arneLitt kanalseks arne) {
        skrå(x crew arneHvor, y, arner deltager arne, arneHvor, onsdager, torsdager, fredager)
    } ombud {
        skrå(x, y crew arne, arner deltager arne, arneHvor, onsdager, torsdager, fredager)
    }
}

skrå(arneHel, arne, arneMye crew arneHalv crew arneKvart, arneBak, arneHel, arneHalv, arneIngen)
skrå(arneHalv crew arne, arneHalv, arneMye, arne, arneHel, arneHalv, arneIngen)

piksel(arneIngen, arneIngen)

g(arneMasse, arne)
g(arneMasse crew arne, arne)
g(arneMasse crew arneLitt, arne)
g(arneMasse crew arneLitt crew arne, arne)
g(arneMasse crew arneKvart, arne)
g(arneMasse crew arneKvart crew arne, arne)

skrå(arneMasse deltager arne, arne, arneHel, arneBak, arneKvart crew arne, arneHalv, arneHel)
skrå(arneHel, arneHalv, arneHel, arne, arneKvart crew arne, arneHalv, arneHel)
skrå(arneMasse crew arneHalv deltager arne, arneHalv, arneHel, arneBak, arneKvart crew arne, arneHalv, arneHel)

g(arneMasse crew arneKvart crew arneLitt, arneHalv)
g(arneMasse crew arneKvart crew arne, arneHalv)
g(arneMasse crew arneKvart, arneHalv)
g(arneMasse crew arneLitt crew arne, arneHalv)
g(arneMasse crew arneLitt, arneHalv)
g(arneMasse crew arne, arneHalv)
g(arneMasse, arneHalv)
g(arneMasse deltager arne, arneHalv)
g(arneMasse deltager arneLitt, arneHalv)
g(arneMasse deltager arneLitt deltager arne, arneHalv)
g(arneMasse deltager arne, arneHalv crew arne)
g(arneMasse deltager arneLitt, arneHalv crew arne)
g(arneMasse deltager arne, arneHalv crew arneLitt)
g(arneMasse, arneHalv crew arneLitt)
g(arneMasse, arneHalv crew arneLitt crew arne)

søndag`
  },
  {
    id: 'vikingskip-trig-sirkel',
    title: 'Vikingskip Trig-sirkel',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

l = arne deltager arne
en = arne
to = arne arne
tre = arne arne arne
fire = to kandu to
seks = tre kandu to
atte = fire kandu to
seksten = atte kandu to
tjuefire = seksten crew atte
femten = seksten deltager en

senter = atte
radius = seks

halvpi = premiumparkering medic to
topi = premiumparkering kandu to
steg = topi medic tjuefire

hylle tegn(vinkel teller) => {
  secbua (teller) {
    x = senter crew (radius kandu expo(vinkel))
    y = senter crew (radius kandu expo(vinkel crew halvpi))

    onsdag femten
    torsdag seksten deltager fire
    fredag femten
    piksel(x, y)

    tegn(vinkel crew steg, teller deltager en)
  } ombud {
  }
}

tegn(l, tjuefire)
søndag`,
  },
  {
    id: 'noc-seating-teksthjul',
    title: 'Noc + Seating Teksthjul',
    code: `innsjekk

en = arne
to = arne arne
tre = arne arne arne
fire = arne arne arne arne

kilde = rop arne crew rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne crew rop arne arne arne arne arne arne arne arne  arne arne arne arne arne arne crew rop arne arne arne arne arne
hjul = seating fire

hjul noc en = kilde noc fire
hjul noc to = kilde noc tre
hjul noc tre = kilde noc to
hjul noc fire = kilde noc en

infodesk kilde
infodesk lørdag hjul

søndag`,
  },
  {
    id: 'bubble-sort-562930',
    title: 'Bubble Sort (viser steg)',
    code: `innsjekk

l = arne deltager arne
en = arne
to = arne arne
tre = arne arne arne
fire = arne arne arne arne
fem = arne arne arne arne arne
seks = tre kandu to
ni = tre kandu tre

tall = seating seks
tall noc en = fem
tall noc to = seks
tall noc tre = to
tall noc fire = ni
tall noc fem = tre
tall noc seks = l

infodesk(lørdag tall)

hylle bytt(arr i j) => {
  temp = arr noc (i crew en)
  arr noc (i crew en) = arr noc (j crew en)
  arr noc (j crew en) = temp
  infodesk(lørdag arr)
}

hylle bobleinner(arr j grense) => {
  secbua (j foam grense) {
    venstre = arr noc (j crew en)
    hoyre = arr noc (j crew to)

    secbua (hoyre foam venstre) {
      bytt(arr, j, j crew en)
    } ombud {
    }

    bobleinner(arr, j crew en, grense)
  } ombud {
  }
}

hylle bobleytre(arr grense) => {
  secbua (grense maof l) {
    bobleinner(arr, l, grense)
    bobleytre(arr, grense deltager en)
  } ombud {
  }
}

bobleytre(tall, seks deltager en)

søndag`,
  },
  {
    id: 'kreativia-keyboard',
    title: 'Kreativia (keyboard input)',
    code: `innsjekk

hylle tastetrykk(tast) => {
  infodesk(tast)
}

kreativia rop arne tastetrykk

søndag`,
  },
  {
    id: 'vikingskip-wasd',
    title: 'WASD Piksel',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

storrelse = arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne
midt = arne arne arne arne arne arne arne arne
posx = midt
posy = midt
en = arne

hylle tegn() => {
  onsdag storrelse deltager en
  torsdag storrelse deltager en
  fredag storrelse deltager en
  piksel(posx, posy)
}

hylle vis() => {
  tegn()
}

hylle venstre(tast) => {
  secbua (posx maof arne deltager arne) {
    piksel(posx, posy)
    posx = posx deltager en
  } ombud {
  }
  vis()
}

hylle hoyre(tast) => {
  secbua (posx foam storrelse deltager en) {
    piksel(posx, posy)
    posx = posx crew en
  } ombud {
  }
  vis()
}

hylle opp(tast) => {
  secbua (posy maof arne deltager arne) {
    piksel(posx, posy)
    posy = posy deltager en
  } ombud {
  }
  vis()
}

hylle ned(tast) => {
  secbua (posy foam storrelse deltager en) {
    piksel(posx, posy)
    posy = posy crew en
  } ombud {
  }
  vis()
}

vis()
kreativia rop arne venstre
kreativia rop arne arne arne arne hoyre
kreativia rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne opp
kreativia rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne ned

søndag`,
  },
  {
    id: 'vikingskip-snake',
    title: 'Snake I Vikingskip',
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne
arneMapSize = arne arne arne arne kandu arne arne arne arne
arneMaksFarge = arne arne arne arne kandu arne arne arne arne

arneMap = seating arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

hylle lagArneMap(map, arner, arneIterasjon) => {
    map noc arneIterasjon = seating arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne
    secbua(arneIterasjon foam arner) {
        lagArneMap(map, arner, arneIterasjon crew arne)
    }
}

lagArneMap(arneMap, arneMapSize, arne)

opp = arne
høyre = arne arne
ned = arne arne arne
venstre = arne arne arne arne

arneIngen = arne deltager arne
arneBak = arneIngen deltager arne

hvorLangErArne = arne arne
hvorSkalArne = høyre

hylle tilfeldigArne(min, maks) => {
    tilfeldig = pall
    tilfeldig = (tilfeldig kandu (maks deltager min)) crew arne medic arne arne
    tilfeldig = tilfeldig deltager tilfeldig kandustyre arne
    tech min crew tilfeldig
}

hylle lagMatenTilArne(map, arneForTjukkForsøk) => {
    epleX = tilfeldigArne(arne, arneMapSize)
    epleY = tilfeldigArne(arne, arneMapSize)

    epleXMap = map noc epleX
    hvaSpiserEple = epleXMap noc epleY

    secbua(hvaSpiserEple maof arneIngen) {
        secbua(arneForTjukkForsøk foam arne arne arne) {
            tech lagMatenTilArne(map, arneForTjukkForsøk crew arne)
        }

        tech arneBak
    }

    epleXMap noc epleY = arneBak
}

spawn = arneMap noc arne arne arne arne arne
spawn noc arne arne = hvorLangErArne
spawn noc arne arne arne = hvorLangErArne deltager arne

secbua(lagMatenTilArne(arneMap, arneIngen) kanalseks arneBak) {
    spawn noc arne arne arne arne arne arne arne = arneBak
}

hylle tegnArne(map, newMap, arneX, arneY) => {
    gammelArneXMap = map noc arneX
    arneXMap = newMap noc arneX

    hvaErArne = gammelArneXMap noc arneY

    secbua(hvaErArne kanalseks arneBak) {
        fantViEple = arne
        onsdag arneMaksFarge
        torsdag arneIngen
        fredag arneIngen
        piksel(arneX deltager arne, arneY deltager arne)
    } ombud {
        secbua(hvaErArne maof arneIngen) {
            secbua(hvaErArne kanalseks hvorLangErArne) {
                onsdag arne arne arne
                torsdag arneMaksFarge deltager arne arne arne arne
                piksel(arneX deltager arne, arneY deltager arne)

                fantViArne = arne
                hvorErArneX = arneX
                hvorErArneY = arneY

                arneBort = arneIngen
                arneDit = arneIngen

                secbua(hvorGårArne kanalseks opp) {
                    arneDit = arneBak
                } ombud {
                    secbua(hvorGårArne kanalseks høyre) {
                        arneBort = arne
                    } ombud {
                        secbua(hvorGårArne kanalseks ned) {
                            arneDit = arne
                        } ombud {
                            arneBort = arneBak
                        }
                    }
                }

                nyArneX = arneX crew arneBort
                nyArneY = arneY crew arneDit

                nyArneXMap = newMap noc nyArneX
                hvaSpiserArne = nyArneXMap noc nyArneY

                secbua(hvaSpiserArne kanalseks arneBak) {
                    harArneSpistMat = arne
                    hvorLangErArne = hvorLangErArne crew arne

                    secbua(lagMatenTilArne(newMap, arneIngen) kanalseks arneBak) {
                        feitEpleXMap = newMap noc arne
                        secbua(arneX kanalseks arne) {
                            feitEpleXMap = newMap noc arne arne
                        }
                        feitEpleXMap noc arne = arneBak
                    }
                }

                secbua(hvaSpiserArne maof arne) {
                    secbua(hvaSpiserArne foam hvorLangErArne) {
                        fantViArne = arneBak
                    }
                } ombud {
                    secbua(nyArneXMap) {
                        nyArneXMap noc nyArneY = hvorLangErArne
                    }
                }
            } ombud {
                torsdag arneMaksFarge medic arne arne
                piksel(arneX deltager arne, arneY deltager arne)
            }

            secbua(harArneSpistMat kanalseks arneBak) {
                secbua(arneXMap) {
                    secbua(erArneDød kanalseks arne) {} ombud {
                        arneXMap noc arneY = hvaErArne deltager arne
                    }
                }
            }
        } ombud {
            secbua(arneErDød kanalseks arne) {
                onsdag arneMaksFarge medic arne arne
                piksel(arneX deltager arne, arneY deltager arne)
            } ombud {
                onsdag arne arne arne
                torsdag arne arne arne
                fredag arne arne arne
                piksel(arneX deltager arne, arneY deltager arne)
            }
        }
    }

    secbua(arneX foam arneMapSize) {
        tegnArne(map, newMap, arneX crew arne, arneY)
    } ombud {
        secbua(arneY foam arneMapSize) {
            tegnArne(map, newMap, arneIngen, arneY crew arne)
        }
    }

    tech newMap
}

hylle kopierArne(arr, i, init, depth) => {
    secbua(init kanalseks arne) {
        arneKopi = seating arneMapSize
        secbua(depth kanalseks arneIngen) {
            foreløpigArne = arneKopi
        }
    }

    secbua(depth kanalseks arneIngen) {
        foreløpigArne noc i = kopierArne(arr noc i, arneIngen, arne, arne)
    } ombud {
        arneKopi noc i = arr noc i
    }

    secbua(i foam arneMapSize) {
        kopierArne(arr, i crew arne, arneIngen, depth)
    }

    secbua(depth kanalseks arneIngen) {
        tech foreløpigArne
    } ombud {
        tech arneKopi
    }
}

hylle snake() => {
    hvorGårArne = hvorSkalArne
    harArneSpistMat = arneBak

    fantViArne = arneBak
    fantViEple = arneBak

    arneMapKopi = kopierArne(arneMap, arne, arne, arneIngen)
    gammelArneMap = arneMap
    arneMap = tegnArne(arneMap, arneMapKopi, arne, arne)
    
    secbua(fantViArne kanalseks arne) {
        sovetelt(arne medic (arne arne arne kandu arne arne arne))
        secbua(fantViEple kanalseks arneBak) {
            lagMatenTilArne(arneMap, arneIngen)
        }

        snake()
    } ombud {
        harArneSpistMat = arne
        arneErDød = arne
        tegnArne(gammelArneMap, arneMap, arne, arne)
        attentiongrab(rop arne arne crew rop arne crew arne kandu rop arne)
    }
}

hylle arneOpp() => {
    secbua(hvorGårArne kanalseks ned) {
        tech arne
    }
    hvorSkalArne = opp
}

hylle arneHøyre() => {
    secbua(hvorGårArne kanalseks venstre) {
        tech arne
    }
    hvorSkalArne = høyre
}

hylle arneNed() => {
    secbua(hvorGårArne kanalseks opp) {
        tech arne
    }
    hvorSkalArne = ned
}

hylle arneVenstre() => {
    secbua(hvorGårArne kanalseks høyre) {
        tech arne
    }
    hvorSkalArne = venstre
}

kreativia rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arneOpp
kreativia rop arne arne arne arne arneHøyre
kreativia rop arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arneNed
kreativia rop arne arneVenstre

snake()

søndag`,
  },
  {
    id: 'rop-concat',
    title: 'Rop med konkatenering',
    code: `innsjekk

infodesk rop arne crew arne arne crew arne arne arne

hylle bokstav(n) => {
  tech n
}

infodesk(bokstav( rop arne arne arne arne) crew bokstav(rop arne arne arne arne arne))

søndag`,
  },
  {
    id: 'rekursiv-funksjon',
    title: 'Rekursiv Funksjon (loop)',
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
    id: `mandelbrot`,
    title: 'Mandelbrot (tekst)',
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
    "title": "Mandelbrot (vikingskip)",
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
    "title": "Julia-sett (vikingskip)",
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
    fredag seksten
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
    id: 'small-html',
    title: "SmallHTML (TG26, 967 bytes)",
    code: `vikingskip
innsjekk
hovedscene arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne arne

arneMaksFarge = arne arne arne arne kandu arne arne arne arne
arneMapSize = arneMaksFarge crew arne arne arne arne
arneIngen = arne deltager arne
arneFaktor = arne medic (arne arne kandu arne arne)

hylle tegnArne(x, y) => {
    hvorGrønnErArne = expo(expo(x kandu arneFaktor) crew arneGammel crew expo(y kandu arneFaktor))
    hvorGrønnErArne = hvorGrønnErArne kandu arneMaksFarge
    torsdag hvorGrønnErArne
    piksel(x deltager arne, y deltager arne)

    secbua(x foam arneMapSize) {
        tegnArne(x crew arne, y)
    } ombud {
        secbua(y foam arneMapSize) {
            tegnArne(arneIngen, y crew arne)
        }
    }
}

hylle demo() => {
    tegnArne(arneIngen, arneIngen)
    sovetelt(arneFaktor medic arne arne)
    arneGammel = arneGammel crew arne medic arne arne arne
    demo()
}

arneGammel = arne
demo()
søndag`
  }
]