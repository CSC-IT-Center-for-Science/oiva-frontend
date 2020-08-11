import React from "react";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import PropTypes from "prop-types";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import common from "../../../../../../../i18n/definitions/common";
import { useIntl } from "react-intl";

const YhteenvetoYleisettiedot = React.memo(props => {
  const intl = useIntl();
  const sectionId = "yhteenveto_yleisettiedot";
  const changesMessages = {
    undo: intl.formatMessage(common.undo),
    changesTest: intl.formatMessage(common.changesText)
  }

  return (
    <ExpandableRowRoot
      title={"Hakemuksen yleiset tiedot"}
      anchor={sectionId}
      changes={props.changeObjects.yhteenveto}
      disableReverting={false}
      hideAmountOfChanges={true}
      messages={changesMessages}
      showCategoryTitles={true}
      isExpanded={true}
      sectionId={sectionId}
      onChangesRemove={props.onChangesRemove}
      onUpdate={props.onChangesUpdate}>
      <Lomake
        action="modification"
        anchor={sectionId}
        changeObjects={props.changeObjects.yhteenveto}
        onChangesUpdate={props.onChangesUpdate}
        path={["yhteenveto", "yleisetTiedot"]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
});

YhteenvetoYleisettiedot.propTypes = {
  changeObjects: PropTypes.object
};

export default YhteenvetoYleisettiedot;
