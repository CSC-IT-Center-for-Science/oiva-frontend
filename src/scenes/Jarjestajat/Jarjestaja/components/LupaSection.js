import _ from "lodash";
import React from "react";
import styled from "styled-components";

import Koulutusala from "./Koulutusala";
import MuuMaarays from "./MuuMaarays";
import VT from "./VT";

import { KOHTEET } from "../modules/constants";
import { FONT_STACK } from "../../../../modules/styles";
import Tutkintokieli from "./Tutkintokieli";
import Section from "../../../../components/03-templates/Section";
import common from "../../../../i18n/definitions/common";
import { useIntl } from "react-intl";

const Otsikko = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`;

const H3 = styled.h3`
  text-transform: uppercase;
  margin-left: 30px;
  font-size: 18px;
  margin-left: 10px;
`;

const List = styled.p`
  margin-left: 30px;
  margin-bottom: 20px;
`;
const Capitalized = styled.span`
  text-transform: capitalize;
  &:after {
    content: ", ";
  }
  &:last-child:after {
    content: "";
  }
`;
const MuutToimialueet = styled.p`
  margin-bottom: 20px;
`;

const Bold = styled.span`
  font-family: ${FONT_STACK.GOTHAM_NARROW_BOLD};
`;

const Tietoa = styled.div`
  margin: 20px 0 20px 0;
`;

const Tutkinnot = styled.div`
  margin: 0 0 10px 0;
`;

const Koulutukset = styled.div``;

const VALMATELMA = styled.div`
  margin: 0 0 20px 0;
`;

const OpiskelijavuosiRajoitukset = styled.div`
  margin-left: 30px;
  margin-bottom: 20px;
`;

const KohdeKuvaus = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Kuvaus = styled.div`
  margin: 5px 0 7px 0;
`;

const MuutSection = styled.div`
  margin: 0 0 20px 0;
`;

const LupaSection = props => {
  const { kohde, ytunnus, lupaAlkuPvm } = props;
  const intl = useIntl();

  // const { isRemoving } = this.state

  if (kohde) {
    const { tunniste, heading, headingNumber } = kohde;

    const section = list =>
      list.length > 0 ? (
        <MuutSection>
          <h4>
            <Bold>{list[0].tyyppi}</Bold>
          </h4>
          {_.map(list, (item, i) => {
            const { kuvaus } = item;
            return (
              <div key={i}>
                <Kuvaus>{kuvaus}</Kuvaus>
              </div>
            );
          })}
        </MuutSection>
      ) : null;

    // Logiikka eri kohteille
    switch (tunniste) {
      // Kohde 1: Tutkinnot
      case KOHTEET.TUTKINNOT: {
        const { maaraykset, muutMaaraykset } = kohde;

        // VALMA ja TELMA
        const vt = muutMaaraykset.filter(
          item => item.koodi === "999901" || item.koodi === "999903"
        );

        return (
          <div className="border-b border-b-gray">
            <Section code={headingNumber} title={heading}>
              {maaraykset && maaraykset.length > 0 && (
                <Otsikko>
                  {intl.formatMessage(common.lupaSectionTitleAllLupas)}
                </Otsikko>
              )}
              <Tutkinnot>
                {_.map(maaraykset, (ala, i) => (
                  <Koulutusala key={i} {...ala} lupaAlkuPvm={lupaAlkuPvm} />
                ))}
              </Tutkinnot>
              {maaraykset && maaraykset.length > 0 ? (
                <Tietoa>
                  {intl.formatMessage(common.lupaSectionTitleSupplementary)}
                </Tietoa>
              ) : null}

              <Koulutukset>
                {vt && vt[0] && (
                  <VALMATELMA>
                    {/* Selite vain yhden kerran */}
                    <p>{vt[0].selite}</p>
                    {_.map(vt, (items, i) => (
                      <VT key={"vt" + i} {...items} />
                    ))}
                  </VALMATELMA>
                )}
                {_.map(
                  muutMaaraykset.filter(
                    item =>
                      item.koodisto === "koulutus" ||
                      item.koodisto ===
                        "ammatilliseentehtavaanvalmistavakoulutus"
                  ),
                  (items, i) => (
                    <MuuMaarays key={i} {...items} />
                  )
                )}
                {_.map(
                  muutMaaraykset.filter(
                    item => item.koodisto === "kuljettajakoulutus"
                  ),
                  (items, i) => (
                    <MuuMaarays key={"k" + i} {...items} />
                  )
                )}
                {_.map(
                  muutMaaraykset.filter(
                    item => item.koodisto === "oivatyovoimakoulutus"
                  ),
                  (items, i) => (
                    <MuuMaarays key={"t" + i} {...items} />
                  )
                )}
              </Koulutukset>
            </Section>
          </div>
        );
      }

      // Kohde 2: Opetuskieli
      case KOHTEET.KIELI: {
        const {
          kohdeKuvaus,
          kohdeArvot,
          tutkinnotjakieletEn,
          tutkinnotjakieletSv,
          tutkinnotjakieletFi,
          tutkinnotjakieletRu
        } = kohde;

        return (
          <div className="border-b border-b-gray">
            <Section code={headingNumber} title={heading}>
              <p>{kohdeKuvaus}</p>
              <List>
                {_.map(kohdeArvot, (arvo, i) => (
                  <Capitalized key={i}>{_.capitalize(arvo.label)}</Capitalized>
                ))}
              </List>
              <Tutkinnot>
                {tutkinnotjakieletEn.length > 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageEnglishPlural
                    )
                  : null}
                {tutkinnotjakieletEn.length === 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageEnglishSingular
                    )
                  : null}
                {_.map(tutkinnotjakieletEn, (obj, i) => (
                  <Tutkintokieli key={i} {...obj} />
                ))}

                {tutkinnotjakieletSv.length > 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageSwedishPlural
                    )
                  : null}
                {tutkinnotjakieletSv.length === 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageSwedishSingular
                    )
                  : null}
                {_.map(tutkinnotjakieletSv, (obj, i) => (
                  <Tutkintokieli key={i} {...obj} />
                ))}

                {tutkinnotjakieletFi.length > 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageFinnishPlural
                    )
                  : null}
                {tutkinnotjakieletFi.length === 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageFinnishSingular
                    )
                  : null}
                {_.map(tutkinnotjakieletFi, (obj, i) => (
                  <Tutkintokieli key={i} {...obj} />
                ))}

                {tutkinnotjakieletRu.length > 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageRussianPlural
                    )
                  : null}
                {tutkinnotjakieletRu.length === 1
                  ? intl.formatMessage(
                      common.lupaSectionExtraLanguageRussianSingular
                    )
                  : null}
                {_.map(tutkinnotjakieletRu, (obj, i) => (
                  <Tutkintokieli key={i} {...obj} />
                ))}
              </Tutkinnot>
            </Section>
          </div>
        );
      }

      // Kohde 3: Toiminta-alueet
      case KOHTEET.TOIMIALUE: {
        const { kohdeKuvaus, maakunnat, kunnat } = kohde;

        return (
          <div className="border-b border-b-gray">
            <Section code={headingNumber} title={heading}>
              <p>{kohdeKuvaus}</p>
              <List>
                {_.map(maakunnat, (maakunta, i) => (
                  <Capitalized key={i}>{maakunta.arvo}</Capitalized>
                ))}
              </List>
              <List>
                {_.map(kunnat, (kunta, i) => (
                  <Capitalized key={i}>{kunta.arvo}</Capitalized>
                ))}
              </List>
              {maakunnat.length > 0 || kunnat.length > 0 ? (
                <MuutToimialueet>
                  {intl.formatMessage(common.lupaSectionToimintaAlueNational)}
                </MuutToimialueet>
              ) : null}
            </Section>
          </div>
        );
      }

      // Kohde 4: Opiskelijavuodet
      case KOHTEET.OPISKELIJAVUODET: {
        const { opiskelijavuodet, rajoitukset, kohdeKuvaus } = kohde;
        return (
          <div className="border-b border-b-gray">
            <Section code={headingNumber} title={heading}>
              {_.map(opiskelijavuodet, (obj, i) => {
                const { arvo } = obj;
                return (
                  <span key={i}>
                    {intl.formatMessage(
                      common.lupaSectionOpiskelijavuodetMinimum,
                      { arvo }
                    )}
                  </span>
                );
              })}
              <KohdeKuvaus>
                {ytunnus === "0244767-4"
                  ? intl.formatMessage(common.lupaSectionOpiskelijavuodetValtio)
                  : kohdeKuvaus}
              </KohdeKuvaus>
              {_.map(rajoitukset, (obj, i) => {
                const { tyyppi, arvo } = obj;
                return (
                  <OpiskelijavuosiRajoitukset key={i}>
                    {intl.formatMessage(
                      common.lupaSectionOpiskelijavuodetMaximum,
                      { tyyppi, arvo }
                    )}
                  </OpiskelijavuosiRajoitukset>
                );
              })}
            </Section>
          </div>
        );
      }

      // Kohde 5: Muut määräykset
      case KOHTEET.MUUT: {
        const {
          muut,
          vaativat,
          vankilat,
          kokeilut,
          yhteistyosopimukset,
          toimintaedellytykset,
          muutCombined
        } = kohde;

        return (
          <div>
            <Section code={headingNumber} title={heading}>
              {_.map(muut, (muu, i) => {
                const { tyyppi, kuvaus } = muu;
                return (
                  <MuutSection key={i}>
                    <h4>
                      <Bold>{tyyppi}</Bold>
                    </h4>
                    <Kuvaus>{kuvaus}</Kuvaus>
                  </MuutSection>
                );
              })}

              {section(vaativat)}
              {section(kokeilut)}
              {section(vankilat)}
              {section(yhteistyosopimukset)}
              {section(toimintaedellytykset)}

              {muutCombined.length === 0 ? (
                <p>{intl.formatMessage(common.lupaSectionMuutEiMaarayksia)}</p>
              ) : null}
            </Section>
          </div>
        );
      }

      default: {
        return (
          <div className="border-b border-b-gray">
            <Section code={headingNumber} title={heading} />
          </div>
        );
      }
    }
  } else {
    return (
      <div className="border-b border-b-gray">
        <H3>{intl.formatMessage(common.lupaSectionNoInfo)}</H3>
      </div>
    );
  }
};

export default LupaSection;
