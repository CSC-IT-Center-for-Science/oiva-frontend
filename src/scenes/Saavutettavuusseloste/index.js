import React from "react";

const contentFi = (
<div className="mx-auto w-full sm:w-3/4 mb-16">
  <h1 className="mb-2 mt-2">
    Saavutettavuusseloste
  </h1>
  <p className="mb-2">
    Tämä saavutettavuusseloste koskee OIVA – Opetushallinnon ohjaus- ja säätelypalvelua ja on laadittu 04.09.2020. Tämä palvelu on arvioitu saavutettavuuden osalta ulkoisen arvioijan toimesta 30.8.2020.
  </p>
  <p className="mb-2">
    OIVA on opetushallinnon ohjaus- ja säätelypalvelu, jonka sisällöstä vastaa Opetus- ja kulttuuriministeriö.
  </p>
  <p className="mb-2">
    Opetus- ja kulttuuriministeriö pyrkii takaamaan OIVA-palvelun saavutettavuuden Euroopan parlamentin ja neuvoston direktiivin EU 2016/2102 täytäntöön panemiseksi annetun kansallisen lainsäädännön mukaisesti. Tämä saavutettavuusseloste koskee <b>oiva.minedu.fi</b> -verkkosivustoa joka on julkaistu vuonna 2018. Direktiivin 12 artiklan mukaisesti verkkosivuston tulee noudattaa WCAG 2.1 -kriteeristön AA-tasoa 23.9.2020 mennessä.
  </p>
  <h2 className="mb-2">
    Digipalvelun saavutettavuuden tila
  </h2>
  <p className="mb-2">
    Täyttää saavutettavuusvaatimukset osittain.
  </p>
  <h2 className="mb-2">
    Digipalvelun ei-saavutettava sisältö (WCAG-kriteerien mukaan)
  </h2>
  <h3 className="mb-2">
    Havaittava
  </h3>
  <h4 className="mb-2">
    Saavutettava sisältö ja sen puutteet
  </h4>
  <h4 className="mb-2" style={{"font-weight": "normal"}}>
    OIVA-palvelun portaalin havaittavuus
  </h4>

  <h4 className="mb-2">
    Saavutettavuusvaatimukset jotka eivät täyty
  </h4>
  <p className="mb-2">
    <ul className="ml-8 list-disc">
      <li>1.3.1 Informaatio ja suhteet</li>
      <li>1.3.3 Aistinvaraiset ominaispiirteet</li>
      <li>1.3.4 Asento</li>
      <li>1.3.5 Määrittele syötteen tarkoitus</li>
      <li>1.4.1 Värien käyttö</li>
      <li>1.4.4 Tekstin koon muuttaminen</li>
      <li>1.4.10 Responsiivisuus</li>
      <li>1.4.12 Tekstin välitys</li>
      <li>1.4.13 Sisältö osoitettaessa tai kohdistettaessa</li>
    </ul>
  </p>
  <h3 className="mb-2">
    Hallittava
  </h3>
  <h4 className="mb-2">
    Saavuttamaton sisältö ja sen puutteet
  </h4>
  <h4 className="mb-2" style={{"font-weight": "normal"}}>
    OIVA-palvelun portaalin hallittavuus
  </h4>
  <h4 className="mb-2">
    Saavutettavuusvaatimukset jotka eivät täyty
  </h4>
  <p className="mb-2">
    <ul className="ml-8 list-disc">
      <li>2.1.1 Näppäimistö</li>
      <li>2.1.2 Ei näppäimistöansaa</li>
      <li>2.1.4 Yhden merkin pikanäppäimet</li>
      <li>2.4.5 Useita tapoja</li>
      <li>2.5.3 Nimilappu nimessä</li>
    </ul>
  </p>
  <h3 className="mb-2">
    Ymmärrettävä
  </h3>
  <h4 className="mb-2">
    Saavuttamaton sisältö ja sen puutteet
  </h4>
  <h4 className="mb-2" style={{"font-weight": "normal"}}>
    OIVA-palvelun portaalin hallittavuus
  </h4>
  <h4 className="mb-2">
    Saavutettavuusvaatimukset jotka eivät täyty
  </h4>
  <p className="mb-2">
    <ul className="ml-8 list-disc">
      <li>3.1.1 Sivun kieli</li>
      <li>3.1.2 Osien kieli</li>
    </ul>
  </p>
  <h3 className="mb-2">
    Toimintavarma
  </h3>
  <h4 className="mb-2">
    Saavuttamaton sisältö ja sen puutteet
  </h4>
  <h4 className="mb-2" style={{"font-weight": "normal"}}>
    OIVA-palvelun portaalin hallittavuus
  </h4>
  <h4 className="mb-2">
    Saavutettavuusvaatimukset jotka eivät täyty
  </h4>
  <p className="mb-2">
    <ul className="ml-8 list-disc">
      <li>4.1.2 Nimi, rooli, arvo</li>
    </ul>
  </p>
  <h4 className="mb-2">
    Saavuttamaton sisältö ja sen puutteet
  </h4>
  <p className="mb-2">
    Pyrimme korjaamaan OIVA-palvelun portaalia koskevat saavutettavuuspuutteet vuoden 2020 aikana. Lisäksi Sitoudumme kehittämään OIVA-palvelun saavutettavuutta jatkuvasti muun kehitystyön rinnalla.
  </p>
  <p className="mb-2">
    Osaa OIVA-palvelun tarjoamista ladattavista lupa-PDF -tiedostoista emme pysty tarjoamaan saavuttavassa muodossa, koska osa vanhoista päätöksistä on ollut saatavilla vain paperimuodossa. Lupien sisältö on kuitenkin tarjolla saavutettavassa HTML-muodossa järjestämis-/ylläpitämislupavälilehdellä.
  </p>
  <p className="mb-2">
    OIVA-palvelun PowerBI-raportit eivät valitettavasti täytä saavutettavuusvaatimuksia kaikilta osin kyseisissä ohjelmistontuottajan sovelluksissa olevien ominaisuuksien takia. Pyrimme parantamaan saavutettavuutta näiden raporttien osalta kun ohjelmistotoimittajan sovelluksiin tekemä kehitys sen mahdollistaa.
  </p>
  <p className="mb-2">
    Mikäli tarvitset PowerBI-raportin sisältämiä tilastoja jostain tietystä raportista saavutettavassa muodossa, otatahan yhteyttä sähköpostilla oivapalvelu@minedu.fi. Selvitämme tapauskohtaisesti, onko tarvittavia tietoja mahdollista tuottaa vaihtoehtoisessa, saavutettavassa muodossa.
  </p>
  <h2 className="mb-2">
    Huomasitko saavutettavuuspuutteen digipalvelussamme? Kerro se meille ja teemme parhaamme puutteen korjaamiseksi
  </h2>
  <h3 className="mb-2">
    Sähköpostilla
  </h3>
  <p className="mb-2">
    Voit antaa palautetta OIVA-palvelun saavutettavuutta koskien sähköpostitse osoitteeseen <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
  </p>
  <p className="mb-2">
    Palaute ohjautuu palvelusta vastaaville opetushallinnon yhteyshenkilöille ja palvelun tekniselle toimittajalle.
  </p>
  <h2 className="mb-2">
    Valvontaviranomainen
  </h2>
  <p className="mb-2">
    Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta sivuston ylläpitäjälle. Vastauksessa voi mennä 14 päivää. Jos et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan kahden viikon aikana, <a href={"https://www.avi.fi/web/avi/avi-etela-suomi"} target={"_blank"}>voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon</a>. Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten ilmoituksen voi tehdä ja miten asia käsitellään.
  </p>
  <h2 className="mb-2">
    Valvontaviranomaisen yhteystiedot
  </h2>
  <p className="mb-2">
    Etelä-Suomen aluehallintovirasto<br/>
    Saavutettavuuden valvonnan yksikkö<br/>
    www.saavutettavuusvaatimukset.fi<br/>
    saavutettavuus(at)avi.fi<br/>
    puhelinnumero vaihde 0295 016 000
  </p>
</div>
)

const contentSv = (
  <div className="mx-auto w-full sm:w-3/4 mb-16">
    <h1 className="mb-2 mt-2">
      Tillgänglighetsutlåtande
    </h1>
    <p className="mb-2">
      Detta tillgänglighetsutlåtande gäller OIVA – Utbildningsförvaltningens styrnings- och regleringstjänst och har utarbetats den 4 september 2020. I fråga om tillgängligheten har den finska versionen av denna tjänst bedömts av en extern bedömare den 30 augusti 2020. (På finska?)
    </p>
    <p className="mb-2">
      OIVA är en styrnings- och regleringstjänst inom undervisningsförvaltningen. Undervisnings - och kulturministeriet ansvarar för innehållet i tjänsten.
    </p>
    <p className="mb-2">
      Undervisnings- och kulturministeriet strävar efter att säkerställa tillgängligheten till OIVA-tjänsten i enlighet med den nationella lagstiftning som antagits för att sätta ikraft Europaparlamentets och rådets direktiv EU 2016/2102. Utlåtandet gäller webbplatsen <b>oiva.minedu.fi</b>, som publicerades 2018. Enligt artikel 12 i direktivet ska webbplatsen uppfylla tillgänglighetskriterierna WCAG 2.1 på nivå AA senast den 23 september 2020.
    </p>
    <h2 className="mb-2">
      Den digitala tjänstens tillgänglighet
    </h2>
    <p className="mb-2">
      Tjänsten uppfyller delvis tillgänglighetskraven.
    </p>
    <h2 className="mb-2">
      Icke tillgängligt innehåll i den digitala tjänsten (enligt WCAG-kriterierna)
    </h2>
    <h3 className="mb-2">
      Möjlig att uppfatta
    </h3>
    <h4 className="mb-2">
      Tillgängligt innehåll och dess brister
    </h4>
    <h4 className="mb-2" style={{"font-weight": "normal"}}>
      Användarnas möjligheter att uppfatta OIVA-portalen
    </h4>

    <h4 className="mb-2">
      Tillgänglighetskrav som inte uppfylls
    </h4>
    <p className="mb-2">
      <ul className="ml-8 list-disc">
        <li>1.3.1 Information och relationer</li>
        <li>1.3.3 Sensoriska kännetecken</li>
        <li>1.3.4 Se till att allt innehåll presenteras rätt oavsett skärmens riktning *</li>
        <li>1.3.5 Syftet med inmatningen definierat *</li>
        <li>1.4.1 Användning av färger</li>
        <li>1.4.4 Förändring av textstorlek</li>
        <li>1.4.10 Responsivitet *</li>
        <li>1.4.12 Se till att det går att öka avstånd mellan tecken, rader, stycken och ord *</li>
        <li>1.4.13 Popup-funktioner ska kunna hanteras och stängas av alla *</li>
      </ul>
    </p>
    <h3 className="mb-2">
      Hanterbar
    </h3>
    <h4 className="mb-2">
      Icke-tillgängligt innehåll och brister
    </h4>
    <h4 className="mb-2" style={{"font-weight": "normal"}}>
      OIVA-portalens hanterbarhet
    </h4>
    <h4 className="mb-2">
      Tillgänglighetskrav som inte uppfylls
    </h4>
    <p className="mb-2">
      <ul className="ml-8 list-disc">
        <li>2.1.1 Tangentbord</li>
        <li>2.1.2 Ingen tangentbordsfälla</li>
        <li>2.1.4 Skapa kortkommandon med varsamhet *</li>
        <li>2.4.5 Flera sätt</li>
        <li>2.5.3 Se till att text med knappar och kontroller överensstämmer med maskinläsbara etiketter *</li>
      </ul>
    </p>
    <h3 className="mb-2">
      Begriplig
    </h3>
    <h4 className="mb-2">
      Icke-tillgängligt innehåll och brister
    </h4>
    <h4 className="mb-2" style={{"font-weight": "normal"}}>
      OIVA-portalens hanterbarhet
    </h4>
    <h4 className="mb-2">
      Tillgänglighetskrav som inte uppfylls
    </h4>
    <p className="mb-2">
      <ul className="ml-8 list-disc">
        <li>3.1.1 Sidans språk</li>
        <li>3.1.2 Språk för del av sida</li>
      </ul>
    </p>
    <h3 className="mb-2">
      Robust
    </h3>
    <h4 className="mb-2">
      Icke-tillgängligt innehåll och brister
    </h4>
    <h4 className="mb-2" style={{"font-weight": "normal"}}>
      OIVA-portalens hanterbarhet
    </h4>
    <h4 className="mb-2">
      Tillgänglighetskrav som inte uppfylls
    </h4>
    <p className="mb-2">
      <ul className="ml-8 list-disc">
        <li>4.1.2 Namn, roll, värde</li>
      </ul>
    </p>
    <h4 className="mb-2">
      Icke-tillgängligt innehåll och brister
    </h4>
    <p className="mb-2">
      Vi strävar efter att åtgärda bristerna i tillgänglighet till OIVA-portalen inom 2020. Dessutom förbinder vi oss att kontinuerligt utveckla tillgängligheten till OIVA-tjänsten vid sidan av övrigt utvecklingsarbete.
    </p>
    <p className="mb-2">
      En del av de PDF-filer som OIVA-tjänsten tillhandahåller kan vi inte tillhandahålla i tillgängligt format, eftersom de ursprungliga besluten endast finns i pappersform. Innehållet i det aktuella tillståndet finns dock tillgängligt i HTML-format på fliken Anordnartillstånd/Tillstånd att driva läroanstalt.
    </p>
    <p className="mb-2">
      OIVA-tjänstens PowerBI-rapporter uppfyller tyvärr inte tillgänglighetskraven till alla delar på grund av attributen i programvaruproducentens applikationer. Vi strävar efter att förbättra tillgängligheten till dessa rapporter så snart producenten utvecklat applikationerna i tillräckligt hög grad.
    </p>
    <p className="mb-2">
      Om du behöver statistik som ingår i en PowerBI-rapport i ett tillgängligt format, vänligen kontakta oivapalvelu@minedu.fi per e-post. Vi utreder från fall till fall om det är möjligt att ta fram de uppgifter som behövs i ett annat tillgängligt format.
    </p>
    <h2 className="mb-2">
      Har du upptäckt problem med tillgängligheten? Berätta om problemen så att vi kan göra vårt bästa för att lösa dem
    </h2>
    <h3 className="mb-2">
      E-postadresser
    </h3>
    <p className="mb-2">
      Du kan lämna respons om OIVA-tjänstens tillgänglighet per e-post till <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
    </p>
    <p className="mb-2">
      Responsen förmedlas till de kontaktpersoner inom undervisningsförvaltningen som ansvarar för tjänsten och till den tekniska leverantören av tjänsten.
    </p>
    <h2 className="mb-2">
      Tillsynsmyndighet
    </h2>
    <p className="mb-2">
      Om du upptäcker problem med tillgängligheten på denna webbplats, kontakta i första hand webbplatsens administratör. Svaret kan dröja 14 dagar. Om du inte är nöjd med svaret eller om du inte får något svar inom 14 dagar, kan du anmäla bristen till Regionförvaltningsverket i Södra Finland. På verkets webbplats finns anvisningar för hur du ger respons och hur ärendet behandlas.
    </p>
    <h2 className="mb-2">
      Tillsynsmyndighetens kontaktuppgifter
    </h2>
    <p className="mb-2">
      Regionförvaltningsverket i Södra Finland<br/>
      Enheten för tillgänglighetstillsyn<br/>
      www.tillgänglighetskrav.fi<br/>
      webbtillganglighet(at)rfv.fi<br/>
      telefonväxel 0295 016 000
    </p>
    <p className="mb-2">
      * Inofficiell översättning. En officiell svensk översättning fanns inte att tillgå vid tidpunkten för upprättandet av detta tillgänglighetsutlåtande.
    </p>
  </div>
)

const Saavutettavuusseloste = (props) => {
  return props.locale === 'sv' ? contentSv : contentFi;
};

export default Saavutettavuusseloste;
