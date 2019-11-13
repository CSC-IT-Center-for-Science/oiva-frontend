import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from "react";
import MuutospyyntoWizard from "./Muutospyynto/components/MuutospyyntoWizard";
import { MuutoshakemusProvider } from "context/muutoshakemusContext";
import { MUUT_KEYS } from "./Muutospyynto/modules/constants";
import { injectIntl } from "react-intl";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import {
  getAnchorsStartingWith,
  getAnchorPart,
  replaceAnchorPartWith
} from "../../../../utils/common";
import { BackendContext } from "../../../../context/backendContext";
import { isReady } from "../../../../services/backendService";
import FetchHandler from "../../../../FetchHandler";
import * as R from "ramda";
import { getMuutosperusteluList } from "../../../../utils/muutosperusteluUtil";
import { setAttachmentUuids } from "../../../../utils/muutospyyntoUtil";

/**
 * HakemusContainer gathers all the required data for the MuutospyyntoWizard by
 * executing several backend searches using FetchHandler.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.history - Router's history object.
 * @param {Object} props.intl - Object of react-intl library.
 * @param {Object} props.lupa - Permission information of the current organisation.
 * @param {Object} props.lupaKohteet - The result of parsed props.lupa object.
 * @param {Object} props.match - Router's match object.
 */
const HakemusContainer = ({ history, intl, lupa, lupaKohteet, match }) => {
  const { state: fromBackend, dispatch } = useContext(BackendContext);

  const notify = (title, options) => {
    toast.success(title, options);
  };

  /**
   * Configuration for backend searches to run.
   */
  const fetchSetup = useMemo(() => {
    const arr1 = [
      { key: "elykeskukset", dispatchFn: dispatch },
      { key: "kohteet", dispatchFn: dispatch },
      {
        key: "koulutus",
        dispatchFn: dispatch,
        urlEnding: "999901",
        path: ["koulutukset", "poikkeukset", "999901"]
      },
      {
        key: "koulutus",
        dispatchFn: dispatch,
        urlEnding: "999903",
        path: ["koulutukset", "poikkeukset", "999903"]
      },
      { key: "koulutusalat", dispatchFn: dispatch },
      { key: "koulutustyypit", dispatchFn: dispatch },
      {
        key: "koulutuksetMuut",
        dispatchFn: dispatch,
        urlEnding: MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS,
        path: [
          "koulutukset",
          "muut",
          MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS
        ]
      },
      {
        key: "koulutuksetMuut",
        dispatchFn: dispatch,
        urlEnding: MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS,
        path: ["koulutukset", "muut", MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS]
      },
      {
        key: "koulutuksetMuut",
        dispatchFn: dispatch,
        urlEnding: MUUT_KEYS.KULJETTAJAKOULUTUS,
        path: ["koulutukset", "muut", MUUT_KEYS.KULJETTAJAKOULUTUS]
      },
      { key: "kielet", dispatchFn: dispatch },
      { key: "opetuskielet", dispatchFn: dispatch },
      { key: "maaraystyypit", dispatchFn: dispatch },
      { key: "muut", dispatchFn: dispatch },
      { key: "kunnat", dispatchFn: dispatch },
      { key: "maakunnat", dispatchFn: dispatch },
      { key: "maakuntakunnat", dispatchFn: dispatch },
      { key: "vankilat", dispatchFn: dispatch },
      { key: "tutkinnot", dispatchFn: dispatch },
      {
        key: "oivamuutoikeudetvelvollisuudetehdotjatehtavat",
        dispatchFn: dispatch
      },
      { key: "oivaperustelut", dispatchFn: dispatch }
    ];
    // Existing muutospyynto will be fetched if we have the UUID to use.
    const arr2 = match.params.uuid
      ? [
          {
            key: "muutospyynto",
            dispatchFn: dispatch,
            urlEnding: match.params.uuid
          }
        ]
      : [];
    return R.concat(arr1, arr2);
  }, [dispatch, match.params.uuid]);

  const [backendChanges, setBackendChanges] = useState({});

  /**
   * Let's walk through all the changes from the backend and update the muutoshakemus.
   */
  useEffect(() => {
    if (isReady(fromBackend.muutospyynto) && match.params.uuid) {
      const attachments = R.path(
        ["raw", "liitteet"],
        fromBackend.muutospyynto
      );

      fromBackend.muutospyynto.raw =
        setAttachmentUuids(attachments, fromBackend.muutospyynto.raw);

      const backendMuutokset = R.compose(
        R.path(["raw", "muutokset"]),
      )(fromBackend.muutospyynto);

      const getChangesOf = (
        key,
        changes,
        { path = ["kohde", "tunniste"], categoryKey } = {}
      ) => {
        let result = R.filter(R.pathEq(path, key))(changes);
        result = R.concat(
          R.reject(R.isNil, R.chain(R.propOr([], "aliMaaraykset"), result)),
          result
        );
        if (key === "tutkinnotjakoulutukset") {
          result = R.filter(
            R.compose(
              R.not,
              R.equals("tutkintokieli"),
              R.path(["meta", "tunniste"])
            ),
            result
          );
        }
        let changeObjects = R.flatten(
          R.map(R.path(["meta", "changeObjects"]))(result)
        ).filter(Boolean);
        if (key === "toimintaalue") {
          changeObjects = R.map(changeObj => {
            const type = R.path(["properties", "meta", "type"], changeObj);
            if (type === "addition") {
              changeObj.anchor = replaceAnchorPartWith(
                changeObj.anchor,
                0,
                `${getAnchorPart(changeObj.anchor, 0)}_additions`
              );
            } else if (type === "removal") {
              changeObj.anchor = replaceAnchorPartWith(
                changeObj.anchor,
                0,
                `${getAnchorPart(changeObj.anchor, 0)}_removals`
              );
            }
            return changeObj;
          }, changeObjects);
        }
        if (categoryKey) {
          changeObjects = getAnchorsStartingWith(categoryKey, changeObjects);
        }
        return changeObjects;
      };

      let tutkinnotjakoulutuksetLiitteetChanges =
        R.path(
          ["raw", "meta", "tutkinnotjakoulutuksetLiitteet", "changeObjects"],
          fromBackend.muutospyynto
        ) || [];
      let taloudellisetChanges =
        R.path(
          ["raw", "meta", "taloudelliset", "changeObjects"],
          fromBackend.muutospyynto
        ) || [];
      let yhteenvetoChanges =
        R.path(
          ["raw", "meta", "yhteenveto", "changeObjects"],
          fromBackend.muutospyynto
        ) || [];

      const c = R.flatten([
        getChangesOf("tutkinnotjakoulutukset", backendMuutokset, {
          categoryKey: "tutkinnot"
        }),
        getChangesOf("tutkinnotjakoulutukset", backendMuutokset, {
          categoryKey: "liitteet"
        }),
        getChangesOf("tutkinnotjakoulutukset", backendMuutokset, {
          categoryKey: "perustelut_tutkinnot"
        }),
        getChangesOf("tutkinnotjakoulutukset", backendMuutokset, {
          categoryKey: "koulutukset"
        }),
        getChangesOf("tutkinnotjakoulutukset", backendMuutokset, {
          categoryKey: "perustelut_koulutukset"
        }),
        getChangesOf("opetuskieli", backendMuutokset, {
          path: ["meta", "key"]
        }),
        getChangesOf("tutkintokieli", backendMuutokset, {
          path: ["meta", "tunniste"]
        }),
        getChangesOf("opiskelijavuodet", backendMuutokset),
        getChangesOf("toimintaalue", backendMuutokset),
        getChangesOf("muut", backendMuutokset),
        tutkinnotjakoulutuksetLiitteetChanges,
        taloudellisetChanges,
        yhteenvetoChanges
      ]).filter(Boolean);

      let changesBySection = {};

      R.forEach(changeObj => {
        const anchorInitialSplitted = R.split(
          "_",
          getAnchorPart(changeObj.anchor, 0)
        );
        const existingChangeObjects =
          R.path(anchorInitialSplitted, changesBySection) || [];
        const changeObjects = R.insert(-1, changeObj, existingChangeObjects);
        changesBySection = R.assocPath(
          anchorInitialSplitted,
          changeObjects,
          changesBySection
        );
      }, c);
      /**
       * At this point the backend data is handled and change objects are formed.
       */
      setBackendChanges({
        changeObjects: changesBySection,
        source: backendMuutokset,
        handled: true
      });
    }
  }, [fromBackend.muutospyynto, match.params.uuid]);

  const elykeskukset = useMemo(() => {
    return R.prop("raw", fromBackend.elykeskukset) || [];
  }, [fromBackend.elykeskukset]);

  const kohteet = useMemo(() => {
    return R.prop("raw", fromBackend.kohteet) || [];
  }, [fromBackend.kohteet]);

  const koulutustyypit = useMemo(() => {
    return R.prop("raw", fromBackend.koulutustyypit) || [];
  }, [fromBackend.koulutustyypit]);

  const kunnat = useMemo(() => {
    return R.prop("raw", fromBackend.kunnat) || [];
  }, [fromBackend.kunnat]);

  const maakunnat = useMemo(() => {
    return R.prop("raw", fromBackend.maakunnat) || [];
  }, [fromBackend.maakunnat]);

  const maakuntakunnat = useMemo(() => {
    return R.prop("raw", fromBackend.maakuntakunnat) || [];
  }, [fromBackend.maakuntakunnat]);

  const maaraystyypit = useMemo(() => {
    return R.prop("raw", fromBackend.maaraystyypit) || [];
  }, [fromBackend.maaraystyypit]);

  const muut = useMemo(() => {
    return R.prop("raw", fromBackend.muut) || [];
  }, [fromBackend.muut]);

  const vankilat = useMemo(() => {
    return R.prop("raw", fromBackend.vankilat) || [];
  }, [fromBackend.vankilat]);

  const muutosperusteluList = useMemo(() => {
    return isReady(fromBackend.oivaperustelut)
      ? getMuutosperusteluList(
          R.prop("raw", fromBackend.oivaperustelut),
          R.toUpper(intl.locale)
        )
      : [];
  }, [fromBackend.oivaperustelut, intl.locale]);

  const onNewDocSave = useCallback(
    muutoshakemus => {
      notify(
        "Muutospyyntö tallennettu! Voit jatkaa pian dokumentin muokkaamista.",
        {
          autoClose: 2000,
          position: toast.POSITION.TOP_LEFT,
          type: toast.TYPE.SUCCESS
        }
      );
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

  return (
    <FetchHandler
      fetchSetup={fetchSetup}
      ready={
        <MuutoshakemusProvider>
          <MuutospyyntoWizard
            backendChanges={backendChanges}
            elykeskukset={elykeskukset}
            history={history}
            kohteet={kohteet}
            koulutustyypit={koulutustyypit}
            kunnat={kunnat}
            lupa={lupa}
            lupaKohteet={lupaKohteet}
            maakunnat={maakunnat}
            maakuntakunnat={maakuntakunnat}
            maaraystyypit={maaraystyypit}
            match={match}
            muut={muut}
            muutosperusteluList={muutosperusteluList}
            muutospyynto={fromBackend.muutospyynto}
            vankilat={vankilat}
            onNewDocSave={onNewDocSave}
          />
        </MuutoshakemusProvider>
      }
    ></FetchHandler>
  );
};

HakemusContainer.propTypes = {
  history: PropTypes.object,
  lupaKohteet: PropTypes.object,
  lupa: PropTypes.object,
  match: PropTypes.object
};

export default injectIntl(HakemusContainer);
