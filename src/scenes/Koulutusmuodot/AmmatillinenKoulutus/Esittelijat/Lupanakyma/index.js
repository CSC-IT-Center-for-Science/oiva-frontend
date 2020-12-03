import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { find, head, includes, last, prop, values } from "ramda";
import EsittelijatMuutospyynto from "../../EsittelijatMuutospyynto";
import { useValidity } from "stores/lomakedata";
import { Typography } from "@material-ui/core";

const Lupanakyma = ({
  kielet,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  kunnat,
  maaraykset,
  lupaKohteet,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  organisation,
  tutkinnot
}) => {
  const intl = useIntl();
  const [validity] = useValidity();
  const organisationPhoneNumber = head(
    values(find(prop("numero"), organisation.yhteystiedot))
  );

  const organisationEmail = head(
    values(find(prop("email"), organisation.yhteystiedot))
  );

  const organisationWebsite = head(
    values(find(prop("www"), organisation.yhteystiedot))
  );

  const isLupaValid = useMemo(() => {
    return !includes(false, values(validity));
  }, [validity]);

  return (
    <div
      className={`border-8 ${
        isLupaValid ? "border-green-500" : "border-red-500"
      }`}>
      <div className="bg-vaalenharmaa px-16 w-full m-auto mb-20 border-b border-xs border-harmaa">
        <div className="py-4">
          <Typography component="h1" variant="h1">
            {organisation.nimi[intl.locale] || last(values(organisation.nimi))}
          </Typography>
          <p>
            {organisation.kayntiosoite.osoite},{" "}
            {organisation.postiosoite.osoite}{" "}
            {organisation.kayntiosoite.postitoimipaikka}
          </p>
          <p>
            {organisationPhoneNumber && (
              <React.Fragment>
                <a
                  href={`tel:${organisationPhoneNumber}`}
                  className="underline">
                  {organisationPhoneNumber}
                </a>{" "}
                |{" "}
              </React.Fragment>
            )}
            {organisationPhoneNumber && (
              <React.Fragment>
                <a href={`mailto:${organisationEmail}`} className="underline">
                  {organisationEmail}
                </a>{" "}
                |{" "}
              </React.Fragment>
            )}
            {organisation.ytunnus} |{" "}
            {organisationWebsite && (
              <a href={organisationWebsite} className="underline">
                {organisationWebsite}
              </a>
            )}
          </p>
        </div>
      </div>
      <div
        id="wizard-content"
        className="px-16 xl:w-3/4 max-w-7xl m-auto mb-20">
        <EsittelijatMuutospyynto
          kielet={kielet}
          kohteet={kohteet}
          koulutukset={koulutukset}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          kunnat={kunnat}
          maakuntakunnat={maakuntakunnat}
          maakunnat={maakunnat}
          maaraykset={maaraykset}
          lupaKohteet={lupaKohteet}
          maaraystyypit={maaraystyypit}
          muut={muut}
          tutkinnot={tutkinnot}
        />
      </div>
    </div>
  );
};

export default Lupanakyma;
