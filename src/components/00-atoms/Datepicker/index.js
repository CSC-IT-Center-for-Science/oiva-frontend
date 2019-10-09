import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import { createStyles } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import DateFnsUtils from "@date-io/date-fns";
import { injectIntl } from "react-intl";
import fiLocale from "date-fns/locale/fi";
import svLocale from "date-fns/locale/sv";
import enLocale from "date-fns/locale/en-GB";
import format from "date-fns/format";
import common from "../../../i18n/definitions/common";

const styles = createStyles(theme => ({
  dense: {
    marginTop: theme.spacing(2)
  }
}));

const materialTheme = createMuiTheme({
  palette: {
    primary: green
  }
});

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d. MMMM", { locale: this.locale });
  }
}

const Datepicker = props => {
  const { classes } = props;
  const [selectedDate, setSelectedDate] = useState(props.value);
  const localeMap = {
    en: enLocale,
    fi: fiLocale,
    sv: svLocale
  };
  const {
    intl: { formatMessage }
  } = props;
  const locale = props.intl.locale;

  const handleDateChange = date => {
    props.onChanges(props.payload, { value: date });
    setSelectedDate(date);
  };

  useEffect(() => {
    if (props.value !== selectedDate || !selectedDate) {
      setSelectedDate(props.value);
    }
  }, [props.value]);

  return (
    <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider
        utils={LocalizedUtils}
        locale={localeMap[locale]}
        theme={materialTheme}
      >
        <KeyboardDatePicker
          format="d.M.yyyy" // Always is Finnish format
          aria-label={props.ariaLabel}
          label={props.label}
          disabled={props.isDisabled}
          placeholder={props.placeholder}
          margin="dense"
          className={`${props.isHidden ? "hidden" : ""} p-2`}
          onChange={handleDateChange}
          error={props.error}
          style={props.fullWidth ? {} : { width: props.width }}
          fullWidth={props.fullWidth}
          InputProps={{
            className: classes.input
          }}
          value={selectedDate}
          inputVariant="outlined"
          showTodayButton={props.showTodayButton}
          okLabel={formatMessage(common.ok)}
          clearLabel={formatMessage(common.clear)}
          cancelLabel={formatMessage(common.cancel)}
          todayLabel={formatMessage(common.today)}
          clearable={props.clearable}
          maxDateMessage={formatMessage(common.datemax)}
          minDateMessage={formatMessage(common.datemin)}
          invalidDateMessage={formatMessage(common.dateinvalid)}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

Datepicker.defaultProps = {
  ariaLabel: "Datepicker",
  label: "",
  delay: 300,
  id: `datepicker-${Math.random()}`,
  isDisabled: false,
  isHidden: false,
  payload: {},
  error: false,
  width: "12em",
  fullWidth: false,
  clearable: false,
  showTodayButton: true
};

Datepicker.propTypes = {
  ariaLabel: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func.isRequired,
  /** Custom object defined by user. */
  payload: PropTypes.object,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  width: PropTypes.string,
  fullWidth: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  clearable: PropTypes.bool,
  showTodayButton: PropTypes.bool
};

export default withStyles(styles)(injectIntl(Datepicker));
