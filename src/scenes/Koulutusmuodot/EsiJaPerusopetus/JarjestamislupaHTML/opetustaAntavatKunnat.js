import React, { useEffect, useState } from "react";
import {
  find,
  toUpper,
  isEmpty,
  filter,
  map,
  concat,
  includes,
  path,
  pipe,
  groupBy,
  mergeDeepWithKey,
  pathEq
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getKunnatFromStorage } from "../../../../helpers/kunnat";
import { getMaakuntakunnat } from "../../../../helpers/maakunnat";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import Typography from "@material-ui/core/Typography";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";

export default function PoOpetustaAntavatKunnatHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [kunnat, setKunnat] = useState([]);
  const [maakuntaKunnat, setMaakuntaKunnat] = useState([]);

  /** Fetch kunnat and maaKuntaKunnat from storage */
  useEffect(() => {
    getKunnatFromStorage()
      .then(kunnat => setKunnat(kunnat))
      .catch(err => {
        console.error(err);
      });
    getMaakuntakunnat()
      .then(maakuntaKunnat => setMaakuntaKunnat(maakuntaKunnat))
      .catch(err => {
        console.error(err);
      });
  }, []);

  const kuntaMaaraykset = [];
  pipe(
    groupBy(x => x.koodiarvo),
    map(x => {
      let kuntaWithCombinedAliMaaraykset = {};
      map(kunta => {
        kuntaWithCombinedAliMaaraykset = mergeDeepWithKey(
          (k, l, r) => (k === "aliMaaraykset" ? concat(l, r) : r),
          kunta,
          kuntaWithCombinedAliMaaraykset
        );
      }, x);
      kuntaMaaraykset.push(kuntaWithCombinedAliMaaraykset);
    })
  )(
    filter(maarays => {
      return (
        pathEq(
          ["kohde", "tunniste"],
          "kunnatjoissaopetustajarjestetaan",
          maarays
        ) &&
        maarays.koodisto === "kunta" &&
        !includes("200", path(["koodiarvo"], maarays) || "")
      );
    }, maaraykset)
  );

  const lisatietomaarays = find(
    maarays =>
      pathEq(
        ["kohde", "tunniste"],
        "kunnatjoissaopetustajarjestetaan",
        maarays
      ) && maarays.koodisto === "lisatietoja",
    maaraykset
  );

  const opetustaJarjestetaanUlkomaillaLisatiedotMaaraykset = filter(
    maarays =>
      pathEq(
        ["kohde", "tunniste"],
        "kunnatjoissaopetustajarjestetaan",
        maarays
      ) &&
      includes("200", path(["koodiarvo"], maarays) || "") &&
      maarays.meta.arvo,
    maaraykset
  );

  return !isEmpty(kunnat) &&
    !isEmpty(maakuntaKunnat) &&
    (!isEmpty(kuntaMaaraykset) ||
      !isEmpty(opetustaJarjestetaanUlkomaillaLisatiedotMaaraykset)) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.opetustaAntavatKunnat)}
      </Typography>
      <ul className="list-disc mb-4">
        {getRajoitteetFromMaarays(
          concat(
            kuntaMaaraykset,
            opetustaJarjestetaanUlkomaillaLisatiedotMaaraykset
          ).filter(Boolean),
          locale,
          "arvo"
        )}
      </ul>
      <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
    </div>
  ) : null;
}
