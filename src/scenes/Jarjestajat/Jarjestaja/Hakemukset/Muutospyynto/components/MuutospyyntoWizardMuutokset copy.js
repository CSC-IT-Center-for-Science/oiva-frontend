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
import FormSection from "../../../../../../components/03-templates/FormSection";
import * as R from "ramda";

const MuutospyyntoWizardMuutokset = React.memo(props => {
  const intl = useIntl();
  const [kohteet, setKohteet] = useState({});
  const [maaraystyypit, setMaaraystyypit] = useState(null);

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

  const kuntamaaraykset = R.filter(
    R.propEq("koodisto", "kunta"),
    props.lupa.maaraykset || []
  );

  const valtakunnallinenMaarays = R.find(
    R.propEq("koodisto", "nuts1"),
    props.lupa.maaraykset || []
  );

  return (
    <React.Fragment>
      <h2 className="my-6">{intl.formatMessage(wizardMessages.pageTitle_1)}</h2>
      <p>{intl.formatMessage(wizardMessages.info_01)}</p>

      <form onSubmit={props.handleSubmit}>
        <FormSection
          code={props.lupaKohteet[1].headingNumber}
          id="tutkinnot"
          render={_props => (
            <React.Fragment>
              <h4 className="pb-4">{intl.formatMessage(common.tutkinnot)}</h4>
              <Tutkinnot
                tutkinnot={props.tutkinnot}
                lupaKohteet={props.lupaKohteet}
                {..._props}
              />
              <h4 className="pt-8 pb-4">
                {intl.formatMessage(common.koulutukset)}
              </h4>
              <MuutospyyntoWizardKoulutukset
                koulutukset={props.koulutukset}
                maaraykset={props.lupa.maaraykset}
                {..._props}
              />
            </React.Fragment>
          )}
          runOnChanges={props.onChangesUpdate}
          title={props.lupaKohteet[1].heading}
        />

        <FormSection
          code={props.lupaKohteet[2].headingNumber}
          id="tutkinnot"
          render={_props => (
            <React.Fragment>
              <MuutospyyntoWizardKielet
                lupa={props.lupa}
                lupaKohteet={props.lupaKohteet}
                kielet={props.kielet}
                koulutukset={props.koulutukset}
                tutkintolomakkeet={props.lomakkeet.tutkinnot}
                onUpdate={props.onUpdate}
                {..._props}
              />
            </React.Fragment>
          )}
          runOnChanges={props.onChangesUpdate}
          title={intl.formatMessage(wizardMessages.header_section2)}
        />

        <FormSection
          code={3}
          id="toimintaalue"
          render={_props => (
            <MuutospyyntoWizardToimintaalue
              lupakohde={props.lupaKohteet[3]}
              kunnat={props.kunnat}
              maakuntakunnatList={props.maakuntakunnatList}
              maakunnat={props.maakunnat}
              kuntamaaraykset={kuntamaaraykset}
              valtakunnallinenMaarays={valtakunnallinenMaarays}
              {..._props}
            />
          )}
          runOnChanges={props.onChangesUpdate}
          title={R.path(["meta", "otsikko", intl.locale], kohteet.toimintaalue)}
        />

        {kohteet.opiskelijavuodet && !R.isEmpty(props.lomakkeet.muut) && (
          <FormSection
            code={props.lupaKohteet[4].headingNumber}
            id="opiskelijavuodet"
            render={_props => (
              <MuutospyyntoWizardOpiskelijavuodet
                lupaKohteet={props.lupaKohteet}
                maaraykset={props.lupa.maaraykset}
                muut={props.muut}
                opiskelijavuodet={props.opiskelijavuodet}
                lomakkeet={{
                  opiskelijavuodet: props.lomakkeet.opiskelijavuodet,
                  muut: props.lomakkeet.muut
                }}
                {..._props}
              />
            )}
            runOnChanges={props.onChangesUpdate}
            title={intl.formatMessage(wizardMessages.header_section4)}
          />
        )}

        {kohteet.muut && props.muut && maaraystyypit && (
          <FormSection
            code={props.lupaKohteet[5].headingNumber}
            id="muut"
            render={_props => (
              <MuutospyyntoWizardMuut
                maaraykset={props.lupa.maaraykset}
                muut={props.muut}
                koulutukset={props.koulutukset}
                {..._props}
              />
            )}
            runOnChanges={props.onChangesUpdate}
            title={intl.formatMessage(wizardMessages.header_section5)}
          />
        )}
      </form>
    </React.Fragment>
  );
});

MuutospyyntoWizardMuutokset.propTypes = {
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

export default MuutospyyntoWizardMuutokset;
