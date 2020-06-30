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
  sortBy,
  toUpper
} from "ramda";
import { MUUT_KEYS } from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/constants";
import Loading from "../../modules/Loading";
import { useKohteet } from "../../stores/kohteet";
import { useKoulutukset } from "../../stores/koulutukset";
import { useOpetuskielet } from "../../stores/opetuskielet";
import { useMaaraystyypit } from "../../stores/maaraystyypit";
import { useMuut } from "../../stores/muut";
import { useKunnat } from "../../stores/kunnat";
import { useMaakunnat } from "../../stores/maakunnat";
import { useOmovt } from "../../stores/omovt";
import { useMuutospyynto } from "../../stores/muutospyynto";
import { useChangeObjects } from "../../stores/changeObjects";
import { getAnchorPart, findObjectWithKey } from "../../utils/common";
import { setAttachmentUuids } from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";
import { useOrganisation } from "../../stores/organisation";
import { initializeTutkinnot } from "../../helpers/tutkinnot/";
import localforage from "localforage";
import { initializeKoulutusala } from "../../helpers/koulutusalat";
import { initializeKoulutustyyppi } from "../../helpers/koulutustyypit";
import { initializeKieli } from "../../helpers/kielet";
import { initializeMaakunta } from "../../helpers/maakunnat";
import { initializeMuu } from "../../helpers/muut";
import loadFromBackend from "../../stores/utils/loadFromBackend";
import { sortLanguages } from "../../utils/kieliUtil";

/**
 * HakemusContainer gathers all the required data for the MuutospyyntoWizard by
 * executing several backend searches.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = React.memo(() => {
  const intl = useIntl();

  const [kielet, setKielet] = useState();
  const [koulutusalat, setKoulutusalat] = useState();
  const [koulutustyypit, setKoulutustyypit] = useState();
  const [lupa, setLupa] = useState();
  const [maakuntakunnat, setMaakuntakunnat] = useState();
  const [tutkinnot, setTutkinnot] = useState();

  const [, coActions] = useChangeObjects();
  const [kohteet, kohteetActions] = useKohteet();
  const [koulutukset, koulutuksetActions] = useKoulutukset();
  const [opetuskielet, opetuskieletActions] = useOpetuskielet();
  const [maakunnat, maakunnatActions] = useMaakunnat();
  const [maaraystyypit, maaraystyypitActions] = useMaaraystyypit();
  const [muut, muutActions] = useMuut();
  const [kunnat, kunnatActions] = useKunnat();
  const [omovt, omovtActions] = useOmovt();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [organisation, organisationActions] = useOrganisation();

  let { uuid, ytunnus } = useParams();
  let history = useHistory();

  // Let's fetch data for the form
  useEffect(() => {
    const abortControllers = flatten([
      kohteetActions.load(),
      opetuskieletActions.load(),
      maakunnatActions.load(),
      maaraystyypitActions.load(),
      muutActions.load(),
      koulutuksetActions.load(),
      kunnatActions.load(),
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
        abortController => abortController.abort(),
        abortControllers.filter(Boolean)
      );
    };
  }, [
    kohteetActions,
    koulutuksetActions,
    opetuskieletActions,
    maakunnatActions,
    maaraystyypitActions,
    muutActions,
    kunnatActions,
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
    let abortController = null;
    if (lupa) {
      abortController = loadFromBackend(
        {
          key: "tutkinnot"
        },
        async fromBackend => {
          setTutkinnot(
            sortBy(
              prop("koodiarvo"),
              await localforage.setItem(
                "tutkinnot",
                initializeTutkinnot(fromBackend, prop("maaraykset", lupa) || [])
              )
            )
          );
        }
      );
    }

    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [lupa]);

  /**
   * Koulutusalat: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "koulutusalat"
      },
      async fromBackend => {
        setKoulutusalat(
          sortBy(
            prop("koodiarvo"),
            await localforage.setItem(
              "koulutusalat",
              map(koulutusala => {
                return initializeKoulutusala(koulutusala);
              }, fromBackend)
            )
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

  /**
   * Koulutustyypit: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "koulutustyypit"
      },
      async fromBackend => {
        setKoulutustyypit(
          sortBy(
            prop("koodiarvo"),
            await localforage.setItem(
              "koulutustyypit",
              map(koulutustyyppi => {
                return initializeKoulutustyyppi(koulutustyyppi);
              }, fromBackend)
            )
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

  /**
   * Kielet: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "kielet"
      },
      async fromBackend => {
        setKielet(
          await localforage.setItem(
            "kielet",
            sortLanguages(
              map(kieli => {
                return initializeKieli(kieli);
              }, fromBackend),
              toUpper(intl.locale)
            )
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, [intl.locale]);

  /**
   * Maakuntakunnat: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "maakuntakunnat"
      },
      async fromBackend => {
        setMaakuntakunnat(
          await localforage.setItem(
            "maakuntakunnat",
            map(maakunta => {
              return initializeMaakunta(maakunta);
            }, fromBackend).filter(Boolean)
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

  /**
   * Muut oikeudet, velvollisuudet ja tehtävät: datan noutaminen backendistä
   * ja sen tallentaminen paikalliseen tietovarastoon jäsenneltynä.
   *
   */
  useEffect(() => {
    async function initializeMuut(muutData) {
      return await localforage.setItem(
        "muut",
        map(muudata => {
          return initializeMuu(muudata);
        }, muutData)
      );
    }
    if (muut.data) {
      initializeMuut(muut.data);
    }
  }, [muut.data]);

  /**
   * Lupa: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "lupa",
        urlEnding: `${ytunnus}?with=all`
      },
      async fromBackend => {
        setLupa(await localforage.setItem("lupa", fromBackend));
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, [ytunnus]);

  const lupaKohteet = useMemo(() => {
    const result = lupa
      ? parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase())
      : {};
    return result;
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
    kielet &&
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
    koulutusalat &&
    koulutustyypit &&
    lupa &&
    opetuskielet.fetchedAt &&
    organisation[ytunnus] &&
    organisation[ytunnus].fetchedAt &&
    maaraystyypit.fetchedAt &&
    muut.fetchedAt &&
    kunnat.fetchedAt &&
    maakunnat.fetchedAt &&
    maakuntakunnat &&
    tutkinnot &&
    omovt.fetchedAt &&
    (!uuid || (muutospyynto.fetchedAt && isHandled))
  ) {
    return (
      <UusiAsiaDialog
        history={history}
        kielet={kielet}
        kohteet={kohteet.data}
        koulutusalat={koulutusalat}
        koulutustyypit={koulutustyypit}
        kunnat={kunnat.data}
        lupa={lupa}
        lupaKohteet={lupaKohteet}
        maakunnat={maakunnat.data}
        maakuntakunnat={maakuntakunnat}
        maaraystyypit={maaraystyypit.data}
        muut={muut.data}
        muutospyynto={muutospyynto.data}
        onNewDocSave={onNewDocSave}
        opetuskielet={opetuskielet.data}
        organisation={organisation[ytunnus].data}
        tutkinnot={tutkinnot}
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
            !!kielet,
            !!kohteet.fetchedAt,
            !!koulutusalat,
            !!koulutustyypit,
            !!lupa,
            !!opetuskielet.fetchedAt,
            !!maaraystyypit.fetchedAt,
            !!muut.fetchedAt,
            !!kunnat.fetchedAt,
            !!maakunnat.fetchedAt,
            !!maakuntakunnat,
            !!organisation.fetchedAt,
            !!tutkinnot,
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
