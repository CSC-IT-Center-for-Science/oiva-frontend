import React from "react";
import PropTypes from "prop-types";
import { addIndex, filter, mapObjIndexed, path, values } from "ramda";
import { getAnchorPart } from "utils/common";
import Lomake from "components/02-organisms/Lomake";
import SimpleButton from "components/00-atoms/SimpleButton";
import { Typography } from "@material-ui/core";

const constants = {
  formLocation: ["esiJaPerusopetus", "rajoite"]
};

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
            <div className="p-6 border border-gray-300">
              <Typography component="h3" variant="h3">
                Rajoite {index + 1}
              </Typography>
              <Lomake
                anchor={"rajoitteet"}
                data={{
                  rajoiteId,
                  sectionId: "rajoitelomake"
                }}
                isInExpandableRow={false}
                isReadOnly={true}
                isSavingState={false}
                key={rajoiteId}
                path={constants.formLocation}
                showCategoryTitles={areTitlesVisible}
              ></Lomake>
              <div className="flex justify-between pt-6">
                <div>
                  <SimpleButton
                    text="poista"
                    onClick={() => onRemoveRestriction(rajoiteId)}
                  />
                </div>
                <div>
                  <SimpleButton
                    text="Muokkaa"
                    onClick={() => onModifyRestriction(rajoiteId)}
                  />
                </div>
              </div>
            </div>
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
