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

export default function PoOpetustaAntavatKunnatHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [kunnat, setKunnat] = useState([]);
  const [maakuntaKunnat, setMaakuntaKunnat] = useState([]);

  /** Fetch kunnat and maaKuntaKunnat from storage */
  useEffect(() => {
    getKunnatFromStorage().then(kunnat =>
      setKunnat(kunnat)
    ).catch(err => {
      console.error(err);
    });
    getMaakuntakunnat().then(maakuntaKunnat =>
      setMaakuntaKunnat(maakuntaKunnat)
    ).catch(err => {
      console.error(err);
      });
  }, []);

  const maakuntaMaaraykset = filter(maarays =>
    maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan"
    && maarays.koodisto === "maakunta", maaraykset);

  const kuntaMaaraykset = filter(maarays => {
    return maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan"
      && maarays.koodisto === "kunta"
      && (!maarays.meta.changeObjects || !includes("ulkomaa", maarays.meta.changeObjects[0].anchor))
  }, maaraykset);

  const kunnatFromMaakuntaMaaraykset = map(maakunta => {
    return !isEmpty(maakuntaKunnat) ? find(propEq("koodiarvo", maakunta.koodiarvo), maakuntaKunnat).kunnat : null
  }, maakuntaMaaraykset);

  const opetustaJarjestetaanUlkomaillaValintaMaarays = find(maarays =>
    maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
    !isNil(path(["meta", "changeObjects"], maarays)) &&
    !isEmpty(path(["meta", "changeObjects"], maarays)) &&
    startsWith("toimintaalue.ulkomaa", maarays.meta.changeObjects[0].anchor) , maaraykset)

  const opetustaJarjestetaanUlkomaillaIsChecked = opetustaJarjestetaanUlkomaillaValintaMaarays &&
    opetustaJarjestetaanUlkomaillaValintaMaarays.meta.changeObjects[0].properties.isChecked;

  const opetustaJarjestetaanUlkomaillaLisatiedotMaarays = find(maarays =>
    maarays.kohde.tunniste === "kunnatjoissaopetustajarjestetaan" &&
    !isNil(path(["meta", "changeObjects"], maarays)) &&
    !isEmpty(path(["meta", "changeObjects"], maarays)) &&
    includes("ulkomaa", maarays.meta.changeObjects[0].anchor) &&
    includes("lisatiedot", maarays.meta.changeObjects[0].anchor), maaraykset)

  /** Set nimi property for maarays, and sort maaraykset by nimi **/
  const kunnatFromLupa = sortBy(prop('nimi'))(
    map(kunta => {
      kunta.nimi = kunta.metadata ?
        kunta.metadata[locale].nimi : find(propEq("kieli", locale), kunta.koodi.metadata).nimi;
      return kunta
    }, flatten(concat(kunnatFromMaakuntaMaaraykset, kuntaMaaraykset)).filter(Boolean))
  );

  return !isEmpty(kunnat) && !isEmpty(maakuntaKunnat) && !isEmpty(kunnatFromLupa) ? (
    <div className="mt-4">
      <h3 className="font-medium mb-4">{intl.formatMessage(education.opetustaAntavatKunnat)}</h3>
      <ul className="ml-8 list-disc mb-4">
        {
          map(kunta =>
            <li key={kunta.koodiarvo}>
            { kunta.nimi }
          </li>, kunnatFromLupa)
        }
      </ul>
      { opetustaJarjestetaanUlkomaillaIsChecked && (
        <div>
          <h4 className="font-medium mb-4">{intl.formatMessage(education.opetustaJarjestetaanSuomenUlkopuolella)}</h4>
          {opetustaJarjestetaanUlkomaillaLisatiedotMaarays ? opetustaJarjestetaanUlkomaillaLisatiedotMaarays.meta.arvo : ""}
        </div>
      )}
    </div>
  ) : null
}