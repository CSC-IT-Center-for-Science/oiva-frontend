import React from "react";
import PropTypes from "prop-types";
import {
  addIndex,
  flatten,
  isEmpty,
  values,
  path,
  split,
  last,
  replace
} from "ramda";
import SimpleButton from "components/00-atoms/SimpleButton";
import { Typography } from "@material-ui/core";
import {
  getRajoiteListamuodossa,
  getRajoitteetFromMaarays
} from "utils/rajoitteetUtils";
import HtmlContent from "components/01-molecules/HtmlContent";
import { useIntl } from "react-intl";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { map } from "ramda";
import { getAnchorPart } from "../../../utils/common";

const koodistoNaytettavaArvoMap = koodisto => {
  switch (koodisto) {
    case "poerityinenkoulutustehtava":
    case "pomuutkoulutuksenjarjestamiseenliittyvatehdot":
    case "lukiomuutkoulutuksenjarjestamiseenliittyvatehdot":
    case "lukioerityinenkoulutustehtavauusi":
      return "kuvaus";
    case "kujalisamaareet":
      return "tyyppi";
    default:
      return "nimi";
  }
};

const RajoitteetList = ({
  locale,
  onRemoveRestriction,
  rajoitteet,
  rajoiteMaaraykset = []
}) => {
  const { formatMessage } = useIntl();

  const rajoiteMaarayksetListamuodossa = map(rajoiteMaarays => {
    const naytettavaArvo = koodistoNaytettavaArvoMap(rajoiteMaarays.koodisto);

    const rajoiteListamuodossa = getRajoitteetFromMaarays(
      rajoiteMaarays.aliMaaraykset,
      locale,
      formatMessage(rajoitteetMessages.ajalla),
      naytettavaArvo ? naytettavaArvo : "nimi",
      true,
      rajoiteMaarays
    );

    /**  Poistetaan list-disc luokat ensimmäisestä ul ja li elementistä.
     *   Lomakkeen rajoitelaatikossa ei haluta bullettia ensimmäiselle riville **/
    return {
      rajoiteId: rajoiteMaarays.uuid,
      htmlContent: replace(
        '<ul class="list-disc"><li class="list-disc">',
        "<ul><li>",
        rajoiteListamuodossa
      )
    };
  }, rajoiteMaaraykset);

  const rajoiteChangeObjsListamuodossa = map(rajoite => {
    const rajoiteId = last(
      split(
        "_",
        getAnchorPart(path(["changeObjects", "0", "anchor"], rajoite), 0)
      )
    );
    return {
      rajoiteId: rajoiteId,
      htmlContent: getRajoiteListamuodossa(
        rajoite.changeObjects,
        locale,
        rajoiteId,
        "list",
        rajoitteet
      )
    };
  }, values(rajoitteet));

  const rajoiteMaarayksetAndCobjsListamuodossa = flatten([
    rajoiteMaarayksetListamuodossa,
    rajoiteChangeObjsListamuodossa
  ]);

  if (isEmpty(rajoiteMaarayksetAndCobjsListamuodossa)) {
    return (
      <p className="mt-6">{formatMessage(rajoitteetMessages.eiRajoitteita)} </p>
    );
  } else {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
        {values(
          addIndex(map)((rajoite, index) => {
            return (
              <div
                className="flex flex-col p-6 border border-gray-300"
                key={rajoite.rajoiteId}
              >
                <Typography component="h3" variant="h3">
                  Rajoite {index + 1}
                </Typography>
                <div className="flex-1">
                  <HtmlContent content={rajoite.htmlContent} />
                </div>
                <div className="flex pt-6">
                  <SimpleButton
                    buttonStyles={{
                      justifyContent: "start",
                      padding: 0
                    }}
                    text={formatMessage(rajoitteetMessages.poistaRajoite)}
                    onClick={() => onRemoveRestriction(rajoite.rajoiteId)}
                    icon={"Delete"}
                    iconStyles={{ fontSize: "24px" }}
                    iconContainerStyles={{ marginRight: "0.5rem" }}
                    variant={"text"}
                  />
                </div>
              </div>
            );
          }, rajoiteMaarayksetAndCobjsListamuodossa)
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
