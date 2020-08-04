import React, { useEffect, useState, useMemo, useCallback } from "react";
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

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const UusiAsiaDialogContainer = React.memo(
  ({
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

    const [muutospyynto, muutospyyntoActions] = useMuutospyynto();

    let { uuid, ytunnus } = useParams();
    let history = useHistory();

    const [changeObjects, setChangeObjects] = useState({
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
    });

    // Let's fetch data for the form
    useEffect(() => {
      // Existing muutospyynto will be fetched if we have the UUID to use.
      if (uuid) {
        muutospyyntoActions.load(uuid);
      }
    }, [muutospyyntoActions, uuid]);

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
        const nextChangeObjects = Object.assign(
          {},
          changeObjects,
          changesBySection
        );

        if (!equals(changeObjects, nextChangeObjects)) {
          setChangeObjects(Object.assign({}, changeObjects, changesBySection));
        }

        setAsHandled(true);
      }
    }, [
      backendMuutokset,
      changeObjects,
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
      (!uuid || (muutospyynto.fetchedAt && isHandled))
    ) {
      return (
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
          muutospyynto={muutospyynto.data}
          onNewDocSave={onNewDocSave}
          opetuskielet={opetuskielet}
          organisation={organisaatio}
          tutkinnot={tutkinnot}
        />
      );
    } else {
      return (
        <Loading
          percentage={
            ([!!!(!uuid || muutospyynto.fetchedAt)].filter(Boolean).length /
              (!uuid ? 1 : 2)) *
            100
          }></Loading>
      );
    }
  }
);

export default UusiAsiaDialogContainer;
