import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";
import Opetustehtavat from "./lomake/1-Opetustehtavat";
import * as R from "ramda";
import Section from "../../components/03-templates/Section";
import Opetuskieli from "./lomake/3-Opetuskieli";
import OpetustaAntavatKunnat from "./lomake/2-OpetustaAntavatKunnat";
import OpetuksenJarjestamismuoto from "./lomake/4-OpetuksenJarjestamismuoto";
import ErityisetKoulutustehtavat from "./lomake/5-ErityisetKoulutustehtavat";
import MuutEhdot from "./lomake/7-MuutEhdot";
import Liitetiedostot from "./lomake/8-Liitetiedostot";
import Opiskelijamaarat from "./lomake/6-Opiskelijamaarat";

const defaultProps = {
  kielet: [],
  kieletOPH: [],
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
  opetuksenJarjestamismuodot: [],
  opetuskielet: [],
  opiskelijavuodet: [],
  opetustehtavakoodisto: {},
  opetustehtavat: [],
  poErityisetKoulutustehtavat: [],
  poMuutEhdot: [],
  tutkinnot: []
};

const EsittelijatMuutospyynto = ({
  changeObjects,
  kielet = defaultProps.kielet,
  kieletOPH = defaultProps.kieletOPH,
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
  opetuksenJarjestamismuodot = defaultProps.opetuksenJarjestamismuodot,
  opetuskielet = defaultProps.opetuskielet,
  opetustehtavat = defaultProps.opetustehtavat,
  opetustehtavakoodisto = defaultProps.opetustehtavakoodisto,
  opiskelijavuodet = defaultProps.opiskelijavuodet,
  poErityisetKoulutustehtavat = defaultProps.poErityisetKoulutustehtavat,
  poMuutEhdot = defaultProps.poMuutEhdot,
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
    <form onSubmit={handleSubmit}>
      <Section
        code={1}
        title={opetustehtavakoodisto.metadata[R.toUpper(intl.locale)].kuvaus}>
        <Opetustehtavat
          changeObjects={changeObjects.opetustehtavat}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
          opetustehtavakoodisto={opetustehtavakoodisto}
          opetustehtavat={opetustehtavat}
        />
      </Section>

      <Section code={2} title={"Kunnat, joissa opetusta järjestetään"}>
        <OpetustaAntavatKunnat
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

      <Section code={3} title={"Opetuskieli"}>
        <Opetuskieli
          changeObjects={changeObjects.opetuskieli}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
          kieletOPH={kieletOPH}
        />
      </Section>

      <Section code={4} title={"Opetuksen järjestämismuoto"}>
        <OpetuksenJarjestamismuoto
          changeObjects={changeObjects.opetuksenJarjestamismuoto}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
          opetuksenJarjestamismuodot={opetuksenJarjestamismuodot}
        />
      </Section>

      <Section code={5} title={"Erityinen koulutustehtävä"}>
        <ErityisetKoulutustehtavat
          changeObjects={changeObjects.poErityisetKoulutustehtavat}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
          poErityisetKoulutustehtavat={poErityisetKoulutustehtavat}
        />
      </Section>

      <Section code={6} title={"Oppilas-/opiskelijamäärät"}>
        <Opiskelijamaarat
          changeObjects={changeObjects.opiskelijamaarat}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
        />
      </Section>

      <Section
        code={7}
        title={"Muut koulutuksen järjestämiseen liittyvät ehdot"}>
        <MuutEhdot
          changeObjects={changeObjects.poMuutEhdot}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
          poMuutEhdot={poMuutEhdot}
        />
      </Section>

      <Section code={8} title={"Liitetiedostot"}>
        <Liitetiedostot
          changeObjects={changeObjects.liitetiedostot}
          onChangesRemove={onChangesRemove}
          onChangesUpdate={updateChanges}
        />
      </Section>
    </form>
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
  maakunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  opetuksenJarjestamismuodot: PropTypes.array,
  opetuskielet: PropTypes.array,
  opiskelijavuodet: PropTypes.array,
  poErityisetKoulutustehtavat: PropTypes.array,
  poMuutEhdot: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default EsittelijatMuutospyynto;
