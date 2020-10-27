import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";
import Tutkinnot from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Tutkinnot";
import MuutospyyntoWizardKielet from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKielet";
import MuutospyyntoWizardKoulutukset from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardMuut from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardMuut";
import MuutospyyntoWizardOpiskelijavuodet from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardToimintaalue from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardToimintaalue";
import * as R from "ramda";
import Section from "../../components/03-templates/Section";

const defaultProps = {
  kielet: [],
  kohteet: [],
  koulutukset: {},
  koulutusalat: [],
  koulutustyypit: [],
  kunnat: [],
  maakuntakunnat: [],
  maakunnat: [],
  maaraykset: [],
  lupaKohteet: {},
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  opiskelijavuodet: [],
  tutkinnot: []
};

const EsittelijatMuutospyynto = ({
  kielet = defaultProps.kielet,
  kohteet: osiokohteet = defaultProps.kohteet,
  koulutukset = defaultProps.koulutukset,
  koulutusalat = defaultProps.koulutusalat,
  koulutustyypit = defaultProps.koulutustyypit,
  kunnat = defaultProps.kunnat,
  maakuntakunnat = defaultProps.maakuntakunnat,
  maakunnat = defaultProps.maakunnat,
  maaraykset = defaultProps.maaraykset,
  lupaKohteet = defaultProps.lupaKohteet,
  maaraystyypit: maaraystyypitRaw = defaultProps.maaraystyypit,
  muut = defaultProps.muut,
  opetuskielet = defaultProps.opetuskielet,
  opiskelijavuodet = defaultProps.opiskelijavuodet,
  tutkinnot = defaultProps.tutkinnot,

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

  const sectionHeadings = {
    tutkinnotJaKoulutukset: {
      number: R.path(["1", "headingNumber"], lupaKohteet) || 1,
      title:
        R.path(["1", "heading"], lupaKohteet) ||
        intl.formatMessage(common.lupaSectionTutkinnotMainTitle)
    },
    opetusJaTutkintokieli: {
      number: R.path(["2", "headingNumber"], lupaKohteet) || 2,
      title:
        R.path(["2", "heading"], lupaKohteet) ||
        intl.formatMessage(common.lupaSectionOpetuskieliMainTitle)
    },
    toimintaalue: {
      number: R.path(["3", "headingNumber"], lupaKohteet) || 3,
      title:
        R.path(["3", "heading"], lupaKohteet) ||
        intl.formatMessage(common.lupaSectionToimintaAlueMainTitle)
    },
    opiskelijavuodet: {
      number: R.path(["4", "headingNumber"], lupaKohteet) || 4,
      title:
        R.path(["4", "heading"], lupaKohteet) ||
        intl.formatMessage(common.lupaSectionOpiskelijavuodetMainTitle)
    },
    muut: {
      number: R.path(["5", "headingNumber"], lupaKohteet) || 5,
      title:
        R.path(["5", "heading"], lupaKohteet) ||
        intl.formatMessage(common.lupaSectionMuutMainTitle)
    }
  };

  return (
    <React.Fragment>
      <h2 className="my-6">{intl.formatMessage(common.changesText)}</h2>
      <form onSubmit={handleSubmit}>
        <Section
          code={sectionHeadings.tutkinnotJaKoulutukset.number}
          title={sectionHeadings.tutkinnotJaKoulutukset.title}>
          <h4 className="pb-4">{intl.formatMessage(common.tutkinnot)}</h4>
          <Tutkinnot
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            tutkinnot={tutkinnot}
          />
          <h4 className="pt-8 pb-4">
            {intl.formatMessage(common.koulutukset)}
          </h4>
          <MuutospyyntoWizardKoulutukset
            koulutukset={koulutukset}
            maaraykset={maaraykset}
          />
        </Section>

        <Section
          code={sectionHeadings.opetusJaTutkintokieli.number}
          title={sectionHeadings.opetusJaTutkintokieli.title}>
          <MuutospyyntoWizardKielet
            kielet={kielet}
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            lupaKohteet={lupaKohteet}
            koulutukset={koulutukset}
            opetuskielet={opetuskielet}
            sectionId={"tutkinnot"}
            tutkinnot={tutkinnot}
          />
        </Section>

        <Section
          code={sectionHeadings.toimintaalue.number}
          title={sectionHeadings.toimintaalue.title}>
          <MuutospyyntoWizardToimintaalue
            lupakohde={lupaKohteet[3]}
            kunnat={kunnat}
            maakuntakunnat={maakuntakunnat}
            maakunnat={maakunnat}
            sectionId={"toimintaalue"}
            valtakunnallinenMaarays={valtakunnallinenMaarays}
          />
        </Section>

        {kohteet.opiskelijavuodet && (
          <Section
            code={sectionHeadings.opiskelijavuodet.number}
            title={sectionHeadings.opiskelijavuodet.title}>
            <MuutospyyntoWizardOpiskelijavuodet
              lupaKohteet={lupaKohteet}
              maaraykset={maaraykset}
              muut={muut}
              opiskelijavuodet={opiskelijavuodet}
              sectionId={"opiskelijavuodet"}
            />
          </Section>
        )}

        {kohteet.muut && muut && maaraystyypit && (
          <Section
            code={sectionHeadings.muut.number}
            title={sectionHeadings.muut.title}>
            <MuutospyyntoWizardMuut
              maaraykset={maaraykset}
              muut={muut}
              koulutukset={koulutukset}
              sectionId={"muut"}
            />
          </Section>
        )}
      </form>
    </React.Fragment>
  );
};

EsittelijatMuutospyynto.propTypes = {
  kielet: PropTypes.array,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraykset: PropTypes.object,
  maakunnat: PropTypes.array,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  opetuskielet: PropTypes.array,
  opiskelijavuodet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default EsittelijatMuutospyynto;
