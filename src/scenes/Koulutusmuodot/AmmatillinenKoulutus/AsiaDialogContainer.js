import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import Loading from "../../../modules/Loading";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../../utils/lupaParser";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { useChangeObjects } from "../../../stores/muutokset";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const AsiaDialogContainer = ({
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
  let history = useHistory();

  const { uuid } = useParams();

  const [, { initializeChanges }] = useChangeObjects();
  const [muutospyynto, setMuutospyynto] = useState();

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

  const lupaKohteet = useMemo(() => {
    const result = viimeisinLupa
      ? parseLupa(
          { ...viimeisinLupa },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  useEffect(() => {
    const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
    initializeChanges(changeObjectsFromBackend);
  }, [muutospyynto, initializeChanges]);

  return muutospyynto ? (
    <UusiAsiaDialog
      history={history}
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
      onNewDocSave={() => {}}
      opetuskielet={opetuskielet}
      organisation={organisaatio}
      tutkinnot={tutkinnot}
    />
  ) : (
    <Loading />
  );
};

export default AsiaDialogContainer;
