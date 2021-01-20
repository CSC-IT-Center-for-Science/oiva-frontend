import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import wizard from "i18n/definitions/wizard";
import { Typography } from "@material-ui/core";
import Lomake from "components/02-organisms/Lomake";
import { find, prop, mapObjIndexed, values } from "ramda";
import MuutospyyntoWizardTaloudelliset from "./MuutospyyntoWizardTaloudelliset";
import EsittelijatMuutospyynto from "scenes/Koulutusmuodot/AmmatillinenKoulutus/EsittelijatMuutospyynto";

const MuutospyyntoWizardYhteenveto = ({
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  lupa,
  lupaKohteet,
  maaraykset,
  maaraystyypit,
  mode,
  muut,
  tutkinnotCO
}) => {
  const intl = useIntl();
  const jarjestaja = useMemo(() => {
    const nimi = {
      label: "Nimi",
      value: lupa.jarjestaja.nimi[intl.locale]
    };

    const kayntiosoite = {
      label: "Käyntiosoite",
      value: `${lupa.jarjestaja.kayntiosoite.osoite} ${lupa.jarjestaja.kayntiosoite.postitoimipaikka}`
    };

    const postiosoite = {
      label: "Postiosoite",
      value: `${lupa.jarjestaja.postiosoite.osoite} ${lupa.jarjestaja.postiosoite.postitoimipaikka}`
    };

    const sahkopostiosoite = {
      label: "Sähköpostiosoite",
      value:
        (find(prop("email"))(lupa.jarjestaja.yhteystiedot) || {}).email || "-"
    };

    const www = {
      label: "WWW-osoite",
      value: (find(prop("www"))(lupa.jarjestaja.yhteystiedot) || {}).www || "-"
    };

    const puhelinnumero = {
      label: "Puhelinnumero",
      value:
        (find(prop("numero"))(lupa.jarjestaja.yhteystiedot) || {}).numero || "-"
    };

    return {
      nimi,
      kayntiosoite,
      postiosoite,
      puhelinnumero,
      sahkopostiosoite,
      www
    };
  }, [intl.locale, lupa.jarjestaja]);

  const jarjestajaLayout = useMemo(() => {
    return values(
      mapObjIndexed((obj, key) => {
        return (
          <div className="flex" key={key}>
            <div className="w-1/2 sm:w-1/4 border-b px-6 py-2">{obj.label}</div>
            <div className="w-1/2 sm:w-3/4 bg-white px-6 py-2">{obj.value}</div>
          </div>
        );
      }, jarjestaja)
    );
  }, [jarjestaja]);

  return (
    <div className="bg-vaalenharmaa px-16 pb-20 w-full m-auto mb-20 border-b border-xs border-harmaa">
      <Typography component="h2" variant="h2">
        {intl.formatMessage(wizard.pageTitle_4)}
      </Typography>

      <Typography component="h4" variant="h4">
        Organisaation tiedot
      </Typography>

      <div className="mb-12">{jarjestajaLayout}</div>

      <Lomake
        anchor="yhteenveto_yleisettiedot"
        isRowExpanded={true}
        mode="modification"
        path={["yhteenveto", "yleisetTiedot"]}
        rowTitle="Hakemuksen yleiset tiedot"
        showCategoryTitles={true}
      ></Lomake>

      <EsittelijatMuutospyynto
        isReadOnly={true}
        kohteet={kohteet}
        koulutukset={koulutukset}
        koulutusalat={koulutusalat}
        koulutustyypit={koulutustyypit}
        maaraykset={maaraykset}
        lupaKohteet={lupaKohteet}
        maaraystyypit={maaraystyypit}
        mode={mode}
        muut={muut}
      />

      <MuutospyyntoWizardTaloudelliset
        isReadOnly={true}
        tutkinnotCO={tutkinnotCO}
      />

      <Lomake
        anchor={"yhteenveto_hakemuksenLiitteet"}
        isRowExpanded={true}
        mode="modification"
        path={["yhteenveto", "liitteet"]}
        rowTitle={intl.formatMessage(wizard.otherAttachments)}
        showCategoryTitles={true}
      ></Lomake>
    </div>
  );
};

MuutospyyntoWizardYhteenveto.propTypes = {
  history: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  muutoshakemus: PropTypes.object,
  muutosperusteluList: PropTypes.array,
  tutkinnotCO: PropTypes.array
};

export default MuutospyyntoWizardYhteenveto;
