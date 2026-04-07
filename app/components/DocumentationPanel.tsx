export function DocumentationPanel() {
  return (
    <section className="panel spec">
      <div className="panel-heading">
        <h2>TG-lang sprakdefinisjon</h2>
        <p className="panel-meta">Sprakregler og runtime-referanse.</p>
      </div>

      <a href="https://github.com/kristebo/TG-lang" target="_blank" rel="noopener noreferrer">
        Full TG-lang spesifikasjon pa GitHub
      </a>

      <h3>Programstruktur</h3>
      <ul>
        <li>
          Et program starter med <strong>innsjekk</strong> og avsluttes med <strong>søndag</strong>.
        </li>
        <li>
          Valgfri grafikkmodus startes med <strong>vikingskip</strong> pa egen linje før <strong>innsjekk</strong>.
        </li>
        <li>
          I grafikkmodus settes oppløsning med <strong>hovedscene arne ...</strong>. Hvis ikke oppgitt brukes standard
          oppløsning 16.
        </li>
      </ul>

      <h3>Verdier og uttrykk</h3>
      <ul>
        <li>
          <strong>arne</strong> representerer 1. Flere arne i sekvens gir tilsvarende heltall.
        </li>
        <li>
          <strong>rop</strong> er et uttrykk som konverterer arne-baserte verdier til bokstaver.
        </li>
        <li>
          <strong>pall</strong> gir en runtime-generert tallverdi der <strong>| 1</strong> brukes pa heltallsdelen, men
          desimaldelen beholdes.
        </li>
        <li>
          <strong>premiumparkering</strong> representerer <strong>PI</strong>.
        </li>
        <li>
          <strong>expo(theta-arne)</strong> representerer <strong>sin(theta)</strong>.
        </li>
        <li>
          <strong>trafikklys(theta-arne)</strong> representerer <strong>tan(theta)</strong>.
        </li>
        <li>
          <strong>seating len-arne(expr, expr, ...)</strong> lager en fast array med angitt lengde og valgfrie
          startverdier.
        </li>
        <li>
          <strong>str noc index-arne</strong> henter tegn eller element med 1-basert indeks fra streng eller seating-array.
        </li>
        <li>
          <strong>navn noc indeks = verdi</strong> skriver verdi til et seating-element med direkte array-indeks.
        </li>
        <li>
          <strong>lørdag arr</strong> returnerer <strong>arr.join('')</strong>.
        </li>
        <li>
          <strong>rop</strong> støtter uttrykk og konkatenering med <strong>crew</strong>.
        </li>
        <li>
          Talltegn er ikke tillatt i kildekoden. Numeriske verdier ma uttrykkes med arne-sekvenser.
        </li>
      </ul>

      <h3>Hendelser (kreativia)</h3>
      <ul>
        <li>
          <strong>kreativia tast handler</strong> registrerer en tastatur-lytter for <strong>keypress</strong>.
        </li>
        <li>
          Tasten oppgis som et uttrykk, typisk <strong>rop arne ...</strong>, slik at bokstaver matches via{' '}
          <strong>event.key</strong> og ikke <strong>keyCode</strong>.
        </li>
        <li>
          For enkle bokstaver normaliseres tasten til store bokstaver, slik at <strong>kreativia rop arne handler</strong>{' '}
          matcher bade <strong>a</strong> og <strong>A</strong>.
        </li>
        <li>Handleren kalles med den faktiske tasten som argument.</li>
        <li>Alle lyttere ryddes automatisk opp nar programmet stopper.</li>
        <li>
          Programmer som bruker <strong>kreativia</strong> forblir aktive til du trykker <strong>Stopp</strong>.
        </li>
      </ul>

      <h3>Output</h3>
      <ul>
        <li>
          <strong>infodesk expr</strong> eller <strong>infodesk(expr)</strong> skriver til output.
        </li>
        <li>I tekstmodus vises output i tekstpanel.</li>
        <li>I vikingskip-modus vises grafisk output i canvas.</li>
      </ul>

      <h3>Operatorer</h3>
      <ul>
        <li>
          <strong>crew</strong> = +
        </li>
        <li>
          <strong>deltager</strong> = -
        </li>
        <li>
          <strong>kandu</strong> = *
        </li>
        <li>
          <strong>medic</strong> = /
        </li>
        <li>
          <strong>kandustyre</strong> = %
        </li>
        <li>
          <strong>foam</strong> = &lt;
        </li>
        <li>
          <strong>maof</strong> = &gt;
        </li>
        <li>
          <strong>kanalseks</strong> = ==
        </li>
      </ul>

      <h3>Kontrollflyt</h3>
      <ul>
        <li>
          <strong>secbua (betingelse) &#123; ... &#125;</strong> for if-blokk.
        </li>
        <li>
          <strong>ombud &#123; ... &#125;</strong> som valgfri else-blokk.
        </li>
      </ul>

      <h3>Funksjoner</h3>
      <ul>
        <li>
          <strong>hylle navn(a b) =&gt; &#123; ... &#125;</strong> definerer funksjon.
        </li>
        <li>
          <strong>tech expr</strong> returnerer verdi.
        </li>
        <li>Funksjonskall awaites automatisk i generert kode, bade pa toppniva og nested.</li>
      </ul>

      <h3>Runtime-kommandoer</h3>
      <ul>
        <li>
          <strong>sovetelt(expr) &#123; &#125;</strong> pauser kjoring i expr sekunder.
        </li>
        <li>
          <strong>attentiongrab(expr)</strong> kaster en feil.
        </li>
        <li>
          <strong>piksel(x, y)</strong> setter en piksel i canvas i vikingskip-modus.
        </li>
        <li>
          <strong>onsdag expr</strong>, <strong>torsdag expr</strong>, <strong>fredag expr</strong> setter r, g og b i
          fargeregisteret.
        </li>
        <li>
          Fargedybde per kanal er <strong>arne arne arne arne kandu arne arne arne arne</strong> (0 til 15).
        </li>
        <li>
          Etter hver <strong>piksel</strong> resettes fargeregisteret til <strong>rgb(0, 0, 0)</strong>.
        </li>
      </ul>

      <h3>Avbrytelse</h3>
      <ul>
        <li>Stopp-knappen avbryter bare den aktive TG-kjoringen.</li>
        <li>Avbrytelse virker ogsa under venting i <strong>sovetelt</strong> og i rekursive kjoringer.</li>
      </ul>
    </section>
  )
}
