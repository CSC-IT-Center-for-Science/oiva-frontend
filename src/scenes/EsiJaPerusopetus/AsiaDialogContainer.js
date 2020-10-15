import React, {useEffect, useMemo, useState} from "react";
import {useIntl} from "react-intl";
import {assocPath, find, forEach, insert, map, path, prop, propEq, split} from "ramda";
import Loading from "../../modules/Loading";
import {findObjectWithKey, getAnchorPart} from "../../utils/common";
import {setAttachmentUuids} from "../../utils/muutospyyntoUtil";
import UusiAsiaDialog from "./UusiAsiaDialog";
import {useHistory, useParams} from "react-router-dom";
import {parseLupa} from "../../utils/lupaParser";
import localforage from "localforage";
import {API_BASE_URL} from "modules/constants";
import {backendRoutes} from "stores/utils/backendRoutes";
import {useEsiJaPerusopetus} from "../../stores/esiJaPerusopetus";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const AsiaDialogContainer = ({
  kielet,
  kieletOPH,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  kunnat,
  lisatiedot,
  maakunnat,
  maakuntakunnat,
  maaraystyypit,
  muut,
  opetuskielet,
  opetustehtavakoodisto,
  opetustehtavat,
  opetuksenJarjestamismuodot,
  organisaatio,
  poErityisetKoulutustehtavat,
  poMuutEhdot,
  tutkinnot,
  viimeisinLupa
}) => {
  const intl = useIntl();
  let history = useHistory();

  const { uuid } = useParams();

  const [muutospyynto, setMuutospyynto] = useState();
  const [state, actions] = useEsiJaPerusopetus();
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

  useEffect(() => {
    if (muutospyynto) {

      const {muutokset: backendMuutokset} = muutospyynto || {};

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

      changesBySection.paatoksentiedot = path(["meta", "paatoksentiedot"], muutospyynto) || [];
      // Set uuid for asianumero
      find(paatoksentiedot => getAnchorPart(paatoksentiedot.anchor, 1) === 'asianumero', changesBySection.paatoksentiedot)
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
      actions.setChangeObjects(null, changesBySection);
    }
  }, [muutospyynto, updatedC, actions]);

  return muutospyynto && state.changeObjects ? (
    <UusiAsiaDialog
      history={history}
      kielet={kielet}
      kieletOPH={kieletOPH}
      kohteet={kohteet}
      koulutukset={koulutukset}
      koulutusalat={koulutusalat}
      koulutustyypit={koulutustyypit}
      kunnat={kunnat}
      lisatiedot={lisatiedot}
      lupa={viimeisinLupa}
      lupaKohteet={lupaKohteet}
      maakunnat={maakunnat}
      maakuntakunnat={maakuntakunnat}
      maaraystyypit={maaraystyypit}
      muut={muut}
      onNewDocSave={() => {}}
      opetuksenJarjestamismuodot={opetuksenJarjestamismuodot}
      poErityisetKoulutustehtavat={poErityisetKoulutustehtavat}
      poMuutEhdot={poMuutEhdot}
      opetuskielet={opetuskielet}
      opetustehtavakoodisto={opetustehtavakoodisto}
      opetustehtavat={opetustehtavat}
      organisation={organisaatio}
      tutkinnot={tutkinnot}
    />
  ) : (
    <Loading />
  );
};

export default AsiaDialogContainer;
