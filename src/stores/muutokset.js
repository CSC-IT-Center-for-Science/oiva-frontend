import { createContainer, createHook, createStore } from "react-sweet-state";
import {
  append,
  assoc,
  assocPath,
  compose,
  concat,
  difference,
  endsWith,
  filter,
  flatten,
  head,
  isNil,
  length,
  map,
  max,
  mergeAll,
  not,
  path,
  prepend,
  propEq,
  reduce,
  reject,
  split,
  startsWith,
  values
} from "ramda";
import {
  getAnchorPart,
  getLatestChangesByAnchor,
  recursiveTreeShake
} from "utils/common";

const removeUnderRemoval = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc(
    "underRemoval",
    {},
    currentState.changeObjects
  );
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const removeUnsavedChanges = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc("unsaved", {}, currentState.changeObjects);
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const setFocusOn = anchor => ({ getState, setState }) => {
  setState(assoc("focusOn", anchor, getState()));
};

const setLatestChanges = changeObjects => ({ getState, setState }) => {
  setState(assoc("latestChanges", changeObjects, getState()));
};

const setSavedChanges = (changeObjects, anchor) => ({ getState, setState }) => {
  if (anchor) {
    setState(
      assocPath(split(".", anchor), changeObjects, getState().changeObjects)
    );
  } else {
    const nextState = assocPath(
      ["changeObjects", "saved"],
      changeObjects,
      getState()
    );
    setState(nextState);
  }
};

const Store = createStore({
  initialState: {
    changeObjects: {
      saved: {},
      unsaved: {
        opetustehtavat: [
          {
            anchor: "opetustehtavat.opetustehtava.7",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetustehtavat.opetustehtava.28",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetustehtavat.opetustehtava.16",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetustehtavat.opetustehtava.21",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetustehtavat.opetustehtava.11",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetustehtavat.lisatiedot.1",
            properties: {
              value: "Lisätietoja koskien osiota 1"
            }
          }
        ],
        toimintaalue: [
          {
            anchor: "toimintaalue.ulkomaa.200",
            properties: {
              metadata: {
                koodiarvo: "200",
                koodisto: {
                  koodistoUri: "kunta"
                },
                versio: 2,
                voimassaAlkuPvm: "1990-01-01"
              },
              isChecked: true
            }
          },
          {
            anchor: "toimintaalue.ulkomaa.200.lisatiedot",
            properties: {
              value: "Islanti",
              metadata: {
                koodiarvo: "200",
                koodisto: {
                  koodistoUri: "kunta"
                },
                versio: 2,
                voimassaAlkuPvm: "1990-01-01"
              }
            }
          },
          {
            anchor: "toimintaalue.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 2.",
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "lisatietoja"
                },
                versio: 1,
                voimassaAlkuPvm: "2020-10-11"
              }
            }
          },
          {
            anchor: "toimintaalue.categoryFilter",
            properties: {
              changesByProvince: {
                "FI-10": [
                  {
                    anchor: "areaofaction.FI-10.kunnat.047",
                    properties: {
                      metadata: {
                        koodiarvo: "047",
                        title: "Enontekiö",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.148",
                    properties: {
                      metadata: {
                        koodiarvo: "148",
                        title: "Inari",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.240",
                    properties: {
                      metadata: {
                        koodiarvo: "240",
                        title: "Kemi",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.320",
                    properties: {
                      metadata: {
                        koodiarvo: "320",
                        title: "Kemijärvi",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.241",
                    properties: {
                      metadata: {
                        koodiarvo: "241",
                        title: "Keminmaa",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.261",
                    properties: {
                      metadata: {
                        koodiarvo: "261",
                        title: "Kittilä",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.498",
                    properties: {
                      metadata: {
                        koodiarvo: "498",
                        title: "Muonio",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.583",
                    properties: {
                      metadata: {
                        koodiarvo: "583",
                        title: "Pelkosenniemi",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.854",
                    properties: {
                      metadata: {
                        koodiarvo: "854",
                        title: "Pello",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.614",
                    properties: {
                      metadata: {
                        koodiarvo: "614",
                        title: "Posio",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.683",
                    properties: {
                      metadata: {
                        koodiarvo: "683",
                        title: "Ranua",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.698",
                    properties: {
                      metadata: {
                        koodiarvo: "698",
                        title: "Rovaniemi",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.732",
                    properties: {
                      metadata: {
                        koodiarvo: "732",
                        title: "Salla",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.742",
                    properties: {
                      metadata: {
                        koodiarvo: "742",
                        title: "Savukoski",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.751",
                    properties: {
                      metadata: {
                        koodiarvo: "751",
                        title: "Simo",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.758",
                    properties: {
                      metadata: {
                        koodiarvo: "758",
                        title: "Sodankylä",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.845",
                    properties: {
                      metadata: {
                        koodiarvo: "845",
                        title: "Tervola",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.851",
                    properties: {
                      metadata: {
                        koodiarvo: "851",
                        title: "Tornio",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.890",
                    properties: {
                      metadata: {
                        koodiarvo: "890",
                        title: "Utsjoki",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.kunnat.976",
                    properties: {
                      metadata: {
                        koodiarvo: "976",
                        title: "Ylitornio",
                        maakuntaKey: "FI-10",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-10.A",
                    properties: {
                      metadata: {
                        koodiarvo: "19",
                        maakuntaKey: "FI-10",
                        title: undefined,
                        maaraysUuid: undefined
                      },
                      isChecked: true,
                      isIndeterminate: true
                    }
                  }
                ],
                "FI-15": [
                  {
                    anchor: "areaofaction.FI-15.kunnat.140",
                    properties: {
                      metadata: {
                        koodiarvo: "140",
                        title: "Iisalmi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.204",
                    properties: {
                      metadata: {
                        koodiarvo: "204",
                        title: "Kaavi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.239",
                    properties: {
                      metadata: {
                        koodiarvo: "239",
                        title: "Keitele",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.263",
                    properties: {
                      metadata: {
                        koodiarvo: "263",
                        title: "Kiuruvesi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.297",
                    properties: {
                      metadata: {
                        koodiarvo: "297",
                        title: "Kuopio",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.402",
                    properties: {
                      metadata: {
                        koodiarvo: "402",
                        title: "Lapinlahti",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.420",
                    properties: {
                      metadata: {
                        koodiarvo: "420",
                        title: "Leppävirta",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.686",
                    properties: {
                      metadata: {
                        koodiarvo: "686",
                        title: "Rautalampi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.687",
                    properties: {
                      metadata: {
                        koodiarvo: "687",
                        title: "Rautavaara",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.749",
                    properties: {
                      metadata: {
                        koodiarvo: "749",
                        title: "Siilinjärvi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.762",
                    properties: {
                      metadata: {
                        koodiarvo: "762",
                        title: "Sonkajärvi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.778",
                    properties: {
                      metadata: {
                        koodiarvo: "778",
                        title: "Suonenjoki",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.844",
                    properties: {
                      metadata: {
                        koodiarvo: "844",
                        title: "Tervo",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.857",
                    properties: {
                      metadata: {
                        koodiarvo: "857",
                        title: "Tuusniemi",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.915",
                    properties: {
                      metadata: {
                        koodiarvo: "915",
                        title: "Varkaus",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.921",
                    properties: {
                      metadata: {
                        koodiarvo: "921",
                        title: "Vesanto",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.kunnat.925",
                    properties: {
                      metadata: {
                        koodiarvo: "925",
                        title: "Vieremä",
                        maakuntaKey: "FI-15",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-15.A",
                    properties: {
                      metadata: {
                        koodiarvo: "11",
                        maakuntaKey: "FI-15",
                        title: undefined,
                        maaraysUuid: undefined
                      },
                      isChecked: true,
                      isIndeterminate: true
                    }
                  }
                ],
                "FI-06": [
                  {
                    anchor: "areaofaction.FI-06.kunnat.061",
                    properties: {
                      metadata: {
                        koodiarvo: "061",
                        title: "Forssa",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.082",
                    properties: {
                      metadata: {
                        koodiarvo: "082",
                        title: "Hattula",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.103",
                    properties: {
                      metadata: {
                        koodiarvo: "103",
                        title: "Humppila",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.109",
                    properties: {
                      metadata: {
                        koodiarvo: "109",
                        title: "Hämeenlinna",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.165",
                    properties: {
                      metadata: {
                        koodiarvo: "165",
                        title: "Janakkala",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.169",
                    properties: {
                      metadata: {
                        koodiarvo: "169",
                        title: "Jokioinen",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.433",
                    properties: {
                      metadata: {
                        koodiarvo: "433",
                        title: "Loppi",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.694",
                    properties: {
                      metadata: {
                        koodiarvo: "694",
                        title: "Riihimäki",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.834",
                    properties: {
                      metadata: {
                        koodiarvo: "834",
                        title: "Tammela",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.kunnat.981",
                    properties: {
                      metadata: {
                        koodiarvo: "981",
                        title: "Ypäjä",
                        maakuntaKey: "FI-06",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-06.A",
                    properties: {
                      metadata: {
                        koodiarvo: "05",
                        maakuntaKey: "FI-06",
                        title: undefined,
                        maaraysUuid: undefined
                      },
                      isChecked: true,
                      isIndeterminate: true
                    }
                  }
                ],
                "FI-03": [
                  {
                    anchor: "areaofaction.FI-03.kunnat.005",
                    properties: {
                      metadata: {
                        koodiarvo: "005",
                        title: "Alajärvi",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.052",
                    properties: {
                      metadata: {
                        koodiarvo: "052",
                        title: "Evijärvi",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.145",
                    properties: {
                      metadata: {
                        koodiarvo: "145",
                        title: "Ilmajoki",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.151",
                    properties: {
                      metadata: {
                        koodiarvo: "151",
                        title: "Isojoki",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.218",
                    properties: {
                      metadata: {
                        koodiarvo: "218",
                        title: "Karijoki",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.232",
                    properties: {
                      metadata: {
                        koodiarvo: "232",
                        title: "Kauhajoki",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.233",
                    properties: {
                      metadata: {
                        koodiarvo: "233",
                        title: "Kauhava",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.300",
                    properties: {
                      metadata: {
                        koodiarvo: "300",
                        title: "Kuortane",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.301",
                    properties: {
                      metadata: {
                        koodiarvo: "301",
                        title: "Kurikka",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.403",
                    properties: {
                      metadata: {
                        koodiarvo: "403",
                        title: "Lappajärvi",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.408",
                    properties: {
                      metadata: {
                        koodiarvo: "408",
                        title: "Lapua",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.743",
                    properties: {
                      metadata: {
                        koodiarvo: "743",
                        title: "Seinäjoki",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.759",
                    properties: {
                      metadata: {
                        koodiarvo: "759",
                        title: "Soini",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.846",
                    properties: {
                      metadata: {
                        koodiarvo: "846",
                        title: "Teuva",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.934",
                    properties: {
                      metadata: {
                        koodiarvo: "934",
                        title: "Vimpeli",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.kunnat.989",
                    properties: {
                      metadata: {
                        koodiarvo: "989",
                        title: "Ähtäri",
                        maakuntaKey: "FI-03",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-03.A",
                    properties: {
                      metadata: {
                        koodiarvo: "14",
                        maakuntaKey: "FI-03",
                        title: undefined,
                        maaraysUuid: undefined
                      },
                      isChecked: true,
                      isIndeterminate: true
                    }
                  }
                ],
                "FI-09": [
                  {
                    anchor: "areaofaction.FI-09.kunnat.075",
                    properties: {
                      metadata: {
                        koodiarvo: "075",
                        title: "Hamina",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.142",
                    properties: {
                      metadata: {
                        koodiarvo: "142",
                        title: "Iitti",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.285",
                    properties: {
                      metadata: {
                        koodiarvo: "285",
                        title: "Kotka",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.286",
                    properties: {
                      metadata: {
                        koodiarvo: "286",
                        title: "Kouvola",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.489",
                    properties: {
                      metadata: {
                        koodiarvo: "489",
                        title: "Miehikkälä",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.624",
                    properties: {
                      metadata: {
                        koodiarvo: "624",
                        title: "Pyhtää",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.kunnat.935",
                    properties: {
                      metadata: {
                        koodiarvo: "935",
                        title: "Virolahti",
                        maakuntaKey: "FI-09",
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  },
                  {
                    anchor: "areaofaction.FI-09.A",
                    properties: {
                      metadata: {
                        koodiarvo: "08",
                        maakuntaKey: "FI-09",
                        title: undefined,
                        maaraysUuid: undefined
                      },
                      isChecked: true
                    }
                  }
                ]
              },
              quickFilterChanges: [
                {
                  anchor: "areaofaction-radios.quick-filters.ei-alueita",
                  properties: {
                    isChecked: false,
                    metadata: {
                      koodiarvo: "FI2"
                    }
                  }
                }
              ]
            }
          }
        ],
        opetuskielet: [
          {
            anchor: "opetuskielet.opetuskieli.ensisijaiset",
            properties: {
              value: [
                {
                  label: "ruotsi",
                  value: "SV"
                },
                {
                  label: "viittomakieli",
                  value: "VK"
                },
                {
                  label: "bretoni",
                  value: "BR"
                }
              ]
            }
          },
          {
            anchor: "opetuskielet.opetuskieli.toissijaiset",
            properties: {
              value: [
                {
                  label: "saksa",
                  value: "DE"
                },
                {
                  label: "inuktitut",
                  value: "IU"
                }
              ]
            }
          },
          {
            anchor: "opetuskielet.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 3.",
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "lisatietoja"
                },
                versio: 1,
                voimassaAlkuPvm: "2020-10-11"
              }
            }
          }
        ],
        opetuksenJarjestamismuodot: [
          {
            anchor: "opetuksenJarjestamismuodot.2.valinta",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "opetuksenJarjestamismuodot.0.valinta",
            properties: {
              isChecked: false
            }
          },
          {
            anchor: "opetuksenJarjestamismuodot.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 4.",
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "lisatietoja"
                },
                versio: 1,
                voimassaAlkuPvm: "2020-10-11"
              }
            }
          }
        ],
        erityisetKoulutustehtavat: [
          {
            anchor: "erityisetKoulutustehtavat.1.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "erityisetKoulutustehtavat.2.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "erityisetKoulutustehtavat.2.0.kuvaus",
            properties: {
              value: "Jotain kuvausta"
            }
          },
          {
            anchor: "erityisetKoulutustehtavat.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 5.",
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "lisatietoja"
                },
                versio: 1,
                voimassaAlkuPvm: "2020-10-11"
              }
            }
          }
        ],
        opiskelijamaarat: [
          {
            anchor: "opiskelijamaarat.kentat.dropdown",
            properties: {
              selectedOption: "2"
            }
          },
          {
            anchor: "opiskelijamaarat.kentat.input",
            properties: {
              value: 23523523423
            }
          },
          {
            anchor: "opiskelijamaarat.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 6."
            }
          }
        ],
        muutEhdot: [
          {
            anchor: "muutEhdot.3.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "muutEhdot.5.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "muutEhdot.7.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "muutEhdot.8.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "muutEhdot.9.valintaelementti",
            properties: {
              isChecked: true
            }
          },
          {
            anchor: "muutEhdot.9.0.kuvaus",
            properties: {
              value: "Kielikylvyn kuvaus",
              metadata: {
                koodiarvo: "9"
              }
            }
          },
          {
            anchor: "muutEhdot.lisatiedot.1",
            properties: {
              value: "Lisätietoja osio 7.",
              metadata: {
                koodiarvo: "1",
                koodisto: {
                  koodistoUri: "lisatietoja"
                },
                versio: 1,
                voimassaAlkuPvm: "2020-10-11"
              }
            }
          }
        ]
      },
      underRemoval: {}
    },
    focusOn: null,
    latestChanges: {
      underRemoval: [],
      unsaved: [
        {
          anchor: "toimintaalue.ulkomaa.200",
          properties: {
            metadata: {
              koodiarvo: "200",
              koodisto: {
                koodistoUri: "kunta"
              },
              versio: 2,
              voimassaAlkuPvm: "1990-01-01"
            },
            isChecked: true
          }
        },
        {
          anchor: "toimintaalue.ulkomaa.200.lisatiedot",
          properties: {
            value: "Islanti",
            metadata: {
              koodiarvo: "200",
              koodisto: {
                koodistoUri: "kunta"
              },
              versio: 2,
              voimassaAlkuPvm: "1990-01-01"
            }
          }
        },
        {
          anchor: "toimintaalue.lisatiedot.1",
          properties: {
            value: "Lisätietoja osio 2.",
            metadata: {
              koodiarvo: "1",
              koodisto: {
                koodistoUri: "lisatietoja"
              },
              versio: 1,
              voimassaAlkuPvm: "2020-10-11"
            }
          }
        },
        {
          anchor: "toimintaalue.categoryFilter",
          properties: {
            changesByProvince: {
              "FI-10": [
                {
                  anchor: "areaofaction.FI-10.kunnat.047",
                  properties: {
                    metadata: {
                      koodiarvo: "047",
                      title: "Enontekiö",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.148",
                  properties: {
                    metadata: {
                      koodiarvo: "148",
                      title: "Inari",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.240",
                  properties: {
                    metadata: {
                      koodiarvo: "240",
                      title: "Kemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.320",
                  properties: {
                    metadata: {
                      koodiarvo: "320",
                      title: "Kemijärvi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.241",
                  properties: {
                    metadata: {
                      koodiarvo: "241",
                      title: "Keminmaa",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.261",
                  properties: {
                    metadata: {
                      koodiarvo: "261",
                      title: "Kittilä",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.498",
                  properties: {
                    metadata: {
                      koodiarvo: "498",
                      title: "Muonio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.583",
                  properties: {
                    metadata: {
                      koodiarvo: "583",
                      title: "Pelkosenniemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.854",
                  properties: {
                    metadata: {
                      koodiarvo: "854",
                      title: "Pello",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.614",
                  properties: {
                    metadata: {
                      koodiarvo: "614",
                      title: "Posio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.683",
                  properties: {
                    metadata: {
                      koodiarvo: "683",
                      title: "Ranua",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.698",
                  properties: {
                    metadata: {
                      koodiarvo: "698",
                      title: "Rovaniemi",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.732",
                  properties: {
                    metadata: {
                      koodiarvo: "732",
                      title: "Salla",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.742",
                  properties: {
                    metadata: {
                      koodiarvo: "742",
                      title: "Savukoski",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.751",
                  properties: {
                    metadata: {
                      koodiarvo: "751",
                      title: "Simo",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.758",
                  properties: {
                    metadata: {
                      koodiarvo: "758",
                      title: "Sodankylä",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.845",
                  properties: {
                    metadata: {
                      koodiarvo: "845",
                      title: "Tervola",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.851",
                  properties: {
                    metadata: {
                      koodiarvo: "851",
                      title: "Tornio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.890",
                  properties: {
                    metadata: {
                      koodiarvo: "890",
                      title: "Utsjoki",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.kunnat.976",
                  properties: {
                    metadata: {
                      koodiarvo: "976",
                      title: "Ylitornio",
                      maakuntaKey: "FI-10",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-10.A",
                  properties: {
                    metadata: {
                      koodiarvo: "19",
                      maakuntaKey: "FI-10",
                      title: undefined,
                      maaraysUuid: undefined
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                }
              ],
              "FI-15": [
                {
                  anchor: "areaofaction.FI-15.kunnat.140",
                  properties: {
                    metadata: {
                      koodiarvo: "140",
                      title: "Iisalmi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.204",
                  properties: {
                    metadata: {
                      koodiarvo: "204",
                      title: "Kaavi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.239",
                  properties: {
                    metadata: {
                      koodiarvo: "239",
                      title: "Keitele",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.263",
                  properties: {
                    metadata: {
                      koodiarvo: "263",
                      title: "Kiuruvesi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.297",
                  properties: {
                    metadata: {
                      koodiarvo: "297",
                      title: "Kuopio",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.402",
                  properties: {
                    metadata: {
                      koodiarvo: "402",
                      title: "Lapinlahti",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.420",
                  properties: {
                    metadata: {
                      koodiarvo: "420",
                      title: "Leppävirta",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.686",
                  properties: {
                    metadata: {
                      koodiarvo: "686",
                      title: "Rautalampi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.687",
                  properties: {
                    metadata: {
                      koodiarvo: "687",
                      title: "Rautavaara",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.749",
                  properties: {
                    metadata: {
                      koodiarvo: "749",
                      title: "Siilinjärvi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.762",
                  properties: {
                    metadata: {
                      koodiarvo: "762",
                      title: "Sonkajärvi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.778",
                  properties: {
                    metadata: {
                      koodiarvo: "778",
                      title: "Suonenjoki",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.844",
                  properties: {
                    metadata: {
                      koodiarvo: "844",
                      title: "Tervo",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.857",
                  properties: {
                    metadata: {
                      koodiarvo: "857",
                      title: "Tuusniemi",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.915",
                  properties: {
                    metadata: {
                      koodiarvo: "915",
                      title: "Varkaus",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.921",
                  properties: {
                    metadata: {
                      koodiarvo: "921",
                      title: "Vesanto",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.kunnat.925",
                  properties: {
                    metadata: {
                      koodiarvo: "925",
                      title: "Vieremä",
                      maakuntaKey: "FI-15",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-15.A",
                  properties: {
                    metadata: {
                      koodiarvo: "11",
                      maakuntaKey: "FI-15",
                      title: undefined,
                      maaraysUuid: undefined
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                }
              ],
              "FI-06": [
                {
                  anchor: "areaofaction.FI-06.kunnat.061",
                  properties: {
                    metadata: {
                      koodiarvo: "061",
                      title: "Forssa",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.082",
                  properties: {
                    metadata: {
                      koodiarvo: "082",
                      title: "Hattula",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.103",
                  properties: {
                    metadata: {
                      koodiarvo: "103",
                      title: "Humppila",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.109",
                  properties: {
                    metadata: {
                      koodiarvo: "109",
                      title: "Hämeenlinna",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.165",
                  properties: {
                    metadata: {
                      koodiarvo: "165",
                      title: "Janakkala",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.169",
                  properties: {
                    metadata: {
                      koodiarvo: "169",
                      title: "Jokioinen",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.433",
                  properties: {
                    metadata: {
                      koodiarvo: "433",
                      title: "Loppi",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.694",
                  properties: {
                    metadata: {
                      koodiarvo: "694",
                      title: "Riihimäki",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.834",
                  properties: {
                    metadata: {
                      koodiarvo: "834",
                      title: "Tammela",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.kunnat.981",
                  properties: {
                    metadata: {
                      koodiarvo: "981",
                      title: "Ypäjä",
                      maakuntaKey: "FI-06",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-06.A",
                  properties: {
                    metadata: {
                      koodiarvo: "05",
                      maakuntaKey: "FI-06",
                      title: undefined,
                      maaraysUuid: undefined
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                }
              ],
              "FI-03": [
                {
                  anchor: "areaofaction.FI-03.kunnat.005",
                  properties: {
                    metadata: {
                      koodiarvo: "005",
                      title: "Alajärvi",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.052",
                  properties: {
                    metadata: {
                      koodiarvo: "052",
                      title: "Evijärvi",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.145",
                  properties: {
                    metadata: {
                      koodiarvo: "145",
                      title: "Ilmajoki",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.151",
                  properties: {
                    metadata: {
                      koodiarvo: "151",
                      title: "Isojoki",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.218",
                  properties: {
                    metadata: {
                      koodiarvo: "218",
                      title: "Karijoki",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.232",
                  properties: {
                    metadata: {
                      koodiarvo: "232",
                      title: "Kauhajoki",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.233",
                  properties: {
                    metadata: {
                      koodiarvo: "233",
                      title: "Kauhava",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.300",
                  properties: {
                    metadata: {
                      koodiarvo: "300",
                      title: "Kuortane",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.301",
                  properties: {
                    metadata: {
                      koodiarvo: "301",
                      title: "Kurikka",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.403",
                  properties: {
                    metadata: {
                      koodiarvo: "403",
                      title: "Lappajärvi",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.408",
                  properties: {
                    metadata: {
                      koodiarvo: "408",
                      title: "Lapua",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.743",
                  properties: {
                    metadata: {
                      koodiarvo: "743",
                      title: "Seinäjoki",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.759",
                  properties: {
                    metadata: {
                      koodiarvo: "759",
                      title: "Soini",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.846",
                  properties: {
                    metadata: {
                      koodiarvo: "846",
                      title: "Teuva",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.934",
                  properties: {
                    metadata: {
                      koodiarvo: "934",
                      title: "Vimpeli",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.kunnat.989",
                  properties: {
                    metadata: {
                      koodiarvo: "989",
                      title: "Ähtäri",
                      maakuntaKey: "FI-03",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-03.A",
                  properties: {
                    metadata: {
                      koodiarvo: "14",
                      maakuntaKey: "FI-03",
                      title: undefined,
                      maaraysUuid: undefined
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                }
              ],
              "FI-09": [
                {
                  anchor: "areaofaction.FI-09.kunnat.075",
                  properties: {
                    metadata: {
                      koodiarvo: "075",
                      title: "Hamina",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.142",
                  properties: {
                    metadata: {
                      koodiarvo: "142",
                      title: "Iitti",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.285",
                  properties: {
                    metadata: {
                      koodiarvo: "285",
                      title: "Kotka",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.286",
                  properties: {
                    metadata: {
                      koodiarvo: "286",
                      title: "Kouvola",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.489",
                  properties: {
                    metadata: {
                      koodiarvo: "489",
                      title: "Miehikkälä",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.624",
                  properties: {
                    metadata: {
                      koodiarvo: "624",
                      title: "Pyhtää",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.kunnat.935",
                  properties: {
                    metadata: {
                      koodiarvo: "935",
                      title: "Virolahti",
                      maakuntaKey: "FI-09",
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-09.A",
                  properties: {
                    metadata: {
                      koodiarvo: "08",
                      maakuntaKey: "FI-09",
                      title: undefined,
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                }
              ]
            },
            quickFilterChanges: [
              {
                anchor: "areaofaction-radios.quick-filters.ei-alueita",
                properties: {
                  isChecked: false,
                  metadata: {
                    koodiarvo: "FI2"
                  }
                }
              }
            ]
          }
        }
      ]
    }
  },
  actions: {
    /**
     * -------------------- CRITERIONS OF LIMITATIONS --------------------
     */
    addCriterion: (sectionId, rajoiteId) => ({ getState, setState }) => {
      const currentChangeObjects = getState().changeObjects;
      const rajoitekriteeritChangeObjects = filter(
        changeObj =>
          startsWith(`${sectionId}.${rajoiteId}.asetukset`, changeObj.anchor) &&
          !startsWith(
            `${sectionId}.${rajoiteId}.asetukset.kohde`,
            changeObj.anchor
          ),
        concat(
          currentChangeObjects.unsaved[sectionId] || [],
          currentChangeObjects.saved[sectionId] || []
        ) || []
      );

      /**
       * Etsitään suurin käytössä oleva kriteerin numero ja muodostetaan seuraava
       * numero lisäämällä lukuun yksi.
       */
      const nextCriterionAnchorPart =
        length(rajoitekriteeritChangeObjects) > 0
          ? reduce(
              max,
              -Infinity,
              map(changeObj => {
                return parseInt(getAnchorPart(changeObj.anchor, 3), 10);
              }, rajoitekriteeritChangeObjects)
            ) + 1
          : 1;

      /**
       * Luodaan
       */
      const nextChangeObjects = assocPath(
        ["unsaved", sectionId],
        append(
          {
            anchor: `${sectionId}.${rajoiteId}.asetukset.${nextCriterionAnchorPart}.kohde.A`,
            properties: {
              value: ""
            }
          },
          currentChangeObjects.unsaved[sectionId] || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
    closeRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: false });
    },
    /**
     * -------------------- DYNAMIC TEXTBOXES --------------------
     */
    createTextBoxChangeObject: (sectionId, koodiarvo) => ({
      getState,
      dispatch,
      setState
    }) => {
      if (sectionId) {
        const splittedSectionId = split("_", sectionId);
        const currentChangeObjects = getState().changeObjects;
        const textBoxChangeObjects = filter(
          changeObj =>
            startsWith(`${sectionId}.${koodiarvo}`, changeObj.anchor) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(`${sectionId}.${koodiarvo}.0`, changeObj.anchor),
          concat(
            currentChangeObjects.unsaved[sectionId] || [],
            currentChangeObjects.saved[sectionId] || []
          ) || []
        );

        const textBoxNumber =
          length(textBoxChangeObjects) > 0
            ? reduce(
                max,
                -Infinity,
                map(changeObj => {
                  return parseInt(getAnchorPart(changeObj.anchor, 2), 10);
                }, textBoxChangeObjects)
              ) + 1
            : 1;

        /**
         * Luodaan uusi muutosobjekti ja annetaan sille focus-ominaisuus,
         * jotta muutosobjektin pohjalta lomakepalvelun puolella luotava
         * kenttä olisi automaattisesti fokusoitu.
         */
        const anchorOfTextBoxChangeObj = `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`;
        let nextChangeObjects = assocPath(
          prepend("unsaved", splittedSectionId),
          append(
            {
              anchor: `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`,
              properties: {
                value: ""
              }
            },
            path(splittedSectionId, currentChangeObjects.unsaved) || []
          ),
          currentChangeObjects
        );
        dispatch(setFocusOn(anchorOfTextBoxChangeObj));
        setState({ ...getState(), changeObjects: nextChangeObjects });
      }
    },
    initializeChanges: changeObjects => ({ dispatch }) => {
      dispatch(setSavedChanges(changeObjects));
      dispatch(setLatestChanges({}));
      dispatch(removeUnderRemoval());
      dispatch(removeUnsavedChanges());
    },
    removeChangeObjectByAnchor: anchor => ({ getState, setState }) => {
      const allCurrentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", getAnchorPart(anchor, 0));
      const unsavedFullPath = prepend("unsaved", anchorParts);
      const changeObjects = path(unsavedFullPath, allCurrentChangeObjects);
      if (changeObjects) {
        let nextChangeObjects = assocPath(
          unsavedFullPath,
          filter(compose(not, propEq("anchor", anchor)), changeObjects),
          getState().changeObjects
        );
        nextChangeObjects = recursiveTreeShake(
          unsavedFullPath,
          nextChangeObjects
        );
        setState(assoc("changeObjects", nextChangeObjects, getState()));
      }
    },
    setChanges: (changeObjects, anchor = "") => ({
      getState,
      dispatch,
      setState
    }) => {
      const currentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", anchor);

      const unsavedFullPath = prepend("unsaved", anchorParts).filter(Boolean);
      const savedFullPath = prepend("saved", anchorParts).filter(Boolean);
      const underRemovalFullPath = prepend("underRemoval", anchorParts).filter(
        Boolean
      );

      const savedByAnchor = path(savedFullPath, getState().changeObjects) || [];
      const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
      const savedChangeObjects = difference(savedByAnchor, changeObjects);

      /**
       * Etsitään ankkuria käyttäen vastaavat underRemoval-tilassa olevat
       * muutokset.
       */
      const underRemovalByAnchor =
        path(underRemovalFullPath, getState().changeObjects) || [];

      /**
       * Etsitään löydetyistä muutosobjekteista ne, joita vastaavia muutos-
       * objekteja ollaan tallentamassa.
       */
      const freshNewChangeObjects = difference(
        unsavedChangeObjects,
        underRemovalByAnchor
      );

      let nextChangeObjects = assocPath(
        unsavedFullPath,
        freshNewChangeObjects,
        currentChangeObjects
      );

      nextChangeObjects = assocPath(
        underRemovalFullPath,
        savedChangeObjects,
        nextChangeObjects
      );

      /**
       * Ravistetaan muutosten puusta tyhjät objektit pois.
       **/
      nextChangeObjects = recursiveTreeShake(
        unsavedFullPath,
        nextChangeObjects,
        dispatch
      );
      nextChangeObjects = recursiveTreeShake(
        underRemovalFullPath,
        nextChangeObjects,
        dispatch
      );

      const focusWhenDeleted = head(
        map(changeObj => {
          const anchor = path(
            ["properties", "metadata", "focusWhenDeleted"],
            changeObj
          );
          return changeObj.properties.deleteElement && anchor ? anchor : null;
        }, changeObjects).filter(Boolean)
      );

      if (focusWhenDeleted) {
        dispatch(setFocusOn(focusWhenDeleted));
      }

      dispatch(
        setLatestChanges({
          underRemoval: savedChangeObjects,
          unsaved: freshNewChangeObjects
        })
      );
      setState(assoc("changeObjects", nextChangeObjects, getState()));
    },
    setFocusOn: anchor => ({ dispatch }) => {
      dispatch(setFocusOn(anchor));
    },
    showNewRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: true });
    }
  },
  name: "Muutokset"
});

const getChangeObjectsByKeyAndAnchor = (key, anchor, changeObjects = {}) => {
  return path(prepend(key, split("_", anchor)), changeObjects) || [];
};

const getAllChangeObjectsByKeyAnchor = (state, { anchor }) => {
  const { changeObjects } = state;
  return {
    saved: getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects),
    underRemoval: getChangeObjectsByKeyAndAnchor(
      "underRemoval",
      anchor,
      changeObjects
    ),
    unsaved: getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects)
  };
};

const getChangeObjectsByAnchorWithoutUnderRemoval = (state, { anchor }) => {
  const { changeObjects } = state;
  const saved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects))
    )
  );
  const underRemoval = reject(
    isNil,
    flatten(
      values(
        getChangeObjectsByKeyAndAnchor("underRemoval", anchor, changeObjects)
      )
    )
  );
  const unsaved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects))
    )
  );
  return difference(concat(saved, unsaved), underRemoval);
};

const getLatestChangesByAnchorByKey = (state, { anchor }) => {
  const { latestChanges } = state;
  return {
    underRemoval: getLatestChangesByAnchor(anchor, latestChanges.underRemoval),
    unsaved: getLatestChangesByAnchor(anchor, latestChanges.unsaved)
  };
};

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useLatestChangesByAnchor = createHook(Store, {
  selector: getLatestChangesByAnchorByKey
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getAllChangeObjectsByKeyAnchor
});

export const useChangeObjectsByAnchorWithoutUnderRemoval = createHook(Store, {
  selector: getChangeObjectsByAnchorWithoutUnderRemoval
});

export const useChangeObjectsByMultipleAnchorsWithoutUnderRemoval = createHook(
  Store,
  {
    selector: (state, { anchors }) => {
      return mergeAll(
        map(anchor => {
          return {
            [anchor]: getChangeObjectsByAnchorWithoutUnderRemoval(state, {
              anchor
            })
          };
        }, anchors)
      );
    }
  }
);

export const useChangeObjects = createHook(Store);

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const useUnderRemovalChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.underRemoval
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
