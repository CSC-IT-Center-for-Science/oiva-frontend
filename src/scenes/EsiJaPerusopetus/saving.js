import moment from "moment";
import * as R from "ramda";
import * as muutEhdotHelper from "helpers/poMuutEhdot";
import * as opetuksenJarjestamismuodotHelper from "helpers/opetuksenJarjestamismuodot";
import * as opetusHelper from "helpers/opetustehtavat";
import * as opetustaAntavatKunnatHelper from "helpers/opetustaAntavatKunnat";
import * as opiskelijamaaratHelper from "helpers/opiskelijamaarat";
import * as opetuskieletHelper from "helpers/opetuskielet"

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

  // ... without tiedosto-property
  const allAttachments = R.map(attachment => {
    return R.dissoc("tiedosto", attachment);
  }, allAttachmentsRaw);

  // 1. OPETUS, JOTA LUPA KOSKEE
  const opetus = await opetusHelper.defineBackendChangeObjects(
    changeObjects.opetustehtavat,
    maaraystyypit,
    locale,
    kohteet
  );
  
  // 2. KUNNAT, JOISSA OPETUSTA JÄRJESTETÄÄN
  const categoryFilterChangeObj =
    R.find(
      R.propEq("anchor", "toimintaalue.categoryFilter"),
      changeObjects.toimintaalue || []
    ) || {};
  
  // 3. OPETUSKIELET
  const opetuskielet = await opetuskieletHelper.defineBackendChangeObjects(
    changeObjects.opetuskielet,
    maaraystyypit,
    locale,
    kohteet
  );

  // 4. OPETUKSEN JÄRJESTÄMISMUOTO
  const opetuksenJarjestamismuodot = await opetuksenJarjestamismuodotHelper.defineBackendChangeObjects(
    changeObjects.opetuksenJarjestamismuodot,
    maaraystyypit,
    locale,
    kohteet
  );

  // 6. OPPILAS-/OPISKELIJAMÄÄRÄT
  const opiskelijamaarat = await opiskelijamaaratHelper.defineBackendChangeObjects(
    changeObjects.opiskelijamaarat,
    maaraystyypit,
    locale,
    kohteet
  );

  // 7. MUUT KOULUTUKSEN JÄRJESTÄMISEEN LIITTYVÄT EHDOT
  const muutEhdot = await muutEhdotHelper.defineBackendChangeObjects(
    changeObjects.muutEhdot,
    maaraystyypit,
    locale,
    kohteet
  );

  const opetustaAntavatKunnat = await opetustaAntavatKunnatHelper.defineBackendChangeObjects(
    {
      quickFilterChanges: R.path(
        ["properties", "quickFilterChanges"],
        categoryFilterChangeObj
      ),
      changesByProvince: R.path(
        ["properties", "changesByProvince"],
        categoryFilterChangeObj
      ),
      lisatiedot: R.find(
        R.compose(R.includes(".lisatiedot."), R.prop("anchor")),
        changeObjects.toimintaalue || []
      ),
      ulkomaa: R.filter(
        R.compose(R.includes(".ulkomaa."), R.prop("anchor")),
        changeObjects.toimintaalue || []
      )
    },
    R.find(R.propEq("tunniste", "toimintaalue"), kohteet),
    maaraystyypit,
    lupa.maaraykset
  );

  console.info(opiskelijamaarat);

  let objectToSave = {
    alkupera,
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
    muutokset: R.flatten([
      muutEhdot,
      opetuksenJarjestamismuodot,
      opetus,
      opetuskielet,
      opetustaAntavatKunnat,
      opiskelijamaarat
    ]),
    uuid
  };

  const asianumeroObj = R.find(
    R.propEq("anchor", "paatoksentiedot.asianumero.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.asianumero = asianumeroObj ? asianumeroObj.properties.value : "";
  const paatospaivaObj = R.find(
    R.propEq("anchor", "paatoksentiedot.paatospaiva.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.paatospvm = paatospaivaObj
    ? moment(paatospaivaObj.properties.value).format("YYYY-MM-DD")
    : "";
  const voimaantulopaivaObj = R.find(
    R.propEq("anchor", "paatoksentiedot.voimaantulopaiva.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.voimassaalkupvm = voimaantulopaivaObj
    ? moment(voimaantulopaivaObj.properties.value).format("YYYY-MM-DD")
    : "";
  const paattymispaivamaaraObj = R.find(
    R.propEq("anchor", "paatoksentiedot.paattymispaivamaara.A"),
    changeObjects.paatoksentiedot || []
  );
  objectToSave.paattymispaivamaara = paattymispaivamaaraObj
    ? moment(paattymispaivamaaraObj.properties.value).format("YYYY-MM-DD")
    : "";

  // This helps the frontend to initialize the first four fields on form load.
  objectToSave.meta.paatoksentiedot = changeObjects.paatoksentiedot;

  return objectToSave;
}
