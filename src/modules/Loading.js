import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useIntl } from "react-intl";
import common from "../i18n/definitions/common";
import PropTypes from "prop-types";
import * as R from "ramda";
import Typography from "@material-ui/core/Typography";

const Loading = ({ notReadyList = [], percentage, text }) => {
  const intl = useIntl();
  const loadingtext = text || intl.formatMessage(common.loading);

  return (
    <div className="flex items-center justify-center mx-auto py-24">
      <span className="relative mr-6">
        {!R.isNil(percentage) && (
          <span className="absolute mt-6 ml-6">{Math.round(percentage)}%</span>
        )}
        <CircularProgress size={80} value={percentage} />
      </span>
      <Typography component="h3" variant="h3" className="ml-4">
        {loadingtext}...
      </Typography>
      <ul className="ml-10">
        {R.addIndex(R.map)((item, i) => {
          return <li key={`${item}-${i}`}>{item}</li>;
        }, notReadyList)}
      </ul>
    </div>
  );
};

Loading.propTypes = {
  notReadyList: PropTypes.array,
  percentage: PropTypes.number,
  text: PropTypes.string
};

export default Loading;
