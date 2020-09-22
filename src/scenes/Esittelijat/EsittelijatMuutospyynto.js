import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";
import Tutkinnot from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Tutkinnot";
import MuutospyyntoWizardKielet from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKielet";
import MuutospyyntoWizardKoulutukset from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardMuut from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardMuut";
import MuutospyyntoWizardOpiskelijavuodet from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardToimintaalue from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardToimintaalue";
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
  lupa: {},
  lupaKohteet: {},
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  opiskelijavuodet: [],
  tutkinnot: []
};

const EsittelijatMuutospyynto = React.memo(
  ({
    changeObjects,
    kielet = defaultProps.kielet,
    kohteet: osiokohteet = defaultProps.kohteet,
    koulutukset = defaultProps.koulutukset,
    koulutusalat = defaultProps.koulutusalat,
    koulutustyypit = defaultProps.koulutustyypit,
    kunnat = defaultProps.kunnat,
    maakuntakunnat = defaultProps.maakuntakunnat,
    maakunnat = defaultProps.maakunnat,
    lupa = defaultProps.lupa,
    lupaKohteet = defaultProps.lupaKohteet,
    maaraystyypit: maaraystyypitRaw = defaultProps.maaraystyypit,
    muut = defaultProps.muut,
    opetuskielet = defaultProps.opetuskielet,
    opiskelijavuodet = defaultProps.opiskelijavuodet,
    tutkinnot = defaultProps.tutkinnot,

    // Callback methods
    handleSubmit,
    onChangesUpdate,
    onUpdate
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

    const onChangesRemove = useCallback(
      sectionId => {
        return onChangesUpdate(sectionId, []);
      },
      [onChangesUpdate]
    );

    const updateChanges = useCallback(
      payload => {
        onChangesUpdate(payload.anchor, payload.changes);
      },
      [onChangesUpdate]
    );

    const valtakunnallinenMaarays = R.find(
      R.propEq("koodisto", "nuts1"),
      R.prop("maaraykset", lupa) || []
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
              changeObjects={changeObjects.tutkinnot}
              koulutusalat={koulutusalat}
              koulutustyypit={koulutustyypit}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              tutkinnot={tutkinnot}
            />
            <h4 className="pt-8 pb-4">
              {intl.formatMessage(common.koulutukset)}
            </h4>
            <MuutospyyntoWizardKoulutukset
              changeObjects={changeObjects}
              key="koulutukset"
              koulutukset={koulutukset}
              maaraykset={lupa.maaraykset}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
            />
          </Section>

          <Section
            code={sectionHeadings.opetusJaTutkintokieli.number}
            title={sectionHeadings.opetusJaTutkintokieli.title}>
            <MuutospyyntoWizardKielet
              changeObjects={changeObjects}
              kielet={kielet}
              koulutusalat={koulutusalat}
              koulutustyypit={koulutustyypit}
              lupaKohteet={lupaKohteet}
              koulutukset={koulutukset}
              onUpdate={onUpdate}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              opetuskielet={opetuskielet}
              sectionId={"tutkinnot"}
              tutkinnot={tutkinnot}
            />
          </Section>

          <Section
            code={sectionHeadings.toimintaalue.number}
            title={sectionHeadings.toimintaalue.title}>
            <MuutospyyntoWizardToimintaalue
              changeObjects={changeObjects}
              lupakohde={lupaKohteet[3]}
              kunnat={kunnat}
              maakuntakunnat={maakuntakunnat}
              maakunnat={maakunnat}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              sectionId={"toimintaalue"}
              valtakunnallinenMaarays={valtakunnallinenMaarays}
            />
          </Section>

          {kohteet.opiskelijavuodet && (
            <Section
              code={sectionHeadings.opiskelijavuodet.number}
              title={sectionHeadings.opiskelijavuodet.title}>
              <MuutospyyntoWizardOpiskelijavuodet
                changeObjects={changeObjects}
                lupaKohteet={lupaKohteet}
                maaraykset={lupa.maaraykset}
                muut={muut}
                opiskelijavuodet={opiskelijavuodet}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={updateChanges}
                sectionId={"opiskelijavuodet"}
              />
            </Section>
          )}

          {kohteet.muut && muut && maaraystyypit && (
            <Section
              code={sectionHeadings.muut.number}
              title={sectionHeadings.muut.title}>
              <MuutospyyntoWizardMuut
                changeObjects={changeObjects}
                maaraykset={lupa.maaraykset}
                muut={muut}
                koulutukset={koulutukset}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={updateChanges}
                sectionId={"muut"}
              />
            </Section>
          )}
        </form>
      </React.Fragment>
    );
  },
  (currentProps, nextProps) => {
    return (
      R.equals(currentProps.changeObjects, nextProps.changeObjects) &&
      R.equals(currentProps.kielet, nextProps.kielet) &&
      R.equals(currentProps.lupa, nextProps.lupa) &&
      R.equals(currentProps.koulutusalat, nextProps.koulutusalat) &&
      R.equals(currentProps.koulutustyypit, nextProps.koulutustyypit) &&
      R.equals(currentProps.tutkinnot, nextProps.tutkinnot) &&
      R.equals(currentProps.lupaKohteet, nextProps.lupaKohteet) &&
      R.equals(currentProps.maaraystyypit, nextProps.maaraystyypit)
    );
  }
);

EsittelijatMuutospyynto.propTypes = {
  kielet: PropTypes.array,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maakunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array,
  opiskelijavuodet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default EsittelijatMuutospyynto;
