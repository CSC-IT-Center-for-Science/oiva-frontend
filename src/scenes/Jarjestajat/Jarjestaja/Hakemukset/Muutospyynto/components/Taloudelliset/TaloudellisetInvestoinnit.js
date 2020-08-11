import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";

const TaloudellisetInvestoinnit = React.memo(
  ({
    changeObjects,
    isReadOnly,
    onChangesRemove,
    onChangesUpdate
  }) => {
    const intl = useIntl();
    const sectionId = "taloudelliset_investoinnit";
    const changesMessages = {
      undo: intl.formatMessage(common.undo),
      changesTest: intl.formatMessage(common.changesText)
    }

    return (
      <ExpandableRowRoot
        title={"Investoinnit"}
        anchor={"taloudelliset_investoinnit"}
        key={`taloudelliset-investoinnit`}
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
          action="investoinnit"
          anchor={sectionId}
          changeObjects={changeObjects}
          isReadOnly={isReadOnly}
          onChangesUpdate={onChangesUpdate}
          path={["taloudelliset"]}
          showCategoryTitles={true}></Lomake>
      </ExpandableRowRoot>
    );
  }
);

TaloudellisetInvestoinnit.propTypes = {
  changeObjects: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangeUpdate: PropTypes.func,
  isReadOnly: PropTypes.bool
};

export default TaloudellisetInvestoinnit;
