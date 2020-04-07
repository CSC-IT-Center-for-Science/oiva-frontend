import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
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
import { MUUT_KEYS } from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/constants";
import Loading from "../../modules/Loading";
import { useElykeskukset } from "../../stores/elykeskukset";
import { useKohteet } from "../../stores/kohteet";
import { useKoulutukset } from "../../stores/koulutukset";
import { useKoulutusalat } from "../../stores/koulutusalat";
import { useKoulutustyypit } from "../../stores/koulutustyypit";
import { useKielet } from "../../stores/kielet";
import { useOpetuskielet } from "../../stores/opetuskielet";
import { useMaaraystyypit } from "../../stores/maaraystyypit";
import { useMuut } from "../../stores/muut";
import { useKunnat } from "../../stores/kunnat";
import { useMaakunnat } from "../../stores/maakunnat";
import { useMaakuntakunnat } from "../../stores/maakuntakunnat";
import { useVankilat } from "../../stores/vankilat";
import { useTutkinnot } from "../../stores/tutkinnot";
import { useOmovt } from "../../stores/omovt";
import { useMuutospyynto } from "../../stores/muutospyynto";
import { useOivaperustelut } from "../../stores/oivaperustelut";
import { useChangeObjects } from "../../stores/changeObjects";
import { getAnchorPart, findObjectWithKey } from "../../utils/common";
import { getMuutosperusteluList } from "../../utils/muutosperusteluUtil";
import { setAttachmentUuids } from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { useLupa } from "../../stores/lupa";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";

/**
 * HakemusContainer gathers all the required data for the MuutospyyntoWizard by
 * executing several backend searches.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = React.memo(() => {
  const intl = useIntl();

  const [, coActions] = useChangeObjects();
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
  const [lupa, lupaActions] = useLupa();

  let { uuid, ytunnus } = useParams();
  let history = useHistory();

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
      koulutuksetActions.load(),
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
    if (uuid) {
      muutospyyntoActions.load(uuid);
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
    uuid
  ]);

  // Let's fetch LUPA
  useEffect(() => {
    let abortController;
    if (ytunnus) {
      abortController = lupaActions.load(ytunnus);
    }
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [lupaActions, ytunnus]);

  const lupaKohteet = useMemo(() => {
    return lupa.fetchedAt && lupa.data
      ? parseLupa(
          { ...lupa.data },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
  }, [lupa, intl]);

  const [isHandled, setAsHandled] = useState(false);

  const [backendMuutokset, setBackendMuutokset] = useState([]);

  const filesFromMuutokset = useMemo(() => {
    if (muutospyynto.fetchedAt && uuid) {
      const attachments = prop("liitteet", muutospyynto.data);
      const muutospyyntoData = setAttachmentUuids(
        attachments,
        muutospyynto.data
      );
      const backendMuutokset = prop("muutokset")(muutospyyntoData);
      return findObjectWithKey(backendMuutokset, "liitteet");
    }
  }, [uuid, muutospyynto.data, muutospyynto.fetchedAt]);

  const updatedC = useMemo(() => {
    return map(changeObj => {
      const files = path(["properties", "attachments"], changeObj)
        ? map(file => {
            const fileFromBackend =
              find(
                propEq("tiedostoId", file.tiedostoId),
                filesFromMuutokset || {}
              ) || {};
            return Object.assign({}, file, fileFromBackend);
          }, changeObj.properties.attachments || [])
        : null;
      return assocPath(["properties", "attachments"], files, changeObj);
    }, findObjectWithKey({ ...muutospyynto.data }, "changeObjects"));
  }, [filesFromMuutokset, muutospyynto.data]);

  /**
   * Let's walk through all the changes from the backend and update the muutoshakemus.
   */
  useEffect(() => {
    if (muutospyynto.fetchedAt && uuid) {
      let changesBySection = {};

      if (updatedC) {
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
      }

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
      coActions.initialize(changesBySection);

      setBackendMuutokset(backendMuutokset);

      setAsHandled(true);
    }
  }, [
    coActions,
    backendMuutokset,
    filesFromMuutokset,
    muutospyynto.data,
    muutospyynto.fetchedAt,
    uuid,
    updatedC
  ]);

  const muutosperusteluList = useMemo(() => {
    return oivaperustelut.fetchedAt
      ? getMuutosperusteluList(oivaperustelut.data, toUpper(intl.locale))
      : [];
  }, [oivaperustelut.fetchedAt, oivaperustelut.data, intl.locale]);

  const onNewDocSave = useCallback(
    muutospyynto => {
      const url = `/jarjestajat/${ytunnus}`;
      const uuid = muutospyynto.uuid;
      let newurl = url + "/hakemukset-ja-paatokset/" + uuid;

      /**
       * User is redirected to the url of the saved document.
       */
      history.push(newurl);
    },
    [history, ytunnus]
  );

  if (
    !isEmpty(lupaKohteet) &&
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
    (!uuid || (muutospyynto.fetchedAt && isHandled))
  ) {
    return (
      <UusiAsiaDialog
        backendMuutokset={backendMuutokset}
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
        muut={muut.data}
        muutosperusteluList={muutosperusteluList}
        muutospyynto={muutospyynto.data}
        vankilat={vankilat.data}
        onNewDocSave={onNewDocSave}
      />
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
            !!(!uuid || muutospyynto.fetchedAt)
          ].filter(Boolean).length /
            22) *
          100
        }
      />
    );
  }
});

export default UusiAsiaDialogContainer;
