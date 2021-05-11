import React from "react";
import PropTypes from "prop-types";
import {
  addIndex,
  find,
  flatten,
  isEmpty,
  values,
  path,
  pathEq,
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
import { useChangeObjectsByAnchorWithoutUnderRemoval } from "../../../stores/muutokset";

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
  rajoitemaaraykset
}) => {
  const { formatMessage } = useIntl();
  const [rajoitepoistot] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "rajoitepoistot"
  });

  const rajoitemaarayksetListamuodossa = map(maarays => {
    const naytettavaArvo =
      /** Ulkomaan kuvaus haetaan eri tavalla kuin muiden kuntien */
      maarays.koodisto === "kunta" && maarays.koodiarvo === "200"
        ? "ulkomaa"
        : koodistoNaytettavaArvoMap(maarays.koodisto);

    return map(key => {
      /** Jos rajoitepoistoista löytyy rajoitteen id, ei näytetä sitä listalla */
      if (
        find(
          pathEq(
            ["properties", "rajoiteId"],
            path(["aliMaaraykset", key, "0", "meta", "rajoiteId"], maarays)
          ),
          rajoitepoistot
        )
      ) {
        return null;
      }

      const rajoiteListamuodossa = getRajoitteetFromMaarays(
        maarays.aliMaaraykset[key],
        locale,
        formatMessage(rajoitteetMessages.ajalla),
        naytettavaArvo ? naytettavaArvo : "nimi",
        true,
        maarays
      );

      /**  Poistetaan list-disc luokat ensimmäisestä ul ja li elementistä.
       *   Lomakkeen rajoitelaatikossa ei haluta bullettia ensimmäiselle riville **/
      return {
        isMaarays: true,
        rajoiteId: path(
          ["aliMaaraykset", key, "0", "meta", "rajoiteId"],
          maarays
        ),
        htmlContent: replace(
          '<ul class="list-disc"><li class="list-disc">',
          "<ul><li>",
          rajoiteListamuodossa
        )
      };
    }, Object.keys(maarays.aliMaaraykset)).filter(Boolean);
  }, rajoitemaaraykset || []).filter(Boolean);

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

  const rajoitemaarayksetAndCobjsListamuodossa = flatten([
    rajoitemaarayksetListamuodossa,
    rajoiteChangeObjsListamuodossa
  ]);

  if (isEmpty(rajoitemaarayksetAndCobjsListamuodossa)) {
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
                key={index}
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
                    onClick={() =>
                      onRemoveRestriction(rajoite.rajoiteId, rajoite.isMaarays)
                    }
                    icon={"Delete"}
                    iconStyles={{ fontSize: "24px" }}
                    iconContainerStyles={{ marginRight: "0.5rem" }}
                    variant={"text"}
                  />
                </div>
              </div>
            );
          }, rajoitemaarayksetAndCobjsListamuodossa)
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
