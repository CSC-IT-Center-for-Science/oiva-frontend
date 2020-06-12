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
  groupBy
} from "ramda";
import { MUUT_KEYS } from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/constants";
import Loading from "../../modules/Loading";
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
import { useTutkinnot } from "../../stores/tutkinnot";
import { useOmovt } from "../../stores/omovt";
import { useMuutospyynto } from "../../stores/muutospyynto";
import { useChangeObjects } from "../../stores/changeObjects";
import { getAnchorPart, findObjectWithKey } from "../../utils/common";
import { setAttachmentUuids } from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { useLupa } from "../../stores/lupa";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";
import { useOrganisation } from "../../stores/organisation";
import {
  initializeTutkintokielet,
  initializeMaarays,
  initializeTutkinto,
  initializeOsaamisalat
} from "../../helpers/tutkinnot/";
import localforage from "localforage";
import { initializeKoulutusala } from "../../helpers/koulutusalat";
import { initializeKoulutustyyppi } from "../../helpers/koulutustyypit";
import { initializeKieli } from "../../helpers/kielet";
import { storeLupa } from "../../helpers/lupa";
import { initializeMaakunta } from "../../helpers/maakunnat";

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
  const [tutkinnot, tutkinnotActions] = useTutkinnot();
  const [omovt, omovtActions] = useOmovt();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [lupa, lupaActions] = useLupa();
  const [organisation, organisationActions] = useOrganisation();

  let { uuid, ytunnus } = useParams();
  let history = useHistory();

  // Let's fetch data for the form
  useEffect(() => {
    const abortControllers = flatten([
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
      tutkinnotActions.load(),
      omovtActions.load(),
      koulutuksetActions.load(),
      organisationActions.load(ytunnus)
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
    tutkinnotActions,
    omovtActions,
    muutospyyntoActions,
    organisationActions,
    uuid,
    ytunnus
  ]);

  /**
   * In the useEffect below we store the degrees with their language
   * regulations (tutkinnot ja tutkintokielet) into a storage for
   * later use. They will be needed on saving phase.
   */
  useEffect(() => {
    async function initializeTutkinnot(tutkinnotData) {
      const maaraykset = prop("maaraykset", lupa.data) || [];

      const maarayksetByTutkinto = groupBy(prop("koodiarvo"), maaraykset);

      const tutkinnot = map(tutkintodata => {
        // Luodaan tutkinto
        let tutkinto = initializeTutkinto(tutkintodata);

        // Asetetaan tutkinnolle määräys
        tutkinto = initializeMaarays(
          tutkinto,
          maarayksetByTutkinto[tutkinto.koodiarvo]
        );

        // Asetetaan tutkinnolle tutkintokieliä koskevat määräykset
        tutkinto = initializeTutkintokielet(
          tutkinto,
          maarayksetByTutkinto[tutkinto.koodiarvo]
        );

        // Asetetaan tutkinnon osaamisalat ja niiden määräykset
        tutkinto = initializeOsaamisalat(tutkinto, tutkintodata.osaamisalat);

        return tutkinto;
      }, tutkinnotData);

      return await localforage.setItem("tutkinnot", tutkinnot);
    }
    if (lupa.fetchedAt) {
      initializeTutkinnot(tutkinnot.data);
    }
  }, [lupa, tutkinnot.data, tutkinnotActions]);

  /**
   * Koulutusalat
   */
  useEffect(() => {
    async function initializeKoulutusalat(koulutusalatData) {
      const koulutusalat = map(koulutusala => {
        return initializeKoulutusala(koulutusala);
      }, koulutusalatData);

      return await localforage.setItem("koulutusalat", koulutusalat);
    }

    if (koulutusalat.data) {
      initializeKoulutusalat(koulutusalat.data);
    }
  }, [koulutusalat.data]);

  /**
   * Koulutustyypit
   */
  useEffect(() => {
    async function initializeKoulutustyypit(koulutustyypitData) {
      const koulutustyypit = map(koulutustyyppi => {
        return initializeKoulutustyyppi(koulutustyyppi);
      }, koulutustyypitData);
      return await localforage.setItem("koulutustyypit", koulutustyypit);
    }
    if (koulutustyypit.data) {
      initializeKoulutustyypit(koulutustyypit.data);
    }
  }, [koulutustyypit.data]);

  /**
   * Kielet (yleinen kieliluettelo)
   */
  useEffect(() => {
    async function initializeKielet(kieletData) {
      return await localforage.setItem(
        "kielet",
        map(kieli => {
          return initializeKieli(kieli);
        }, kieletData)
      );
    }
    if (kielet.data) {
      initializeKielet(kielet.data);
    }
  }, [kielet.data]);

  /**
   * Maakunnat ja niiden kunnat (maakuntakunnat)
   */
  useEffect(() => {
    async function initializeMaakunnat(maakuntadata) {
      return await localforage.setItem(
        "maakunnat",
        map(maakunta => {
          return initializeMaakunta(maakunta);
        }, maakuntadata)
      );
    }
    if (maakuntakunnat.data) {
      initializeMaakunnat(maakuntakunnat.data);
    }
  }, [maakuntakunnat.data]);

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

  useEffect(() => {
    if (lupa.fetchedAt) {
      storeLupa(lupa);
    }
  }, [lupa]);

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

  const backendMuutokset =
    muutospyynto.fetchedAt && uuid ? muutospyynto.data.muutokset : [];

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
      localforage.setItem("backendMuutokset", muutospyynto.data.muutokset);

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

      changesBySection.topthree = muutospyynto.data.meta.topthree || [];

      if (
        changesBySection.categoryFilter &&
        changesBySection.categoryFilter.length > 0
      ) {
        changesBySection.toimintaalue = [
          Object.assign({}, changesBySection.categoryFilter[0])
        ];
      }

      delete changesBySection.categoryFilter;

      /**
       * At this point the backend data is handled and change objects have been formed.
       */
      coActions.initialize(changesBySection);

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

  const onNewDocSave = useCallback(
    muutospyynto => {
      /**
       * User is redirected to the url of the saved document.
       */
      history.push(`/asiat/${ytunnus}/${muutospyynto.uuid}`);
    },
    [history, ytunnus]
  );

  if (
    !isEmpty(lupaKohteet) &&
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
    organisation[ytunnus] &&
    organisation[ytunnus].fetchedAt &&
    maaraystyypit.fetchedAt &&
    muut.fetchedAt &&
    kunnat.fetchedAt &&
    maakunnat.fetchedAt &&
    maakuntakunnat.fetchedAt &&
    tutkinnot.fetchedAt &&
    omovt.fetchedAt &&
    (!uuid || (muutospyynto.fetchedAt && isHandled))
  ) {
    return (
      <UusiAsiaDialog
        history={history}
        kohteet={kohteet.data}
        koulutustyypit={koulutustyypit.data}
        kunnat={kunnat.data}
        lupa={lupa.data}
        lupaKohteet={lupaKohteet}
        maakunnat={maakunnat.data}
        maakuntakunnat={maakuntakunnat.data}
        maaraystyypit={maaraystyypit.data}
        muut={muut.data}
        muutospyynto={muutospyynto.data}
        onNewDocSave={onNewDocSave}
        organisation={organisation[ytunnus].data}
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
            ),
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
            !!organisation.fetchedAt,
            !!tutkinnot.fetchedAt,
            !!omovt.fetchedAt,
            !!(!uuid || muutospyynto.fetchedAt)
          ].filter(Boolean).length /
            (!uuid ? 18 : 19)) *
          100
        }
      />
    );
  }
});

export default UusiAsiaDialogContainer;
