import _ from "lodash";
import dateformat from "dateformat";
import store from "../../../../store";
import { parseLocalizedField } from "../../../../modules/helpers";
import { KOHTEET } from "../../../Jarjestajat/Jarjestaja/modules/constants";
import {
  MUUTOS_TILAT,
  MUUTOS_TYPES
} from "../../../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants";

export function getKoulutusAlat() {
  const state = store.getState();

  if (state.koulutusalat && state.koulutusalat.fetched) {
    return state.koulutusalat.data;
  }
}

export function getTutkintoKoodiByMaaraysId(maaraysId) {
  const state = store.getState();

  if (state.lupa && state.lupa.data && state.lupa.data.maaraykset) {
    const { maaraykset } = state.lupa.data;
    const obj = _.find(maaraykset, { id: maaraysId });

    if (obj && obj.koodiarvo) {
      return obj.koodiarvo;
    }
  }
}

export function getTutkintoNimiByMaaraysId(maaraysId) {
  const state = store.getState();

  if (state.lupa && state.lupa.data && state.lupa.data.maaraykset) {
    const { maaraykset } = state.lupa.data;
    const obj = _.find(maaraykset, { id: maaraysId });

    if (obj && obj.koodi && obj.koodi.metadata) {
      return parseLocalizedField(obj.koodi.metadata);
    }
  }
}

export function getPaatoskierrosByUuid(paatoskierrosUuid) {
  const state = store.getState();

  if (state.paatoskierrokset && state.paatoskierrokset.data) {
    return _.find(state.paatoskierrokset.data, paatoskierros => {
      return paatoskierros.uuid === paatoskierrosUuid;
    });
  }
}

export function getJarjestajaData(state) {
  const fakeUser = "oiva-web"; // TODO: oikea käyttäjä statesta

  if (state.lupa && state.lupa.data) {
    const { data } = state.lupa;
    const { id, diaarinumero, jarjestajaYtunnus, jarjestajaOid } = data;
    const now = dateformat(new Date(), "yyyy-mm-dd");

    return {
      diaarinumero,
      // hakupvm: now, // kun siirretään käsittelyyn
      jarjestajaOid,
      jarjestajaYtunnus,
      luoja: fakeUser,
      luontipvm: now,
      lupaId: id,
      paatoskierrosId: null,
      paivityspvm: now,
      tila: "LUONNOS",
      voimassaalkupvm: null,
      voimassaloppupvm: null,
      muutosperustelu: {
        arvo: "",
        koodiarvo: null,
        koodisto: "oivaperustelut",
        luoja: fakeUser,
        luontipvm: now,
        meta: {
          perusteluteksti: null
        }
      }
    };
  }
}

export function loadValmisteluData(state, muutosdata) {
  // console.log('loadValmisteluData')
  // console.log(state)
  // console.log(muutosdata)

  if (!muutosdata) {
    console.log("muutosdata ei saatavilla, poistutaan");
    return;
  }

  let uusiData = { ...muutosdata };

  const { muutokset } = muutosdata;

  // formatoi muutokset

  if (state.kohteet && state.kohteet.fetched) {
    const kohteet = state.kohteet.data;

    // 1. Tutkinnot ja koulutukset
    const tutkinnotKohde = _.find(kohteet, kohde => {
      return kohde.tunniste === KOHTEET.TUTKINNOT;
    });

    if (tutkinnotKohde) {
      uusiData.tutkinnotjakoulutukset = getMuutosArray(
        muutokset,
        tutkinnotKohde.uuid
      );
    }
  }

  // delete muutosdata.muutokset

  // console.log(uusiData)

  return uusiData;
}

function getMuutosArray(muutokset, kohdeUuid) {
  if (!muutokset || !kohdeUuid) {
    return;
  }

  let results = _.filter(muutokset, muutos => {
    if (muutos.kohde) {
      return muutos.kohde.uuid === kohdeUuid;
    }
  });

  _.forEach(results, muutos => {
    const tyyppi =
      muutos.tila === MUUTOS_TILAT.LISAYS
        ? MUUTOS_TYPES.ADDITION
        : muutos.tila === MUUTOS_TILAT.POISTO
        ? MUUTOS_TYPES.REMOVAL
        : muutos.tila === MUUTOS_TILAT.MUUTOS
        ? MUUTOS_TYPES.CHANGE
        : null;
    _.extend(muutos, { type: tyyppi });
  });

  return results;
}

export function handleRadioChange() {}
