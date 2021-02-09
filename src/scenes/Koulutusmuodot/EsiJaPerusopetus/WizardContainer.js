import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "utils/lupaParser";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import wizard from "i18n/definitions/wizard";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";
import { Wizard } from "components/03-templates/Wizard";
import LupanakymaA from "./lupanakymat/LupanakymaA";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import { createObjectToSave } from "./saving";
import { find, prop, propEq, toUpper } from "ramda";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const WizardContainer = ({
  kohteet,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  organisaatio,
  role,
  viimeisinLupa
}) => {
  let history = useHistory();
  const intl = useIntl();
  const { id, uuid } = useParams();
  const [
    { isPreviewModeOn },
    { initializeChanges, setPreviewMode }
  ] = useChangeObjects();
  const [muutospyynto, setMuutospyynto] = useState();

  const [paatoksentiedotCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "paatoksentiedot"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opetuskieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetuskielet"
  });
  const [opetustehtavatCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetustehtavat"
  });
  const [
    opetuksenJarjestamismuodotCo
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetuksenJarjestamismuodot"
  });
  const [
    erityisetKoulutustehtavatCO
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "erityisetKoulutustehtavat"
  });
  const [opiskelijamaaratCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opiskelijamaarat"
  });
  const [muutEhdotCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muutEhdot"
  });
  const [rajoitteetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "rajoitteet"
  });

  useEffect(() => {
    const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
    initializeChanges(changeObjectsFromBackend);
  }, [muutospyynto, initializeChanges]);

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

    if (!muutospyynto && uuid) {
      fetchMuutospyynto();
    }
  }, [muutospyynto, uuid]);

  const lupakohteet = useMemo(() => {
    const result = viimeisinLupa
      ? parseLupa(
          { ...viimeisinLupa },
          intl.formatMessage,
          intl.locale.toUpperCase()
        )
      : {};
    return result;
  }, [viimeisinLupa, intl]);

  const valtakunnallinenMaarays = find(
    propEq("koodisto", "nuts1"),
    prop("maaraykset", viimeisinLupa) || []
  );

  const steps = null;

  const onNewDocSave = useCallback(
    uuid => {
      /**
       * User is redirected to the url of the saved document.
       */
      history.push(`/esi-ja-perusopetus/asianhallinta/${id}/${uuid}`);
    },
    [history, id]
  );

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(async () => {
    return setPreviewMode(!isPreviewModeOn);
  }, [isPreviewModeOn, setPreviewMode]);

  /**
   * Saves the form.
   * @param {object} formData
   * @returns {object} - Muutospyyntö
   */
  const onSave = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData]
      );
      return outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
        .result;
    },
    [intl.formatMessage]
  );

  const onAction = useCallback(
    async (action, fromDialog = false) => {
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          toUpper(intl.locale),
          organisaatio,
          viimeisinLupa,
          {
            erityisetKoulutustehtavat: erityisetKoulutustehtavatCO,
            muutEhdot: muutEhdotCo,
            opetuksenJarjestamismuodot: opetuksenJarjestamismuodotCo,
            opetuskielet: opetuskieletCO,
            opetustehtavat: opetustehtavatCo,
            opiskelijamaarat: opiskelijamaaratCo,
            paatoksentiedot: paatoksentiedotCo,
            rajoitteet: rajoitteetCO,
            toimintaalue: toimintaalueCO
          },
          uuid,
          kohteet,
          maaraystyypit,
          "ESITTELIJA"
        )
      );

      if (!formData) {
        console.info("NO FORM DATA: ");
      }

      let muutospyynto = null;

      if (action === "save") {
        // console.info("TALLENNUSTOIMINTO ON KOMMENTOITU VÄLIAIKAISESTI POIS.");
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      }

      if (action === "save") {
        if (!!muutospyynto && prop("uuid", muutospyynto)) {
          if (!uuid && !fromDialog) {
            // Jos kyseessä on ensimmäinen tallennus...
            onNewDocSave(muutospyynto.uuid);
          } else {
            /**
             * Kun muutospyyntolomakkeen tilaa muokataan tässä vaiheessa,
             * vältytään tarpeelta tehdä sivun täydellistä uudelleen latausta.
             **/
            const changeObjectsFromBackend = getSavedChangeObjects(
              muutospyynto
            );
            initializeChanges(changeObjectsFromBackend);
          }
        }
      }
    },
    [
      erityisetKoulutustehtavatCO,
      initializeChanges,
      intl.locale,
      kohteet,
      viimeisinLupa,
      maaraystyypit,
      muutEhdotCo,
      onNewDocSave,
      onPreview,
      onSave,
      opetuksenJarjestamismuodotCo,
      opetuskieletCO,
      opetustehtavatCo,
      opiskelijamaaratCo,
      organisaatio,
      paatoksentiedotCo,
      rajoitteetCO,
      toimintaalueCO,
      uuid
    ]
  );

  return (
    <Wizard
      page1={
        <LupanakymaA
          isPreviewModeOn={false}
          isRestrictionsModeOn={true}
          lupakohteet={lupakohteet}
          maaraykset={viimeisinLupa.maaraykset}
          valtakunnallinenMaarays={valtakunnallinenMaarays}
        />
      }
      onAction={onAction}
      organisation={organisaatio}
      steps={steps}
      title={intl.formatMessage(wizard.esittelijatMuutospyyntoDialogTitle)}
      urlOnClose={
        role === "KJ"
          ? `../../../${id}/jarjestamislupa-asiat`
          : "/esi-ja-perusopetus/asianhallinta/avoimet?force=true"
      }
    />
  );
};

export default WizardContainer;
