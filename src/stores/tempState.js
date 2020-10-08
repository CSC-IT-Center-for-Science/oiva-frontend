export default {
  isRestrictionDialogVisible: true,
  changeObjects: {
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
        anchor: "rajoitelomake.eka.kohteenValinta.valintaelementti",
        properties: {
          value: {
            label: "2. Kunnat, joissa opetusta järjestetään",
            value: "opetustaAntavatKunnat"
          }
        }
      },
      {
        anchor: "rajoitelomake.eka.opetustaAntavatKunnat.autocomplete",
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
        anchor: "rajoitelomake.eka.kriteerit.kriteeri0.valintaelementti",
        properties: {
          value: {
            label: "Määräaika",
            value: "maaraaika"
          }
        }
      },
      {
        anchor: "rajoitelomake.eka.kriteerit.kriteeri1.valintaelementti",
        properties: {
          value: {
            label: "Määräaika",
            value: "maaraaika"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.eka.kriteerit.kriteeri0.valintaelementti.autocomplete",
        properties: {
          value: {
            label: "Määräaika",
            value: "maaraaika"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.eka.kriteerit.kriteeri0.maaraaika.alkamispaiva",
        properties: {
          value: new Date(1602230400000)
        }
      },
      {
        anchor:
          "rajoitelomake.eka.kriteerit.kriteeri1.valintaelementti.autocomplete",
        properties: {
          value: {
            label: "Määräaika",
            value: "maaraaika"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.eka.kriteerit.kriteeri1.maaraaika.paattymispaiva",
        properties: {
          value: new Date(1604048400000)
        }
      }
    ]
  }
};
