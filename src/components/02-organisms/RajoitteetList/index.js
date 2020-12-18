import React from "react";
import PropTypes from "prop-types";
import { addIndex, filter, mapObjIndexed, path, values } from "ramda";
import { getAnchorPart } from "utils/common";
import Rajoite from "../Rajoite";

const defaultProps = {
  areTitlesVisible: true,
  isBorderVisible: true
};

const RajoitteetList = ({
  areTitlesVisible = defaultProps.areTitlesVisible,
  isBorderVisible = defaultProps.isBorderVisible,
  onModifyRestriction,
  onRemoveRestriction,
  rajoitteet
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
      {values(
        addIndex(mapObjIndexed)((rajoite, rajoiteId, ___, index) => {
          return (
            <Rajoite
              areTitlesVisible={areTitlesVisible}
              isBorderVisible={isBorderVisible}
              id={rajoiteId}
              index={index}
              key={rajoiteId}
              onModifyRestriction={onModifyRestriction}
              onRemoveRestriction={onRemoveRestriction}
              rajoite={rajoite}
            />
          );
        }, rajoitteet)
      )}
    </div>
  );
};

RajoitteetList.propTypes = {
  areTitlesVisible: PropTypes.bool,
  isBorderVisible: PropTypes.bool,
  onModifyRestriction: PropTypes.func,
  onRemoveRestriction: PropTypes.func
};

export default RajoitteetList;
