import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import MuutospyyntoWizard from "./Muutospyynto/components/MuutospyyntoWizard";
import { getAnchorPart, findObjectWithKey } from "../../../../utils/common";
import { getMuutosperusteluList } from "../../../../utils/muutosperusteluUtil";
import { setAttachmentUuids } from "../../../../utils/muutospyyntoUtil";
import { useKoulutukset } from "../../../../stores/koulutukset";
import { useKohteet } from "../../../../stores/kohteet";
import { useOpetuskielet } from "../../../../stores/opetuskielet";
import { useMaaraystyypit } from "../../../../stores/maaraystyypit";
import { useMuut } from "../../../../stores/muut";
import { useKunnat } from "../../../../stores/kunnat";
import { useMaakunnat } from "../../../../stores/maakunnat";
import { useOmovt } from "../../../../stores/omovt";
import { useMuutospyynto } from "../../../../stores/muutospyynto";
import { useOivaperustelut } from "../../../../stores/oivaperustelut";
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
  toUpper,
  uniq,
  sortBy
} from "ramda";
import { MUUT_KEYS } from "./Muutospyynto/modules/constants";
import { useChangeObjects } from "../../../../stores/changeObjects";
import loadFromBackend from "../../../../stores/utils/loadFromBackend";
import { initializeKoulutusala } from "../../../../helpers/koulutusalat";
import localforage from "localforage";
import { initializeKoulutustyyppi } from "../../../../helpers/koulutustyypit";
import { initializeTutkinnot } from "../../../../helpers/tutkinnot";
import { initializeKieli } from "../../../../helpers/kielet";
import { initializeMaakunta } from "../../../../helpers/maakunnat";
import { initializeElykeskus } from "helpers/elykeskukset";
import { initializeVankilat } from "helpers/vankilat";

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

  const [elykeskukset, setElykeskukset] = useState();
  const [kielet, setKielet] = useState();
  const [koulutusalat, setKoulutusalat] = useState();
  const [koulutustyypit, setKoulutustyypit] = useState();
  const [maakuntakunnat, setMaakuntakunnat] = useState();
  const [tutkinnot, setTutkinnot] = useState();
  const [vankilat, setVankilat] = useState();

  const [, coActions] = useChangeObjects();
  const [kohteet, kohteetActions] = useKohteet();
  const [koulutukset, koulutuksetActions] = useKoulutukset();
  const [opetuskielet, opetuskieletActions] = useOpetuskielet();
  const [maaraystyypit, maaraystyypitActions] = useMaaraystyypit();
  const [muut, muutActions] = useMuut();
  const [kunnat, kunnatActions] = useKunnat();
  const [maakunnat, maakunnatActions] = useMaakunnat();
  const [omovt, omovtActions] = useOmovt();
  const [muutospyynto, muutospyyntoActions] = useMuutospyynto();
  const [oivaperustelut, oivaperustelutActions] = useOivaperustelut();

  // Let's fetch data for the form
  useEffect(() => {
    const abortControllers = flatten([
      kohteetActions.load(),
      opetuskieletActions.load(),
      maaraystyypitActions.load(),
      muutActions.load(),
      koulutuksetActions.load(),
      kunnatActions.load(),
      maakunnatActions.load(),
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
    kohteetActions,
    koulutuksetActions,
    opetuskieletActions,
    maaraystyypitActions,
    muutActions,
    kunnatActions,
    maakunnatActions,
    omovtActions,
    muutospyyntoActions,
    oivaperustelutActions,
    match.params.uuid
  ]);

  /**
   * Ely-keskukset: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "elykeskukset"
      },
      async fromBackend => {
        setElykeskukset(
          await localforage.setItem(
            "elykeskukset",
            map(elykeskus => {
              return initializeElykeskus(elykeskus);
            }, fromBackend)
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

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
            map(kieli => {
              return initializeKieli(kieli);
            }, fromBackend)
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

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
   * Vankilat: datan noutaminen backendistä ja sen tallentaminen
   * paikalliseen tietovarastoon jäsenneltynä.
   */
  useEffect(() => {
    const abortController = loadFromBackend(
      {
        key: "vankilat"
      },
      async fromBackend => {
        setVankilat(
          await localforage.setItem(
            "vankilat",
            map(vankila => {
              return initializeVankilat(vankila);
            }, fromBackend)
          )
        );
      }
    );

    return function cancel() {
      abortController.abort();
    };
  }, []);

  const [isHandled, setAsHandled] = useState(false);

  const [backendMuutokset, setBackendMuutokset] = useState([]);

  const filesFromMuutokset = useMemo(() => {
    if (muutospyynto.fetchedAt && match.params.uuid) {
      const attachments = prop("liitteet", muutospyynto.data);
      const muutospyyntoData = setAttachmentUuids(
        attachments,
        muutospyynto.data
      );
      const backendMuutokset = prop("muutokset")(muutospyyntoData);
      return findObjectWithKey(backendMuutokset, "liitteet");
    }
  }, [match.params.uuid, muutospyynto.data, muutospyynto.fetchedAt]);

  const updatedC = useMemo(() => {
    return uniq(
      map(changeObj => {
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
      }, findObjectWithKey({ ...muutospyynto.data }, "changeObjects"))
    );
  }, [filesFromMuutokset, muutospyynto.data]);

  /**
   * Let's walk through all the changes from the backend and update the muutoshakemus.
   */
  useEffect(() => {
    if (muutospyynto.fetchedAt && match.params.uuid) {
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

      if (changesBySection.areaofaction) {
        changesBySection.toimintaalue = changesBySection.toimintaalue || [];

        let byProvince = {};

        forEach(changeObj => {
          const provinceKey = getAnchorPart(changeObj.anchor, 1);
          byProvince[provinceKey] = byProvince[provinceKey] || [];
          byProvince[provinceKey].push(changeObj);
        }, changesBySection.areaofaction);

        changesBySection.toimintaalue.push({
          anchor: "categoryFilter",
          properties: {
            changeObjects: byProvince
          }
        });

        const toimintaAluePerusteluChangeObject = path(
          ["perustelut", "categoryFilter", "0"],
          changesBySection
        );

        if (toimintaAluePerusteluChangeObject) {
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
        delete changesBySection.areaofaction;
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
    match.params.uuid,
    updatedC
  ]);

  const muutosperusteluList = useMemo(() => {
    return oivaperustelut.fetchedAt
      ? getMuutosperusteluList(oivaperustelut.data, toUpper(intl.locale))
      : [];
  }, [oivaperustelut.fetchedAt, oivaperustelut.data, intl.locale]);

  const onNewDocSave = useCallback(
    muutospyynto => {
      const page = parseInt(match.params.page, 10);
      const url = `/jarjestajat/${match.params.ytunnus}`;
      const uuid = muutospyynto.uuid;
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
    elykeskukset &&
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
    opetuskielet.fetchedAt &&
    maaraystyypit.fetchedAt &&
    muut.fetchedAt &&
    kunnat.fetchedAt &&
    maakunnat.fetchedAt &&
    maakuntakunnat &&
    vankilat &&
    tutkinnot &&
    omovt.fetchedAt &&
    oivaperustelut.fetchedAt &&
    (!match.params.uuid || (muutospyynto.fetchedAt && isHandled))
  ) {
    return (
      <MuutospyyntoWizard
        backendMuutokset={backendMuutokset}
        elykeskukset={elykeskukset}
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
        match={match}
        muut={muut.data}
        muutosperusteluList={muutosperusteluList}
        muutospyynto={muutospyynto.data}
        vankilat={vankilat.data}
        onNewDocSave={onNewDocSave}
        opetuskielet={opetuskielet.data}
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
            ) && !!lupaKohteet,
            !!elykeskukset,
            !!kielet,
            !!kohteet.fetchedAt,
            !!koulutusalat,
            !!koulutustyypit,
            !!opetuskielet.fetchedAt,
            !!maaraystyypit.fetchedAt,
            !!muut.fetchedAt,
            !!kunnat.fetchedAt,
            !!maakunnat.fetchedAt,
            !!maakuntakunnat,
            !!vankilat,
            !!tutkinnot,
            !!omovt.fetchedAt,
            !!oivaperustelut.fetchedAt,
            !!(!match.params.uuid || muutospyynto.fetchedAt)
          ].filter(Boolean).length /
            20) *
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
