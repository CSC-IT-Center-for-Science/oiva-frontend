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
import { Wizard } from "components/03-templates/Wizard/index";
import LupanakymaA from "./lupanakymat/LupanakymaA";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import { createObjectToSave } from "./saving";
import { find, prop, propEq, toUpper } from "ramda";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { FIELDS } from "locales/uusiHakemusFormConstants";
import { getUrlOnClose } from "components/03-templates/Wizard/wizardUtils";
import { PropTypes } from "prop-types";

/**
 * Container component of UusiaAsiaDialog.
 *
 * @param {Object} props - Props object.
 */
const WizardContainer = ({
  kohteet,
  koulutusmuoto,
  maaraystyypit,
  organisaatio,
  role,
  viimeisinLupa
}) => {
  let history = useHistory();
  const { formatMessage, locale } = useIntl();
  const { id, language, uuid } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [muutospyynnonTila, setMuutospyynnonTila] = useState();
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
    oikeusSisaoppilaitosmuotoiseenKoulutukseenCo
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "oikeusSisaoppilaitosmuotoiseenKoulutukseen"
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
  const [
    valtakunnallisetKehittamistehtavatCO
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "valtakunnallisetKehittamistehtavat"
  });
  const [rajoitepoistotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "rajoitepoistot"
  });

  useEffect(() => {
    if (muutospyynto) {
      const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
      initializeChanges(changeObjectsFromBackend);
      setMuutospyynnonTila(prop("tila", muutospyynto));
    }
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
      ? parseLupa({ ...viimeisinLupa }, formatMessage, locale.toUpperCase())
      : {};
    return result;
  }, [formatMessage, locale, viimeisinLupa]);

  const valtakunnallinenMaarays = find(
    propEq("koodisto", "nuts1"),
    prop("maaraykset", viimeisinLupa) || []
  );

  const steps = null;

  const title =
    muutospyynnonTila === FIELDS.TILA.VALUES.KORJAUKSESSA
      ? formatMessage(wizard.luvanKorjaustilaJarjestamisluvanMuutos)
      : formatMessage(wizard.esittelijatMuutospyyntoDialogTitle);

  const onNewDocSave = useCallback(
    (uuid, language) => {
      /**
       * User is redirected to the url of the saved document.
       */
      const url = localizeRouteKey(locale, AppRoute.Hakemus, formatMessage, {
        id,
        koulutusmuoto: koulutusmuoto.kebabCase,
        language,
        page: 1,
        uuid
      });
      history.push(url);
    },
    [formatMessage, history, id, koulutusmuoto.kebabCase, locale]
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
      setIsSaving(true);
      const procedureHandler = new ProcedureHandler(formatMessage);
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData]
      );
      setIsSaving(false);
      return outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
        .result;
    },
    [formatMessage]
  );

  const onAction = useCallback(
    async (action, fromDialog = false, muutospyynnonTila) => {
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          toUpper(locale),
          organisaatio,
          viimeisinLupa,
          {
            erityisetKoulutustehtavat: erityisetKoulutustehtavatCO,
            muutEhdot: muutEhdotCo,
            oikeusSisaoppilaitosmuotoiseenKoulutukseen: oikeusSisaoppilaitosmuotoiseenKoulutukseenCo,
            opetuskielet: opetuskieletCO,
            opetustehtavat: opetustehtavatCo,
            opiskelijamaarat: opiskelijamaaratCo,
            paatoksentiedot: paatoksentiedotCo,
            rajoitteet: rajoitteetCO,
            rajoitepoistot: rajoitepoistotCO,
            toimintaalue: toimintaalueCO,
            valtakunnallisetKehittamistehtavat: valtakunnallisetKehittamistehtavatCO
          },
          uuid,
          kohteet,
          maaraystyypit,
          language,
          "ESITTELIJA",
          muutospyynnonTila
        )
      );

      let muutospyynto = null;

      if (action === "save") {
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      }

      if (action === "save") {
        if (!!muutospyynto && prop("uuid", muutospyynto)) {
          if (!uuid && !fromDialog) {
            // Jos kyseessä on ensimmäinen tallennus...
            onNewDocSave(muutospyynto.uuid, language);
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
      language,
      locale,
      kohteet,
      viimeisinLupa,
      maaraystyypit,
      muutEhdotCo,
      onNewDocSave,
      onPreview,
      onSave,
      oikeusSisaoppilaitosmuotoiseenKoulutukseenCo,
      opetuskieletCO,
      opetustehtavatCo,
      opiskelijamaaratCo,
      organisaatio,
      paatoksentiedotCo,
      rajoitteetCO,
      rajoitepoistotCO,
      toimintaalueCO,
      valtakunnallisetKehittamistehtavatCO,
      uuid
    ]
  );

  const urlOnClose = getUrlOnClose(
    role,
    locale,
    formatMessage,
    organisaatio,
    koulutusmuoto,
    uuid
  );

  return (
    <Wizard
      page1={
        <LupanakymaA
          isPreviewModeOn={false}
          isRestrictionsModeOn={true}
          koulutustyyppi={koulutusmuoto.koulutustyyppi}
          lupakohteet={lupakohteet}
          maaraykset={viimeisinLupa.maaraykset}
          valtakunnallinenMaarays={valtakunnallinenMaarays}
          rajoitemaaraykset={viimeisinLupa.rajoitteet}
        />
      }
      isSaving={isSaving}
      onAction={onAction}
      organisation={organisaatio}
      steps={steps}
      title={title}
      urlOnClose={urlOnClose}
    />
  );
};

WizardContainer.propTypes = {
  kohteet: PropTypes.array,
  koulutusmuoto: PropTypes.object,
  maaraystyypit: PropTypes.array,
  organisaatio: PropTypes.object,
  role: PropTypes.string,
  viimeisinLupa: PropTypes.object
};

export default WizardContainer;
