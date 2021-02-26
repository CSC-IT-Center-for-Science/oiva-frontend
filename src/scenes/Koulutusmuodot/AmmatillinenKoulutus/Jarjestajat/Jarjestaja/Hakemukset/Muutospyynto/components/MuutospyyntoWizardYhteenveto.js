import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import wizard from "i18n/definitions/wizard";
import { Typography } from "@material-ui/core";
import Lomake from "components/02-organisms/Lomake";
import { find, prop, mapObjIndexed, values } from "ramda";
import MuutospyyntoWizardTaloudelliset from "./MuutospyyntoWizardTaloudelliset";
import EsittelijatMuutospyynto from "scenes/Koulutusmuodot/AmmatillinenKoulutus/EsittelijatMuutospyynto";
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "stores/muutokset";

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
  muut
}) => {
  const [
    changeObjectsYleisetTiedot
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "yhteenveto_yleisettiedot"
  });
  const [
    changeObjectsHakemuksenLiiteet
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "yhteenveto_hakemuksenLiitteet"
  });

  const [tutkinnotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "tutkinnot"
  });

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
    <React.Fragment>
      <div className="mt-12">
        <Typography component="h2" variant="h2">
          {intl.formatMessage(wizard.pageTitle_4)}
        </Typography>
      </div>

      <Typography component="h4" variant="h4">
        Organisaation tiedot
      </Typography>

      <div className="mb-12">{jarjestajaLayout}</div>

      <Lomake
        anchor="yhteenveto_yleisettiedot"
        changeObjects={changeObjectsYleisetTiedot}
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
        lupaKohteet={lupaKohteet}
        maaraykset={maaraykset}
        maaraystyypit={maaraystyypit}
        mode={mode}
        muut={muut}
      />

      <div className="mt-20">
        <MuutospyyntoWizardTaloudelliset
          isReadOnly={true}
          tutkinnotCO={tutkinnotCO}
        />
      </div>

      <Lomake
        anchor={"yhteenveto_hakemuksenLiitteet"}
        changeObjects={changeObjectsHakemuksenLiiteet}
        isReadOnly={true}
        isRowExpanded={true}
        mode="modification"
        path={["yhteenveto", "liitteet"]}
        rowTitle={intl.formatMessage(wizard.otherAttachments)}
        showCategoryTitles={true}
      ></Lomake>
    </React.Fragment>
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
