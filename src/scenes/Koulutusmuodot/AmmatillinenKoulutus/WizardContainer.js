import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import { parseLupa } from "../../../utils/lupaParser";
import { isEmpty, prop, toUpper } from "ramda";
import { Wizard } from "components/03-templates/Wizard/index";
import wizard from "i18n/definitions/wizard";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";
import common from "i18n/definitions/common";
import MuutospyyntoWizardTaloudelliset from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardTaloudelliset";
import MuutospyyntoWizardYhteenveto from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardYhteenveto";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import { createObjectToSave } from "helpers/ammatillinenKoulutus/tallentaminen/esittelijat";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval
} from "stores/muutokset";
import { useAllSections } from "stores/lomakedata";
import ProcedureHandler from "components/02-organisms/procedureHandler/index";
import { useMuutospyynto } from "stores/muutospyynto";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import { API_BASE_URL } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { getUrlOnClose } from "components/03-templates/Wizard/wizardUtils";
//localhost/fi/jarjestamis-ja-yllapitamisluvat/ammatillinen-koulutus/0208201-1/jarjestamislupa-asiat
// https: //localhost/fi/jarjestamis-ja-yllapitamisluvat/ammatillinen-koulutus/koulutustoimijat/0208201-1/jarjestamislupa-asiat
/**
 * Container component of Wizard.
 *
 * @param {Object} props - Props object.
 * @param {Object} props.intl - Object of react-intl library.
 */
const WizardContainer = ({
  kohteet,
  koulutukset,
  koulutusalat,
  koulutusmuoto,
  koulutustyypit,
  maaraystyypit,
  muut,
  organisaatio,
  role,
  viimeisinLupa
}) => {
  const { formatMessage, locale } = useIntl();

  let { id, language, uuid } = useParams();
  let history = useHistory();

  const [lomakedata] = useAllSections();
  const [muutospyynto, setMuutospyynto] = useState();
  const [isSaving, setIsSaving] = useState();

  // Relevantit muutosobjektit osioittain (tarvitaan tallennettaessa)
  const [topThreeCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "topthree"
  });
  const [tutkinnotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "tutkinnot"
  });
  const [koulutuksetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "koulutukset"
  });
  const [opetuskieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_opetuskielet"
  });
  const [tutkintokieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_tutkintokielet"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opiskelijavuodetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opiskelijavuodet"
  });
  const [muutCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muut"
  });

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

  const [, { initializeChanges }] = useChangeObjects();

  const [, muutospyyntoActions] = useMuutospyynto();

  const lupaKohteet = useMemo(() => {
    const result = !isEmpty(viimeisinLupa)
      ? parseLupa({ ...viimeisinLupa }, formatMessage, locale.toUpperCase())
      : {};
    return result;
  }, [formatMessage, locale, viimeisinLupa]);

  useEffect(() => {
    const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
    initializeChanges(changeObjectsFromBackend);
  }, [muutospyynto, initializeChanges]);

  const onNewDocSave = useCallback(
    uuid => {
      /**
       * User is redirected to the url of the saved document.
       */
      history.push(
        localizeRouteKey(locale, AppRoute.Hakemus, formatMessage, {
          id,
          koulutusmuoto: koulutusmuoto.kebabCase,
          language,
          page: 1,
          uuid
        })
      );
    },
    [history, id, koulutusmuoto, language, locale, formatMessage]
  );

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(formatMessage);
      /**
       * Let's save the form without notification. Notification about saving isn't
       * needed when we're going to show a notification related to the preview.
       */
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData, false] // false = Notification of save success won't be shown.
      );
      const muutospyynto =
        outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
          .result;
      // Let's get the path of preview (PDF) document and download the file.
      const path = await muutospyyntoActions.getLupaPreviewDownloadPath(
        muutospyynto.uuid
      );
      if (path) {
        muutospyyntoActions.download(path, formatMessage);
      }
      return muutospyynto;
    },
    [formatMessage, muutospyyntoActions]
  );

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

  // KJ eli koulutuksen järjestäjä on velvolliinen perustelemaan hakemansa
  // muutokset, esittelijä ei ole. Siksi esittelijän tarvitsee täyttää vain
  // lomakewizardin ensimmäinen sivu.
  const [steps] = useState(
    role === "KJ"
      ? [
          {
            title: formatMessage(wizard.pageTitle_1)
          },
          {
            title: formatMessage(wizard.pageTitle_2)
          },
          {
            title: formatMessage(wizard.pageTitle_3)
          },
          {
            title: formatMessage(wizard.pageTitle_4)
          }
        ]
      : null
  );

  const onAction = useCallback(
    async (action, fromDialog = false, muutospyynnonTila) => {
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          toUpper(locale),
          organisaatio,
          viimeisinLupa,
          {
            koulutukset: koulutuksetCO,
            muut: muutCO,
            opetuskielet: opetuskieletCO,
            opiskelijavuodet: opiskelijavuodetCO,
            toimintaalue: toimintaalueCO,
            topthree: topThreeCO,
            tutkinnot: tutkinnotCO,
            tutkintokielet: tutkintokieletCO
          },
          uuid,
          kohteet,
          maaraystyypit,
          muut,
          lupaKohteet,
          lomakedata,
          muutospyynnonTila
        )
      );

      let muutospyynto = null;

      if (action === "save") {
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      }

      if (!!muutospyynto && prop("uuid", muutospyynto)) {
        if (!uuid && !fromDialog && !!onNewDocSave) {
          // Jos kyseessä on ensimmäinen tallennus...
          onNewDocSave(muutospyynto.uuid);
        } else {
          /**
           * Kun muutospyyntolomakkeen tilaa muokataan tässä vaiheessa,
           * vältytään tarpeelta tehdä sivun täydellistä uudelleen latausta.
           **/
          const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
          initializeChanges(changeObjectsFromBackend);
        }
      }
    },
    [
      kohteet,
      initializeChanges,
      locale,
      koulutuksetCO,
      lomakedata,
      viimeisinLupa,
      lupaKohteet,
      maaraystyypit,
      muut,
      muutCO,
      onNewDocSave,
      onPreview,
      onSave,
      opetuskieletCO,
      opiskelijavuodetCO,
      organisaatio,
      toimintaalueCO,
      topThreeCO,
      tutkinnotCO,
      tutkintokieletCO,
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
        <EsittelijatMuutospyynto
          kohteet={kohteet}
          koulutukset={koulutukset}
          koulutusalat={koulutusalat}
          koulutustyypit={koulutustyypit}
          maaraykset={viimeisinLupa.maaraykset}
          lupaKohteet={lupaKohteet}
          maaraystyypit={maaraystyypit}
          mode={"modification"}
          muut={muut}
          role={role}
          title={formatMessage(common.changesText)}
        />
      }
      page2={
        role === "KJ" ? (
          <EsittelijatMuutospyynto
            kohteet={kohteet}
            koulutukset={koulutukset}
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            maaraykset={viimeisinLupa.maaraykset}
            lupaKohteet={lupaKohteet}
            maaraystyypit={maaraystyypit}
            mode={"reasoning"}
            muut={muut}
            role={role}
            title={formatMessage(wizard.pageTitle_2)}
          />
        ) : null
      }
      page3={
        role === "KJ" ? (
          <MuutospyyntoWizardTaloudelliset
            isReadOnly={false}
            // isFirstVisit={visitsPerPage[3] === 1}
          />
        ) : null
      }
      page4={
        role === "KJ" ? (
          <MuutospyyntoWizardYhteenveto
            history={history}
            kohteet={kohteet}
            koulutukset={koulutukset}
            koulutusalat={koulutusalat}
            koulutustyypit={koulutustyypit}
            lupa={viimeisinLupa}
            lupaKohteet={lupaKohteet}
            maaraykset={viimeisinLupa.maaraykset}
            maaraystyypit={maaraystyypit}
            mode="reasoning"
            muut={muut}
            // isFirstVisit={visitsPerPage[4] === 1}
          />
        ) : null
      }
      isSaving={isSaving}
      koulutusmuoto={koulutusmuoto}
      onAction={onAction}
      organisation={organisaatio}
      steps={steps}
      title={formatMessage(wizard.esittelijatMuutospyyntoDialogTitle)}
      urlOnClose={urlOnClose}
    />
  );
};

export default WizardContainer;
