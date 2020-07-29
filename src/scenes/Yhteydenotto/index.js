import React from "react";

const ContentFi = (
  <div className="mx-auto w-full sm:w-3/4 mb-16">
    <h1 className="mb-2">
      Yhteydenotto
    </h1>
    <h2 className="mb-2">
      Kysy tai anna palautetta
    </h2>
    <p className="mb-2">
      Oiva sivustoon liittyvää palautetta ja kysymyksiä voit lähettää osoitteeseen: <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
    </p>
    <p className="mb-2">
      Kaikki palaute luetaan ja lähetetään tarvittaessa tiedoksi asiasta vastaavalle virkamiehelle. Kysymyksiin pyrimme vastaamaan mahdollisimman pian. Vastaus lähetetään sähköpostilla ja edellyttää, että olet antanut sähköpostiosoitteesi.
    </p>
    <p className="mb-2">
      Viestiin pyydetään seuraavat lähettäjän tiedot: nimi, sähköposti tai muu yhteystieto ja organisaatio.
    </p>
    <h2 className="mb-2">
      Opetus- ja kulttuuriministeriön yhteystiedot
    </h2>
    <p className="mb-2">
      <a href="https://minedu.fi/yhteystiedot" target="_blank" rel="noopener noreferrer">Opetus- ja kulttuuriministeriön yhteystiedot</a>
    </p>
    <p className="mb-2">
      Opetus- ja kulttuuriministeriön yhteystiedoista voit hakea ministeriössä työskentelevien henkilöiden yhteystietoja nimellä, virkanimikkellää tai osastojen ja yksiköiden mukaan.
    </p>
  </div>
)

const ContentSv = (
  <div className="mx-auto w-full sm:w-3/4 mb-16">
    <h1 className="mb-2">
      Kontaktuppgifter
    </h1>
    <h2 className="mb-2">
      Fråga eller ge response
    </h2>
    <p className="mb-2">
      Du kan skicka respons och frågor om Oiva-webbplatsen till adressen: <a href="mailto:oivapalvelu@minedu.fi">oivapalvelu@minedu.fi</a>
    </p>
    <p className="mb-2">
      All respons läses och skickas vid behov för kännedom till den ansvariga tjänstemannen. Vi strävar efter att besvara frågorna så snart som möjligt. Svar skickas per e-post och förutsätter att du har gett din e-postadress.
    </p>
    <p className="mb-2">
      I meddelandet begärs följande uppgifter om avsändaren: namn, e-post eller annan kontaktinformation och organisation.
    </p>
    <h2 className="mb-2">
      Undervisnings- och kulturministeriets kontaktuppgifter
    </h2>
    <p className="mb-2">
      <a href="https://minedu.fi/sv/kontaktinformation" target="_blank" rel="noopener noreferrer">Undervisnings- och kulturministeriets kontaktuppgifter</a>
    </p>
    <p className="mb-2">
      I undervisnings- och kulturministeriets kontaktuppgifter kan du söka kontaktuppgifter för personer som arbetar vid ministeriet med namn, tjänstebenämning eller enligt avdelningarna och enheterna.
    </p>
  </div>
)

const Yhteydenotto = (props) => {
  return props.locale === 'sv' ? ContentSv : ContentFi;
};

export default Yhteydenotto;
