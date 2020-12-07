import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import Loading from "modules/Loading";
import UusiAsiaDialog from "./Dialogit/Esittelijat/Lupanakyma/index";
import { useParams } from "react-router-dom";
import { parseLupa } from "utils/lupaParser";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import { useChangeObjects } from "stores/muutokset";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const AsiaDialogContainer = ({
  kohteet,
  koulutusalat,
  koulutustyypit,
  lisatiedot,
  maaraystyypit,
  organisaatio,
  viimeisinLupa
}) => {
  const intl = useIntl();
  const { uuid } = useParams();
  const [, { initializeChanges }] = useChangeObjects();
  const [muutospyynto, setMuutospyynto] = useState();

  useEffect(() => {
    const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
    initializeChanges(changeObjectsFromBackend);
  }, [muutospyynto, initializeChanges]);

  useEffect(() => {
    async function fetchMuutospyynto() {
      const response = await fetch(
        `${API_BASE_URL}/${backendRoutes.muutospyynto.path}${uuid}`
      );
      if (response && response.ok) {
        setMuutospyynto(await response.json());
      }
      return muutospyynto;
    }

    if (!muutospyynto) {
      fetchMuutospyynto();
    }
  }, [muutospyynto, uuid]);

  const lupakohteet = useMemo(() => {
    const result = viimeisinLupa
      ? parseLupa(
          { ...viimeisinLupa },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  return muutospyynto ? (
    <UusiAsiaDialog
      kohteet={kohteet}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      lisatiedot={lisatiedot}
      lupa={viimeisinLupa}
      lupakohteet={lupakohteet}
      maaraystyypit={maaraystyypit}
      organisation={organisaatio}
    />
  ) : (
    <Loading />
  );
};

export default AsiaDialogContainer;
