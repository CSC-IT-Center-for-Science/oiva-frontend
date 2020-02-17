import React, { useEffect, useState } from "react";
import Tutkinnot from "./Tutkinnot";
import MuutospyyntoWizardKoulutukset from "./MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardKielet from "./MuutospyyntoWizardKielet";
import MuutospyyntoWizardToimintaalue from "./MuutospyyntoWizardToimintaalue";
import MuutospyyntoWizardOpiskelijavuodet from "./MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardMuut from "./MuutospyyntoWizardMuut";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import * as R from "ramda";
import FormSection from "../../../../../../components/03-templates/FormSection";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "okm-frontend-components/dist/components/02-organisms/Tooltip";

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
              <FormSection
                code={props.lupaKohteet[1].headingNumber}
                id="tutkinnot"
                render={_props => (
                  <React.Fragment>
                    <div className="flex justify-between">
                      <p className="mb-4">
                        Lain (531/2017) 23 §:n mukaan järjestämisluvassa
                        määrättävät tutkinnot ja koulutukset
                      </p>
                      <div>
                        <Tooltip
                          tooltip={`Ammatillisesta koulutuksesta annetun lain 23 §:n mukaan
                    järjestämisluvassa määrätään tutkinnot, joita koulutuksen
                    järjestäjällä on oikeus myöntää ja joihin se voi järjestää
                    tutkintokoulutusta sekä muut koulutukset, joita koulutuksen
                    järjestäjä voi järjestää. Koulutuksen järjestäjällä on
                    oikeus myöntää järjestämisluvan 1 kohdassa mainittuja
                    tutkintoja ja antaa niihin tutkintokoulutusta sekä järjestää
                    järjestämisluvan 1 kohdassa mainittuja koulutuksia.`}
                          trigger="click">
                          <HelpIcon color="primary" />
                        </Tooltip>
                      </div>
                    </div>
                    <Tutkinnot
                      tutkinnot={props.tutkinnot}
                      lupaKohteet={props.lupaKohteet}
                      {..._props}
                    />
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
                    <div className="flex justify-between">
                      <p className="mb-4">
                        Lain (531/2017) 24 §:n mukaan järjestämisluvassa
                        määrättävät opetus- ja tutkintokielet
                      </p>
                      <div>
                        <Tooltip
                          tooltip={`Koulutuksen järjestäjän on em. lain (531/2017) 24 §:n mukaisesti annettava opetusta järjestämisluvan 2 kohdassa mainitulla opetuskielellä, jonka lisäksi koulutuksen järjestäjä voi antaa opetusta toisella kotimaisella kielellä, saamenkielellä, romanikielellä, viittomakielellä tai vieraalla kielellä. Opetuskielen lisäksi tutkinnon tai valmentavan koulutuksen voi suorittaa järjestämisluvassa tutkinnoittain määrätyllä tai valmentavan koulutuksen osalta määrätyllä tutkintokielellä.

                          Muulla kuin opetuskielellä voidaan antaa opetusta esimerkiksi opintojen alkuvaiheessa tai opintojen eri vaiheissa, opiskelijan yksilöllisten ja työelämän tarpeiden perusteella. Tutkintokielellä tarkoitetaan kieltä, jolla tutkinnon tai tutkinnon osan taikka valmentavan koulutuksen voi suorittaa. Käytännössä tutkintokielellä tarkoitetaan kieltä, jolla opiskelija voi antaa näytön tai muutoin osoittaa osaamisensa. Myös tutkintotodistus ja muut todistukset annetaan tutkintokielellä.`}
                          trigger="click">
                          <HelpIcon color="primary" />
                        </Tooltip>
                      </div>
                    </div>
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
            </React.Fragment>
          )}
          runOnChanges={props.onChangesUpdate}
          title={props.lupaKohteet[1].heading}
        />

              <FormSection
                code={3}
                id="toimintaalue"
                render={_props => (
                  <React.Fragment>
                    <div className="flex justify-between">
                      <p className="mb-4 pr-4">
                        Lain (531/2017) 25 §:n mukaan järjestämisluvassa
                        määrättävä ensisijainen toiminta-alue, jonka
                        koulutustarpeeseen koulutuksen järjestäjän tulee vastata
                      </p>
                      <div>
                        <Tooltip
                          tooltip={`Koulutuksen järjestäjän toiminnan tulee ensisijaisesti vastata em. lain (531/2017) 25 §:n mukaisesti järjestämisluvan kohdassa 3 mainitun alueen osaamistarpeisiin. Koulutuksen järjestäjällä on velvollisuus järjestää osaamistarpeen mukaisesti tutkintoja ja koulutusta järjestämisluvassa määrätyllä toiminta-alueella, jonka lisäksi tutkintoja ja koulutusta voi järjestää myös muualla Suomessa, ei kuitenkaan Ahvenanmaan maakunnassa.`}
                          trigger="click">
                          <HelpIcon color="primary" />
                        </Tooltip>
                      </div>
                    </div>
                    <MuutospyyntoWizardToimintaalue
                      lupakohde={props.lupaKohteet[3]}
                      kunnat={props.kunnat}
                      maakuntakunnatList={props.maakuntakunnatList}
                      maakunnat={props.maakunnat}
                      {..._props}
                    />
                  </React.Fragment>
                )}
                runOnChanges={props.onChangesUpdate}
                title={R.path(
                  ["meta", "otsikko", intl.locale],
                  kohteet.toimintaalue
                )}
              />
            </React.Fragment>
          )}
          runOnChanges={props.onChangesUpdate}
          title={intl.formatMessage(wizardMessages.header_section2)}
        />

              {kohteet.opiskelijavuodet && !R.isEmpty(props.lomakkeet.muut) && (
                <FormSection
                  code={props.lupaKohteet[4].headingNumber}
                  id="opiskelijavuodet"
                  render={_props => (
                    <React.Fragment>
                      <div className="flex justify-between">
                        <p className="mb-4 pr-4">
                          Lain (531/2017) 26 §:n mukaan järjestämisluvassa
                          määrättävät opiskelijavuodet ja niitä koskevat
                          rajoitukset
                        </p>
                        <div>
                          <Tooltip
                            tooltip={`Järjestämisluvan kohdassa 4 on määrätty em. lain (531/2017) 26 §:n mukaisesti opetus- ja kulttuuritoimen rahoituksesta annetun lain (1705/2009) 32 b §:ssä tarkoitettujen opiskelijavuosien vähimmäismäärä.`}
                            trigger="click">
                            <HelpIcon color="primary" />
                          </Tooltip>
                        </div>
                      </div>
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
                    </React.Fragment>
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
                    <React.Fragment>
                      <div className="flex justify-between">
                        <p className="mb-4 pr-4">
                          Lain (531/2017) 27 §:n mukaan järjestämisluvassa
                          määrättävät muut oikeudet, velvollisuudet, ehdot ja
                          tehtävät
                        </p>
                        <div>
                          {/* Tooltip would be here */}
                        </div>
                      </div>
                      <MuutospyyntoWizardMuut
                        maaraykset={props.lupa.maaraykset}
                        muut={props.muut}
                        koulutukset={props.koulutukset}
                        {..._props}
                      />
                    </React.Fragment>
                  )}
                  runOnChanges={props.onChangesUpdate}
                  title={intl.formatMessage(wizardMessages.header_section5)}
                />
              )}
            </React.Fragment>
          ) : null}
        </form>
      </div>
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
