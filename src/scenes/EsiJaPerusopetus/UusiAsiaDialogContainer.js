import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = ({
  ensisijaisetOpetuskieletOPH,
  kielet,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  kunnat,
  lisatiedot,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  opetuksenJarjestamismuodot,
  opetuskielet,
  opetustehtavakoodisto,
  opetustehtavat,
  organisaatio,
  poErityisetKoulutustehtavat,
  poMuutEhdot,
  toissijaisetOpetuskieletOPH,
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
      kielet={kielet}
      ensisijaisetOpetuskieletOPH={ensisijaisetOpetuskieletOPH}
      kohteet={kohteet}
      koulutukset={koulutukset}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      kunnat={kunnat}
      lisatiedot={lisatiedot}
      lupa={viimeisinLupa}
      lupaKohteet={lupaKohteet}
      maakunnat={maakunnat}
      maakuntakunnat={maakuntakunnat}
      maaraystyypit={maaraystyypit}
      muut={muut}
      onNewDocSave={onNewDocSave}
      opetuksenJarjestamismuodot={opetuksenJarjestamismuodot}
      opetuskielet={opetuskielet}
      opetustehtavakoodisto={opetustehtavakoodisto}
      opetustehtavat={opetustehtavat}
      organisation={organisaatio}
      poErityisetKoulutustehtavat={poErityisetKoulutustehtavat}
      poMuutEhdot={poMuutEhdot}
      toissijaisetOpetuskieletOPH={toissijaisetOpetuskieletOPH}
      tutkinnot={tutkinnot}
    />
  );
};

export default UusiAsiaDialogContainer;
