import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getAdditionFormStructure } from "../../../../services/lomakkeet/perustelut/tutkinnot";
import CategorizedListRoot from "../../../02-organisms/CategorizedListRoot";
import { injectIntl } from "react-intl";
import * as R from "ramda";

const defaultProps = {
  changes: [],
  checkboxItems: [],
  isReadOnly: false
};

const TutkinnonLisayksenPerustelulomake = ({
  changes = defaultProps.changes,
  checkboxItems = defaultProps.checkboxItems,
  intl,
  isReadOnly = defaultProps.checkboxItems
}) => {
  const [lomake, setLomake] = useState();

  useEffect(() => {
    setLomake(
      getAdditionFormStructure(
        checkboxItems,
        R.toUpper(intl.locale),
        isReadOnly
      )
    );
  }, [checkboxItems, intl.locale]);

  return (
    <React.Fragment>
      {lomake ? (
        <CategorizedListRoot
          anchor="lomake"
          categories={lomake}
          changes={changes}
          onUpdate={() => {}}
          showCategoryTitles={true}
        />
      ) : null}
    </React.Fragment>
  );
};

TutkinnonLisayksenPerustelulomake.propTypes = {
  changes: PropTypes.array,
  checkboxItems: PropTypes.array,
  isReadOnly: PropTypes.bool
};

export default injectIntl(TutkinnonLisayksenPerustelulomake);
