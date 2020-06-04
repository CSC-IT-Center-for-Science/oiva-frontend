import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import wizardMessages from "../../i18n/definitions/wizard";
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
        <h1 className="my-6">
          {intl.formatMessage(wizardMessages.pageTitle_1)}
        </h1>
        <form onSubmit={props.handleSubmit}>
          <Section
            code={props.lupaKohteet[1].headingNumber}
            title={props.lupaKohteet[1].heading}>
            <h4 className="pb-4">{intl.formatMessage(common.tutkinnot)}</h4>
            <Tutkinnot
              tutkinnot={props.tutkinnot}
              lupaKohteet={props.lupaKohteet}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              sectionId={"tutkinnot"}
            />
            <h4 className="pt-8 pb-4">
              {intl.formatMessage(common.koulutukset)}
            </h4>
            <MuutospyyntoWizardKoulutukset
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
              lupa={props.lupa}
              lupaKohteet={props.lupaKohteet}
              kielet={props.kielet}
              koulutukset={props.koulutukset}
              tutkintolomakkeet={props.lomakkeet.tutkinnot}
              onUpdate={props.onUpdate}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              sectionId={"tutkinnot"}
            />
          </Section>
          <Section
            code={props.lupaKohteet[3].headingNumber}
            title={props.lupaKohteet[3].heading}>
            <MuutospyyntoWizardToimintaalue
              lupakohde={props.lupaKohteet[3]}
              kunnat={props.kunnat}
              maakuntakunnatList={props.maakuntakunnatList}
              maakunnat={props.maakunnat}
              onChangesRemove={onChangesRemove}
              onChangesUpdate={updateChanges}
              sectionId={"toimintaalue"}
              valtakunnallinenMaarays={valtakunnallinenMaarays}
            />
          </Section>

          {kohteet.opiskelijavuodet && !R.isEmpty(props.lomakkeet.muut) && (
            <Section
              code={props.lupaKohteet[4].headingNumber}
              title={props.lupaKohteet[4].heading}>
              <MuutospyyntoWizardOpiskelijavuodet
                lupaKohteet={props.lupaKohteet}
                maaraykset={props.lupa.maaraykset}
                muut={props.muut}
                opiskelijavuodet={props.opiskelijavuodet}
                lomakkeet={{
                  opiskelijavuodet: props.lomakkeet.opiskelijavuodet,
                  muut: props.lomakkeet.muut
                }}
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
      R.equals(currentProps.kielet, nextProps.kielet) &&
      JSON.stringify(currentProps.lomakkeet) ===
        JSON.stringify(nextProps.lomakkeet) &&
      JSON.stringify(currentProps.lupa) === JSON.stringify(nextProps.lupa) &&
      JSON.stringify(currentProps.lupaKohteet) ===
        JSON.stringify(nextProps.lupaKohteet) &&
      JSON.stringify(currentProps.maaraystyypit) ===
        JSON.stringify(nextProps.maaraystyypit)
    );
  }
);

EsittelijatMuutospyynto.defaultProps = {
  maaraystyypit: []
};

EsittelijatMuutospyynto.propTypes = {
  kielet: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  kunnat: PropTypes.array,
  maakuntakunnatList: PropTypes.array,
  maakunnat: PropTypes.array,
  lomakkeet: PropTypes.object,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  tutkinnot: PropTypes.object
};

export default EsittelijatMuutospyynto;
