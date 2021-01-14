export const muutokset = {
  changeObjects: {
    saved: {
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
            value: "Kieliä ja kulttuuria kuvaus 1",
            metadata: {
              ankkuri: "0",
              koodiarvo: "2"
            }
          }
        },
        {
          anchor: "erityisetKoulutustehtavat.2.1.kuvaus",
          properties: {
            value: "Kieliä ja kulttuuria kuvaus 2",
            metadata: {
              ankkuri: "1",
              koodiarvo: "2",
              focusWhenDeleted: "erityisetKoulutustehtavat.2.0.kuvaus"
            }
          }
        }
      ],
      muutEhdot: [
        {
          anchor: "muutEhdot.1.valintaelementti",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "muutEhdot.10.valintaelementti",
          properties: {
            isChecked: true
          }
        }
      ],
      opetuksenJarjestamismuodot: [
        {
          anchor: "opetuksenJarjestamismuodot.1.valinta",
          properties: {
            metadata: {
              koodiarvo: "1"
            },
            isChecked: true
          }
        },
        {
          anchor: "opetuksenJarjestamismuodot.0.valinta",
          properties: {
            isChecked: false
          }
        }
      ],
      opetustehtavat: [
        {
          anchor: "opetustehtavat.opetustehtava.8",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.5",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.26",
          properties: {
            isChecked: true
          }
        }
      ],
      rajoitteet: [
        {
          anchor:
            "rajoitteet.0861b32f-2f32-4894-a62c-e033fab22f9f.kohdennukset.0.rajoite.kohde.valikko",
          properties: {
            value: {
              label: "Opetus, jota lupa koskee",
              value: "opetustehtavat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.0861b32f-2f32-4894-a62c-e033fab22f9f.kohdennukset.0.rajoite.kohde.tarkennin.opetustehtavat",
          properties: {
            value: {
              label: "erityisopetus",
              value: "5"
            },
            metadata: {
              section: "getOpetustehtavatLomake"
            }
          }
        },
        {
          anchor:
            "rajoitteet.0861b32f-2f32-4894-a62c-e033fab22f9f.kohdennukset.0.rajoite.asetukset.0.kohde",
          properties: {
            value: {
              label: "Opetuskieli",
              value: "opetuskielet"
            }
          }
        },
        {
          anchor:
            "rajoitteet.0861b32f-2f32-4894-a62c-e033fab22f9f.kohdennukset.0.rajoite.asetukset.0.tarkennin.opetuskielet",
          properties: {
            value: {
              label: "englanti",
              value: "EN"
            },
            metadata: {
              section: "opetuskielet"
            }
          }
        },
        {
          anchor:
            "rajoitteet.fe3a24e6-65b4-4cf1-969d-c41013ba34f3.kohdennukset.0.rajoite.kohde.valikko",
          properties: {
            value: {
              label: "Kunnat, joissa opetusta järjestetään",
              value: "toimintaalue"
            }
          }
        },
        {
          anchor:
            "rajoitteet.fe3a24e6-65b4-4cf1-969d-c41013ba34f3.kohdennukset.0.rajoite.kohde.tarkennin.opetustaAntavatKunnat",
          properties: {
            value: {
              label: "Alavieska",
              value: "009"
            },
            metadata: {
              section: "opetustaAntavatKunnat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.fe3a24e6-65b4-4cf1-969d-c41013ba34f3.kohdennukset.0.rajoite.asetukset.0.kohde",
          properties: {
            value: {
              label: "Opetus, jota lupa koskee",
              value: "opetustehtavat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.fe3a24e6-65b4-4cf1-969d-c41013ba34f3.kohdennukset.0.rajoite.asetukset.0.tarkennin.opetustehtavat",
          properties: {
            value: {
              label: "joustava perusopetus (JOPO)",
              value: "8"
            },
            metadata: {
              section: "getOpetustehtavatLomake"
            }
          }
        }
      ],
      opetuskielet: [
        {
          anchor: "opetuskielet.opetuskieli.ensisijaiset",
          properties: {
            value: [
              {
                label: "saame",
                value: "SE"
              },
              {
                label: "viittomakieli",
                value: "VK"
              },
              {
                label: "afrikaans",
                value: "AF"
              }
            ],
            metadata: {
              valikko: "ensisijaiset"
            }
          }
        },
        {
          anchor: "opetuskielet.opetuskieli.toissijaiset",
          properties: {
            value: [
              {
                label: "englanti",
                value: "EN"
              },
              {
                label: "aimara",
                value: "AY"
              }
            ],
            metadata: {
              valikko: "toissijaiset"
            }
          }
        }
      ],
      toimintaalue: [
        {
          anchor: "toimintaalue.categoryFilter",
          properties: {
            changesByProvince: {
              "FI-08": [
                {
                  anchor: "areaofaction.FI-08.kunnat.249",
                  properties: {
                    metadata: {
                      title: "Keuruu",
                      koodiarvo: "249",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.A",
                  properties: {
                    metadata: {
                      koodiarvo: "13",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.kunnat.265",
                  properties: {
                    metadata: {
                      title: "Kivijärvi",
                      koodiarvo: "265",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.kunnat.601",
                  properties: {
                    metadata: {
                      title: "Pihtipudas",
                      koodiarvo: "601",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.kunnat.850",
                  properties: {
                    metadata: {
                      title: "Toivakka",
                      koodiarvo: "850",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-08.kunnat.931",
                  properties: {
                    metadata: {
                      title: "Viitasaari",
                      koodiarvo: "931",
                      maakuntaKey: "FI-08"
                    },
                    isChecked: true
                  }
                }
              ],
              "FI-14": [
                {
                  anchor: "areaofaction.FI-14.kunnat.009",
                  properties: {
                    metadata: {
                      title: "Alavieska",
                      koodiarvo: "009",
                      maakuntaKey: "FI-14"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-14.A",
                  properties: {
                    metadata: {
                      koodiarvo: "17",
                      maakuntaKey: "FI-14"
                    },
                    isChecked: true,
                    isIndeterminate: true
                  }
                },
                {
                  anchor: "areaofaction.FI-14.kunnat.535",
                  properties: {
                    metadata: {
                      title: "Nivala",
                      koodiarvo: "535",
                      maakuntaKey: "FI-14"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-14.kunnat.625",
                  properties: {
                    metadata: {
                      title: "Pyhäjoki",
                      koodiarvo: "625",
                      maakuntaKey: "FI-14"
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: "areaofaction.FI-14.kunnat.691",
                  properties: {
                    metadata: {
                      title: "Reisjärvi",
                      koodiarvo: "691",
                      maakuntaKey: "FI-14"
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
                  metadata: {
                    koodiarvo: "FI2"
                  },
                  isChecked: false
                }
              }
            ]
          }
        }
      ],
      topthree: [],
      paatoksentiedot: [
        {
          anchor: "paatoksentiedot.asianumero.A",
          properties: {
            value: "VN/3443/4000"
          }
        }
      ]
    },
    unsaved: {
      rajoitelomake: [],
      rajoitteet: [
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.kohde.valikko",
          properties: {
            value: {
              label: "Opiskelijamäärät",
              value: "opiskelijamaarat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.kohde.tarkennin.opiskelijamaarat",
          properties: {
            value: {
              value: "kokonaismaara",
              label: "Kokonaisoppilas-/opiskelijamäärä"
            },
            metadata: {
              section: "opiskelijamaarat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.asetukset.0.kohde",
          properties: {
            value: {
              value: "enintaan",
              label: "Enintään"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.asetukset.0.tarkennin.lukumaara",
          properties: {
            value: "9000"
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.kohde",
          properties: {
            value: {
              value: "joistaVahintaan",
              label: "Joista vähintään"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.tarkennin.lukumaara",
          properties: {
            value: "800"
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.kohde.valikko",
          properties: {
            value: {
              label: "Opetus, jota lupa koskee",
              value: "opetustehtavat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.kohde.tarkennin.opetustehtavat",
          properties: {
            value: {
              label: "erityisopetus",
              value: "5"
            },
            metadata: {
              section: "getOpetustehtavatLomake"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.kohde",
          properties: {
            value: {
              value: "maaraaika",
              label: "Määräaika"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.tarkennin.alkamispaiva",
          properties: {
            value: new Date(1610440958706),
            metadata: {
              koodiarvo: "3",
              koodisto: "kujalisamaareet",
              section: "maaraaika"
            }
          }
        },
        {
          anchor:
            "rajoitteet.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.tarkennin.paattymispaiva",
          properties: {
            value: new Date(1612082520000),
            metadata: {
              koodiarvo: "3",
              koodisto: "kujalisamaareet",
              section: "maaraaika"
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
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.kohde.valikko",
        properties: {
          value: {
            label: "Opiskelijamäärät",
            value: "opiskelijamaarat"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.kohde.tarkennin.opiskelijamaarat",
        properties: {
          value: {
            value: "kokonaismaara",
            label: "Kokonaisoppilas-/opiskelijamäärä"
          },
          metadata: {
            section: "opiskelijamaarat"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.asetukset.0.kohde",
        properties: {
          value: {
            value: "enintaan",
            label: "Enintään"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.rajoite.asetukset.0.tarkennin.lukumaara",
        properties: {
          value: "9000"
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.kohde.A",
        properties: {
          value: ""
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.kohde",
        properties: {
          value: {
            value: "joistaVahintaan",
            label: "Joista vähintään"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.tarkennin.lukumaara",
        properties: {
          value: "800"
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.kohde.valikko",
        properties: {
          value: {
            label: "Opetus, jota lupa koskee",
            value: "opetustehtavat"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.kohde.tarkennin.opetustehtavat",
        properties: {
          value: {
            label: "erityisopetus",
            value: "5"
          },
          metadata: {
            section: "getOpetustehtavatLomake"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.kohde",
        properties: {
          value: {
            value: "maaraaika",
            label: "Määräaika"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.tarkennin.alkamispaiva",
        properties: {
          value: new Date(1610440958706),
          metadata: {
            koodiarvo: "3",
            koodisto: "kujalisamaareet",
            section: "maaraaika"
          }
        }
      },
      {
        anchor:
          "rajoitelomake.e936fc6f-fabb-4a8f-b657-e8494e5602ab.kohdennukset.0.kohdennukset.0.rajoite.asetukset.0.tarkennin.paattymispaiva",
        properties: {
          value: new Date(1612082520000),
          metadata: {
            koodiarvo: "3",
            koodisto: "kujalisamaareet",
            section: "maaraaika"
          }
        }
      }
    ]
  },
  validity: {},
  isRestrictionDialogVisible: false
};
