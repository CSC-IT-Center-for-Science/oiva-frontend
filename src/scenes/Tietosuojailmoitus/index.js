import React from "react";
import { Typography } from "@material-ui/core";
import SivupohjaA from "components/03-templates/SivupohjaA";
import { useIntl } from "react-intl";

const ContentFi = (
  <SivupohjaA>
    <Typography component="h1" variant="h1">
      Tietosuojailmoitus
    </Typography>
    <Typography component="h2" variant="h2">
      Opetus- ja kulttuuriministeriön tietosuojailmoitus rekisteröidylle
    </Typography>
    <p className="mb-6">
      Oiva-opetushallinnon ohjaus- ja säätelypalvelussa käsiteltävät
      henkilötiedot
    </p>
    <Typography component="h3" variant="h3">
      1. Yleistä
    </Typography>
    <p className="mb-6">
      Tämä tietosuojailmoitus sisältää EU:n tietosuoja-asetuksen (EU) 679/2016
      13 ja 14 artiklan mukaiset tiedot rekisteröidylle (luonnolliselle
      henkilölle). Tämä ilmoitus annetaan rekisteröidylle henkilötietoja
      kerättäessä.
    </p>

    <Typography component="h3" variant="h3">
      2. Rekisterinpitäjä ja rekisterinpitäjän yhteystiedot
    </Typography>
    <p className="mb-6">
      Opetus- ja kulttuuriministeriö
      <br />
      Kirjaamon käyntiosoite: Ritarikatu 2 b, Helsinki
      <br />
      Postiosoite: PL 29, 00023 VALTIONEUVOSTO
      <br />
      Sähköpostiosoite: kirjaamo@minedu.fi
      <br />
      Puh. 0295 16001 (keskus)
    </p>

    <Typography component="h3" variant="h3">
      3. Tietosuojavastaavan yhteystiedot
    </Typography>
    <p className="mb-6">
      Opetus- ja kulttuuriministeriön tietosuojavastaava
      <br />
      Sähköpostiosoite: okmtietosuojavastaava@minedu.fi
      <br />
      Postiosoite: Opetus- ja kulttuuriministeriö, PL 29, 00023 VALTIONEUVOSTO
    </p>
    <Typography component="h3" variant="h3">
      4. Henkilötietojen käsittelyn tarkoitukset ja oikeusperusteet
    </Typography>

    <Typography component="h4" variant="h4">
      Henkilötietojen käsittelyn tarkoitukset:
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>
        opetus- ja kulttuuriministeriössä vireille tulevien koulutuksen
        järjestämis- tai ylläpitämislupa-asioiden vastaanottaminen
      </li>
      <li>
        koulutuksen järjestämis- tai ylläpitämislupa-asioiden valmistelu ja
        päätöksenteko
      </li>
      <li>
        henkilötietoja sisältävien asiakirjojen säilyttäminen asian käsittelyn
        ajan
      </li>
    </ul>

    <Typography component="h4" variant="h4">
      Henkilötietojen käsittelyn oikeusperusteet:
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>Valtioneuvoston ohjesääntö (262/2003) 11 § ja 18 §</li>
      <li>
        Valtioneuvoston asetus opetus- ja kulttuuriministeriöstä (310/2010) 1 §
      </li>
      <li>
        Valtioneuvoston asetus kuorma- ja linja-auton kuljettajien
        ammattipätevyydestä (434/2018) 12 §
      </li>
    </ul>

    <Typography component="h3" variant="h3">
      5. Henkilötietojen käsittelijät
    </Typography>
    <p className="mb-6">Henkilötietojen käsittelijöitä ovat:</p>
    <ul className="ml-8 mb-6 list-disc">
      <li>
        CSC – Tieteen tietotekniikan keskus Oy, ohjelmiston kehitys ja ylläpito
        (sopimus)
      </li>
      <li>Valtioneuvoston kanslia VNK (asianhallinnan toteuttajana)</li>
    </ul>

    <Typography component="h3" variant="h3">
      6. Henkilötietojen siirtäminen kolmansiin maihin tai kansainvälisille
      järjestöille
    </Typography>
    <p className="mb-6">
      Henkilötietoja ei luovuteta kolmansiin maihin tai kansainvälisille
      järjestöille.
    </p>

    <Typography component="h3" variant="h3">
      7. Henkilötietojen säilyttämisajat
    </Typography>
    <p className="mb-6">
      Henkilötietoja käsitellään asian ratkaisun ja päätöksen valitusajan
      päättymiseen asti sekä mahdollisen valituksen käsittelyn loppuun asti,
      ellei arkistoinnin tai kirjanpidon säädöksistä muuta johdu. Henkilötietoja
      säilytetään käsittelyn ajan myös valtiohallinnon
      asianhallintajärjestelmässä.
    </p>

    <Typography component="h3" variant="h3">
      8. Rekisteröidyn oikeudet
    </Typography>
    <p className="mb-6">
      Rekisteröidyllä on oikeus saada rekisterinpitäjältä tieto siitä,
      käsitelläänkö hänen henkilötietojaan.
    </p>
    <p className="mb-6">Rekisteröidyllä on myös oikeus pyytää:</p>
    <ul className="ml-8 mb-6 list-disc">
      <li>itseään koskevat henkilötiedot</li>
      <li>
        rekisterinpitäjää oikaisemaan tai poistamaan virheelliset tai
        vanhentuneet tiedot
      </li>
      <li>henkilötietojen käsittelyn rajoittamista</li>
    </ul>

    <p className="mb-6">
      Mikäli rekisteröity katsoo, ettei hänen henkilötietojensa käsittely ole
      lainmukaista, rekisteröidyllä on oikeus tehdä asiasta valitus
      tietosuojavaltuutetulle.
    </p>

    <Typography component="h3" variant="h3">
      9. Henkilötietojen lähde/lähteet
    </Typography>
    <p className="mb-6">
      Henkilötietoja voidaan saada myös rekisteröityjen yhteyshenkilöiden
      toimesta tai julkisista lähteistä.
    </p>

    <Typography component="h3" variant="h3">
      10. Automaattinen päätöksenteko
    </Typography>
    <p className="mb-6">
      Henkilötietojen käsittelyyn ei liity sellaista automaattista
      päätöksentekoa, jolla vaikutettaisiin rekisteröityjen oikeuksiin tai
      vapauksiin.
    </p>

    <Typography component="h3" variant="h3">
      11. Henkilötietojen käsitteyn suojaaminen
    </Typography>
    <p className="mb-6">
      Opetus- ja kulttuuriministeriö rekisterinpitäjänä on toteuttanut
      tarvittavat tekniset ja organisatoriset toimet sekä vaatii sitä myös
      henkilötietojen käsittelijöiltä.
    </p>
  </SivupohjaA>
);

const ContentSv = (
  <div className="mx-auto w-213 mt-12 mb-16 px-5">
    <Typography component="h1" variant="h1">
      Dataskyddsbeskrivning
    </Typography>
    <Typography component="h2" variant="h2">
      Undervisnings- och kulturministeriets dataskyddsbeskrivning för den
      registrerade
    </Typography>
    <p className="mb-6">
      Personuppgifter som behandlas i undervisningsförvaltningens styrnings- och
      regleringstjänst Oiva
    </p>

    <Typography component="h3" variant="h3">
      1. Allmänt
    </Typography>
    <p className="mb-6">
      Denna dataskyddsbeskrivning innehåller information till den registrerade
      (fysisk person) enligt artikel 13 och 14 i EU:s dataskyddsförordning (EU)
      679/2016. Denna beskrivning ges till den registrerade när personuppgifter
      samlas in.
    </p>

    <Typography component="h3" variant="h3">
      2. Personuppgiftsansvarig och kontaktuppgifter
    </Typography>
    <p className="mb-6">
      Undervisnings- och kulturministeriet
      <br />
      Registratorskontorets besöksadress: Riddaregatan 2 B, Helsingfors
      <br />
      Postadress: PB 29, 00023 STATSRÅDET
      <br />
      E-postadress: kirjaamo@minedu.fi
      <br />
      Tfn 0295 16001 (växel)
    </p>

    <Typography component="h3" variant="h3">
      3. Dataskyddsombudets kontaktuppgifter
    </Typography>
    <p className="mb-6">
      Undervisnings- och kulturministeriets dataskyddsombud
      <br />
      E-postadress: okmtietosuojavastaava@minedu.fi
      <br />
      Postadress: Undervisnings- och kulturministeriet, PB 29, 00023 STATSRÅDET
    </p>

    <Typography component="h3" variant="h3">
      4. Syften och rättslig grund för behandlingen av personuppgifter
    </Typography>
    <Typography component="h4" variant="h4">
      Syften för behandlingen av personuppgifter:
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>
        mottagande av ärenden som gäller tillstånd att ordna utbildning eller
        att driva läroanstalt som inleds vid undervisnings- och
        kulturministeriet
      </li>
      <li>
        beredning och beslutsfattande i ärenden som gäller tillstånd att ordna
        utbildning eller att driva läroanstalt
      </li>
      <li>
        förvaring av handlingar som innehåller personuppgifter under
        handläggningen av ärendet
      </li>
    </ul>

    <Typography component="h4" variant="h4">
      Rättslig grund för behandlingen av personuppgifter:
    </Typography>
    <ul className="ml-8 mb-6 list-disc">
      <li>Statsrådets reglemente (262/2003) 11 § och 18 §</li>
      <li>
        Statsrådets förordning om undervisnings- och kulturministeriet
        (310/2010) 1 §
      </li>
      <li>
        Statsrådets förordning om yrkeskompetens för lastbils- och bussförare
        (434/2018) 12 §
      </li>
    </ul>

    <Typography component="h3" variant="h3">
      5. Personuppgiftsbiträden
    </Typography>
    <p>Personuppgiftsbiträden är:</p>
    <ul className="ml-8 mb-6 list-disc">
      <li>
        CSC – It-centret för vetenskap, utveckling av programvaran och drift
        (avtal)
      </li>
      <li>Statsrådets kansli SRK (som verkställare av ärendehanteringen)</li>
    </ul>

    <Typography component="h3" variant="h3">
      6. Överföring av personuppgifter till tredjeländer eller internationella
      organisationer
    </Typography>
    <p className="mb-6">
      Personuppgifter lämnas inte till tredjeländer eller internationella
      organisationer.
    </p>

    <Typography component="h3" variant="h3">
      7. Lagringstid för personuppgifter
    </Typography>
    <p className="mb-6">
      Personuppgifter behandlas tills ärendet är avgjort och besvärstiden för
      beslutet har gått ut samt till utgången av behandlingen av eventuella
      besvär, om inte något annat följer av arkiverings- eller
      bokföringsbestämmelserna. Personuppgifter lagras under behandlingens tid
      också i statsförvaltningens ärendehanteringssystem.
    </p>

    <Typography component="h3" variant="h3">
      8. Den registrerades rättigheter
    </Typography>
    <p className="mb-6">
      Den registrerade har rätt att av den personuppgiftsansvarige få
      information om huruvida hans eller hennes personuppgifter behandlas.
    </p>
    <p className="mb-6">Den registrerade har även rätt att begära:</p>
    <ul className="ml-8 mb-6 list-disc">
      <li>personuppgifter som gäller honom eller henne själv</li>
      <li>
        att den personuppgiftsansvarige rättar eller raderar felaktiga eller
        föråldrade uppgifter
      </li>
      <li>begränsning av behandlingen av personuppgifter</li>
    </ul>
    <p className="mb-6">
      Om den registrerade anser att behandlingen av hans eller hennes
      personuppgifter inte är lagenlig har den registrerade rätt att lämna in
      ett klagomål till dataombudsmannen.
    </p>
    <Typography component="h3" variant="h3">
      9. Källa/källor till personuppgifter
    </Typography>
    <p className="mb-6">
      Personuppgifter kan också fås av de registrerades kontaktpersoner eller
      från offentliga källor.
    </p>

    <Typography component="h3" variant="h3">
      10. Automatiserat beslutsfattande
    </Typography>
    <p className="mb-6">
      Behandlingen av personuppgifter innefattar inte sådant automatiskt
      beslutsfattande som påverkar de registrerades rättigheter eller friheter.
    </p>

    <Typography component="h3" variant="h3">
      11. Skydd för behandlingen av personuppgifter
    </Typography>
    <p className="mb-6">
      I egenskap av personuppgiftsansvarig har undervisnings- och
      kulturministeriet vidtagit de tekniska och organisatoriska åtgärder som
      behövs samt kräver detta även av personuppgiftsbiträdena.
    </p>
  </div>
);

const Tietosuojailmoitus = () => {
  const { locale } = useIntl();
  return locale === "sv" ? ContentSv : ContentFi;
};

export default Tietosuojailmoitus;
