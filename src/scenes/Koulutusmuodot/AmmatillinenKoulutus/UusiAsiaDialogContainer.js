import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../../utils/lupaParser";
import { isEmpty } from "ramda";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = ({
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  muut,
  opetuskielet,
  organisaatio,
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
      history.push(`/ammatillinenkoulutus/asianhallinta/${id}/${uuid}`);
    },
    [history, id]
  );

  return (
    <UusiAsiaDialog
      history={history}
      kohteet={kohteet}
      koulutukset={koulutukset}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      lupa={viimeisinLupa}
      lupaKohteet={lupaKohteet}
      maaraystyypit={maaraystyypit}
      muut={muut}
      onNewDocSave={onNewDocSave}
      opetuskielet={opetuskielet}
      organisation={organisaatio}
    />
  );
};

export default UusiAsiaDialogContainer;
