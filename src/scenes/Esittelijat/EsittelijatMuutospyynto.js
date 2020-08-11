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

const EsittelijatMuutospyynto = React.memo(
  props => {
    const intl = useIntl();
    const [kohteet, setKohteet] = useState({});
    const [maaraystyypit, setMaaraystyypit] = useState(null);

    const { onChangesUpdate } = props;

    useEffect(() => {
      const _kohteet = R.mergeAll(
        R.flatten(
          R.map(item => {
            return {
              [R.props(["tunniste"], item)]: item
            };
          }, props.kohteet)
        )
      );
      setKohteet(_kohteet);
    }, [props.kohteet]);

    useEffect(() => {
      const _maaraystyypit = R.mergeAll(
        R.flatten(
          R.map(item => {
            return {
              [R.props(["tunniste"], item)]: item
            };
          }, props.maaraystyypit)
        )
      );
      setMaaraystyypit(_maaraystyypit);
    }, [props.maaraystyypit]);

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
      props.lupa.maaraykset || []
    );

    return (
      <React.Fragment>
        <h2 className="my-6">{intl.formatMessage(common.changesText)}</h2>
        <form onSubmit={props.handleSubmit}>
          <Section
            code={props.lupaKohteet[1].headingNumber}
            title={props.lupaKohteet[1].heading}>
            <h4 className="pb-4">{intl.formatMessage(common.tutkinnot)}</h4>
            <Tutkinnot
              changeObjects={props.changeObjects.tutkinnot}
              koulutusalat={props.koulutusalat}
              koulutustyypit={props.koulutustyypit}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              tutkinnot={props.tutkinnot}
            />
            <h4 className="pt-8 pb-4">
              {intl.formatMessage(common.koulutukset)}
            </h4>
            <MuutospyyntoWizardKoulutukset
              changeObjects={props.changeObjects}
              key="koulutukset"
              koulutukset={props.koulutukset}
              maaraykset={props.lupa.maaraykset}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
            />
          </Section>

          <Section
            code={props.lupaKohteet[2].headingNumber}
            title={props.lupaKohteet[2].heading}>
            <MuutospyyntoWizardKielet
              changeObjects={props.changeObjects}
              kielet={props.kielet}
              koulutusalat={props.koulutusalat}
              koulutustyypit={props.koulutustyypit}
              lupa={props.lupa}
              lupaKohteet={props.lupaKohteet}
              koulutukset={props.koulutukset}
              onUpdate={props.onUpdate}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              opetuskielet={props.opetuskielet}
              sectionId={"tutkinnot"}
              tutkinnot={props.tutkinnot}
            />
          </Section>

          <Section
            code={props.lupaKohteet[3].headingNumber}
            title={props.lupaKohteet[3].heading}>
            <MuutospyyntoWizardToimintaalue
              changeObjects={props.changeObjects}
              lupakohde={props.lupaKohteet[3]}
              kunnat={props.kunnat}
              maakuntakunnat={props.maakuntakunnat}
              maakunnat={props.maakunnat}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              sectionId={"toimintaalue"}
              valtakunnallinenMaarays={valtakunnallinenMaarays}
            />
          </Section>

          {kohteet.opiskelijavuodet && (
            <Section
              code={props.lupaKohteet[4].headingNumber}
              title={props.lupaKohteet[4].heading}>
              <MuutospyyntoWizardOpiskelijavuodet
                changeObjects={props.changeObjects}
                lupaKohteet={props.lupaKohteet}
                maaraykset={props.lupa.maaraykset}
                muut={props.muut}
                opiskelijavuodet={props.opiskelijavuodet}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={updateChanges}
                sectionId={"opiskelijavuodet"}
              />
            </Section>
          )}

          {kohteet.muut && props.muut && maaraystyypit && (
            <Section
              code={props.lupaKohteet[5].headingNumber}
              title={props.lupaKohteet[5].heading}>
              <MuutospyyntoWizardMuut
                changeObjects={props.changeObjects}
                maaraykset={props.lupa.maaraykset}
                muut={props.muut}
                koulutukset={props.koulutukset}
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

EsittelijatMuutospyynto.defaultProps = {
  maaraystyypit: []
};

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
  tutkinnot: PropTypes.array
};

export default EsittelijatMuutospyynto;
