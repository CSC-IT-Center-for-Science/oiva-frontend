import React from "react";
import PropTypes from "prop-types";
import {
  addIndex,
  isEmpty,
  values,
  concat,
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

  const rajoiteMaarayksetAndCobjs = concat(
    rajoiteMaaraykset || [],
    rajoitteet ? values(rajoitteet) : []
  );

  if (isEmpty(rajoiteMaarayksetAndCobjs)) {
    return (
      <p className="mt-6">{formatMessage(rajoitteetMessages.eiRajoitteita)} </p>
    );
  } else {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-6">
        {values(
          addIndex(map)((rajoite, index) => {
            const isChangeObj = !!rajoite.changeObjects;
            const rajoiteId = isChangeObj
              ? last(
                  split(
                    "_",
                    getAnchorPart(
                      path(["changeObjects", "0", "anchor"], rajoite),
                      0
                    )
                  )
                )
              : rajoite.uuid;

            const naytettavaArvo = !isChangeObj
              ? koodistoNaytettavaArvoMap(rajoite.koodisto)
              : null;
            console.log(rajoite.koodisto);

            let rajoiteListamuodossa = isChangeObj
              ? getRajoiteListamuodossa(
                  rajoite.changeObjects,
                  locale,
                  rajoiteId,
                  "list"
                )
              : getRajoitteetFromMaarays(
                  rajoite.aliMaaraykset,
                  locale,
                  formatMessage(rajoitteetMessages.ajalla),
                  naytettavaArvo ? naytettavaArvo : "nimi",
                  true,
                  rajoite
                );
            if (!isChangeObj) {
              /**  Poistetaan list-disc luokat ensimmäisestä ul ja li elementistä jos kyseessä määräys.
               *   Lomakkeen rajoitelaatikossa ei haluta bullettia ensimmäiselle riville **/
              rajoiteListamuodossa = replace(
                '<ul class="list-disc"><li class="list-disc">',
                "<ul><li>",
                rajoiteListamuodossa
              );
            }
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
          }, rajoiteMaarayksetAndCobjs)
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
