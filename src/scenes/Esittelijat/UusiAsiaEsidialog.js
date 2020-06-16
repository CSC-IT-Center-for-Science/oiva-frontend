import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "okm-frontend-components/dist/components/02-organisms/DialogTitle";
import Autocomplete from "okm-frontend-components/dist/components/02-organisms/Autocomplete";
import common from "../../i18n/definitions/common";
import {
  DialogContent,
  Dialog,
  DialogActions,
  Button
} from "@material-ui/core";
import { useOrganisations } from "../../stores/organisations";
import { sortBy, prop, map } from "ramda";
import { resolveLocalizedOrganizationName } from "../../modules/helpers";

const UusiAsiaEsidialog = ({ isVisible, onClose, onSelect }) => {
  const intl = useIntl();
  const [selectedKJ, setSelectedKJ] = useState();
  const [organisations, organisationsActions] = useOrganisations({});

  useEffect(() => {
    const abortController = organisationsActions.load();
    return function cancel() {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [organisationsActions]);

  return organisations.data &&
    organisations.fetchedAt &&
    !organisations.isErroneous ? (
    <Dialog
      open={isVisible}
      aria-labelledby="simple-dialog-title"
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {intl.formatMessage(common.luoUusiAsia)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <div className="py-4 relative">
          <Autocomplete
            isMulti={false}
            name="koulutuksen-jarjestaja"
            options={sortBy(
              prop("label"),
              map(organisation => {
                return organisation
                  ? {
                      label: resolveLocalizedOrganizationName(organisation, intl.locale),
                      value: organisation.ytunnus
                    }
                  : null;
              }, organisations.data)
            ).filter(Boolean)}
            callback={(payload, values) => {
              setSelectedKJ(values.value);
            }}
            title={intl.formatMessage(common.luoUusiAsiaInstructions)}
            value={selectedKJ}
          />
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
            onClick={() => {
              return onSelect(selectedKJ);
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
