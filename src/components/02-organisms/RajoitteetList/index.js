import React from "react";
import {
  addIndex,
  compose,
  filter,
  find,
  includes,
  map,
  mapObjIndexed,
  path,
  pathEq,
  prop,
  values
} from "ramda";
import { Typography } from "@material-ui/core";
import rajoitteetMessages from "i18n/definitions/rajoitteet";
import { useIntl } from "react-intl";
import { getAnchorPart } from "utils/common";
import SimpleButton from "components/00-atoms/SimpleButton";
import { __ as translate } from "i18n-for-browser";
import { useLomakedata } from "stores/lomakedata";

const RajoitteetList = ({
  onModifyRestriction,
  onRemoveRestriction,
  rajoitteet
}) => {
  const { formatMessage } = useIntl();

  const [opetuksenJarjestamismuodot] = useLomakedata({
    anchor: "opetuksenJarjestamismuodot"
  });

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
            <section key={rajoiteId}>
              <Typography component="h3" variant="h3">
                {`${formatMessage(rajoitteetMessages.rajoite)} ${index + 1}`}
              </Typography>
              <div className="border p-12 shadow-md">
                <Typography component="h4" variant="h4">
                  Kohteet:
                </Typography>
                <ul>
                  {addIndex(map)((item, index) => {
                    return (
                      <li key={index} className="list-disc list-inside">
                        {item.label}
                      </li>
                    );
                  }, rajoitusPropValue)}
                </ul>
                <Typography component="h4" variant="h4">
                  Kohteita rajoitetaan seuraavasti:
                </Typography>
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
                        item.properties.value.value ===
                        "opetuksenJarjestamismuodot"
                      ) {
                        const checkedRadio = find(
                          pathEq(["properties", "isChecked"], true),
                          opetuksenJarjestamismuodot
                        );
                        if (checkedRadio) {
                          const koodiarvo = getAnchorPart(
                            checkedRadio.anchor,
                            1
                          );
                          const title = path(
                            ["properties", "title"],
                            checkedRadio
                          );

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
                        <div className="ml-12">
                          <Typography component="h5" variant="h5">
                            {item.properties.value.label}:
                          </Typography>
                          {kriteerinArvoobjekti && (
                            <ul>
                              {addIndex(map)(
                                (item, index) => {
                                  return (
                                    <li
                                      key={index}
                                      className="list-disc list-inside"
                                    >
                                      {item.label}
                                    </li>
                                  );
                                },
                                Array.isArray(
                                  kriteerinArvoobjekti.properties.value
                                )
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
                <div className="flex justify-between pt-8">
                  <SimpleButton
                    onClick={() => onRemoveRestriction(rajoiteId)}
                    text={translate("rajoitteet.poistaRajoite")}
                    variant={"outlined"}
                  />{" "}
                  <SimpleButton
                    onClick={() => onModifyRestriction(rajoiteId)}
                    size="small"
                    text={translate("rajoitteet.muokkaaRajoitetta")}
                    variant={"outlined"}
                  />
                </div>
              </div>
            </section>
          );
        }, rajoitteet)
      )}
    </div>
  );
};

export default RajoitteetList;
