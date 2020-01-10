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
import { calculateValues } from "./calculate";

// TODO: Add more imports for other forms
import { getMapping as getMappingForKuljettajakoulutukset } from "./mappings/kuljettajakoulutukset";
import { getMapping as getMappingForTyovoimakoulutus } from "./mappings/tyovoimakoulutus";
import { getMapping as getMappingForVaativaerityinentuki } from "./mappings/vaativaerityinentuki";
import { getMapping as getMappingForOppisopimuskoulutus } from "./mappings/oppisopimuskoulutus";
import { getMapping as getMappingForVankilakoulutus } from "./mappings/vankilakoulutus";

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
      tyovoimakoulutus: calculateValues(
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
  perustelut_muut_02: changeObjects => {
    return {
      perusteluteksti_vaativa: calculateValues(
        getMappingForVaativaerityinentuki(),
        changeObjects
      )
    };
  },
  perustelut_muut_04: changeObjects => {
    return {
      perusteluteksti_vankila: calculateValues(
        getMappingForVankilakoulutus(),
        changeObjects
      )
    };
  }
  //, TODO: Write more definitions here and call the 'calculateValues' function with
  // mappings array and and array of change objects.
};
