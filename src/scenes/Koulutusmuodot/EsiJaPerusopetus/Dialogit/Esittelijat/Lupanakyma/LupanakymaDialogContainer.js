import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import UusiAsiaDialog from ".";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../../../../../utils/lupaParser";
import { isEmpty } from "ramda";

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
  lisatiedot,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  opetuskielet,
  opetustehtavakoodisto,
  organisaatio,
  tutkinnot,
  viimeisinLupa
}) => {
  const intl = useIntl();

  let { id } = useParams();
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
      history.push(`/esi-ja-perusopetus/asianhallinta/${id}/${uuid}`);
    },
    [history, id]
  );

  return (
    <UusiAsiaDialog
      history={history}
      kielet={kielet}
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
      opetuskielet={opetuskielet}
      opetustehtavakoodisto={opetustehtavakoodisto}
      organisation={organisaatio}
      tutkinnot={tutkinnot}
    />
  );
};

export default UusiAsiaDialogContainer;
