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
import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";

export default function PoOpetuksenMuutEhdotHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [muutEhdotKoodisto, setMuutEhdotKoodisto] = useState([]);

  /** Fetch Muut ehdot -koodisto from storage */
  useEffect(() => {
    getPOMuutEhdotFromStorage()
      .then(muutEhdotKoodisto => setMuutEhdotKoodisto(muutEhdotKoodisto))
      .catch(err => {
        console.error(err);
      });
  }, []);
  console.info(maaraykset);
  const muutEhdot = filter(
    maarays =>
      maarays.kohde.tunniste === "muutkoulutuksenjarjestamiseenliittyvatehdot" &&
      maarays.koodisto === "pomuutkoulutuksenjarjestamiseenliittyvatehdot",
    maaraykset
  );

  return !isEmpty(muutEhdot) && !isEmpty(muutEhdotKoodisto) ? (
    <div className={"pt-8 pb-4"}>
      <h1 className="font-medium mb-4">
        {intl.formatMessage(education.muutEhdotTitle)}
      </h1>
      <ul className="ml-8 list-disc mb-4">
        {map(muuEhto => {
          const koodistonTiedot = find(
            propEq("koodiarvo", muuEhto.koodiarvo),
            muutEhdotKoodisto
          );
          /**
           * Etsitään määräystä vastaava toinen määräys, jossa on
           * mahdollisesti määritelty tähän määräykseen liittyvä
           * kuvausteksti.
           */
          const kuvausmaaraykset = filter(me => {
            return and(
              propEq("koodiarvo", muuEhto.koodiarvo)(me),
              compose(not, isNil, path(["meta", "kuvaus"]))(me)
            );
          }, muutEhdot);

          return !!koodistonTiedot ? (
            <li key={muuEhto.koodiarvo}>
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
        }, filter(compose(isNil, path(["meta", "kuvaus"])), muutEhdot)).filter(
          Boolean
        )}
      </ul>
    </div>
  ) : null;
}
