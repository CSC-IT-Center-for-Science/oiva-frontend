import { epaonnistui as tallennusEpaonnistui } from "./procedures/muutospyynto/tallennus/epaonnistui";
import { onnistui as tallennusOnnistui } from "./procedures/muutospyynto/tallennus/onnistui";
import { tallenna as tallennaMuutospyynto } from "./procedures/muutospyynto/tallennus/tallenna";
import { epaonnistui as lahetysEpaonnistui } from "./procedures/muutospyynto/lahetys/epaonnistui";
import { onnistui as lahetysOnnistui } from "./procedures/muutospyynto/lahetys/onnistui";
import { laheta as lahetaMuutospyynto } from "./procedures/muutospyynto/lahetys/laheta";
import { eiAvaudu as esikatseluEiAvaudu } from "./procedures/muutospyynto/esikatselu/eiAvaudu";
import { latauspolku as esikatselunLatauspolku } from "./procedures/muutospyynto/esikatselu/latauspolku";
import { onKatsottavissa as esikatseluOnKatsottavissa } from "./procedures/muutospyynto/esikatselu/onKatsottavissa";
import { listaus as muutospyyntojenListaus } from "./procedures/muutospyynnot/listaus";
import { poista as poistaWizardinMuutokset } from "./procedures/muutospyynto/muutokset/poista";
import { tallennaEsittelijanToimesta } from "./procedures/muutospyynto/tallennus/tallennaEsittelijanToimesta";

export const procedures = {
  muutospyynnot: {
    listaus: muutospyyntojenListaus
  },
  muutospyynto: {
    esikatselu: {
      eiAvaudu: esikatseluEiAvaudu,
      latauspolku: esikatselunLatauspolku,
      onKatsottavissa: esikatseluOnKatsottavissa
    },
    lahetys: {
      epaonnistui: lahetysEpaonnistui,
      laheta: lahetaMuutospyynto,
      onnistui: lahetysOnnistui
    },
    muutokset: {
      poista: poistaWizardinMuutokset
    },
    tallennus: {
      epaonnistui: tallennusEpaonnistui,
      onnistui: tallennusOnnistui,
      tallenna: tallennaMuutospyynto,
      tallennaEsittelijanToimesta
    }
  }
};
