import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { FormHelperText } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns";
import fiLocale from "date-fns/locale/fi";
import svLocale from "date-fns/locale/sv";
import enLocale from "date-fns/locale/en-GB";
import format from "date-fns/format";
import { COLORS } from "../../../modules/styles";

const styles = createStyles(theme => ({
  root: {
    "& input:focus + fieldset": {
      borderColor: "green !important"
    },
    "& .Mui-disabled": {
      color: COLORS.OIVA_TEXT,
      marginTop: "0.6em",
      padding: 0
    },
    "& label.Mui-disabled": {
      transform: "translate(0, -0.8em) scale(0.75)"
    },
    "& input:disabled + fieldset": {
      borderColor: "transparent !important"
    },
    "& label": {
      color: COLORS.OIVA_TEXT + " !important"
    }
  },
  requiredVisited: {
    "& input + fieldset ": {
      borderColor: COLORS.OIVA_ORANGE,
      borderWidth: 2
    },
    "& input:focus + fieldset": {
      borderColor: "green !important"
    },
    "& label": {
      color: COLORS.OIVA_ORANGE_TEXT + " !important"
    }
  },
  dense: {
    marginTop: theme.spacing(2)
  }
}));

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, "d. MMMM", { locale: this.locale });
  }
}

const Datepicker = ({
  ariaLabel,
  classes,
  clearable,
  disableFuture,
  disablePast,
  error,
  forChangeObject,
  fullAnchor,
  fullWidth,
  invalidLabel,
  isDisabled,
  isHidden,
  isReadOnly,
  isRequired,
  label,
  locale,
  minDate,
  maxDate,
  messages,
  onChanges,
  placeholder,
  requiredMessage,
  showTodayButton,
  showValidationErrors,
  value,
  width
}) => {
  const [selectedDate, setSelectedDate] = useState(value);
  const [isVisited, setIsVisited] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const localeMap = {
    en: enLocale,
    fi: fiLocale,
    sv: svLocale
  };

  const handleDateChange = useCallback(
    date => {
      onChanges({ forChangeObject, fullAnchor }, { value: date });
      setSelectedDate(date);
    },
    [forChangeObject, fullAnchor, onChanges]
  );

  useEffect(() => {
    if(!selectedDate) {
      setSelectedDate("")
      onChanges({ forChangeObject, fullAnchor }, { value: "" });
    } else if (value !== selectedDate) {
      setSelectedDate(value);
    }
  }, [value, selectedDate]);

  return (
    <MuiPickersUtilsProvider utils={LocalizedUtils} locale={localeMap[locale]}>
      <div
        className="flex-col"
        style={!width && fullWidth ? { display: "flex" } : {}}>
        {/* https://material-ui-pickers.dev/api/DatePicker */}
        <DatePicker
          format="d.M.yyyy" // Always is Finnish format
          aria-label={ariaLabel}
          label={label}
          disabled={isDisabled || isReadOnly}
          placeholder={isDisabled || isReadOnly || label ? "" : placeholder}
          margin="dense"
          onChange={handleDateChange}
          error={error}
          invalidLabel={invalidLabel}
          required={isRequired}
          width={width}
          style={width ? { width } : {}}
          fullWidth={width ? false : fullWidth}
          InputProps={{
            className: classes.input
          }}
          value={selectedDate || null}
          inputVariant="outlined"
          showTodayButton={showTodayButton}
          okLabel={messages.ok}
          clearLabel={messages.clear}
          cancelLabel={messages.cancel}
          todayLabel={messages.today}
          clearable={clearable}
          maxDateMessage={messages.datemax}
          minDateMessage={messages.datemin}
          invalidDateMessage={messages.dateinvalid}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          disableFuture={disableFuture}
          className={`${isHidden ? "hidden" : ""} 
            ${
              (isVisited || showValidationErrors) &&
              isRequired &&
              !value &&
              !isFocused
                ? classes.requiredVisited
                : classes.root
            } 
        `}
          onBlurCapture={() =>
            !selectedDate ? setIsVisited(true) : setIsVisited(false)
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showValidationErrors && requiredMessage && (
          <FormHelperText
            id="component-message-text"
            style={{
              marginTop: "0.1em",
              paddingLeft: "1.2em",
              marginBottom: "0.5em",
              color: COLORS.OIVA_ORANGE_TEXT
            }}>
            {isVisited && !selectedDate && requiredMessage}
          </FormHelperText>
        )}
      </div>
    </MuiPickersUtilsProvider>
  );
};

Datepicker.defaultProps = {
  ariaLabel: "Datepicker",
  label: null,
  delay: 300,
  id: `datepicker-${Math.random()}`,
  isDisabled: false,
  isHidden: false,
  error: false,
  width: "",
  forChangeObject: {},
  fullWidth: true,
  clearable: true,
  showTodayButton: true,
  disablePast: false,
  disableFuture: false
};

Datepicker.propTypes = {
  ariaLabel: PropTypes.string,
  label: PropTypes.string,
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHidden: PropTypes.bool,
  /** Is called with the payload and the value. */
  onChanges: PropTypes.func,
  /** Custom object defined by user. */
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  width: PropTypes.string,
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  fullWidth: PropTypes.bool,
  value: PropTypes.any,
  clearable: PropTypes.bool,
  showTodayButton: PropTypes.bool,
  disablePast: PropTypes.bool,
  disableFuture: PropTypes.bool,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  locale: PropTypes.string,
  messages: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  isReadonly: PropTypes.bool,
  invalidLabel: PropTypes.string,
  requiredMessage: PropTypes.string,
  showValidationErrors: PropTypes.bool
};

export default withStyles(styles)(Datepicker);
