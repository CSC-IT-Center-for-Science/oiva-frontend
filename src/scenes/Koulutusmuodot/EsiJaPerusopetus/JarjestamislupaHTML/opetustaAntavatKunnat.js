import React, { useEffect, useState } from "react";
import {
  find,
  toUpper,
  isEmpty,
  propEq,
  filter,
  map,
  concat,
  flatten,
  includes,
  prop,
  sortBy,
  startsWith,
  path,
  isNil
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import { getKunnatFromStorage } from "../../../../helpers/kunnat";
import { getMaakuntakunnat } from "../../../../helpers/maakunnat";
import Typography from "@material-ui/core/Typography";

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

  const maakuntaMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
      maarays.koodisto === "maakunta",
    maaraykset
  );

  const kuntaMaaraykset = filter(maarays => {
    return (
      maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
      maarays.koodisto === "kunta" &&
      (!maarays.meta.changeObjects ||
        !includes("ulkomaa", path(["meta", "changeObjects", "0", "anchor"], maarays) || ""))
    );
  }, maaraykset);

  const kunnatFromMaakuntaMaaraykset = map(maakunta => {
    return !isEmpty(maakuntaKunnat)
      ? find(propEq("koodiarvo", maakunta.koodiarvo), maakuntaKunnat).kunnat
      : null;
  }, maakuntaMaaraykset);

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  const opetustaJarjestetaanUlkomaillaValintaMaarays = find(
    maarays =>
      maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
      !isNil(path(["meta", "changeObjects"], maarays)) &&
      !isEmpty(path(["meta", "changeObjects"], maarays)) &&
      startsWith("toimintaalue.ulkomaa", maarays.meta.changeObjects[0].anchor),
    maaraykset
  );

  const opetustaJarjestetaanUlkomaillaIsChecked =
    opetustaJarjestetaanUlkomaillaValintaMaarays &&
    path(
      ["meta", "changeObjects", "0", "properties", "isChecked"],
      opetustaJarjestetaanUlkomaillaValintaMaarays
    );

  const opetustaJarjestetaanUlkomaillaLisatiedotMaarays = find(
    maarays =>
      maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
      !isNil(path(["meta", "changeObjects"], maarays)) &&
      !isEmpty(path(["meta", "changeObjects"], maarays)) &&
      includes("ulkomaa", maarays.meta.changeObjects[0].anchor) &&
      includes("lisatiedot", maarays.meta.changeObjects[0].anchor),
    maaraykset
  );

  /** Set nimi property for maarays, and sort maaraykset by nimi **/
  const kunnatFromLupa = sortBy(prop("nimi"))(
    map(kunta => {
      kunta.nimi = kunta.metadata
        ? kunta.metadata[locale].nimi
        : find(propEq("kieli", locale), kunta.koodi.metadata).nimi;
      return kunta;
    }, flatten(concat(kunnatFromMaakuntaMaaraykset, kuntaMaaraykset)).filter(Boolean))
  );

  return !isEmpty(kunnat) &&
    !isEmpty(maakuntaKunnat) &&
    (!isEmpty(kunnatFromLupa) || opetustaJarjestetaanUlkomaillaIsChecked) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.opetustaAntavatKunnat)}
      </Typography>
      <ul className="ml-8 list-disc mb-4">
        {map(
          kunta => (
            <li key={kunta.koodiarvo} className="leading-bulletList">
              {kunta.nimi}
            </li>
          ),
          kunnatFromLupa
        )}
        {opetustaJarjestetaanUlkomaillaIsChecked && opetustaJarjestetaanUlkomaillaLisatiedotMaarays ?
          <li>
            {opetustaJarjestetaanUlkomaillaLisatiedotMaarays.meta.arvo}
          </li>
          : ""}
      </ul>
      <p className="mb-6">{lisatietomaarays && lisatietomaarays.meta.arvo}</p>
    </div>
  ) : null;
}
