import moment from "moment";
import * as R from "ramda";
import * as opetusHelper from "helpers/opetustehtavat";
import * as opetuksenJarjestamismuodotHelper from "helpers/opetuksenJarjestamismuodot";
import * as opetustaAntavatKunnatHelper from "helpers/opetustaAntavatKunnat";

export async function createObjectToSave(
  locale,
  organisation,
  lupa,
  changeObjects,
  uuid,
  kohteet,
  maaraystyypit,
  muut,
  lupaKohteet,
  alkupera = "KJ"
) {
  const allAttachmentsRaw = [];

  // ... without tiedosto-property
  const allAttachments = R.map(attachment => {
    return R.dissoc("tiedosto", attachment);
  }, allAttachmentsRaw);

  const getValueByPathAndAnchor = (anchor, path, changeObjects) => {
    return R.path(
      ["properties", "value"],
      R.find(R.propEq("anchor", anchor), R.path(path, changeObjects) || []) ||
        {}
    );
  };

  // OPETUSTEHTÄVÄT
  const opetus = await opetusHelper.defineBackendChangeObjects(
    changeObjects.opetustehtavat,
    maaraystyypit,
    locale,
    kohteet
  );

  // OPETUKSEN JÄRJESTÄMISMUODOT
  const opetuksenJarjestamismuodot = await opetuksenJarjestamismuodotHelper.defineBackendChangeObjects(
    changeObjects.opetuksenJarjestamismuodot,
    maaraystyypit,
    locale,
    kohteet
  );

  // OPETUSTA ANTAVAT KUNNAT
  const categoryFilterChangeObj =
    R.find(
      R.propEq("anchor", "toimintaalue.categoryFilter"),
      changeObjects.toimintaalue
    ) || {};
  console.info(changeObjects.toimintaalue);
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
        changeObjects.toimintaalue
      )
    },
    R.find(R.propEq("tunniste", "toimintaalue"), kohteet),
    maaraystyypit,
    lupa.maaraykset
  );

  console.info(opetustaAntavatKunnat);

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
      opetus,
      opetuksenJarjestamismuodot,
      opetustaAntavatKunnat
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
