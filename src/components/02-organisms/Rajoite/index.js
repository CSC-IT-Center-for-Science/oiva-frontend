import React from "react";
import PropTypes from "prop-types";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { Typography } from "@material-ui/core";
import SimpleButton from "components/00-atoms/SimpleButton";
import { __ as translate } from "i18n-for-browser";
import { getAnchorPart, isDate } from "utils/common";
import { useIntl } from "react-intl";
import { useLomakedata } from "stores/lomakedata";
import { moment } from "moment";
import {
  addIndex,
  compose,
  filter,
  find,
  includes,
  map,
  nth,
  path,
  pathEq,
  prop,
  reject,
  __
} from "ramda";

const isEven = n => !(n % 2);

const indexEven = (__, idx) => isEven(idx);

const defaultProps = {
  areTitlesVisible: true,
  isBorderVisible: true,
  isReadOnly: false
};

const Rajoite = ({
  areTitlesVisible = defaultProps.areTitlesVisible,
  id,
  index,
  isBorderVisible = defaultProps.isBorderVisible,
  isReadOnly = defaultProps.isReadOnly,
  onModifyRestriction,
  onRemoveRestriction,
  rajoite
}) => {
  const { formatMessage } = useIntl();

  const asetukset = path(["elements", "asetukset"], rajoite);

  const kohteenTarkennin = path(
    ["elements", "kohde", 1, "properties", "value"],
    rajoite
  );

  const asetuskohteet = addIndex(filter)(indexEven, asetukset);

  const asetustenTarkentimet = addIndex(reject)(indexEven, asetukset);

  // const asetukset = filter(asetus => {
  //   const anchorPart = getAnchorPart(asetus.anchor, 3);
  //   return (
  //     !isNaN(parseInt(anchorPart, 10)) &&
  //     getAnchorPart(asetus.anchor, 4) === "kohde"
  //   );
  // }, rajoite.elements.asetukset || []);
  // console.info(rajoite, kriteerit);

  const [opetuksenJarjestamismuodot] = useLomakedata({
    anchor: "opetuksenJarjestamismuodot"
  });

  return (
    <section
      key={id}
      className={`rajoite ${isBorderVisible ? "border p-6" : ""}`}
    >
      {areTitlesVisible && (
        <Typography component="h3" variant="h3">
          {`${formatMessage(rajoitteetMessages.rajoite)} ${index + 1}`}
        </Typography>
      )}
      <div>
        {areTitlesVisible && (
          <Typography component="h4" variant="h4">
            Kohde:
          </Typography>
        )}
        <ul>
          <li key={index} className={`list-inside`}>
            {kohteenTarkennin ? kohteenTarkennin.label : "-Tieto puuttuu-"}
          </li>
        </ul>
        {areTitlesVisible && (
          <Typography component="h4" variant="h4">
            Kohteen rajoitukset:
          </Typography>
        )}
        <ul>
          {addIndex(map)((asetuskohde, index) => {
            const asetuskohteenTarkennin = nth(index, asetustenTarkentimet);
            let asetuskohteenTarkentimet = [];
            console.info(asetuskohteenTarkennin);
            if (!asetuskohteenTarkennin) {
              // Opetuksen järjestämismuodot on poikkeustapaus,
              // koska päälomakkeella valittu arvo valikoituu
              // rajoitteeksi automaattisesti. Tällöin muutosobjekti
              // jää kuitenkin syntymättä, mistä johtuen tieto
              // päälomakkeella valitttuna olevasta arvosta täytyy
              // etsiä päälomakkeen osiokohtaisesta datasta, johon
              // on laskettu mukaan osioon tehdyt muutokset.
              if (
                asetuskohde.properties.value.value ===
                "opetuksenJarjestamismuodot"
              ) {
                const checkedRadio = find(
                  pathEq(["properties", "isChecked"], true),
                  opetuksenJarjestamismuodot
                );
                if (checkedRadio) {
                  const koodiarvo = getAnchorPart(checkedRadio.anchor, 1);
                  const title = path(["properties", "title"], checkedRadio);

                  asetuskohteenTarkentimet = [
                    {
                      properties: {
                        value: [{ label: title, value: koodiarvo }]
                      }
                    }
                  ];
                }
              }
            } else {
              asetuskohteenTarkentimet = asetuskohteenTarkennin;
            }

            const tarkentimetForLooping = Array.isArray(
              asetuskohteenTarkentimet.properties.value
            )
              ? asetuskohteenTarkentimet.properties.value
              : [asetuskohteenTarkentimet.properties.value];
            return (
              <li key={index}>
                <div className="ml-6 flex items-center">
                  <Typography component="h5" variant="h5">
                    {asetuskohde.properties.value.label}:
                  </Typography>
                  {asetuskohteenTarkennin && (
                    <ul className="ml-4">
                      {addIndex(map)((value, index) => {
                        return (
                          <li key={index} className="inline">
                            {isDate(value)
                              ? moment(value).format("DD.MM.YYYY")
                              : value}
                            {index < tarkentimetForLooping.length - 1
                              ? ", "
                              : ""}
                          </li>
                        );
                      }, tarkentimetForLooping)}
                    </ul>
                  )}
                </div>
              </li>
            );
          }, asetuskohteet)}
        </ul>
        {!isReadOnly && (
          <div className="flex justify-between pt-8">
            <SimpleButton
              onClick={() => onRemoveRestriction(id)}
              text={translate("rajoitteet.poistaRajoite")}
              variant={"outlined"}
            />{" "}
            <SimpleButton
              onClick={() => onModifyRestriction(id)}
              size="small"
              text={translate("rajoitteet.muokkaaRajoitetta")}
              variant={"outlined"}
            />
          </div>
        )}
      </div>
    </section>
  );
};

Rajoite.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  isReadOnly: PropTypes.bool,
  areTitlesVisible: PropTypes.bool,
  onModifyRestriction: PropTypes.func,
  onRemoveRestriction: PropTypes.func,
  rajoite: PropTypes.object.isRequired
};

export default Rajoite;
