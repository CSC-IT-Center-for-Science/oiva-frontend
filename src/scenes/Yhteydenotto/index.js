import React from "react";
import { Typography } from "@material-ui/core";
import SivupohjaA from "components/03-templates/SivupohjaA";
import { useIntl } from "react-intl";

const ContentFi = (
  <SivupohjaA>
    <Typography component="h1" variant="h1">
      Yhteydenotto
    </Typography>
    <Typography component="h2" variant="h2">
      Kysy tai anna palautetta
    </Typography>
    <p className="mb-6">
      Oiva sivustoon liittyvää palautetta ja kysymyksiä voit lähettää
      osoitteeseen:{" "}
      <a href="mailto:oivapalvelu@minedu.fi" className="underline">
        oivapalvelu@minedu.fi
      </a>
    </p>
    <p className="mb-6">
      Kaikki palaute luetaan ja lähetetään tarvittaessa tiedoksi asiasta
      vastaavalle virkamiehelle. Kysymyksiin pyrimme vastaamaan mahdollisimman
      pian. Vastaus lähetetään sähköpostilla ja edellyttää, että olet antanut
      sähköpostiosoitteesi.
    </p>
    <p className="mb-6">
      Viestiin pyydetään seuraavat lähettäjän tiedot: nimi, sähköposti tai muu
      yhteystieto ja organisaatio.
    </p>
    <Typography component="h2" variant="h2">
      Opetus- ja kulttuuriministeriön yhteystiedot
    </Typography>
    <p className="mb-6">
      <a
        href="https://minedu.fi/yhteystiedot"
        className="underline"
        target="_blank"
        rel="noopener noreferrer">
        Opetus- ja kulttuuriministeriön yhteystiedot
      </a>
    </p>
    <p className="mb-6">
      Opetus- ja kulttuuriministeriön yhteystiedoista voit hakea ministeriössä
      työskentelevien henkilöiden yhteystietoja nimellä, virkanimikkellää tai
      osastojen ja yksiköiden mukaan.
    </p>
  </SivupohjaA>
);

const ContentSv = (
  <SivupohjaA>
    <Typography component="h1" variant="h1">
      Kontaktuppgifter
    </Typography>
    <Typography component="h2" variant="h2">
      Fråga eller ge response
    </Typography>
    <p className="mb-6">
      Du kan skicka respons och frågor om Oiva-webbplatsen till adressen:{" "}
      <a href="mailto:oivapalvelu@minedu.fi" className="underline">
        oivapalvelu@minedu.fi
      </a>
    </p>
    <p className="mb-6">
      All respons läses och skickas vid behov för kännedom till den ansvariga
      tjänstemannen. Vi strävar efter att besvara frågorna så snart som möjligt.
      Svar skickas per e-post och förutsätter att du har gett din e-postadress.
    </p>
    <p className="mb-6">
      I meddelandet begärs följande uppgifter om avsändaren: namn, e-post eller
      annan kontaktinformation och organisation.
    </p>
    <Typography component="h2" variant="h2">
      Undervisnings- och kulturministeriets kontaktuppgifter
    </Typography>
    <p className="mb-6">
      <a
        href="https://minedu.fi/sv/kontaktinformation"
        className="underline"
        target="_blank"
        rel="noopener noreferrer">
        Undervisnings- och kulturministeriets kontaktuppgifter
      </a>
    </p>
    <p className="mb-6">
      I undervisnings- och kulturministeriets kontaktuppgifter kan du söka
      kontaktuppgifter för personer som arbetar vid ministeriet med namn,
      tjänstebenämning eller enligt avdelningarna och enheterna.
    </p>
  </SivupohjaA>
);

const Yhteydenotto = () => {
  const { locale } = useIntl();
  return locale === "sv" ? ContentSv : ContentFi;
};

export default Yhteydenotto;
