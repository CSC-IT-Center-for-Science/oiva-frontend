import React from "react";
import SivupohjaA from "components/03-templates/SivupohjaA";
import { Typography } from "@material-ui/core";
import { useIntl } from "react-intl";

const contentFi = (
  <SivupohjaA>
    <Typography component="h1" variant="h1">
      Saavutettavuusseloste
    </Typography>
    <p className="mb-6">
      Tämä saavutettavuusseloste koskee OIVA – Opetushallinnon ohjaus- ja
      säätelypalvelua ja on laadittu 04.09.2020. Tämä palvelu on arvioitu
      saavutettavuuden osalta ulkoisen arvioijan toimesta 30.8.2020.
    </p>
    <p className="mb-6">
      OIVA on opetushallinnon ohjaus- ja säätelypalvelu, jonka sisällöstä vastaa
      Opetus- ja kulttuuriministeriö.
    </p>
    <p className="mb-6">
      Opetus- ja kulttuuriministeriö pyrkii takaamaan OIVA-palvelun
      saavutettavuuden Euroopan parlamentin ja neuvoston direktiivin EU
      2016/2102 täytäntöön panemiseksi annetun kansallisen lainsäädännön
      mukaisesti. Tämä saavutettavuusseloste koskee <b>oiva.minedu.fi</b>{" "}
      -verkkosivustoa joka on julkaistu vuonna 2018. Direktiivin 12 artiklan
      mukaisesti verkkosivuston tulee noudattaa WCAG 2.1 -kriteeristön AA-tasoa
      23.9.2020 mennessä.
    </p>
    <Typography component="h2" variant="h2">
      Digipalvelun saavutettavuuden tila
    </Typography>
    <p className="mb-6">Täyttää saavutettavuusvaatimukset osittain.</p>
    <Typography component="h2" variant="h2">
      Digipalvelun ei-saavutettava sisältö (WCAG-kriteerien mukaan)
    </Typography>
    <Typography component="h3" variant="h3">
      Havaittava
    </Typography>
    <Typography component="h4" variant="h4">
      Saavutettava sisältö ja sen puutteet
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-palvelun portaalin havaittavuus
    </Typography>

    <Typography component="h4" variant="h4">
      Saavutettavuusvaatimukset jotka eivät täyty
    </Typography>

    <ul className="ml-8 mb-6 list-disc">
      <li>1.3.1 Informaatio ja suhteet</li>
      <li>1.3.3 Aistinvaraiset ominaispiirteet</li>
      <li>1.3.4 Asento</li>
      <li>1.4.1 Värien käyttö</li>
      <li>1.3.5 Määrittele syötteen tarkoitus</li>
      <li>1.4.4 Tekstin koon muuttaminen</li>
      <li>1.4.10 Responsiivisuus</li>
      <li>1.4.12 Tekstin välitys</li>
      <li>1.4.13 Sisältö osoitettaessa tai kohdistettaessa</li>
    </ul>

    <Typography component="h3" variant="h3">
      Hallittava
    </Typography>
    <Typography component="h4" variant="h4">
      Saavuttamaton sisältö ja sen puutteet
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-palvelun portaalin hallittavuus
    </Typography>
    <Typography component="h4" variant="h4">
      Saavutettavuusvaatimukset jotka eivät täyty
    </Typography>

    <ul className="ml-8 mb-6 list-disc">
      <li>2.1.1 Näppäimistö</li>
      <li>2.1.2 Ei näppäimistöansaa</li>
      <li>2.1.4 Yhden merkin pikanäppäimet</li>
      <li>2.4.5 Useita tapoja</li>
      <li>2.5.3 Nimilappu nimessä</li>
    </ul>

    <Typography component="h3" variant="h3">
      Ymmärrettävä
    </Typography>
    <Typography component="h4" variant="h4">
      Saavuttamaton sisältö ja sen puutteet
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-palvelun portaalin hallittavuus
    </Typography>
    <Typography component="h4" variant="h4">
      Saavutettavuusvaatimukset jotka eivät täyty
    </Typography>

    <ul className="ml-8 mb-6 list-disc">
      <li>3.1.1 Sivun kieli</li>
      <li>3.1.2 Osien kieli</li>
    </ul>

    <Typography component="h3" variant="h3">
      Toimintavarma
    </Typography>
    <Typography component="h4" variant="h4">
      Saavuttamaton sisältö ja sen puutteet
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-palvelun portaalin hallittavuus
    </Typography>
    <Typography component="h4" variant="h4">
      Saavutettavuusvaatimukset jotka eivät täyty
    </Typography>

    <ul className="ml-8 mb-6 list-disc">
      <li>4.1.2 Nimi, rooli, arvo</li>
    </ul>

    <Typography component="h4" variant="h4">
      Saavuttamaton sisältö ja sen puutteet
    </Typography>
    <p className="mb-6">
      Pyrimme korjaamaan OIVA-palvelun portaalia koskevat saavutettavuuspuutteet
      vuoden 2020 aikana. Lisäksi Sitoudumme kehittämään OIVA-palvelun
      saavutettavuutta jatkuvasti muun kehitystyön rinnalla.
    </p>
    <p className="mb-6">
      Osaa OIVA-palvelun tarjoamista ladattavista lupa-PDF -tiedostoista emme
      pysty tarjoamaan saavuttavassa muodossa, koska osa vanhoista päätöksistä
      on ollut saatavilla vain paperimuodossa. Lupien sisältö on kuitenkin
      tarjolla saavutettavassa HTML-muodossa
      järjestämis-/ylläpitämislupavälilehdellä.
    </p>
    <p className="mb-6">
      OIVA-palvelun PowerBI-raportit eivät valitettavasti täytä
      saavutettavuusvaatimuksia kaikilta osin kyseisissä ohjelmistontuottajan
      sovelluksissa olevien ominaisuuksien takia. Pyrimme parantamaan
      saavutettavuutta näiden raporttien osalta kun ohjelmistotoimittajan
      sovelluksiin tekemä kehitys sen mahdollistaa.
    </p>
    <p className="mb-6">
      Mikäli tarvitset PowerBI-raportin sisältämiä tilastoja jostain tietystä
      raportista saavutettavassa muodossa, otatahan yhteyttä sähköpostilla
      oivapalvelu@minedu.fi. Selvitämme tapauskohtaisesti, onko tarvittavia
      tietoja mahdollista tuottaa vaihtoehtoisessa, saavutettavassa muodossa.
    </p>
    <Typography component="h2" variant="h2">
      Huomasitko saavutettavuuspuutteen digipalvelussamme? Kerro se meille ja
      teemme parhaamme puutteen korjaamiseksi
    </Typography>
    <Typography component="h3" variant="h3">
      Sähköpostilla
    </Typography>
    <p className="mb-6">
      Voit antaa palautetta OIVA-palvelun saavutettavuutta koskien sähköpostitse
      osoitteeseen 
      <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
    </p>
    <p className="mb-6">
      Palaute ohjautuu palvelusta vastaaville opetushallinnon yhteyshenkilöille
      ja palvelun tekniselle toimittajalle.
    </p>
    <Typography component="h2" variant="h2">
      Valvontaviranomainen
    </Typography>
    <p className="mb-6">
      Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta
      sivuston ylläpitäjälle. Vastauksessa voi mennä 14 päivää. Jos et ole
      tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan kahden
      viikon aikana,{" "}
      <a
        href={"https://www.avi.fi/web/avi/avi-etela-suomi"}
        rel="noopener noreferrer"
        target={"_blank"}
      >
        voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon
      </a>
      . Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
      ilmoituksen voi tehdä ja miten asia käsitellään.
    </p>
    <Typography component="h2" variant="h2">
      Valvontaviranomaisen yhteystiedot
    </Typography>
    <p className="mb-6">
      Etelä-Suomen aluehallintovirasto
      <br />
      Saavutettavuuden valvonnan yksikkö
      <br />
      www.saavutettavuusvaatimukset.fi
      <br />
      saavutettavuus(at)avi.fi
      <br />
      puhelinnumero vaihde 0295 016 000
    </p>
  </SivupohjaA>
);

const contentSv = (
  <SivupohjaA>
    <Typography component="h1" variant="h1" className="mb-6 mt-2">
      Tillgänglighetsutlåtande
    </Typography>
    <p className="mb-6">
      Detta tillgänglighetsutlåtande gäller OIVA – Utbildningsförvaltningens
      styrnings- och regleringstjänst och har utarbetats den 4 september 2020. I
      fråga om tillgängligheten har den finska versionen av denna tjänst bedömts
      av en extern bedömare den 30 augusti 2020.
    </p>
    <p className="mb-6">
      OIVA är en styrnings- och regleringstjänst inom
      undervisningsförvaltningen. Undervisnings - och kulturministeriet ansvarar
      för innehållet i tjänsten.
    </p>
    <p className="mb-6">
      Undervisnings- och kulturministeriet strävar efter att säkerställa
      tillgängligheten till OIVA-tjänsten i enlighet med den nationella
      lagstiftning som antagits för att sätta ikraft Europaparlamentets och
      rådets direktiv EU 2016/2102. Utlåtandet gäller webbplatsen{" "}
      <b>oiva.minedu.fi</b>, som publicerades 2018. Enligt artikel 12 i
      direktivet ska webbplatsen uppfylla tillgänglighetskriterierna WCAG 2.1 på
      nivå AA senast den 23 september 2020.
    </p>
    <Typography component="h2" variant="h2">
      Den digitala tjänstens tillgänglighet
    </Typography>
    <p className="mb-6">Tjänsten uppfyller delvis tillgänglighetskraven.</p>
    <Typography component="h2" variant="h2">
      Icke tillgängligt innehåll i den digitala tjänsten (enligt
      WCAG-kriterierna)
    </Typography>
    <Typography component="h3" variant="h3">
      Möjlig att uppfatta
    </Typography>
    <Typography component="h4" variant="h4">
      Tillgängligt innehåll och dess brister
    </Typography>
    <Typography component="h4" variant="h4">
      Användarnas möjligheter att uppfatta OIVA-portalen
    </Typography>

    <Typography component="h4" variant="h4">
      Tillgänglighetskrav som inte uppfylls
    </Typography>
    <p className="mb-6">
      <ul className="ml-8 mb-6 list-disc">
        <li>1.3.1 Information och relationer</li>
        <li>1.3.3 Sensoriska kännetecken</li>
        <li>
          1.3.4 Se till att allt innehåll presenteras rätt oavsett skärmens
          riktning *
        </li>
        <li>1.3.5 Syftet med inmatningen definierat *</li>
        <li>1.4.1 Användning av färger</li>
        <li>1.4.4 Förändring av textstorlek</li>
        <li>1.4.10 Responsivitet *</li>
        <li>
          1.4.12 Se till att det går att öka avstånd mellan tecken, rader,
          stycken och ord *
        </li>
        <li>
          1.4.13 Popup-funktioner ska kunna hanteras och stängas av alla *
        </li>
      </ul>
    </p>
    <Typography component="h3" variant="h3">
      Hanterbar
    </Typography>
    <Typography component="h4" variant="h4">
      Icke-tillgängligt innehåll och brister
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-portalens hanterbarhet
    </Typography>
    <Typography component="h4" variant="h4">
      Tillgänglighetskrav som inte uppfylls
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>2.1.1 Tangentbord</li>
      <li>2.1.2 Ingen tangentbordsfälla</li>
      <li>2.1.4 Skapa kortkommandon med varsamhet *</li>
      <li>2.4.5 Flera sätt</li>
      <li>
        2.5.3 Se till att text med knappar och kontroller överensstämmer med
        maskinläsbara etiketter *
      </li>
    </ul>

    <Typography component="h3" variant="h3">
      Begriplig
    </Typography>
    <Typography component="h4" variant="h4">
      Icke-tillgängligt innehåll och brister
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-portalens hanterbarhet
    </Typography>
    <Typography component="h4" variant="h4">
      Tillgänglighetskrav som inte uppfylls
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>3.1.1 Sidans språk</li>
      <li>3.1.2 Språk för del av sida</li>
    </ul>

    <Typography component="h3" variant="h3">
      Robust
    </Typography>
    <Typography component="h4" variant="h4">
      Icke-tillgängligt innehåll och brister
    </Typography>
    <Typography component="h4" variant="h4">
      OIVA-portalens hanterbarhet
    </Typography>
    <Typography component="h4" variant="h4">
      Tillgänglighetskrav som inte uppfylls
    </Typography>

    <ul className="ml-8 mb-6 list-disc">
      <li>4.1.2 Namn, roll, värde</li>
    </ul>

    <Typography component="h4" variant="h4">
      Icke-tillgängligt innehåll och brister
    </Typography>
    <p className="mb-6">
      Vi strävar efter att åtgärda bristerna i tillgänglighet till OIVA-portalen
      inom 2020. Dessutom förbinder vi oss att kontinuerligt utveckla
      tillgängligheten till OIVA-tjänsten vid sidan av övrigt utvecklingsarbete.
    </p>
    <p className="mb-6">
      En del av de PDF-filer som OIVA-tjänsten tillhandahåller kan vi inte
      tillhandahålla i tillgängligt format, eftersom de ursprungliga besluten
      endast finns i pappersform. Innehållet i det aktuella tillståndet finns
      dock tillgängligt i HTML-format på fliken Anordnartillstånd/Tillstånd att
      driva läroanstalt.
    </p>
    <p className="mb-6">
      OIVA-tjänstens PowerBI-rapporter uppfyller tyvärr inte
      tillgänglighetskraven till alla delar på grund av attributen i
      programvaruproducentens applikationer. Vi strävar efter att förbättra
      tillgängligheten till dessa rapporter så snart producenten utvecklat
      applikationerna i tillräckligt hög grad.
    </p>
    <p className="mb-6">
      Om du behöver statistik som ingår i en PowerBI-rapport i ett tillgängligt
      format, vänligen kontakta oivapalvelu@minedu.fi per e-post. Vi utreder
      från fall till fall om det är möjligt att ta fram de uppgifter som behövs
      i ett annat tillgängligt format.
    </p>
    <Typography component="h2" variant="h2">
      Har du upptäckt problem med tillgängligheten? Berätta om problemen så att
      vi kan göra vårt bästa för att lösa dem
    </Typography>
    <Typography component="h3" variant="h3">
      E-postadresser
    </Typography>
    <p className="mb-6">
      Du kan lämna respons om OIVA-tjänstens tillgänglighet per e-post till{" "}
      <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
    </p>
    <p className="mb-6">
      Responsen förmedlas till de kontaktpersoner inom
      undervisningsförvaltningen som ansvarar för tjänsten och till den tekniska
      leverantören av tjänsten.
    </p>
    <Typography component="h2" variant="h2">
      Tillsynsmyndighet
    </Typography>
    <p className="mb-6">
      Om du upptäcker problem med tillgängligheten på denna webbplats, kontakta
      i första hand webbplatsens administratör. Svaret kan dröja 14 dagar. Om du
      inte är nöjd med svaret eller om du inte får något svar inom 14 dagar, kan
      du anmäla bristen till Regionförvaltningsverket i Södra Finland. På
      verkets webbplats finns anvisningar för hur du ger respons och hur ärendet
      behandlas.
    </p>
    <Typography component="h2" variant="h2">
      Tillsynsmyndighetens kontaktuppgifter
    </Typography>
    <p className="mb-6">
      Regionförvaltningsverket i Södra Finland
      <br />
      Enheten för tillgänglighetstillsyn
      <br />
      www.tillgänglighetskrav.fi
      <br />
      webbtillganglighet(at)rfv.fi
      <br />
      telefonväxel 0295 016 000
    </p>
    <p className="mb-6">
      * Inofficiell översättning. En officiell svensk översättning fanns inte
      att tillgå vid tidpunkten för upprättandet av detta
      tillgänglighetsutlåtande.
    </p>
  </SivupohjaA>
);

const Saavutettavuusseloste = () => {
  const { locale } = useIntl();
  return locale === "sv" ? contentSv : contentFi;
};

export default Saavutettavuusseloste;
