import React, { useMemo } from "react";
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants";
import FormSection from "../../../../../../components/03-templates/FormSection";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import * as R from "ramda";
import YhteenvetoYleisetTiedot from "./Yhteenveto/YhteenvetoYleisetTiedot";
import YhteenvetoKooste from "./Yhteenveto/YhteenvetoKooste";
import YhteenvetoLiitteet from "./Yhteenveto/YhteenvetoLiitteet";

const MuutospyyntoWizardYhteenveto = ({
  changeObjects,
  intl,
  kielet,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  lupa,
  maaraystyypit,
  muut,
  muutoshakemus,
  onChangesUpdate,
  onStateUpdate
}) => {
  const jarjestaja = useMemo(() => {
    const nimi = {
      label: "Nimi",
      value: lupa.data.jarjestaja.nimi[intl.locale]
    };

    const kayntiosoite = {
      label: "Käyntiosoite",
      value: `${lupa.data.jarjestaja.kayntiosoite.osoite} ${lupa.data.jarjestaja.kayntiosoite.postitoimipaikka}`
    };

    const postiosoite = {
      label: "Postiosoite",
      value: `${lupa.data.jarjestaja.postiosoite.osoite} ${lupa.data.jarjestaja.postiosoite.postitoimipaikka}`
    };

    const sahkopostiosoite = {
      label: "Sähköpostiosoite",
      value: (R.find(R.prop("email"))(lupa.data.jarjestaja.yhteystiedot) || {})
        .email || "-"
    };

    const www = {
      label: "WWW-osoite",
      value: (R.find(R.prop("www"))(lupa.data.jarjestaja.yhteystiedot) || {})
        .www || "-"
    };
  
    const puhelinnumero = {
      label: "Puhelinnumero",
      value: (R.find(R.prop("numero"))(lupa.data.jarjestaja.yhteystiedot) || {})
        .numero || "-"
    };

    return {
      nimi,
      kayntiosoite,
      postiosoite,
      puhelinnumero,
      sahkopostiosoite,
      www,
    };
  }, [intl.locale, lupa.data.jarjestaja]);

  const jarjestajaLayout = useMemo(() => {
    return R.values(
      R.mapObjIndexed((obj, key) => {
        return (
          <div className="flex" key={key}>
            <div className="w-1/2 sm:w-1/4 border-b px-6 py-2">
              {obj.label}
            </div>
            <div className="w-1/2 sm:w-3/4 bg-white px-6 py-2">{obj.value}</div>
          </div>
        );
      }, jarjestaja)
    );
  }, [jarjestaja]);

  return (
    <React.Fragment>
      <h2 className="my-6">{MUUTOS_WIZARD_TEKSTIT.YHTEENVETO.HEADING.FI}</h2>

      <h4 className="my-6">Organisaation tiedot</h4>

      <div className="mb-12">{jarjestajaLayout}</div>

      <FormSection
        id="yhteenveto_yleisettiedot"
        className="my-0"
        render={_props => (
          <React.Fragment>
            <YhteenvetoYleisetTiedot
              stateObject={R.path(
                ["yhteenveto", "yleisettiedot"],
                muutoshakemus
              )}
              changeObjects={{
                yhteenveto: R.path(
                  ["yhteenveto", "yleisettiedot"],
                  changeObjects
                )
              }}
              {..._props}
            />
            <YhteenvetoKooste
              changeObjects={changeObjects}
              kielet={kielet}
              kohteet={kohteet}
              koulutukset={koulutukset}
              koulutusalat={koulutusalat}
              koulutustyypit={koulutustyypit}
              lupa={lupa}
              maaraystyypit={maaraystyypit}
              muut={muut}
              muutoshakemus={muutoshakemus}
              onChangesUpdate={onChangesUpdate}
              onStateUpdate={onStateUpdate}
            ></YhteenvetoKooste>
          </React.Fragment>
        )}
        runOnStateUpdate={onStateUpdate}
        runOnChanges={onChangesUpdate}
      />
      <FormSection
        id="yhteenveto_hakemuksenliitteet"
        className="my-0"
        render={_props => (
          <React.Fragment>
            <YhteenvetoLiitteet
              stateObject={R.path(
                ["yhteenveto", "hakemuksenliitteet"],
                muutoshakemus
              )}
              changeObjects={{
                yhteenveto: R.path(
                  ["yhteenveto", "hakemuksenliitteet"],
                  changeObjects
                )
              }}
              {..._props}
            />
          </React.Fragment>
        )}
        runOnStateUpdate={onStateUpdate}
        runOnChanges={onChangesUpdate}
      />
    </React.Fragment>
  );
};

MuutospyyntoWizardYhteenveto.propTypes = {
  changeObjects: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.object,
  lupa: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func
};

export default injectIntl(MuutospyyntoWizardYhteenveto);
