import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import wizardMessages from "i18n/definitions/wizard";
import Tutkinnot from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Tutkinnot";
import MuutospyyntoWizardKoulutukset from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardMuut from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardMuut";
import MuutospyyntoWizardOpiskelijavuodet from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardToimintaalue from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardToimintaalue";
import Section from "components/03-templates/Section";
import MuutospyyntoWizardTopThree from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardTopThree";
import Lomake from "components/02-organisms/Lomake";
import * as R from "ramda";
import Tutkintokielet from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Kielet/Tutkintokielet";
import { Typography } from "@material-ui/core";
import FormTitle from "components/00-atoms/FormTitle";

const constants = {
  formLocation: {
    opetuskielet: ["kielet", "opetuskielet"]
  }
};

const defaultProps = {
  kohteet: [],
  koulutukset: {},
  koulutusalat: [],
  koulutustyypit: [],
  maaraykset: [],
  lupaKohteet: {},
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  opiskelijavuodet: []
};

const EsittelijatMuutospyynto = ({
  kohteet: osiokohteet = defaultProps.kohteet,
  koulutukset = defaultProps.koulutukset,
  koulutusalat = defaultProps.koulutusalat,
  koulutustyypit = defaultProps.koulutustyypit,
  maaraykset = defaultProps.maaraykset,
  lupaKohteet = defaultProps.lupaKohteet,
  maaraystyypit: maaraystyypitRaw = defaultProps.maaraystyypit,
  muut = defaultProps.muut,
  opiskelijavuodet = defaultProps.opiskelijavuodet,
  // Callback methods
  handleSubmit
}) => {
  const intl = useIntl();
  const [kohteet, setKohteet] = useState({});
  const [maaraystyypit, setMaaraystyypit] = useState(null);

  useEffect(() => {
    const _kohteet = R.mergeAll(
      R.flatten(
        R.map(item => {
          return {
            [R.props(["tunniste"], item)]: item
          };
        }, osiokohteet)
      )
    );
    setKohteet(_kohteet);
  }, [osiokohteet]);

  useEffect(() => {
    const _maaraystyypit = R.mergeAll(
      R.flatten(
        R.map(item => {
          return {
            [R.props(["tunniste"], item)]: item
          };
        }, maaraystyypitRaw)
      )
    );
    setMaaraystyypit(_maaraystyypit);
  }, [maaraystyypitRaw]);

  const valtakunnallinenMaarays = R.find(
    R.propEq("koodisto", "nuts1"),
    maaraykset
  );

  const sectionHeadings = useMemo(
    () => ({
      tutkinnotJaKoulutukset: {
        number: R.path(["1", "headingNumber"], lupaKohteet) || "1",
        title:
          R.path(["1", "heading"], lupaKohteet) ||
          intl.formatMessage(common.lupaSectionTutkinnotMainTitle)
      },
      opetusJaTutkintokieli: {
        number: R.path(["2", "headingNumber"], lupaKohteet) || "2",
        title:
          R.path(["2", "heading"], lupaKohteet) ||
          intl.formatMessage(common.lupaSectionOpetuskieliMainTitle)
      },
      toimintaalue: {
        number: R.path(["3", "headingNumber"], lupaKohteet) || "3",
        title:
          R.path(["3", "heading"], lupaKohteet) ||
          intl.formatMessage(common.lupaSectionToimintaAlueMainTitle)
      },
      opiskelijavuodet: {
        number: R.path(["4", "headingNumber"], lupaKohteet) || "4",
        title:
          R.path(["4", "heading"], lupaKohteet) ||
          intl.formatMessage(common.lupaSectionOpiskelijavuodetMainTitle)
      },
      muut: {
        number: R.path(["5", "headingNumber"], lupaKohteet) || "5",
        title:
          R.path(["5", "heading"], lupaKohteet) ||
          intl.formatMessage(common.lupaSectionMuutMainTitle)
      }
    }),
    [intl, lupaKohteet]
  );

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <Section>
          <div className="w-1/3">
            <Typography component="h2" variant="h2">
              {intl.formatMessage(common.decisionDetails)}
            </Typography>
            <MuutospyyntoWizardTopThree />
          </div>
        </Section>

        <Typography component="h2" variant="h2">
          {intl.formatMessage(common.changesText)}
        </Typography>

        <FormTitle
          code={String(sectionHeadings.tutkinnotJaKoulutukset.number)}
          title={sectionHeadings.tutkinnotJaKoulutukset.title}
        />

        <Tutkinnot
          code={sectionHeadings.tutkinnotJaKoulutukset.number}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          title={sectionHeadings.tutkinnotJaKoulutukset.title}
        />

        <Typography component="h4" variant="h4">
          {intl.formatMessage(common.koulutukset)}
        </Typography>

        <MuutospyyntoWizardKoulutukset
          koulutukset={koulutukset}
          maaraykset={maaraykset}
        />

        <Lomake
          anchor={"kielet_opetuskielet"}
          code={String(sectionHeadings.opetusJaTutkintokieli.number)}
          formTitle={sectionHeadings.opetusJaTutkintokieli.title}
          isPreviewModeOn={false}
          isRowExpanded={true}
          mode="modification"
          path={constants.formLocation.opetuskielet}
          rowTitle={intl.formatMessage(wizardMessages.teachingLanguages)}
          showCategoryTitles={true}
        />

        <Tutkintokielet koulutusalat={koulutusalat} />

        <MuutospyyntoWizardToimintaalue
          code={String(sectionHeadings.toimintaalue.number)}
          lupakohde={lupaKohteet[3]}
          sectionId={"toimintaalue"}
          title={sectionHeadings.toimintaalue.title}
          valtakunnallinenMaarays={valtakunnallinenMaarays}
        />

        {kohteet.opiskelijavuodet && (
          <MuutospyyntoWizardOpiskelijavuodet
            code={String(sectionHeadings.opiskelijavuodet.number)}
            lupaKohteet={lupaKohteet}
            maaraykset={maaraykset}
            muut={muut}
            opiskelijavuodet={opiskelijavuodet}
            sectionId={"opiskelijavuodet"}
            title={sectionHeadings.opiskelijavuodet.title}
          />
        )}

        {kohteet.muut && muut && maaraystyypit && (
          <MuutospyyntoWizardMuut
            code={sectionHeadings.muut.number}
            maaraykset={maaraykset}
            muut={muut}
            sectionId={"muut"}
            title={sectionHeadings.muut.title}
          />
        )}
      </form>
    </React.Fragment>
  );
};

EsittelijatMuutospyynto.propTypes = {
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  maaraykset: PropTypes.array,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  opiskelijavuodet: PropTypes.array
};

export default EsittelijatMuutospyynto;
