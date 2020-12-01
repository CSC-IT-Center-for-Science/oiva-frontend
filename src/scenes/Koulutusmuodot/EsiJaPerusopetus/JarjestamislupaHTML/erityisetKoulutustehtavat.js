import React, { useEffect, useState } from "react";
import {
  addIndex,
  and,
  compose,
  filter,
  find,
  isEmpty,
  isNil,
  map,
  not,
  path,
  propEq,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import Typography from "@material-ui/core/Typography";

export default function PoOpetuksenErityisetKoulutustehtavatHtml({
  maaraykset
}) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [
    erityisetKoulutustehtavatKoodisto,
    setErityisetKoulutustehtavatKoodisto
  ] = useState([]);

  /** Fetch opetuksenJarjestamismuodot from storage */
  useEffect(() => {
    getPOErityisetKoulutustehtavatFromStorage()
      .then(erityisetKoulutustehtavat =>
        setErityisetKoulutustehtavatKoodisto(erityisetKoulutustehtavat)
      )
      .catch(err => {
        console.error(err);
      });
  }, []);

  const erityisetKoulutustehtavat = filter(
    maarays =>
      maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
      maarays.koodisto === "poerityinenkoulutustehtava",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "erityinenkoulutustehtava" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(erityisetKoulutustehtavat) &&
    !isEmpty(erityisetKoulutustehtavatKoodisto) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.erityisetKoulutustehtavat)}
      </Typography>
      <ul className="ml-8 list-disc mb-4">
        {map(erityinenKoulutustehtava => {
          const koodistonTiedot = find(
            propEq("koodiarvo", erityinenKoulutustehtava.koodiarvo),
            erityisetKoulutustehtavatKoodisto
          );
          /**
           * Etsitään määräystä vastaava toinen määräys, jossa on
           * mahdollisesti määritelty tähän määräykseen liittyvä
           * kuvausteksti.
           */
          const kuvausmaaraykset = filter(ek => {
            return and(
              propEq("koodiarvo", erityinenKoulutustehtava.koodiarvo)(ek),
              compose(not, isNil, path(["meta", "kuvaus"]))(ek)
            );
          }, erityisetKoulutustehtavat);

          return !!koodistonTiedot ? (
            <li key={erityinenKoulutustehtava.koodiarvo}>
              {path(["metadata", locale, "nimi"], koodistonTiedot)}
              {kuvausmaaraykset.length ? (
                <ul className="ml-8 list-disc mb-4">
                  {addIndex(map)(
                    (kuvausmaarays, index) => (
                      <li key={`kuvaus-${index}`}>
                        {path(["meta", "kuvaus"], kuvausmaarays)}
                      </li>
                    ),
                    kuvausmaaraykset
                  )}
                </ul>
              ) : null}
            </li>
          ) : null;
        }, filter(compose(isNil, path(["meta", "kuvaus"])), erityisetKoulutustehtavat)).filter(
          Boolean
        )}
      </ul>
      { lisatietomaarays ? (lisatietomaarays.meta.arvo) : null}
    </div>
  ) : null;
}
