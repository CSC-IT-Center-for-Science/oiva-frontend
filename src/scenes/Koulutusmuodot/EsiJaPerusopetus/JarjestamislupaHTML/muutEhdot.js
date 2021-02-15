import React, { useEffect, useState } from "react";
import {
  addIndex,
  filter,
  find,
  isEmpty,
  length,
  map,
  path,
  propEq,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "utils/rajoitteetUtils";

export default function PoOpetuksenMuutEhdotHtml({ maaraykset }) {
  const intl = useIntl();
  const localeUpper = toUpper(intl.locale);
  const [muutEhdotKoodisto, setMuutEhdotKoodisto] = useState([]);

  /** Fetch Muut ehdot -koodisto from storage */
  useEffect(() => {
    getPOMuutEhdotFromStorage()
      .then(muutEhdotKoodisto => setMuutEhdotKoodisto(muutEhdotKoodisto))
      .catch(err => {
        console.error(err);
      });
  }, []);

  const muutEhdotMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste ===
        "muutkoulutuksenjarjestamiseenliittyvatehdot" &&
      maarays.koodisto === "pomuutkoulutuksenjarjestamiseenliittyvatehdot",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste ===
        "muutkoulutuksenjarjestamiseenliittyvatehdot" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(muutEhdotMaaraykset) && !isEmpty(muutEhdotKoodisto) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.muutEhdotTitle)}
      </Typography>

      <ul className="ml-8 list-disc mb-4">
        {addIndex(map)((maarays, index) => {
          let naytettavaArvo = path(["meta", "kuvaus"], maarays);

          if (!naytettavaArvo) {
            const koodistosta = find(
              propEq("koodiarvo", maarays.koodiarvo),
              muutEhdotKoodisto
            );

            naytettavaArvo = koodistosta.metadata[localeUpper].nimi;
          }

          console.info(maarays);
          const result = (
            <React.Fragment key={`${maarays.koodiarvo}-${index}`}>
              <li className="leading-bulletList">{naytettavaArvo}</li>
              {length(maarays.aliMaaraykset)
                ? getRajoitteetFromMaarays(
                    maarays.aliMaaraykset,
                    localeUpper,
                    "kuvaus"
                  )
                : ""}
            </React.Fragment>
          );
          return result;
        }, muutEhdotMaaraykset)}
      </ul>
      {lisatietomaarays ? lisatietomaarays.meta.arvo : null}
    </div>
  ) : null;

  // return !isEmpty(muutEhdot) && !isEmpty(muutEhdotKoodisto) ? (
  //   <div className="mt-4">
  //     <Typography component="h3" variant="h3">
  //       {intl.formatMessage(education.muutEhdotTitle)}
  //     </Typography>
  //     <ul className="ml-8 list-disc mb-4">
  //       {map(muuEhto => {
  //         const koodistonTiedot = find(
  //           propEq("koodiarvo", muuEhto.koodiarvo),
  //           muutEhdotKoodisto
  //         );
  //         /**
  //          * Etsitään määräystä vastaava toinen määräys, jossa on
  //          * mahdollisesti määritelty tähän määräykseen liittyvä
  //          * kuvausteksti.
  //          */
  //         const kuvausmaaraykset = filter(me => {
  //           return and(
  //             propEq("koodiarvo", muuEhto.koodiarvo)(me),
  //             compose(not, isNil, path(["meta", "kuvaus"]))(me)
  //           );
  //         }, muutEhdot);

  //         return !!koodistonTiedot ? (
  //           <li key={muuEhto.koodiarvo}>
  //             {path(["metadata", locale, "nimi"], koodistonTiedot)}
  //             {kuvausmaaraykset.length ? (
  //               <ul className="ml-8 list-disc mb-4">
  //                 {addIndex(map)(
  //                   (kuvausmaarays, index) => (
  //                     <li key={`kuvaus-${index}`}>
  //                       {path(["meta", "kuvaus"], kuvausmaarays)}
  //                     </li>
  //                   ),
  //                   kuvausmaaraykset
  //                 )}
  //               </ul>
  //             ) : null}
  //           </li>
  //         ) : null;
  //       }, filter(compose(isNil, path(["meta", "kuvaus"])), muutEhdot)).filter(
  //         Boolean
  //       )}
  //     </ul>
  //     { lisatietomaarays ? (lisatietomaarays.meta.arvo) : null}
  //   </div>
  // ) : null;
}
