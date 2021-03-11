import moment from "moment";
import {
  compose,
  dissoc,
  filter,
  find,
  flatten,
  groupBy,
  includes,
  isNil,
  last,
  map,
  mapObjIndexed,
  nth,
  path,
  pathEq,
  prop,
  propEq,
  reject,
  split
} from "ramda";
import * as muutEhdotHelper from "helpers/lukioMuutEhdot";
import * as oikeusSisaoppilaitosmuotoiseenKoulutukseeenHelper from "helpers/oikeusSisaoppilaitosmuotoiseenKoulutukseen";
import * as opetustaAntavatKunnatHelper from "helpers/opetustaAntavatKunnat";
import * as opiskelijamaaratHelper from "helpers/opiskelijamaarat";
import * as opetuskieletHelper from "helpers/opetuskielet";
import * as erityinenKoulutustehtavaHelper from "helpers/lukioErityisetKoulutustehtavat";
import { koulutustyypitMap } from "../../../utils/constants";

export async function createObjectToSave(
  locale,
  organisation,
  lupa,
  changeObjects,
  uuid,
  kohteet,
  maaraystyypit,
  alkupera = "KJ"
) {
  const allAttachmentsRaw = [];
  const koulutustyyppi = koulutustyypitMap.LUKIO;

  // ... without tiedosto-property
  const allAttachments = map(attachment => {
    return dissoc("tiedosto", attachment);
  }, allAttachmentsRaw);

  const rajoitteetByRajoiteId = groupBy(
    compose(last, split("_"), nth(0), split("."), prop("anchor")),
    changeObjects.rajoitteet
  );

  // 1. KUNNAT, JOISSA OPETUSTA JÄRJESTETÄÄN
  const categoryFilterChangeObj =
    find(
      propEq("anchor", "toimintaalue.categoryFilter"),
      changeObjects.toimintaalue || []
    ) || {};

  const opetustaAntavatKunnat = await opetustaAntavatKunnatHelper.defineBackendChangeObjects(
    {
      quickFilterChanges: path(
        ["properties", "quickFilterChanges"],
        categoryFilterChangeObj
      ),
      changesByProvince: path(
        ["properties", "changesByProvince"],
        categoryFilterChangeObj
      ),
      lisatiedot: find(
        compose(includes(".lisatiedot."), prop("anchor")),
        changeObjects.toimintaalue || []
      ),
      ulkomaa: filter(
        compose(includes(".ulkomaa."), prop("anchor")),
        changeObjects.toimintaalue || []
      ),
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "toimintaalue",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    find(propEq("tunniste", "kunnatjoissaopetustajarjestetaan"), kohteet),
    maaraystyypit,
    lupa.maaraykset,
    locale,
    kohteet
  );

  // 2. OPETUSKIELET
  const opetuskielet = await opetuskieletHelper.defineBackendChangeObjects(
    {
      opetuskielet: changeObjects.opetuskielet,
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "opetuskielet",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    maaraystyypit,
    locale,
    kohteet
  );

  // 3. OIKEUS SISÄOPPILAITOSMUOTOISEEN KOULUTUKSEEN
  const oikeusSisaoppilaitosmuotoiseenKoulutukseen = await oikeusSisaoppilaitosmuotoiseenKoulutukseeenHelper.defineBackendChangeObjects(
    {
      oikeusSisaoppilaitosmuotoiseenKoulutukseen:
        changeObjects.oikeusSisaoppilaitosmuotoiseenKoulutukseen,
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "oikeusSisaoppilaitosmuotoiseenKoulutukseen",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    maaraystyypit,
    locale,
    kohteet
  );

  // 4. ERITYINEN KOULUTUSTEHTÄVÄ
  const erityisetKoulutustehtavat = await erityinenKoulutustehtavaHelper.defineBackendChangeObjects(
    {
      erityisetKoulutustehtavat: changeObjects.erityisetKoulutustehtavat,
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "erityisetKoulutustehtavat",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    maaraystyypit,
    locale,
    kohteet
  );

  // 6. OPPILAS-/OPISKELIJAMÄÄRÄT
  const opiskelijamaarat = await opiskelijamaaratHelper.defineBackendChangeObjects(
    {
      opiskelijamaarat: changeObjects.opiskelijamaarat,
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "opiskelijamaarat",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    maaraystyypit,
    locale,
    kohteet,
    koulutustyyppi
  );

  // 7. MUUT KOULUTUKSEN JÄRJESTÄMISEEN LIITTYVÄT EHDOT
  const muutEhdot = await muutEhdotHelper.defineBackendChangeObjects(
    {
      muutEhdot: changeObjects.muutEhdot,
      rajoitteetByRajoiteId: reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            ["0", "properties", "value", "value"],
            "muutEhdot",
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      )
    },
    maaraystyypit,
    locale,
    kohteet
  );

  let objectToSave = {
    alkupera,
    koulutustyyppi,
    diaarinumero: lupa.diaarinumero,
    jarjestajaOid: organisation.oid,
    jarjestajaYtunnus: organisation.ytunnus,
    luoja: sessionStorage.getItem("username"),
    // luontipvm: moment().valueOf(),
    luontipvm: moment().format("YYYY-MM-DD"),
    lupaUuid: lupa.uuid,
    // uuid: lupa.asiatyyppi.uuid,
    tila: alkupera === "ESITTELIJA" && uuid ? "VALMISTELUSSA" : "LUONNOS",
    paivittaja: "string",
    paivityspvm: null,
    voimassaalkupvm: null,
    voimassaloppupvm: null, // TODO: find the correct value somehow,
    liitteet: allAttachments,
    meta: {},
    muutokset: flatten([
      erityisetKoulutustehtavat,
      muutEhdot,
      oikeusSisaoppilaitosmuotoiseenKoulutukseen,
      opetuskielet,
      opetustaAntavatKunnat,
      opiskelijamaarat
    ]),
    uuid
  };

  const asianumeroObj = find(
    propEq("anchor", "paatoksentiedot.asianumero.A"),
    changeObjects.paatoksentiedot || []
  );

  objectToSave.asianumero = asianumeroObj ? asianumeroObj.properties.value : "";

  const diaarinumeroObj = find(
    propEq("anchor", "paatoksentiedot.diaarinumero.A"),
    changeObjects.paatoksentiedot || []
  );

  objectToSave.diaarinumero = diaarinumeroObj
    ? diaarinumeroObj.properties.value
    : "";

  const paatospaivaObj = find(
    propEq("anchor", "paatoksentiedot.paatospaiva.A"),
    changeObjects.paatoksentiedot || []
  );

  objectToSave.paatospvm =
    paatospaivaObj && paatospaivaObj.properties.value
      ? moment(paatospaivaObj.properties.value).format("YYYY-MM-DD")
      : "";
  const voimaantulopaivaObj = find(
    propEq("anchor", "paatoksentiedot.voimaantulopaiva.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.voimassaalkupvm =
    voimaantulopaivaObj && voimaantulopaivaObj.properties.value
      ? moment(voimaantulopaivaObj.properties.value).format("YYYY-MM-DD")
      : "";
  const paattymispaivamaaraObj = find(
    propEq("anchor", "paatoksentiedot.paattymispaivamaara.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.voimassaloppupvm =
    paattymispaivamaaraObj && paattymispaivamaaraObj.properties.value
      ? moment(paattymispaivamaaraObj.properties.value).format("YYYY-MM-DD")
      : "";

  // This helps the frontend to initialize the first four fields on form load.
  objectToSave.meta.paatoksentiedot = changeObjects.paatoksentiedot;

  return objectToSave;
}
