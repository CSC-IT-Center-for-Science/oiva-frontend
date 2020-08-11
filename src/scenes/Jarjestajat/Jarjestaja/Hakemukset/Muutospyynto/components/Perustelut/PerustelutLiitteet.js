import React from "react";
import PropTypes from "prop-types";
import ExpandableRowRoot from "okm-frontend-components/dist/components/02-organisms/ExpandableRowRoot";
import Lomake from "../../../../../../../components/02-organisms/Lomake";

const PerustelutLiitteet = React.memo(props => {
  const sectionId = 'perustelut_liitteet';
  return (
    <React.Fragment>
      <div className="mt-4">
        <ExpandableRowRoot
          title={"Liitteet"}
          anchor={props.sectionId}
          key={`perustelut-liitteet`}
          changes={props.changeObjects.perustelut}
          disableReverting={true}
          showCategoryTitles={true}
          isExpanded={true}
          sectionId={props.sectionId}
          onUpdate={props.onChangesUpdate}
          hideAmountOfChanges={true}
          isReadOnly={props.isReadOnly}
          {...props}>
          <Lomake
            action="reasoning"
            anchor={sectionId}
            changeObjects={props.changeObjects.perustelut}
            onChangesUpdate={props.onChangesUpdate}
            path={["perustelut", "liitteet"]}
            showCategoryTitles={true}></Lomake>
        </ExpandableRowRoot>
      </div>
    </React.Fragment>
  );
});

PerustelutLiitteet.propTypes = {
  changeObjects: PropTypes.object,
  handleChanges: PropTypes.func,
  headingNumber: PropTypes.number,
  kohde: PropTypes.object,
  lupa: PropTypes.object,
  isReadOnly: PropTypes.bool
};
export default PerustelutLiitteet;
