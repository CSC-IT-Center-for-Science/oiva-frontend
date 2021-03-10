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
import { getLukioMuutEhdotFromStorage } from "helpers/lukioMuutEhdot/index";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "utils/rajoitteetUtils";
import { getLocalizedProperty } from "services/lomakkeet/utils";

export default function OpetuksenMuutEhdotHtml({ maaraykset }) {
  const intl = useIntl();
  const localeUpper = toUpper(intl.locale);
  const [muutEhdotKoodisto, setMuutEhdotKoodisto] = useState([]);

  /** Fetch Muut ehdot -koodisto from storage */
  useEffect(() => {
    getLukioMuutEhdotFromStorage()
      .then(muutEhdotKoodisto => setMuutEhdotKoodisto(muutEhdotKoodisto))
      .catch(err => {
        console.error(err);
      });
  }, []);

  const muutEhdotMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste ===
        "muutkoulutuksenjarjestamiseenliittyvatehdot" &&
      maarays.koodisto === "lukiomuutkoulutuksenjarjestamiseenliittyvatehdot",
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

            naytettavaArvo = getLocalizedProperty(
              koodistosta.metadata,
              localeUpper,
              "kuvaus"
            );
          }

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
}
