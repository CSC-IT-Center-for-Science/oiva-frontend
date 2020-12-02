import React, { useState, useEffect, useCallback, useRef } from "react";
import { PropTypes } from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "components/02-organisms/DialogTitle";
import Autocomplete from "components/02-organisms/Autocomplete";
import common from "i18n/definitions/common";
import {
  DialogContent,
  Dialog,
  DialogActions,
  Button,
  FormControl,
  IconButton,
  TextField,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { useOrganisations } from "stores/organisations";
import { sortBy, prop, map, find, propEq, trim } from "ramda";
import { resolveLocalizedOrganizationName } from "modules/helpers";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles, makeStyles } from "@material-ui/styles";
import { fetchJSON } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";

const StyledButton = withStyles({
  root: {
    color: "#4C7A61",
    fontWeight: 400,
    fontSize: "0.9375rem",
    textTransform: "none"
  }
})(Button);

const StyledErrorIcon = withStyles({
  root: {
    color: "#E5C418"
  }
})(ErrorIcon);

const useStyles = makeStyles({
  fakeDisabled: {
    backgroundColor: "#B7CAC0",
    "&:hover": {
      backgroundColor: "#B7CAC0"
    }
  }
});

const UusiAsiaEsidialog = ({ isVisible, onClose, onSelect }) => {
  const intl = useIntl();
  const [selectedKJ, setSelectedKJ] = useState();
  const [organisations, organisationsActions] = useOrganisations({});
  const [isSearchFieldVisible, setIsSearchFieldVisible] = useState(false);
  const [organisation, setOrganisation] = useState(null);
  const [organisationStatus, setOrganisationStatus] = useState();
  const inputEl = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKJMissing, setIsKJMissing] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const abortController = organisationsActions.load();
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [organisationsActions]);

  const searchByYtunnus = useCallback(async () => {
    const { value: ytunnus } = inputEl.current;
    setIsLoading(true);
    const result = await fetchJSON(
      `${backendRoutes.ytunnushaku.path}/${trim(ytunnus)}`
    );
    setIsLoading(false);
    setOrganisation(result);
    setIsKJMissing(false);
    if (result) {
      const isLupaExisting = !!find(
        propEq("oid", result.oid),
        organisations.data
      );
      if (isLupaExisting) {
        setOrganisationStatus("duplicate");
      } else {
        setOrganisationStatus("ok");
      }
    } else {
      setOrganisationStatus("notfound");
    }
  }, [organisations]);

  return organisations.data &&
    organisations.fetchedAt &&
    !organisations.isErroneous ? (
    <Dialog open={isVisible} PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle onClose={onClose}>
        {intl.formatMessage(common.luoUusiAsia)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <div className="px-8 py-4 relative">
          {isSearchFieldVisible ? (
            <React.Fragment>
              <p className="mb-6">
                {intl.formatMessage(common.luoUusiAsiaEsidialogiInfo2)}
              </p>
              <Typography component="h4" variant="h4">
                {intl.formatMessage(common.haeKJYtunnuksella)}
              </Typography>
              <div className="flex items-center">
                <FormControl>
                  <TextField
                    id="search-field"
                    label={intl.formatMessage(common.syotaYtunnus)}
                    InputProps={{
                      endAdornment: isLoading ? (
                        <CircularProgress style={{ height: "auto" }} />
                      ) : (
                        <IconButton
                          type="button"
                          aria-label={intl.formatMessage(
                            common.suoritaYtunnushaku
                          )}
                          onClick={searchByYtunnus}>
                          <SearchIcon />
                        </IconButton>
                      ),
                      inputRef: inputEl,
                      onKeyUp: e => {
                        // 13 = Enter
                        return e.keyCode === 13 ? searchByYtunnus() : null;
                      }
                    }}
                    variant="outlined"
                  />
                </FormControl>
                <StyledButton
                  onClick={() => {
                    setOrganisation(null);
                    setIsSearchFieldVisible(false);
                  }}
                  style={{ marginLeft: "1rem" }}>
                  {intl.formatMessage(common.suljeHaku)}
                </StyledButton>
              </div>
              {organisation && organisationStatus === "ok" ? (
                <div>
                  <p className="my-4 text-gray-500 text-xs">
                    {intl.formatMessage(common.haullaLoytyiKJ)}
                  </p>
                  <p className="mb-2">
                    <CheckIcon color="primary" />{" "}
                    {organisation.nimi.fi || organisation.nimi.sv}
                  </p>
                </div>
              ) : null}
              {organisationStatus === "notfound" ? (
                <div>
                  <p className="my-4 text-gray-500 text-xs">
                    {intl.formatMessage(common.KJHakuEpaonnistui)}
                  </p>
                  <p className="mb-2">
                    {intl.formatMessage(common.KJHakuEpaonnistuiLisainfo)}{" "}
                    <a
                      href={`mailto:${intl.formatMessage(
                        common.yhteisetpalvelutEmailAddress
                      )}`}>
                      {intl.formatMessage(common.yhteisetpalvelutEmailAddress)}
                    </a>
                  </p>
                </div>
              ) : null}
              {organisation && organisationStatus === "duplicate" ? (
                <div>
                  <p className="my-4 text-gray-500 text-xs">
                    {intl.formatMessage(common.haullaLoytyiKJ)}
                  </p>
                  <p className="mb-2 text-xl">
                    <StyledErrorIcon />{" "}
                    {organisation.nimi.fi || organisation.nimi.sv}
                  </p>
                  <p className="mb-2">
                    {intl.formatMessage(common.loytyyjoVoimassaOlevaLupa)}{" "}
                  </p>
                </div>
              ) : null}
              {isKJMissing && !organisation ? (
                <p className="mt-2">
                  <StyledErrorIcon />{" "}
                  {intl.formatMessage(common.oneKJMustBeSelected)}
                </p>
              ) : null}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p className="mb-6">
                {intl.formatMessage(common.luoUusiAsiaInstructions)}
              </p>
              <Autocomplete
                id="list-of-organisations"
                isMulti={false}
                name="koulutuksen-jarjestaja"
                options={sortBy(
                  prop("label"),
                  map(organisation => {
                    return organisation
                      ? {
                          label: resolveLocalizedOrganizationName(
                            organisation,
                            intl.locale
                          ),
                          value: organisation.ytunnus
                        }
                      : null;
                  }, organisations.data)
                ).filter(Boolean)}
                callback={(payload, values) => {
                  setSelectedKJ(values.value);
                }}
                title={""}
                value={[selectedKJ]}
              />
              <p className="my-4">
                {intl.formatMessage(common.luoUusiAsiaEsidialogiInfo2)}
              </p>
              <StyledButton
                onClick={() => {
                  setSelectedKJ(null);
                  setIsSearchFieldVisible(true);
                }}
                startIcon={<SearchIcon />}>
                {intl.formatMessage(common.haeKJYtunnuksella)}
              </StyledButton>
              {isKJMissing && !selectedKJ ? (
                <p className="mt-2">
                  <StyledErrorIcon />{" "}
                  {intl.formatMessage(common.oneKJMustBeSelected)}
                </p>
              ) : null}
            </React.Fragment>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button onClick={onClose} color="primary" variant="outlined">
              {intl.formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            className={selectedKJ || organisation ? "" : classes.fakeDisabled}
            onClick={() => {
              const kj =
                isSearchFieldVisible && organisation
                  ? { value: organisation.ytunnus }
                  : selectedKJ;
              if (
                isSearchFieldVisible &&
                organisation &&
                organisationStatus !== "duplicate"
              ) {
                return onSelect(kj);
              } else if (kj) {
                return onSelect(kj);
              } else {
                setIsKJMissing(true);
              }
              return false;
            }}
            color="primary"
            variant="contained">
            {intl.formatMessage(common.accept)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  ) : null;
};

UusiAsiaEsidialog.propTypes = {
  // Boolean that tells if the dialog is open or closed.
  isVisible: PropTypes.bool,
  // Function that will be called when the dialog is going to be closed / hided.
  onClose: PropTypes.func.isRequired,
  // Function that will be called when user selects a koulutuksen järjestäjä
  onSelect: PropTypes.func.isRequired
};

export default UusiAsiaEsidialog;
