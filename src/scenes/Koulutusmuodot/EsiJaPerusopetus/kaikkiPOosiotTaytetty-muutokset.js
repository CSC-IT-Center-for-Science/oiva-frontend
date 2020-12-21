export const muutokset = {
  changeObjects: {
    saved: {
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
                label: "suomi",
                value: "FI"
              },
              {
                label: "baski, euskara",
                value: "EU"
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
                label: "ranska",
                value: "FR"
              },
              {
                label: "bretoni",
                value: "BR"
              }
            ],
            metadata: {
              valikko: "toissijaiset"
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
            value: "Testikuvaus",
            metadata: {
              ankkuri: "0"
            }
          }
        }
      ],
      opetuksenJarjestamismuodot: [
        {
          anchor: "opetuksenJarjestamismuodot.1.valinta",
          properties: {
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
          anchor: "opetustehtavat.opetustehtava.6",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.3",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.4",
          properties: {
            isChecked: true
          }
        },
        {
          anchor: "opetustehtavat.opetustehtava.27",
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
          anchor: "opetustehtavat.opetustehtava.18",
          properties: {
            isChecked: true
          }
        }
      ],
      topthree: [],
      paatoksentiedot: [
        {
          anchor: "paatoksentiedot.asianumero.A",
          properties: {
            value: "VN/1111/2000"
          }
        }
      ]
    },
    unsaved: {
      rajoitteet: [
        {
          anchor:
            "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.valikko",
          properties: {
            value: {
              label: "Opiskelijamäärät",
              value: "opiskelijamaarat"
            }
          }
        },
        {
          anchor:
            "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.tarkennin.opiskelijamaarat",
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
            "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.kohde",
          properties: {
            value: {
              value: "enintaan",
              label: "Enintään"
            }
          }
        },
        {
          anchor:
            "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.tarkennin.lukumaara",
          properties: {
            value: "400"
          }
        }
      ],
      rajoitelomake: [
        {
          anchor:
            "rajoitelomake.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.valikko",
          properties: {
            value: {
              label: "Opiskelijamäärät",
              value: "opiskelijamaarat"
            }
          }
        },
        {
          anchor:
            "rajoitelomake.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.tarkennin.opiskelijamaarat",
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
            "rajoitelomake.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.kohde",
          properties: {
            value: {
              value: "enintaan",
              label: "Enintään"
            }
          }
        },
        {
          anchor:
            "rajoitelomake.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.tarkennin.lukumaara",
          properties: {
            value: "400"
          }
        },
        {
          anchor:
            "rajoitelomake.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohdennukset.1.kohde.A",
          properties: {
            value: ""
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
        anchor: "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.valikko",
        properties: {
          value: {
            label: "Opiskelijamäärät",
            value: "opiskelijamaarat"
          }
        }
      },
      {
        anchor:
          "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.kohde.tarkennin.opiskelijamaarat",
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
          "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.kohde",
        properties: {
          value: {
            value: "enintaan",
            label: "Enintään"
          }
        }
      },
      {
        anchor:
          "rajoitteet.9a3a1a6b-bab9-48d3-ae07-6ca43ef1faee.asetukset.0.tarkennin.lukumaara",
        properties: {
          value: "400"
        }
      }
    ]
  },
  validity: {},
  isRestrictionDialogVisible: false
};
