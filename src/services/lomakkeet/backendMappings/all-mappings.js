/**
 * This file should include all mapping configuration that is needed for
 * backend's PDF templates. It gathers all the mappings into an object
 * called named as 'perustelut'.
 *
 * Steps to add more mappings:
 *
 * 1) Create a new file into mappings folder. Name it freely. In most cases there will be
 * one file for per form but same mapping can be used for multiple forms if it's created
 * using one or more parameters. See: kuljettajakoulutukset.js for an example.
 * 2) Create a function named as getMapping into the file you just created. Write your
 * mappings there.
 * 2) Import the mapping here and alialize it using 'as' keyword.
 */
import { calculateValues, calculateValuesAsArray } from "./calculate";

// TODO: Add more imports for other forms
import { getMapping as getMappingForKuljettajakoulutukset } from "./mappings/kuljettajakoulutukset";
import { getMapping as getMappingForTyovoimakoulutus } from "./mappings/tyovoimakoulutus";
import { getMapping as getMappingForVaativaerityinentuki } from "./mappings/vaativaerityinentuki";
import { getMapping as getMappingForOppisopimuskoulutus } from "./mappings/oppisopimuskoulutus";
import { getMapping as getMappingForVankilakoulutus } from "./mappings/vankilakoulutus";
import { getMapping as getMappingForTutkinnot } from "./mappings/tutkinnot";
import { getMapping as getMappingForOpiskeluvuodet } from "./mappings/opiskeluvuodet";
import { path } from "ramda";

export const perustelut = {
  /**
   * Key here is the first part of anchor of a change object. At the following
   * case 'perustelut_koulutukset_kuljettajakoulutukset' matches to two forms
   * (kuljettajien peruskoulutuslomake ja kuljettajien jatkokoulutuslomake).
   **/
  perustelut_koulutukset_kuljettajakoulutukset: (changeObjects, koodiarvo) => {
    // Return value differs depending on the form.
    return {
      perusteluteksti_kuljetus: calculateValues(
        getMappingForKuljettajakoulutukset(koodiarvo),
        changeObjects
      )
    };
  },
  perustelut_koulutukset_tyovoimakoulutukset: (changeObjects, koodiarvo) => {
    return {
      perusteluteksti_tyovoimakoulutus: calculateValues(
        getMappingForTyovoimakoulutus(koodiarvo),
        changeObjects
      )
    };
  },
  perustelut_muut_01: changeObjects => {
    return {
      perusteluteksti_oppisopimus: calculateValues(
        getMappingForOppisopimuskoulutus(),
        changeObjects
      )
    };
  },
  perustelut_muut_02: (changeObjects, koodiarvo) => {
    return {
      perusteluteksti_vaativa: calculateValues(
        getMappingForVaativaerityinentuki(koodiarvo),
        changeObjects
      )
    };
  },
  perustelut_muut_04: changeObjects => {
    const perustelut =
      changeObjects.length === 1
        ? {
            perusteluteksti: [
              { value: path(["properties", "value"], changeObjects[0]) }
            ]
          }
        : {
            perusteluteksti_vankila: calculateValues(
              getMappingForVankilakoulutus(),
              changeObjects
            )
          };
    return perustelut;
  },
  perustelut_tutkinnot_01: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_02: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_03: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_04: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_05: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_06: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_07: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_08: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_09: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_tutkinnot_10: (changeObjects, anchor) => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForTutkinnot(anchor),
        changeObjects
      )
    };
  },
  perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet: changeObjects => {
    return {
      perusteluteksti: calculateValuesAsArray(
        getMappingForOpiskeluvuodet(),
        changeObjects
      )
    };
  }
  //, TODO: Write more definitions here and call the 'calculateValues' (Or calculateValuesAsArray') function with
  // mappings array and and array of change objects.
};
