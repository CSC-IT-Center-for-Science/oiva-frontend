import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";

const changeObjects = {
  tutkinnot: {},
  kielet: {
    opetuskielet: [],
    tutkintokielet: {}
  },
  koulutukset: {
    atvKoulutukset: [],
    kuljettajakoulutukset: [],
    valmentavatKoulutukset: []
  },
  perustelut: {
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      atvKoulutukset: [],
      kuljettajakoulutukset: [],
      tyovoimakoulutukset: [],
      valmentavatKoulutukset: []
    },
    opiskelijavuodet: {
      sisaoppilaitos: [],
      vaativatuki: [],
      vahimmaisopiskelijavuodet: []
    },
    liitteet: [],
    toimintaalue: [],
    tutkinnot: {}
  },
  taloudelliset: {
    yleisettiedot: [],
    investoinnit: [],
    tilinpaatostiedot: [],
    liitteet: []
  },
  muut: {},
  opiskelijavuodet: [],
  toimintaalue: [],
  yhteenveto: {
    yleisettiedot: [],
    hakemuksenLiitteet: []
  },
  // Top three fields of muutospyyntö form of esittelijä role
  topthree: []
};

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = ({
  kielet,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  kunnat,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  opetuskielet,
  organisaatio,
  tutkinnot,
  viimeisinLupa
}) => {
  const intl = useIntl();

  let { ytunnus } = useParams();
  let history = useHistory();

  const lupaKohteet = useMemo(() => {
    const result = !isEmpty(viimeisinLupa)
      ? parseLupa(
          { ...viimeisinLupa },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  const onNewDocSave = useCallback(
    uuid => {
      /**
       * User is redirected to the url of the saved document.
       */
      history.push(`/esi-ja-perusopetus/asianhallinta/${ytunnus}/${uuid}`);
    },
    [history, ytunnus]
  );

  return (
    <UusiAsiaDialog
      history={history}
      initialChangeObjects={changeObjects}
      kielet={kielet}
      kohteet={kohteet}
      koulutukset={koulutukset}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      kunnat={kunnat}
      lupa={viimeisinLupa}
      lupaKohteet={lupaKohteet}
      maakunnat={maakunnat}
      maakuntakunnat={maakuntakunnat}
      maaraystyypit={maaraystyypit}
      muut={muut}
      onNewDocSave={onNewDocSave}
      opetuskielet={opetuskielet}
      organisation={organisaatio}
      tutkinnot={tutkinnot}
    />
  );
};

export default UusiAsiaDialogContainer;
