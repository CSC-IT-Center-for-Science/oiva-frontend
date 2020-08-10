import React, { useEffect, useState, useMemo } from "react";
import { useIntl } from "react-intl";
import {
  assocPath,
  find,
  forEach,
  includes,
  insert,
  map,
  path,
  prop,
  propEq,
  split,
  equals
} from "ramda";
import Loading from "../../modules/Loading";
import { useMuutospyynto } from "../../stores/muutospyynto";
import { getAnchorPart, findObjectWithKey } from "../../utils/common";
import { setAttachmentUuids } from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../utils/lupaParser";
import { isEmpty } from "ramda";
import localforage from "localforage";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";

const initialChangeObjects = {
  tutkinnot: {},
  kielet: {
    opetuskielet: [],
    tutkintokielet: {}
  },
  koulutukset: {
    atvKoulutukset: [],
    kuljettajakoulutukset: [],
    valmentavatKoulutukset: []
  },
  perustelut: {
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      atvKoulutukset: [],
      kuljettajakoulutukset: [],
      tyovoimakoulutukset: [],
      valmentavatKoulutukset: []
    },
    opiskelijavuodet: {
      sisaoppilaitos: [],
      vaativatuki: [],
      vahimmaisopiskelijavuodet: []
    },
    liitteet: [],
    toimintaalue: [],
    tutkinnot: {}
  },
  taloudelliset: {
    yleisettiedot: [],
    investoinnit: [],
    tilinpaatostiedot: [],
    liitteet: []
  },
  muut: {},
  opiskelijavuodet: [],
  toimintaalue: [],
  yhteenveto: {
    yleisettiedot: [],
    hakemuksenLiitteet: []
  },
  // Top three fields of muutospyyntö form of esittelijä role
  topthree: []
};

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
  lupa,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  opetuskielet,
  organisaatio,
  tutkinnot
}) => {
  const intl = useIntl();
  let history = useHistory();

  const { uuid } = useParams();

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

    fetchMuutospyynto();
  }, [uuid]);

  const lupaKohteet = useMemo(() => {
    const result = lupa
      ? parseLupa({ ...lupa }, intl.formatMessage, intl.locale.toUpperCase())
      : {};
    return result;
  }, [lupa, intl]);

  const filesFromMuutokset = useMemo(() => {
    if (muutospyynto) {
      const attachments = prop("liitteet", muutospyynto);
      const muutospyyntoData = setAttachmentUuids(attachments, muutospyynto);
      const backendMuutokset = prop("muutokset")(muutospyyntoData);
      return findObjectWithKey(backendMuutokset, "liitteet");
    }
    return null;
  }, [uuid, muutospyynto]);

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
    }, findObjectWithKey({ ...muutospyynto }, "changeObjects"));
  }, [filesFromMuutokset, muutospyynto]);

  const changeObjects = useMemo(() => {
    if (!muutospyynto) {
      return null;
    }
    console.info("KÄYDÄÄN LÄPI.", muutospyynto);
    const { muutokset: backendMuutokset } = muutospyynto || {};

    let changesBySection = {};

    localforage.setItem("backendMuutokset", backendMuutokset);

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

    changesBySection.topthree = path(["meta", "topthree"], muutospyynto) || [];

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
    const nextChangeObjects = Object.assign(
      {},
      initialChangeObjects,
      changesBySection
    );

    return nextChangeObjects;
  }, [muutospyynto]);

  console.info(changeObjects);
  return muutospyynto && changeObjects ? (
    <UusiAsiaDialog
      history={history}
      initialChangeObjects={changeObjects}
      kielet={kielet}
      kohteet={kohteet}
      koulutukset={koulutukset}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      kunnat={kunnat}
      lupa={lupa}
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

  // const [changeObjects, setChangeObjects] = useState({
  //   tutkinnot: {},
  //   kielet: {
  //     opetuskielet: [],
  //     tutkintokielet: {}
  //   },
  //   koulutukset: {
  //     atvKoulutukset: [],
  //     kuljettajakoulutukset: [],
  //     valmentavatKoulutukset: []
  //   },
  //   perustelut: {
  //     kielet: {
  //       opetuskielet: [],
  //       tutkintokielet: []
  //     },
  //     koulutukset: {
  //       atvKoulutukset: [],
  //       kuljettajakoulutukset: [],
  //       tyovoimakoulutukset: [],
  //       valmentavatKoulutukset: []
  //     },
  //     opiskelijavuodet: {
  //       sisaoppilaitos: [],
  //       vaativatuki: [],
  //       vahimmaisopiskelijavuodet: []
  //     },
  //     liitteet: [],
  //     toimintaalue: [],
  //     tutkinnot: {}
  //   },
  //   taloudelliset: {
  //     yleisettiedot: [],
  //     investoinnit: [],
  //     tilinpaatostiedot: [],
  //     liitteet: []
  //   },
  //   muut: {},
  //   opiskelijavuodet: [],
  //   toimintaalue: [],
  //   yhteenveto: {
  //     yleisettiedot: [],
  //     hakemuksenLiitteet: []
  //   },
  //   // Top three fields of muutospyyntö form of esittelijä role
  //   topthree: []
  // });

  // const [isHandled, setAsHandled] = useState(false);

  // const filesFromMuutokset = useMemo(() => {
  //   if (muutospyynto.fetchedAt && uuid) {
  //     const attachments = prop("liitteet", muutospyynto.data);
  //     const muutospyyntoData = setAttachmentUuids(
  //       attachments,
  //       muutospyynto.data
  //     );
  //     const backendMuutokset = prop("muutokset")(muutospyyntoData);
  //     return findObjectWithKey(backendMuutokset, "liitteet");
  //   }
  // }, [uuid, muutospyynto.data, muutospyynto.fetchedAt]);

  // const updatedC = useMemo(() => {
  //   return map(changeObj => {
  //     const files = path(["properties", "attachments"], changeObj)
  //       ? map(file => {
  //           const fileFromBackend =
  //             find(
  //               propEq("tiedostoId", file.tiedostoId),
  //               filesFromMuutokset || {}
  //             ) || {};
  //           return Object.assign({}, file, fileFromBackend);
  //         }, changeObj.properties.attachments || [])
  //       : null;
  //     return assocPath(["properties", "attachments"], files, changeObj);
  //   }, findObjectWithKey({ ...muutospyynto.data }, "changeObjects"));
  // }, [filesFromMuutokset, muutospyynto.data]);

  // /**
  //  * Let's walk through all the changes from the backend and update the muutoshakemus.
  //  */
  // const changesBySection = useMemo(() => {
  // console.info(backendMuutokset);
  // return {};

  // let changesBySection = {};

  //   console.info("KÄYDÄÄN LÄPI MUUTOSPYYNNÖN MUUTOKSET!");

  //   localforage.setItem("backendMuutokset", backendMuutokset);

  // if (updatedC) {
  //   forEach(changeObj => {
  //     const anchorInitialSplitted = split(
  //       "_",
  //       getAnchorPart(changeObj.anchor, 0)
  //     );
  //     const existingChangeObjects =
  //       path(anchorInitialSplitted, changesBySection) || [];
  //     const changeObjects = insert(-1, changeObj, existingChangeObjects);
  //     changesBySection = assocPath(
  //       anchorInitialSplitted,
  //       changeObjects,
  //       changesBySection
  //     );
  //   }, updatedC);
  // }

  //   // Special case: Toiminta-alueen perustelut
  //   const toimintaAluePerusteluChangeObject = path(
  //     ["perustelut", "toimintaalue", "0"],
  //     changesBySection
  //   );
  //   if (
  //     toimintaAluePerusteluChangeObject &&
  //     !includes("reasoning", toimintaAluePerusteluChangeObject.anchor)
  //   ) {
  //     changesBySection = assocPath(
  //       ["perustelut", "toimintaalue"],
  //       [
  //         {
  //           anchor: "perustelut_toimintaalue.reasoning.A",
  //           properties: toimintaAluePerusteluChangeObject.properties
  //         }
  //       ],
  //       changesBySection
  //     );
  //   }

  //   changesBySection.topthree =
  //     path(["data", "meta", "topthree"], muutospyynto) || [];

  //   if (
  //     changesBySection.categoryFilter &&
  //     changesBySection.categoryFilter.length > 0
  //   ) {
  //     changesBySection.toimintaalue = [
  //       Object.assign({}, changesBySection.categoryFilter[0])
  //     ];
  //   }

  //   delete changesBySection.categoryFilter;
  //   return changesBySection;
  // }, [backendMuutokset]);

  // useEffect(() => {
  // /**
  //  * At this point the backend data is handled and change objects have been formed.
  //  */
  // const nextChangeObjects = Object.assign(
  //   {},
  //   changeObjects,
  //   changesBySection
  // );

  //   if (!equals(changeObjects, nextChangeObjects)) {
  //     // setChangeObjects(Object.assign({}, changeObjects, changesBySection));
  //   }
  //   console.info(changesBySection);
  //   if (changesBySection) {
  //     setAsHandled(true);
  //   }
  // }, [changesBySection]);

  // if (
  //   isHandled &&
  //   path(["topthree"], changeObjects) &&
  //   !isEmpty(lupaKohteet) &&
  //   (!uuid || muutospyynto.fetchedAt)
  // ) {
  //   console.info(
  //     "Valmista!",
  //     muutospyynto.fetchedAt,
  //     isHandled,
  //     path(["topthree"], changeObjects)
  //   );
  //   return (
  // <UusiAsiaDialog
  //   history={history}
  //   initialChangeObjects={changeObjects}
  //   kielet={kielet}
  //   kohteet={kohteet}
  //   koulutukset={koulutukset}
  //   koulutusalat={koulutusalat}
  //   koulutustyypit={koulutustyypit}
  //   kunnat={kunnat}
  //   lupa={lupa}
  //   lupaKohteet={lupaKohteet}
  //   maakunnat={maakunnat}
  //   maakuntakunnat={maakuntakunnat}
  //   maaraystyypit={maaraystyypit}
  //   muut={muut}
  //   onNewDocSave={() => {}}
  //   opetuskielet={opetuskielet}
  //   organisation={organisaatio}
  //   tutkinnot={tutkinnot}
  // />
  //   );
  // } else {
  //   return (
  //     <Loading
  //       percentage={
  //         ([!!!(!uuid || muutospyynto.fetchedAt)].filter(Boolean).length /
  //           (!uuid ? 1 : 2)) *
  //         100
  //       }></Loading>
  //   );
  // }
};

export default AsiaDialogContainer;
