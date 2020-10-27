import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { find, head, includes, last, prop, values } from "ramda";
import common from "i18n/definitions/common";
import Lomake from "components/02-organisms/Lomake";
import { useParams } from "react-router-dom";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";
import { useValidity } from "./lomakedata";

const formLocations = {
  kolmeEnsimmaistaKenttaa: ["esittelija", "topThree"]
};

const Lupa = ({
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
  opetuskielet,
  organisation,
  tutkinnot
}) => {
  const intl = useIntl();
  const { uuid } = useParams();
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

  const topThreeData = useMemo(
    () => ({ formatMessage: intl.formatMessage, uuid }),
    [intl, uuid]
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
          <h1>
            {organisation.nimi[intl.locale] || last(values(organisation.nimi))}
          </h1>
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
        <div className="w-1/3" style={{ marginLeft: "-2rem" }}>
          <h2 className="p-8">{intl.formatMessage(common.decisionDetails)}</h2>
          <Lomake
            anchor="topthree"
            isInExpandableRow={false}
            data={topThreeData}
            path={formLocations.kolmeEnsimmaistaKenttaa}></Lomake>
        </div>
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
          opetuskielet={opetuskielet}
          tutkinnot={tutkinnot}
        />
      </div>
    </div>
  );
};

export default Lupa;
