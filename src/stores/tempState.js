export default {
  isRestrictionDialogVisible: true,
  changeObjects: {
    opetustehtavat: [
      {
        anchor: "opetustehtavat.opetustehtava.6",
        properties: {
          isChecked: true
        }
      },
      {
        anchor: "opetustehtavat.opetustehtava.10",
        properties: {
          isChecked: true
        }
      }
    ],
    toimintaalue: [
      {
        anchor: "categoryFilter",
        properties: {
          changesByProvince: {
            "FI-05": [
              {
                anchor: "areaofaction.FI-05.kunnat.105",
                properties: {
                  metadata: {
                    koodiarvo: "105",
                    title: "Hyrynsalmi",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.205",
                properties: {
                  metadata: {
                    koodiarvo: "205",
                    title: "Kajaani",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.290",
                properties: {
                  metadata: {
                    koodiarvo: "290",
                    title: "Kuhmo",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.578",
                properties: {
                  metadata: {
                    koodiarvo: "578",
                    title: "Paltamo",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.620",
                properties: {
                  metadata: {
                    koodiarvo: "620",
                    title: "Puolanka",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.697",
                properties: {
                  metadata: {
                    koodiarvo: "697",
                    title: "Ristijärvi",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.765",
                properties: {
                  metadata: {
                    koodiarvo: "765",
                    title: "Sotkamo",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.kunnat.777",
                properties: {
                  metadata: {
                    koodiarvo: "777",
                    title: "Suomussalmi",
                    maakuntaKey: "FI-05",
                    maaraysUuid: undefined
                  },
                  isChecked: true
                }
              },
              {
                anchor: "areaofaction.FI-05.A",
                properties: {
                  metadata: {
                    koodiarvo: "18",
                    maakuntaKey: "FI-05",
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
    rajoitelomake: [
      {
        anchor: "rajoitelomake.eka.asetukset.0.kohde.A",
        properties: {
          value: {
            label: "2. Kunnat, joissa opetusta järjestetään",
            value: "opetustaAntavatKunnat"
          }
        }
      },
      {
        anchor: "rajoitelomake.eka.asetukset.0.rajoitus.opetustaAntavatKunnat",
        properties: {
          value: [
            {
              label: "Kuhmo",
              value: "290"
            },
            {
              label: "Sotkamo",
              value: "765"
            },
            {
              label: "Suomussalmi",
              value: "777"
            }
          ]
        }
      },
      {
        anchor: "rajoitelomake.eka.asetukset.1.kohde.A",
        properties: {
          value: {
            label: "1. Opetus, jota lupa koskee",
            value: "opetustehtavat"
          }
        }
      },
      {
        anchor: "rajoitelomake.eka.asetukset.2.kohde.A",
        properties: {
          value: {
            label: "Määräaika",
            value: "maaraaika"
          }
        }
      },
      {
        anchor: "rajoitelomake.eka.asetukset.2.rajoitus.paattymispaiva",
        properties: {
          value: new Date(1604048400000)
        }
      }
    ]
  }
};
