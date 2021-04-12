import React, { useCallback, useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "components/02-organisms/DialogTitle";
import Autocomplete from "components/02-organisms/Autocomplete/index";
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
import { sortBy, prop, map, trim } from "ramda";
import { resolveLocalizedOrganizationName } from "modules/helpers";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles, makeStyles } from "@material-ui/styles";
import { fetchJSON } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
import languages from "i18n/definitions/languages";
import Select from "react-select";
import informUser from "i18n/definitions/informUser";
import { getRaw } from "basedata";

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

const defaultProps = {
  organisations: []
};

const UusiAsiaEsidialog = ({
  isVisible,
  koulutustyyppi,
  onClose,
  onSelect,
  organisations = defaultProps.organisations
}) => {
  const intl = useIntl();
  const [viimeisinLupa, setViimeisinLupa] = useState();
  const [selectedKJ, setSelectedKJ] = useState();
  const [isSearchFieldVisible, setIsSearchFieldVisible] = useState(false);
  const [organisation, setOrganisation] = useState(null);
  const [organisationStatus, setOrganisationStatus] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState();
  const inputEl = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKJMissing, setIsKJMissing] = useState(false);
  const classes = useStyles();

  const Kielivalikko = (
    <Select
      id="luvan-kielivalinta"
      name="luvan-kieli"
      options={[
        {
          label: intl.formatMessage(languages.finnish),
          value: "fi"
        },
        {
          label: intl.formatMessage(languages.swedish),
          value: "sv"
        }
      ]}
      onChange={value => {
        setSelectedLanguage(value);
      }}
      placeholder={intl.formatMessage(common.valitseLuvanKieli)}
      value={selectedLanguage}
    />
  );

  // Käyttäjän tehdessä organisaatiohaun tai vaihtaessa luvan kieltä
  // tarkistetaan onko KJ:llä jo kyseisellä kielellä lupaa.
  useEffect(() => {
    const oid = prop("value", selectedKJ) || prop("oid", organisation);
    if (koulutustyyppi && oid && selectedLanguage) {
      getRaw(
        "viimeisinLupa",
        `${backendRoutes.viimeisinLupa.path}${oid}/viimeisin?koulutustyyppi=${koulutustyyppi}&kieli=${selectedLanguage.value}`,
        []
      ).then(viimeisinLupa => {
        // Asetetaan vielä muistiin tieto siitä, löytyikö lupaa.
        setViimeisinLupa(viimeisinLupa);
      });
    }
  }, [koulutustyyppi, organisation, selectedKJ, selectedLanguage]);

  const searchById = useCallback(async () => {
    const { value: id } = inputEl.current;
    setIsLoading(true);
    const result = await fetchJSON(
      `${backendRoutes.organisaatio.path}/${trim(id)}`
    );
    setIsLoading(false);
    setOrganisation(result);
    setIsKJMissing(false);
    if (result) {
      if (result.status === "PASSIIVINEN") {
        setOrganisationStatus("passive");
      } else {
        setOrganisationStatus("ok");
      }
    } else {
      setOrganisationStatus("notfound");
    }
  }, []);

  return organisations ? (
    <Dialog open={isVisible} PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle onClose={onClose}>
        {intl.formatMessage(common.luoUusiAsia)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <div className="px-8 py-4 relative">
          {isSearchFieldVisible ? (
            // HAKUNÄKYMÄ
            <React.Fragment>
              <p className="mb-6">
                {intl.formatMessage(common.luoUusiAsiaEsidialogiInfo3)}
              </p>
              <Typography component="h4" variant="h4">
                {intl.formatMessage(common.haeKJ)}
              </Typography>
              <div className="flex items-center">
                <FormControl style={{ flexGrow: "1" }}>
                  <TextField
                    id="search-field"
                    label={intl.formatMessage(common.syotaHaettavaTunniste)}
                    InputProps={{
                      endAdornment: isLoading ? (
                        <CircularProgress style={{ height: "auto" }} />
                      ) : (
                        <IconButton
                          type="button"
                          aria-label={intl.formatMessage(
                            common.suoritaYtunnushaku
                          )}
                          onClick={searchById}
                        >
                          <SearchIcon />
                        </IconButton>
                      ),
                      inputRef: inputEl,
                      onKeyUp: e => {
                        return e.key === "Enter" ? searchById() : null;
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
                  style={{ marginLeft: "auto" }}
                >
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
                  {/* Jos KJ:lla on voimassa oleva järjestämislupa valitulla kielellä, näytetään aihetta koskeva ohjeteksti.  */}
                  {selectedLanguage && viimeisinLupa ? (
                    <p className="mt-4 mb-12">
                      <StyledErrorIcon />{" "}
                      {intl.formatMessage(
                        informUser.voimassaOlevaJarjestamislupa,
                        {
                          xKielinen:
                            prop("value", selectedLanguage) === "fi"
                              ? intl.formatMessage(languages.suomenkielinen)
                              : intl.formatMessage(languages.ruotsinkielinen)
                        }
                      )}{" "}
                      {intl.formatMessage(
                        informUser.hyvaksymallaSiirrytaanLuvanMuokkaamiseen
                      )}
                    </p>
                  ) : null}
                  <div className="my-4 w-4/5 pr-5">{Kielivalikko}</div>
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
                      )}`}
                    >
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
              {organisation && organisationStatus === "passive" ? (
                <div>
                  <p className="my-4 text-gray-500 text-xs">
                    {intl.formatMessage(common.haullaLoytyiKJ)}
                  </p>
                  <p className="mb-2 text-xl">
                    <StyledErrorIcon />{" "}
                    {organisation.nimi.fi || organisation.nimi.sv}
                  </p>
                  <p className="mb-2">
                    {intl.formatMessage(common.KJPassiivinen)}{" "}
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
            // PUDOTUSVALIKKONÄKYMÄ
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
                          value: organisation.oid
                        }
                      : null;
                  }, organisations)
                ).filter(Boolean)}
                callback={(payload, values) => {
                  setSelectedKJ(values.value);
                }}
                title={""}
                value={[selectedKJ]}
              />

              {/* Jos KJ on valittuna, näytetään valikko, josta käyttäjän tulee valita kieli luvalle, jonka hän on aikeissa luoda. */}
              {selectedKJ && <div className="mt-4">{Kielivalikko}</div>}

              {/* Jos KJ:lla ei ole voimassa olevaa järjestämislupaa valitulla kielellä, näytetään aihetta koskeva ohjeteksti.  */}
              {selectedKJ && selectedLanguage && !viimeisinLupa ? (
                <p className="mt-4 mb-12">
                  <StyledErrorIcon />{" "}
                  {intl.formatMessage(
                    informUser.eiVoimassaOlevaaJarjestamislupaa,
                    {
                      xKielista:
                        prop("value", selectedLanguage) === "fi"
                          ? intl.formatMessage(languages.suomenkielista)
                          : intl.formatMessage(languages.ruotsinkielista)
                    }
                  )}{" "}
                  {intl.formatMessage(
                    informUser.hyvaksymallaSiirrytaanLupalomakkeelle
                  )}
                </p>
              ) : null}

              <p className="my-4">
                {intl.formatMessage(common.luoUusiAsiaEsidialogiInfo3)}
              </p>

              <StyledButton
                onClick={() => {
                  setSelectedKJ(null);
                  setIsSearchFieldVisible(true);
                }}
                startIcon={<SearchIcon />}
              >
                {intl.formatMessage(common.haeKJ)}
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
            className={
              (selectedKJ || organisation) && selectedLanguage
                ? ""
                : classes.fakeDisabled
            }
            onClick={() => {
              const kj =
                isSearchFieldVisible && organisation
                  ? { value: organisation.oid }
                  : selectedKJ;
              if (
                isSearchFieldVisible &&
                organisation &&
                organisationStatus !== "duplicate"
              ) {
                return selectedLanguage
                  ? onSelect(kj, selectedLanguage)
                  : false;
              } else if (kj) {
                return selectedLanguage
                  ? onSelect(kj, selectedLanguage)
                  : false;
              } else {
                setIsKJMissing(true);
              }
              return false;
            }}
            color="primary"
            variant="contained"
          >
            {intl.formatMessage(common.accept)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  ) : null;
};

UusiAsiaEsidialog.propTypes = {
  // Enum value that defines the type of education
  koulutustyyppi: PropTypes.string,
  // Boolean that tells if the dialog is open or closed.
  isVisible: PropTypes.bool,
  // Function that will be called when the dialog is going to be closed / hided.
  onClose: PropTypes.func.isRequired,
  // Function that will be called when user selects a koulutuksen järjestäjä
  onSelect: PropTypes.func.isRequired
};

export default UusiAsiaEsidialog;
