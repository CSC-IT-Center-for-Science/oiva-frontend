import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import Tutkinnot from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Tutkinnot";
import MuutospyyntoWizardKoulutukset from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardMuut from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardMuut";
import MuutospyyntoWizardOpiskelijavuodet from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardToimintaalue from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardToimintaalue";
import Section from "components/03-templates/Section";
import MuutospyyntoWizardTopThree from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardTopThree";
import Tutkintokielet from "scenes/Koulutusmuodot/AmmatillinenKoulutus/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Kielet/Tutkintokielet";
import { Typography } from "@material-ui/core";
import FormTitle from "components/00-atoms/FormTitle";
import MuutospyyntoWizardOpetuskielet from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpetuskielet";
import * as R from "ramda";
import isEqual from "react-fast-compare";

const defaultProps = {
  isPreviewModeOn: false,
  isReadOnly: false,
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

const EsittelijatMuutospyynto = React.memo(
  ({
    isPreviewModeOn = defaultProps.isPreviewModeOn,
    isReadOnly = defaultProps.isReadOnly,
    kohteet: osiokohteet = defaultProps.kohteet,
    koulutukset = defaultProps.koulutukset,
    koulutusalat = defaultProps.koulutusalat,
    koulutustyypit = defaultProps.koulutustyypit,
    maaraykset = defaultProps.maaraykset,
    lupaKohteet = defaultProps.lupaKohteet,
    maaraystyypit: maaraystyypitRaw = defaultProps.maaraystyypit,
    mode,
    muut = defaultProps.muut,
    opiskelijavuodet = defaultProps.opiskelijavuodet,
    role,
    title
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

    return isPreviewModeOn ? (
      <div>Esikatselua ei ole toteutettu, kuin PDF:nä.</div>
    ) : (
      <form>
        {role === "ESITTELIJA" && (
          <Section>
            <div className="w-1/3">
              <Typography component="h2" variant="h2">
                {intl.formatMessage(common.decisionDetails)}
              </Typography>
              <MuutospyyntoWizardTopThree />
            </div>
          </Section>
        )}
        <Typography component="h2" variant="h2">
          {title}
        </Typography>
        <FormTitle
          code={String(sectionHeadings.tutkinnotJaKoulutukset.number)}
          level={isReadOnly ? 3 : 2}
          title={sectionHeadings.tutkinnotJaKoulutukset.title}
        />
        <Tutkinnot
          code={sectionHeadings.tutkinnotJaKoulutukset.number}
          isPreviewModeOn={isPreviewModeOn}
          isReadOnly={isReadOnly}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          mode={mode}
          title={sectionHeadings.tutkinnotJaKoulutukset.title}
        />
        <Typography component="h4" variant="h4">
          {intl.formatMessage(common.koulutukset)}
        </Typography>
        <MuutospyyntoWizardKoulutukset
          isReadOnly={isReadOnly}
          koulutukset={koulutukset}
          maaraykset={maaraykset}
          mode={mode}
        />

        <MuutospyyntoWizardOpetuskielet
          isReadOnly={isReadOnly}
          mode={mode}
          sectionHeadingsOpetusJaTutkintokieli={
            sectionHeadings.opetusJaTutkintokieli
          }
        ></MuutospyyntoWizardOpetuskielet>

        <Tutkintokielet
          koulutusalat={koulutusalat}
          maaraykset={maaraykset}
          mode={mode}
        />

        <MuutospyyntoWizardToimintaalue
          code={String(sectionHeadings.toimintaalue.number)}
          isReadOnly={isReadOnly}
          lupakohde={lupaKohteet[3]}
          mode={mode}
          sectionId={"toimintaalue"}
          title={sectionHeadings.toimintaalue.title}
          valtakunnallinenMaarays={valtakunnallinenMaarays}
        />

        {kohteet.opiskelijavuodet && (
          <MuutospyyntoWizardOpiskelijavuodet
            code={String(sectionHeadings.opiskelijavuodet.number)}
            lupaKohteet={lupaKohteet}
            maaraykset={maaraykset}
            mode={mode}
            muut={muut}
            opiskelijavuodet={opiskelijavuodet}
            sectionId={"opiskelijavuodet"}
            title={sectionHeadings.opiskelijavuodet.title}
          />
        )}
        {kohteet.muut && muut && maaraystyypit && (
          <MuutospyyntoWizardMuut
            code={sectionHeadings.muut.number}
            isReadOnly={isReadOnly}
            maaraykset={maaraykset}
            mode={mode}
            muut={muut}
            sectionId={"muut"}
            title={sectionHeadings.muut.title}
          />
        )}
      </form>
    );
  },
  (cp, np) => isEqual(cp, np)
);

EsittelijatMuutospyynto.propTypes = {
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  maaraykset: PropTypes.array,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  opiskelijavuodet: PropTypes.array,
  role: PropTypes.string
};

export default EsittelijatMuutospyynto;
