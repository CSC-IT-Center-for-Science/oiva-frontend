import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import MuutospyyntoWizard from "./Muutospyynto/components/MuutospyyntoWizard";
import { MuutoshakemusProvider } from "context/muutoshakemusContext";
import { getAnchorPart, findObjectWithKey } from "../../../../utils/common";
import { getMuutosperusteluList } from "../../../../utils/muutosperusteluUtil";
import { setAttachmentUuids } from "../../../../utils/muutospyyntoUtil";
import { useElykeskukset } from "../../../../stores/elykeskukset";
import { useKoulutukset } from "../../../../stores/koulutukset";
import { useKohteet } from "../../../../stores/kohteet";
import { useKoulutusalat } from "../../../../stores/koulutusalat";
import { useKielet } from "../../../../stores/kielet";
import { useOpetuskielet } from "../../../../stores/opetuskielet";
import { useMaaraystyypit } from "../../../../stores/maaraystyypit";
import { useMuut } from "../../../../stores/muut";
import { useKunnat } from "../../../../stores/kunnat";
import { useMaakunnat } from "../../../../stores/maakunnat";
import { useMaakuntakunnat } from "../../../../stores/maakuntakunnat";
import { useVankilat } from "../../../../stores/vankilat";
import { useTutkinnot } from "../../../../stores/tutkinnot";
import { useOmovt } from "../../../../stores/omovt";
import { useMuutospyynto } from "../../../../stores/muutospyynto";
import { useOivaperustelut } from "../../../../stores/oivaperustelut";
import { useKoulutustyypit } from "../../../../stores/koulutustyypit";
import Loading from "../../../../modules/Loading";
import {
  assocPath,
  find,
  flatten,
  forEach,
  includes,
  insert,
  map,
  path,
  prop,
  propEq,
  split,
  toUpper
} from "ramda";
import { MUUT_KEYS } from "./Muutospyynto/modules/constants";

/**
 * HakemusContainer gathers all the required data for the MuutospyyntoWizard by
 * executing several backend searches.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.history - Router's history object.
 * @param {Object} props.intl - Object of react-intl library.
 * @param {Object} props.lupa - Permission information of the current organisation.
 * @param {Object} props.lupaKohteet - The result of parsed props.lupa object.
 * @param {Object} props.match - Router's match object.
 */
const HakemusContainer = React.memo(({ history, lupa, lupaKohteet, match }) => {
  const intl = useIntl();

  const [elykeskukset, elykeskuksetActions] = useElykeskukset();
  const [kohteet, kohteetActions] = useKohteet();
  const [koulutukset, koulutuksetActions] = useKoulutukset();
  const [koulutusalat, koulutusalatActions] = useKoulutusalat();
  const [koulutustyypit, koulutustyypitActions] = useKoulutustyypit();
  const [kielet, kieletActions] = useKielet();
  const [opetuskielet, opetuskieletActions] = useOpetuskielet();
  const [maaraystyypit, maaraystyypitActions] = useMaaraystyypit();
  const [muut, muutActions] = useMuut();
  const [kunnat, kunnatActions] = useKunnat();
  const [maakunnat, maakunnatActions] = useMaakunnat();
  const [maakuntakunnat, maakuntakunnatActions] = useMaakuntakunnat();
  const [vankilat, vankilatActions] = useVankilat();
  const [tutkinnot, tutkinnotActions] = useTutkinnot();
  const [omovt, omovtActions] = useOmovt();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [oivaperustelut, oivaperustelutActions] = useOivaperustelut();

  // Let's fetch data for the form
  useEffect(() => {
    const abortControllers = flatten([
      elykeskuksetActions.load(),
      kieletActions.load(),
      kohteetActions.load(),
      koulutusalatActions.load(),
      koulutustyypitActions.load(),
      opetuskieletActions.load(),
      maaraystyypitActions.load(),
      muutActions.load(),
      kunnatActions.load(),
      maakunnatActions.load(),
      maakuntakunnatActions.load(),
      vankilatActions.load(),
      tutkinnotActions.load(),
      omovtActions.load(),
      oivaperustelutActions.load(),
      koulutuksetActions.load()
    ]);

    // Existing muutospyynto will be fetched if we have the UUID to use.
    if (match.params.uuid) {
      muutospyyntoActions.load(match.params.uuid);
    }
    return function cancel() {
      forEach(
        abortContoller => abortContoller.abort(),
        abortControllers.filter(Boolean)
      );
    };
  }, [
    elykeskuksetActions,
    kieletActions,
    kohteetActions,
    koulutuksetActions,
    koulutusalatActions,
    koulutustyypitActions,
    opetuskieletActions,
    maaraystyypitActions,
    muutActions,
    kunnatActions,
    maakunnatActions,
    maakuntakunnatActions,
    vankilatActions,
    tutkinnotActions,
    omovtActions,
    muutospyyntoActions,
    oivaperustelutActions,
    match.params.uuid
  ]);

  const [backendChanges, setBackendChanges] = useState({});

  /**
   * Let's walk through all the changes from the backend and update the muutoshakemus.
   */
  useEffect(() => {
    let muutospyyntoData = { ...muutospyynto.data };
    if (muutospyynto.fetchedAt && match.params.uuid) {
      const attachments = prop("liitteet", muutospyynto.data);

      muutospyyntoData = setAttachmentUuids(attachments, muutospyynto.data);

      const backendMuutokset = prop("muutokset")(muutospyyntoData);

      let filesFromMuutokset = findObjectWithKey(backendMuutokset, "liitteet");

      const updatedC = map(changeObj => {
        const files = changeObj.properties.attachments
          ? map(file => {
              const fileFromBackend =
                find(
                  propEq("tiedostoId", file.tiedostoId),
                  filesFromMuutokset
                ) || {};
              return Object.assign({}, file, fileFromBackend);
            }, changeObj.properties.attachments || [])
          : null;
        return assocPath(["properties", "attachments"], files, changeObj);
      }, findObjectWithKey(muutospyyntoData, "changeObjects"));

      let changesBySection = {};

      forEach(changeObj => {
        const anchorInitialSplitted = split(
          "_",
          getAnchorPart(changeObj.anchor, 0)
        );
        const existingChangeObjects =
          path(anchorInitialSplitted, changesBySection) || [];
        const changeObjects = insert(-1, changeObj, existingChangeObjects);
        changesBySection = assocPath(
          anchorInitialSplitted,
          changeObjects,
          changesBySection
        );
      }, updatedC);

      // Special case: Toiminta-alueen perustelut
      const toimintaAluePerusteluChangeObject = path(
        ["perustelut", "toimintaalue", "0"],
        changesBySection
      );
      if (
        toimintaAluePerusteluChangeObject &&
        !includes("reasoning", toimintaAluePerusteluChangeObject.anchor)
      ) {
        changesBySection = assocPath(
          ["perustelut", "toimintaalue"],
          [
            {
              anchor: "perustelut_toimintaalue.reasoning.A",
              properties: toimintaAluePerusteluChangeObject.properties
            }
          ],
          changesBySection
        );
      }

      /**
       * At this point the backend data is handled and change objects are formed.
       */
      setBackendChanges({
        changeObjects: changesBySection,
        source: backendMuutokset,
        handled: true
      });
    }
  }, [muutospyynto.data, muutospyynto.fetchedAt, match.params.uuid]);

  const muutosperusteluList = useMemo(() => {
    return oivaperustelut.fetchedAt
      ? getMuutosperusteluList(oivaperustelut.data, toUpper(intl.locale))
      : [];
  }, [oivaperustelut.fetchedAt, oivaperustelut.data, intl.locale]);

  const onNewDocSave = useCallback(
    muutoshakemus => {
      const page = parseInt(match.params.page, 10);
      const url = `/jarjestajat/${match.params.ytunnus}`;
      const uuid = muutoshakemus.save.data.data.uuid;
      let newurl = url + "/hakemukset-ja-paatokset/" + uuid + "/" + page;

      /**
       * User is redirected to the url of the saved document.
       */
      history.push(newurl);
    },
    [history, match.params.page, match.params.ytunnus]
  );

  if (
    lupaKohteet &&
    elykeskukset.fetchedAt &&
    kielet.fetchedAt &&
    kohteet.fetchedAt &&
    kohteet.data &&
    path(["poikkeukset", "999901", "fetchedAt"], koulutukset) &&
    path(["poikkeukset", "999903", "fetchedAt"], koulutukset) &&
    path(
      [
        "muut",
        MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS,
        "fetchedAt"
      ],
      koulutukset
    ) &&
    path(["muut", MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS, "fetchedAt"], koulutukset) &&
    path(["muut", MUUT_KEYS.KULJETTAJAKOULUTUS, "fetchedAt"], koulutukset) &&
    koulutusalat.fetchedAt &&
    koulutustyypit.fetchedAt &&
    opetuskielet.fetchedAt &&
    maaraystyypit.fetchedAt &&
    muut.fetchedAt &&
    kunnat.fetchedAt &&
    maakunnat.fetchedAt &&
    maakuntakunnat.fetchedAt &&
    vankilat.fetchedAt &&
    tutkinnot.fetchedAt &&
    omovt.fetchedAt &&
    oivaperustelut.fetchedAt &&
    (!match.params.uuid || (muutospyynto.fetchedAt && backendChanges.handled))
  ) {
    return (
      <MuutoshakemusProvider>
        <MuutospyyntoWizard
          backendChanges={backendChanges}
          elykeskukset={elykeskukset.data}
          history={history}
          kohteet={kohteet.data}
          koulutustyypit={koulutustyypit.data}
          kunnat={kunnat.data}
          lupa={lupa}
          lupaKohteet={lupaKohteet}
          maakunnat={maakunnat.data}
          maakuntakunnat={maakuntakunnat.data}
          maaraystyypit={maaraystyypit.data}
          match={match}
          muut={muut.data}
          muutosperusteluList={muutosperusteluList}
          muutospyynto={muutospyynto.data}
          vankilat={vankilat.data}
          onNewDocSave={onNewDocSave}
        />
      </MuutoshakemusProvider>
    );
  } else {
    return (
      <Loading
        percentage={
          ([
            !!path(["poikkeukset", "999901", "fetchedAt"], koulutukset),
            !!path(["poikkeukset", "999903", "fetchedAt"], koulutukset),
            !!path(
              [
                "muut",
                MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS,
                "fetchedAt"
              ],
              koulutukset
            ),
            !!path(
              ["muut", MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS, "fetchedAt"],
              koulutukset
            ),
            !!path(
              ["muut", MUUT_KEYS.KULJETTAJAKOULUTUS, "fetchedAt"],
              koulutukset
            ) && !!lupaKohteet,
            !!elykeskukset.fetchedAt,
            !!elykeskukset.fetchedAt,
            !!kielet.fetchedAt,
            !!kohteet.fetchedAt,
            !!koulutusalat.fetchedAt,
            !!koulutustyypit.fetchedAt,
            !!opetuskielet.fetchedAt,
            !!maaraystyypit.fetchedAt,
            !!muut.fetchedAt,
            !!kunnat.fetchedAt,
            !!maakunnat.fetchedAt,
            !!maakuntakunnat.fetchedAt,
            !!vankilat.fetchedAt,
            !!tutkinnot.fetchedAt,
            !!omovt.fetchedAt,
            !!oivaperustelut.fetchedAt,
            !!(!match.params.uuid || muutospyynto.fetchedAt)
          ].filter(Boolean).length /
            22) *
          100
        }
      />
    );
  }
});

HakemusContainer.propTypes = {
  history: PropTypes.object,
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object,
  match: PropTypes.object
};

export default HakemusContainer;
