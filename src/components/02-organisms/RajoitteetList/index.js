import React from "react";
import PropTypes from "prop-types";
import { addIndex, isEmpty, mapObjIndexed, values } from "ramda";
import Lomake from "components/02-organisms/Lomake";
import SimpleButton from "components/00-atoms/SimpleButton";
import { Typography } from "@material-ui/core";
import { getRajoiteListamuodossa } from "utils/rajoitteetUtils";
import HtmlContent from "components/01-molecules/HtmlContent";

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
  if (isEmpty(rajoitteet)) {
    return <p>Ei rajoitteita.</p>;
  } else {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
        {values(
          mapObjIndexed((rajoite, rajoiteId) => {
            console.info(rajoite, rajoiteId);
            const rajoiteListamuodossa = getRajoiteListamuodossa(
              rajoiteId,
              rajoite.changeObjects,
              "list"
            );
            return (
              <div
                className="flex flex-col p-6 border border-gray-300"
                key={rajoiteId}
              >
                <Typography component="h3" variant="h3">
                  Rajoite {rajoiteId}
                </Typography>
                <div className="flex-1">
                  <HtmlContent content={rajoiteListamuodossa} />
                </div>
                <div className="flex justify-between pt-6">
                  <div className="mr-2">
                    <SimpleButton
                      text="Poista"
                      onClick={() => onRemoveRestriction(rajoiteId)}
                    />
                  </div>
                  <div className="ml-2">
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
  }
};

RajoitteetList.propTypes = {
  areTitlesVisible: PropTypes.bool,
  isBorderVisible: PropTypes.bool,
  onModifyRestriction: PropTypes.func,
  onRemoveRestriction: PropTypes.func,
  rajoitteet: PropTypes.object
};

export default RajoitteetList;
