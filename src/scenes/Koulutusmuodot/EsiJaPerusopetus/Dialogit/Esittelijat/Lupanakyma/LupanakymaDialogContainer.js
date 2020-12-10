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
const UusiAsiaDialogContainer = React.memo(
  ({ kohteet, maaraystyypit, organisaatio, viimeisinLupa }) => {
    const history = useHistory();
    const intl = useIntl();

    let { id } = useParams();

    const lupakohteet = useMemo(() => {
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
        kohteet={kohteet}
        lupa={viimeisinLupa}
        lupakohteet={lupakohteet}
        maaraystyypit={maaraystyypit}
        onNewDocSave={onNewDocSave}
        organisation={organisaatio}
      />
    );
  }
);

export default UusiAsiaDialogContainer;
