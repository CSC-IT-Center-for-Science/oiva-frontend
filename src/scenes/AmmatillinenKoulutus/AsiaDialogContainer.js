import React, {useEffect, useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {assocPath, find, forEach, includes, insert, map, path, prop, propEq, split} from "ramda";
import Loading from "../../modules/Loading";
import {findObjectWithKey, getAnchorPart} from "../../utils/common";
import {setAttachmentUuids} from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import {useHistory, useParams} from "react-router-dom";
import {parseLupa} from "../../utils/lupaParser";
import localforage from "localforage";
import {API_BASE_URL} from "modules/constants";
import {backendRoutes} from "stores/utils/backendRoutes";

const initialChangeObjects = {
  tutkinnot: {},
  kielet: {
    opetuskielet: [],
    tutkintokielet: {}
  },
  koulutukset: {},
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
      ? parseLupa({ ...viimeisinLupa }, intl.formatMessage, intl.locale.toUpperCase())
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  const filesFromMuutokset = useMemo(() => {
    if (muutospyynto) {
      const attachments = prop("liitteet", muutospyynto);
      const muutospyyntoData = setAttachmentUuids(attachments, muutospyynto);
      const backendMuutokset = prop("muutokset")(muutospyyntoData);
      return findObjectWithKey(backendMuutokset, "liitteet");
    }
    return null;
  }, [muutospyynto]);

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
      return files ? assocPath(["properties", "attachments"], files, changeObj) : changeObj;
    }, findObjectWithKey({ ...muutospyynto }, "changeObjects"));
  }, [filesFromMuutokset, muutospyynto]);

  const changeObjects = useMemo(() => {
    if (!muutospyynto) {
      return null;
    }

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
    // Set uuid for asianumero
    find(topthree => getAnchorPart(topthree.anchor, 1) === 'asianumero', changesBySection.topthree)
      .properties.metadata = {uuid: muutospyynto.uuid};

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
  }, [muutospyynto, updatedC]);

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
