import React from "react";
import PropTypes from "prop-types"
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import Lomake from "../../../../../../../components/02-organisms/Lomake";
import { useChangeObjects } from "../../../../../../../stores/changeObjects";

const TaloudellisetLiitteet = React.memo(props => {
  const [changeObjects] = useChangeObjects();

  return (
    <ExpandableRowRoot
      title={"Liitteet"}
      anchor={props.sectionId}
      key={`taloudelliset-liitteet`}
      changes={changeObjects.taloudelliset.liitteet}
      disableReverting={props.isReadOnly}
      hideAmountOfChanges={true}
      showCategoryTitles={true}
      isExpanded={true}
      sectionId={props.sectionId}
      onUpdate={props.onChangesUpdate}>
      <Lomake
        action="liitteet"
        anchor={props.sectionId}
        changeObjects={changeObjects.taloudelliset.liitteet}
        isReadOnly={props.isReadOnly}
        onChangesUpdate={props.onChangesUpdate}
        path={["taloudelliset"]}
        rules={[]}
        showCategoryTitles={true}></Lomake>
    </ExpandableRowRoot>
  );
});

TaloudellisetLiitteet.propTypes = {
  isReadOnly: PropTypes.bool
};
export default TaloudellisetLiitteet;
