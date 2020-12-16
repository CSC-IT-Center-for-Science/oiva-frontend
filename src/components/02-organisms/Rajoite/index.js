import React from "react";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { Typography } from "@material-ui/core";
import SimpleButton from "components/00-atoms/SimpleButton";
import { __ as translate } from "i18n-for-browser";
import { getAnchorPart } from "utils/common";
import { useIntl } from "react-intl";
import { useLomakedata } from "stores/lomakedata";
import {
  addIndex,
  compose,
  find,
  identity,
  includes,
  map,
  path,
  pathEq,
  prop
} from "ramda";

const defaultProps = {
  areTitlesVisible: true,
  isReadOnly: false
};

const Rajoite = ({
  id,
  index,
  isReadOnly = defaultProps.isReadOnly,
  areTitlesVisible = defaultProps.areTitlesVisible,
  kriteerit,
  onModifyRestriction,
  onRemoveRestriction,
  rajoite,
  rajoitusPropValue
}) => {
  const { formatMessage } = useIntl();

  const [opetuksenJarjestamismuodot] = useLomakedata({
    anchor: "opetuksenJarjestamismuodot"
  });

  return (
    <section key={id}>
      {areTitlesVisible && (
        <Typography component="h3" variant="h3">
          {`${formatMessage(rajoitteetMessages.rajoite)} ${index + 1}`}
        </Typography>
      )}
      <div className={`${areTitlesVisible ? "border p-6" : ""}`}>
        {areTitlesVisible && (
          <Typography component="h4" variant="h4">
            Kohteet:
          </Typography>
        )}
        <ul>
          {addIndex(map)((item, index) => {
            return (
              <li
                key={index}
                className={`${areTitlesVisible ? "list-disc" : ""} list-inside`}
              >
                {item.label}
              </li>
            );
          }, rajoitusPropValue)}
        </ul>
        {areTitlesVisible && (
          <Typography component="h4" variant="h4">
            Kohteita rajoitetaan seuraavasti:
          </Typography>
        )}
        <ul>
          {addIndex(map)((item, index) => {
            const anchorPart = getAnchorPart(item.anchor, 3);
            let kriteerinArvoobjekti = find(
              compose(
                includes(`.asetukset.${anchorPart}.rajoitus`),
                prop("anchor")
              ),
              rajoite.elements.asetukset
            );
            if (!kriteerinArvoobjekti) {
              // Opetuksen järjestämismuodot on poikkeustapaus,
              // koska päälomakkeella valittu arvo valikoituu
              // rajoitteeksi automaattisesti. Tällöin muutosobjekti
              // jää kuitenkin syntymättä, mistä johtuen tieto
              // päälomakkeella valitttuna olevasta arvosta täytyy
              // etsiä päälomakkeen osiokohtaisesta datasta, johon
              // on laskettu mukaan osioon tehdyt muutokset.
              if (
                item.properties.value.value === "opetuksenJarjestamismuodot"
              ) {
                const checkedRadio = find(
                  pathEq(["properties", "isChecked"], true),
                  opetuksenJarjestamismuodot
                );
                if (checkedRadio) {
                  const koodiarvo = getAnchorPart(checkedRadio.anchor, 1);
                  const title = path(["properties", "title"], checkedRadio);

                  kriteerinArvoobjekti = {
                    properties: {
                      value: [{ label: title, value: koodiarvo }]
                    }
                  };
                }
              }
            }
            return (
              <li key={index}>
                <div className="ml-6">
                  <Typography component="h5" variant="h5">
                    {item.properties.value.label}:
                  </Typography>
                  {kriteerinArvoobjekti && (
                    <ul>
                      {addIndex(map)(
                        (item, index) => {
                          return (
                            <li key={index} className="list-disc list-inside">
                              {item.label}
                            </li>
                          );
                        },
                        Array.isArray(kriteerinArvoobjekti.properties.value)
                          ? kriteerinArvoobjekti.properties.value
                          : [kriteerinArvoobjekti.properties.value]
                      )}
                    </ul>
                  )}
                </div>
              </li>
            );
          }, kriteerit)}
        </ul>
        {!isReadOnly && (
          <div className="flex justify-between pt-8">
            <SimpleButton
              onClick={() => onRemoveRestriction(identity)}
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

export default Rajoite;
