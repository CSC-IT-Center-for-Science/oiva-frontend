import { epaonnistui as tallennusEpaonnistui } from "./procedures/muutospyynto/tallennus/epaonnistui";
import { onnistui as tallennusOnnistui } from "./procedures/muutospyynto/tallennus/onnistui";
import { tallenna as tallennaMuutospyynto } from "./procedures/muutospyynto/tallennus/tallenna";
import { epaonnistui as lahetysEpaonnistui } from "./procedures/muutospyynto/lahetys/epaonnistui";
import { onnistui as lahetysOnnistui } from "./procedures/muutospyynto/lahetys/onnistui";
import { laheta as lahetaMuutospyynto } from "./procedures/muutospyynto/lahetys/laheta";
import { polkuvirhe as eiEsikatselupolkua } from "./procedures/muutospyynto/esikatselu/polkuvirhe";
import { latauspolku as esikatselunLatauspolku } from "./procedures/muutospyynto/esikatselu/latauspolku";
import { polkuOK as esikatselupolkuOK } from "./procedures/muutospyynto/esikatselu/polkuOK";
import { listaus as muutospyyntojenListaus } from "./procedures/muutospyynnot/listaus";
import { poista as poistaWizardinMuutokset } from "./procedures/muutospyynto/muutokset/poista";
import { poista as poistaMuutospyynto } from "./procedures/muutospyynnot/poisto/poista";
import { epaonnistui as muutospyynnonPoistoEpaonnistui } from "./procedures/muutospyynnot/poisto/epaonnistui";
import { onnistui as muutospyynnonPoistoOnnistui } from "./procedures/muutospyynnot/poisto/onnistui";
import { epaonnistui as muutospyynnonVieminenEsittelyssaTilaanEpaonnistui } from "./procedures/muutospyynnot/tilanmuutos/epaonnistui";
import { onnistui as muutospyynnonVieminenEsittelyssaTilaanOnnistui } from "./procedures/muutospyynnot/tilanmuutos/onnistui";
import { esittelyyn as muutaMuutospyynnonTilaksiEsittelyssa } from "./procedures/muutospyynnot/tilanmuutos/esittelyyn";
import { paatetyksi as muutaMuutospyynnonTilaksiPaatetty } from "./procedures/muutospyynnot/tilanmuutos/paatetyksi";
import { valmisteluun as muutaMuutospyynnonTilaksiValmistelussa } from "./procedures/muutospyynnot/tilanmuutos/valmisteluun";
import { tallennaEsittelijanToimesta } from "./procedures/muutospyynto/tallennus/tallennaEsittelijanToimesta";
import { download as lataaMuutospyynto } from "./procedures/muutospyynto/lataaminen/download";
import { downloadAndShow as lataaJaNaytaMuutospyynto } from "./procedures/muutospyynto/lataaminen/downloadAndShow";
import { epaonnistui as muutospyynnonLataaminenEpaonnistui } from "./procedures/muutospyynto/lataaminen/epaonnistui";
import { onnistui as muutospyynnonLataaminenOnnistui } from "./procedures/muutospyynto/lataaminen/onnistui";
import { onnistuiNew as muutospyynnonLataaminenOnnistuiNew } from "./procedures/muutospyynto/lataaminen/onnistuiNew";
import { luvanLatauspolku } from "./procedures/muutospyynto/esikatselu/luvanLatauspolku";
import { tarkistaDuplikaattiAsianumero } from "./procedures/muutospyynto/muutokset/tarkistaDuplikaattiAsianumero"
import {asianumeroOnJoKaytossa} from "./procedures/muutospyynto/muutokset/asianumeroOnJoKaytossa";

export const procedures = {
  muutospyynnot: {
    listaus: muutospyyntojenListaus,
    poisto: {
      epaonnistui: muutospyynnonPoistoEpaonnistui,
      onnistui: muutospyynnonPoistoOnnistui,
      poista: poistaMuutospyynto
    },
    tilanmuutos: {
      epaonnistui: muutospyynnonVieminenEsittelyssaTilaanEpaonnistui,
      esittelyyn: muutaMuutospyynnonTilaksiEsittelyssa,
      onnistui: muutospyynnonVieminenEsittelyssaTilaanOnnistui,
      paatetyksi: muutaMuutospyynnonTilaksiPaatetty,
      valmisteluun: muutaMuutospyynnonTilaksiValmistelussa
    }
  },
  muutospyynto: {
    esittelijanEsikatselu: {
      latauspolku: luvanLatauspolku,
      polkuOK: esikatselupolkuOK,
      polkuvirhe: eiEsikatselupolkua
    },
    esikatselu: {
      latauspolku: esikatselunLatauspolku,
      polkuOK: esikatselupolkuOK,
      polkuvirhe: eiEsikatselupolkua
    },
    lahetys: {
      epaonnistui: lahetysEpaonnistui,
      laheta: lahetaMuutospyynto,
      onnistui: lahetysOnnistui
    },
    lataaminen: {
      download: lataaMuutospyynto,
      downloadAndShow: lataaJaNaytaMuutospyynto,
      epaonnistui: muutospyynnonLataaminenEpaonnistui,
      onnistui: muutospyynnonLataaminenOnnistui,
      onnistuiNew: muutospyynnonLataaminenOnnistuiNew
    },
    muutokset: {
      tarkistaDuplikaattiAsianumero: tarkistaDuplikaattiAsianumero,
      poista: poistaWizardinMuutokset,
      asianumeroOnJoKaytossa: asianumeroOnJoKaytossa,
    },
    tallennus: {
      epaonnistui: tallennusEpaonnistui,
      onnistui: tallennusOnnistui,
      tallenna: tallennaMuutospyynto,
      tallennaEsittelijanToimesta
    }
  }
};
