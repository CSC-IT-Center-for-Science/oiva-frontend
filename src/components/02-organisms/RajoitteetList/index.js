import React from "react";
import PropTypes from "prop-types";
import { addIndex, isEmpty, mapObjIndexed, values } from "ramda";
import SimpleButton from "components/00-atoms/SimpleButton";
import { Typography } from "@material-ui/core";
import { getRajoiteListamuodossa } from "utils/rajoitteetUtils";
import HtmlContent from "components/01-molecules/HtmlContent";
import { useIntl } from "react-intl";
import rajoitteetMessages from "i18n/definitions/rajoitteet";

const RajoitteetList = ({ locale, onRemoveRestriction, rajoitteet }) => {
  const { formatMessage } = useIntl();
  if (isEmpty(rajoitteet)) {
    return (
      <p className="mt-6">{formatMessage(rajoitteetMessages.eiRajoitteita)} </p>
    );
  } else {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
        {values(
          addIndex(mapObjIndexed)((rajoite, rajoiteId, __, index) => {
            const rajoiteListamuodossa = getRajoiteListamuodossa(
              rajoite.changeObjects,
              locale,
              rajoiteId,
              "list"
            );
            return (
              <div
                className="flex flex-col p-6 border border-gray-300"
                key={rajoiteId}
              >
                <Typography component="h3" variant="h3">
                  Rajoite {index + 1}
                </Typography>
                <div className="flex-1">
                  <HtmlContent content={rajoiteListamuodossa} />
                </div>
                <div className="flex pt-6">
                  <SimpleButton
                    buttonStyles={{
                      justifyContent: "start",
                      padding: 0
                    }}
                    text={formatMessage(rajoitteetMessages.poistaRajoite)}
                    onClick={() => onRemoveRestriction(rajoiteId)}
                    icon={"Delete"}
                    iconStyles={{ fontSize: "24px" }}
                    iconContainerStyles={{ marginRight: "0.5rem" }}
                    variant={"text"}
                  />
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
  onModifyRestriction: PropTypes.func,
  onRemoveRestriction: PropTypes.func,
  rajoitteet: PropTypes.object
};

export default RajoitteetList;
