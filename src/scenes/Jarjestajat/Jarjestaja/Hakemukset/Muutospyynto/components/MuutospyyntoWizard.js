import React, { useContext, useEffect, useCallback, useState } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import WizardPage from "./WizardPage";
import DialogContent from "@material-ui/core/DialogContent";
import MuutospyyntoWizardMuutokset from "./MuutospyyntoWizardMuutokset";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { MessageWrapper } from "modules/elements";
import { ROLE_KAYTTAJA } from "modules/constants";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import { MUUT_KEYS } from "../modules/constants";
import PropTypes from "prop-types";
import Loading from "../../../../../../modules/Loading";
import { KoulutusalatContext } from "context/koulutusalatContext";
import { KoulutuksetContext } from "context/koulutuksetContext";
import { KoulutustyypitContext } from "context/koulutustyypitContext";
import { KieletContext } from "../../../../../../context/kieletContext";
import { OpiskelijavuodetContext } from "../../../../../../context/opiskelijavuodetContext";
import { MuutContext } from "../../../../../../context/muutContext";
import { MuutoshakemusContext } from "../../../../../../context/muutoshakemusContext";
import { MuutospyynnotContext } from "../../../../../../context/muutospyynnotContext";
import {
  saveMuutospyynto,
  setSectionData
} from "../../../../../../services/muutoshakemus/actions";
import { createObjectToSave } from "../../../../../../services/muutoshakemus/utils/saving";
import { fetchKoulutusalat } from "services/koulutusalat/actions";
import { fetchMuut } from "services/muut/actions";
import {
  fetchKielet,
  fetchOppilaitoksenOpetuskielet
} from "../../../../../../services/kielet/actions";
import {
  fetchKoulutuksetAll,
  fetchKoulutuksetMuut,
  fetchKoulutus
} from "../../../../../../services/koulutukset/actions";
import { fetchKoulutustyypit } from "services/koulutustyypit/actions";
import { fetchMuutospyynto } from "../../../../../../services/muutospyynnot/actions";
import { HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants";
import { MuutoshakemusProvider } from "context/muutoshakemusContext";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { injectIntl } from "react-intl";

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const MuutospyyntoWizard = props => {
  // const [changes, setChanges] = useState({
  //   tutkinnot: {}
  // });
  const { state: muutospyynnot, dispatch: muutospyynnotDispatch } = useContext(
    MuutospyynnotContext
  );
  const { state: muutoshakemus, dispatch: muutoshakemusDispatch } = useContext(
    MuutoshakemusContext
  );
  const { state: koulutukset, dispatch: koulutuksetDispatch } = useContext(
    KoulutuksetContext
  );
  const { state: koulutusalat, dispatch: koulutusalatDispatch } = useContext(
    KoulutusalatContext
  );
  const { state: opiskelijavuodet } = useContext(OpiskelijavuodetContext);
  const { state: muut, dispatch: muutDispatch } = useContext(MuutContext);
  const {
    state: koulutustyypit,
    dispatch: koulutustyypitDispatch
  } = useContext(KoulutustyypitContext);
  const { state: kielet, dispatch: kieletDispatch } = useContext(KieletContext);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [state] = useState({
    isHelpVisible: false
  });
  const {
    intl: { formatMessage }
  } = props;

  useEffect(() => {
    fetchKoulutus("999901")(koulutuksetDispatch);
    fetchKoulutus("999903")(koulutuksetDispatch);
    fetchKoulutusalat()(koulutusalatDispatch);
    fetchKoulutustyypit()(koulutustyypitDispatch);
    fetchKoulutuksetMuut(MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS)(
      koulutuksetDispatch
    );
    fetchKoulutuksetMuut(MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS)(koulutuksetDispatch);
    fetchKoulutuksetMuut(MUUT_KEYS.KULJETTAJAKOULUTUS)(koulutuksetDispatch);
    fetchKielet(props.intl.locale)(kieletDispatch);
    fetchOppilaitoksenOpetuskielet()(kieletDispatch);
    fetchMuut()(muutDispatch);
    const uuid = props.match.params.uuid;
    if (uuid) {
      fetchMuutospyynto(uuid)(muutospyynnotDispatch);
    }
  }, [
    koulutuksetDispatch,
    koulutusalatDispatch,
    koulutustyypitDispatch,
    kieletDispatch,
    muutDispatch,
    muutospyynnotDispatch,
    props.intl.locale,
    props.match.params.uuid
  ]);

  useEffect(() => {
    if (koulutusalat.fetched && koulutustyypit.fetched) {
      fetchKoulutuksetAll(koulutusalat.data, koulutustyypit.data)(
        koulutuksetDispatch
      );
    }
  }, [koulutusalat, koulutustyypit, koulutuksetDispatch]);

  useEffect(() => {
    // TODO: Divide muutokset array of the muutospyynnot object by section and pass data to correct sections
  }, [muutospyynnot]);

  useEffect(() => {
    if (muutoshakemus.save && muutoshakemus.save.saved) {
      // TODO: If props.match.params.uuid is undefined but the document is already saved redirect user to the correct url
      console.info(muutoshakemus);
    }
  }, [muutoshakemus]);

  const handleNext = pageNumber => {
    if (pageNumber !== 4) {
      props.history.push(String(pageNumber + 1));
    }
  };

  const getSteps = () => {
    return [
      formatMessage(wizardMessages.pageTitle_1),
      formatMessage(wizardMessages.pageTitle_2),
      formatMessage(wizardMessages.pageTitle_3),
      formatMessage(wizardMessages.pageTitle_4)
    ];
  };

  const steps = getSteps();

  const save = () => {
    if (props.match.params.uuid) {
      // TODO: save existing document
    } else {
      saveMuutospyynto(createObjectToSave(lupa, muutoshakemus))(
        muutoshakemusDispatch
      );
    }
  };

  const onUpdate = useCallback(
    payload => {
      setSectionData(payload)(muutoshakemusDispatch);
    },
    [muutoshakemusDispatch]
  );

  const openCancelModal = () => {
    setIsConfirmDialogVisible(true);
  };

  function handleCancel() {
    setIsConfirmDialogVisible(false);
  }

  function handleOk() {
    props.history.push(`/jarjestajat/${props.match.params.ytunnus}`);
  }

  const { lupa } = props;
  const page = parseInt(props.match.params.page, 10);

  if (sessionStorage.getItem("role") !== ROLE_KAYTTAJA) {
    return (
      <MessageWrapper>
        <h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3>
      </MessageWrapper>
    );
  }

  // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
  const jarjestajaOid =
    props.lupa && props.lupa.data ? props.lupa.data.jarjestajaOid : null;
  if (sessionStorage.getItem("oid") !== jarjestajaOid) {
    return (
      <MessageWrapper>
        <Loading />
      </MessageWrapper>
    );
  }
  if (
    kielet.fetched &&
    koulutukset.fetched &&
    koulutukset.muut.fetched.length === 3 &&
    koulutukset.poikkeukset.fetched.length === 2 &&
    koulutusalat.fetched &&
    koulutustyypit.fetched &&
    lupa.fetched
  ) {
    return (
      <MuutoshakemusProvider>
        <Dialog
          open={true}
          onClose={openCancelModal}
          maxWidth={state.isHelpVisible ? "xl" : "lg"}
          fullScreen={true}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="customized-dialog-title" onClose={openCancelModal}>
            {formatMessage(wizardMessages.formTitle_new)}
          </DialogTitle>
          <DialogContent>
            <div className="lg:px-16 lg:py-4 max-w-6xl m-auto mb-10">
              <Stepper activeStep={page - 1}>
                {steps.map(label => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {page === 1 && (
                <WizardPage
                  pageNumber={1}
                  onNext={handleNext}
                  onSave={save}
                  lupa={lupa}
                  muutoshakemus={muutoshakemus}
                >
                  <MuutospyyntoWizardMuutokset
                    kielet={kielet}
                    koulutukset={koulutukset}
                    koulutusalat={koulutusalat}
                    koulutustyypit={koulutustyypit}
                    lupa={lupa}
                    opiskelijavuodet={opiskelijavuodet}
                    muut={muut}
                    muutoshakemus={muutoshakemus || {}}
                    onUpdate={onUpdate}
                    tutkinnotState={(muutoshakemus.tutkinnot || {}).state || []}
                  />
                </WizardPage>
              )}
            </div>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isConfirmDialogVisible}
          fullWidth={true}
          aria-labelledby="confirm-dialog"
          maxWidth="sm"
        >
          <DialogTitle id="confirm-dialog">Poistutaanko?</DialogTitle>
          <DialogContent>{HAKEMUS_VIESTI.VARMISTUS.FI}</DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              {HAKEMUS_VIESTI.EI.FI}
            </Button>
            <Button onClick={handleOk} color="primary">
              {HAKEMUS_VIESTI.KYLLA.FI}
            </Button>
          </DialogActions>
        </Dialog>
      </MuutoshakemusProvider>
    );
  } else {
    return <div>Haetaan</div>;
  }
};

export default injectIntl(MuutospyyntoWizard);

MuutospyyntoWizard.propTypes = {
  lupa: PropTypes.object
};
