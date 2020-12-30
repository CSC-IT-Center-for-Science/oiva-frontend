import React, { useCallback } from "react";
import PropTypes from "prop-types";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { Typography } from "@material-ui/core";
import SimpleButton from "components/00-atoms/SimpleButton";
import { __ as translate } from "i18n-for-browser";
import { getAnchorPart, isDate } from "utils/common";
import { useIntl } from "react-intl";
import { useAllSections, useLomakedata } from "stores/lomakedata";
import { moment } from "moment";
import Lomake from "components/02-organisms/Lomake";
import {
  addIndex,
  compose,
  filter,
  find,
  includes,
  map,
  nth,
  path,
  pathEq,
  prop,
  reject,
  __
} from "ramda";

const isEven = n => !(n % 2);

const indexEven = (__, idx) => isEven(idx);

const defaultProps = {
  areTitlesVisible: true,
  canHaveAlirajoite: false,
  isBorderVisible: true,
  isReadOnly: false
};

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"]
};

const Rajoite = ({
  areTitlesVisible = defaultProps.areTitlesVisible,
  canHaveAlirajoite = defaultProps.canHaveAlirajoite,
  id,
  index,
  isBorderVisible = defaultProps.isBorderVisible,
  isReadOnly = defaultProps.isReadOnly,
  onModifyRestriction,
  onRemoveRestriction,
  rajoiteId
}) => {
  return (
    <Lomake
      anchor={"rajoitteet"}
      data={{
        rajoiteId,
        sectionId: "rajoitelomake"
      }}
      isInExpandableRow={false}
      isReadOnly={true}
      isSavingState={false}
      path={constants.formLocation}
      showCategoryTitles={areTitlesVisible}
    ></Lomake>
  );
};

Rajoite.propTypes = {
  canHaveAlirajoite: PropTypes.bool,
  id: PropTypes.string,
  index: PropTypes.number,
  isReadOnly: PropTypes.bool,
  areTitlesVisible: PropTypes.bool,
  onModifyRestriction: PropTypes.func,
  onRemoveRestriction: PropTypes.func,
  rajoiteId: PropTypes.string.isRequired
};

export default Rajoite;
