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
    unsaved: {},
    underRemoval: {}
  },
  focusOn: null,
  latestChanges: {
    underRemoval: [],
    unsaved: []
  },
  validity: {},
  isRestrictionDialogVisible: false
};
