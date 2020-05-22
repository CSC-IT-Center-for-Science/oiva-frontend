import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import { tilinpaatostiedot } from "../../../../../../../services/lomakkeet/taloudelliset/rules";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";

const TaloudellisetTilinpaatostiedot = React.memo(
  ({
    changeObjects,
    isReadOnly,
    onChangesRemove,
    onChangesUpdate,
    sectionId
  }) => {
    const intl = useIntl();
    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    }

    return (
      <ExpandableRowRoot
        title={"Tilinpäätöstiedot"}
        anchor={sectionId}
        key={`taloudelliset-tilinpaatos`}
        categories={[]}
        changes={changeObjects}
        disableReverting={isReadOnly}
        hideAmountOfChanges={true}
        messages={changesMessages}
        showCategoryTitles={true}
        isExpanded={true}
        sectionId={sectionId}
        onChangesRemove={onChangesRemove}
        onUpdate={onChangesUpdate}>
        <Lomake
          action="tilinpaatostiedot"
          anchor={sectionId}
          changeObjects={changeObjects}
          isReadOnly={isReadOnly}
          onChangesUpdate={onChangesUpdate}
          path={["taloudelliset"]}
          rules={tilinpaatostiedot}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  }
);

TaloudellisetTilinpaatostiedot.defaultProps = {
  isReadOnly: false
};

TaloudellisetTilinpaatostiedot.propTypes = {
  changeObjects: PropTypes.array,
  isReadOnly: PropTypes.bool,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  sectionId: PropTypes.string
};
export default TaloudellisetTilinpaatostiedot;
