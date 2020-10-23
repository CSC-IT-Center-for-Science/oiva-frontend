import React, { useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";
import { MuutoksetContainer } from "./store";

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
      history.push(`/ammatillinenkoulutus/asianhallinta/${ytunnus}/${uuid}`);
    },
    [history, ytunnus]
  );

  return (
    <MuutoksetContainer
      kielet={{
        opetuskielet: [],
        tutkintokielet: {}
      }}
      koulutukset={{
        atvKoulutukset: [],
        kuljettajakoulutukset: [],
        valmentavatKoulutukset: []
      }}
      muut={{}}
      opiskelijavuodet={[]}
      toimintaalue={[]}
      topthree={[]}
      tutkinnot={[]}>
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
        onNewDocSave={onNewDocSave}
        opetuskielet={opetuskielet}
        organisation={organisaatio}
        tutkinnot={tutkinnot}
      />
      );
    </MuutoksetContainer>
  );
};

export default UusiAsiaDialogContainer;
