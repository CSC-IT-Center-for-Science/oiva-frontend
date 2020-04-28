import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import wizardMessages from "../../i18n/definitions/wizard";
import common from "../../i18n/definitions/common";
import FormSection from "../../components/03-templates/FormSection";
import Tutkinnot from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/Tutkinnot";
import MuutospyyntoWizardKielet from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKielet";
import MuutospyyntoWizardKoulutukset from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardMuut from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardMuut";
import MuutospyyntoWizardOpiskelijavuodet from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardToimintaalue from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardToimintaalue";
import * as R from "ramda";

const EsittelijatMuutospyynto = React.memo(
  props => {
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

    return (
      <React.Fragment>
        <h1 className="my-6">
          {intl.formatMessage(wizardMessages.pageTitle_1)}
        </h1>

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
                {..._props}
              />
            )}
            runOnChanges={props.onChangesUpdate}
            title={R.path(
              ["meta", "otsikko", intl.locale],
              kohteet.toimintaalue
            )}
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
