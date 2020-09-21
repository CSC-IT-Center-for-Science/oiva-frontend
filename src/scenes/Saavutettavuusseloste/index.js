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
    Opetus- ja kulttuuriministeriö pyrkii takaamaan OIVA-palvelun saavutettavuuden Euroopan parlamentin ja neuvoston direktiivin EU 2016/2102 täytäntöön panemiseksi annetun kansallisen lainsäädännön mukaisesti. Tämä saavutettavuusseloste koskee <b>oiva.minedu.fi</b> -verkkosivustoa joka on julkaistu vuonna 2018. Direktiivin 12 artiklan mukaisesti verkkosivuston tulee noudattaa WCAG 2.1 -kriteeristön AA-tasoa 23.9.2020 mennessä.
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
      <li>1.4.1 Värien käyttö</li>
      <li>1.3.5 Määrittele syötteen tarkoitus</li>
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
    Voit antaa palautetta OIVA-palvelun saavutettavuutta koskien sähköpostitse osoitteeseen <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
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

const Saavutettavuusseloste = (props) => {
  return props.locale === 'sv' ? contentFi : contentFi;
};

export default Saavutettavuusseloste;
