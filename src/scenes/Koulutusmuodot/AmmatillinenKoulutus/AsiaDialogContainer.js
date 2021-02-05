import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import Loading from "../../../modules/Loading";
import common from "i18n/definitions/common";
import wizard from "i18n/definitions/wizard";
import { useParams } from "react-router-dom";
import { parseLupa } from "../../../utils/lupaParser";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { useChangeObjects } from "../../../stores/muutokset";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import { Wizard } from "components/03-templates/Wizard";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const AsiaDialogContainer = ({
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  muut,
  opetuskielet,
  organisaatio,
  role,
  viimeisinLupa
}) => {
  const intl = useIntl();
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
    <Wizard
      page1={
        <EsittelijatMuutospyynto
          kohteet={kohteet}
          koulutukset={koulutukset}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          maaraykset={viimeisinLupa.maaraykset}
          lupaKohteet={lupaKohteet}
          maaraystyypit={maaraystyypit}
          mode={"modification"}
          muut={muut}
          role={role}
          title={intl.formatMessage(common.changesText)}
        />
      }
      organisation={organisaatio}
      role={role}
      title={intl.formatMessage(wizard.esittelijatMuutospyyntoDialogTitle)}
      urlOnClose={"/ammatillinenkoulutus/asianhallinta/avoimet?force=true"}
    />
  ) : (
    <Loading />
  );
};

export default AsiaDialogContainer;
