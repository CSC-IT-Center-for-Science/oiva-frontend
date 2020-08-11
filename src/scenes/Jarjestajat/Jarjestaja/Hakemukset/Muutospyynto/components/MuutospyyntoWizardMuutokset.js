import React, { useEffect, useState } from "react";
import Tutkinnot from "./Tutkinnot";
import MuutospyyntoWizardKoulutukset from "./MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardKielet from "./MuutospyyntoWizardKielet";
import MuutospyyntoWizardToimintaalue from "./MuutospyyntoWizardToimintaalue";
import MuutospyyntoWizardOpiskelijavuodet from "./MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardMuut from "./MuutospyyntoWizardMuut";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import common from "../../../../../../i18n/definitions/common";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import Section from "../../../../../../components/03-templates/Section";
import * as R from "ramda";

const MuutospyyntoWizardMuutokset = React.memo(
  props => {
    const intl = useIntl();
    const [kohteet, setKohteet] = useState({});
    const [maaraystyypit, setMaaraystyypit] = useState(null);

    const { onChangesRemove, onChangesUpdate } = props;

    useEffect(() => {
      setKohteet(
        R.mergeAll(
          R.flatten(
            R.map(item => {
              return {
                [R.props(["tunniste"], item)]: item
              };
            }, props.kohteet)
          )
        )
      );
    }, [props.kohteet]);

    useEffect(() => {
      setMaaraystyypit(
        R.mergeAll(
          R.flatten(
            R.map(item => {
              return {
                [R.props(["tunniste"], item)]: item
              };
            }, props.maaraystyypit)
          )
        )
      );
    }, [props.maaraystyypit]);

    const valtakunnallinenMaarays = R.find(
      R.propEq("koodisto", "nuts1"),
      props.lupa.maaraykset || []
    );

    return (
      <React.Fragment>
        <h2 className="my-6">
          {intl.formatMessage(wizardMessages.pageTitle_1)}
        </h2>
        <p>{intl.formatMessage(wizardMessages.info_01)}</p>

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
              onChangesUpdate={onChangesUpdate}
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
              onChangesUpdate={onChangesUpdate}
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
              onChangesUpdate={onChangesUpdate}
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
              onChangesUpdate={onChangesUpdate}
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
                onChangesUpdate={onChangesUpdate}
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
                onChangesUpdate={onChangesUpdate}
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
      JSON.stringify(currentProps.lupa) === JSON.stringify(nextProps.lupa) &&
      JSON.stringify(currentProps.lupaKohteet) ===
        JSON.stringify(nextProps.lupaKohteet) &&
      JSON.stringify(currentProps.maaraystyypit) ===
        JSON.stringify(nextProps.maaraystyypit) &&
      R.equals(currentProps.changeObjects, nextProps.changeObjects)
    );
  }
);

MuutospyyntoWizardMuutokset.propTypes = {
  changeObjects: PropTypes.object,
  kielet: PropTypes.array,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  kunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maakunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default MuutospyyntoWizardMuutokset;
