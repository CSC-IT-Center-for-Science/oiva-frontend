import React from "react";
import { addIndex, filter, mapObjIndexed, values } from "ramda";
import { getAnchorPart } from "utils/common";
import Rajoite from "../Rajoite";

const RajoitteetList = ({
  onModifyRestriction,
  onRemoveRestriction,
  rajoitteet
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
      {values(
        addIndex(mapObjIndexed)((rajoite, rajoiteId, ___, index) => {
          const rajoitus = rajoite.elements.asetukset[1];
          const rajoitusPropValue = [rajoitus.properties.value];
          const kriteerit = filter(asetus => {
            const anchorPart = getAnchorPart(asetus.anchor, 3);
            return (
              !isNaN(parseInt(anchorPart, 10)) &&
              getAnchorPart(asetus.anchor, 4) === "kohde"
            );
          }, rajoite.elements.asetukset);

          return (
            <Rajoite
              id={rajoiteId}
              index={index}
              key={rajoiteId}
              kriteerit={kriteerit}
              onModifyRestriction={onModifyRestriction}
              onRemoveRestriction={onRemoveRestriction}
              rajoite={rajoite}
              rajoitusPropValue={rajoitusPropValue}
            />
          );
        }, rajoitteet)
      )}
    </div>
  );
};

export default RajoitteetList;
