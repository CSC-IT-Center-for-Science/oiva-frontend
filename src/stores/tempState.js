export default {
    isRestrictionDialogVisible: true,
    changeObjects: {
      toimintaalue: [
        {
          anchor: 'categoryFilter',
          properties: {
            changesByProvince: {
              'FI-05': [
                {
                  anchor: 'areaofaction.FI-05.kunnat.105',
                  properties: {
                    metadata: {
                      koodiarvo: '105',
                      title: 'Hyrynsalmi',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.205',
                  properties: {
                    metadata: {
                      koodiarvo: '205',
                      title: 'Kajaani',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.290',
                  properties: {
                    metadata: {
                      koodiarvo: '290',
                      title: 'Kuhmo',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.578',
                  properties: {
                    metadata: {
                      koodiarvo: '578',
                      title: 'Paltamo',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.620',
                  properties: {
                    metadata: {
                      koodiarvo: '620',
                      title: 'Puolanka',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.697',
                  properties: {
                    metadata: {
                      koodiarvo: '697',
                      title: 'Ristijärvi',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.765',
                  properties: {
                    metadata: {
                      koodiarvo: '765',
                      title: 'Sotkamo',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.kunnat.777',
                  properties: {
                    metadata: {
                      koodiarvo: '777',
                      title: 'Suomussalmi',
                      maakuntaKey: 'FI-05',
                      maaraysUuid: undefined
                    },
                    isChecked: true
                  }
                },
                {
                  anchor: 'areaofaction.FI-05.A',
                  properties: {
                    metadata: {
                      koodiarvo: '18',
                      maakuntaKey: 'FI-05',
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
                anchor: 'areaofaction-radios.quick-filters.ei-alueita',
                properties: {
                  isChecked: false,
                  metadata: {
                    koodiarvo: 'FI2'
                  }
                }
              }
            ]
          }
        }
      ],
      rajoitteet: [
        {
          anchor: 'rajoitteet.kohteenValinta.valintaelementti',
          properties: {
            value: {
              label: '2. Kunnat, joissa opetusta järjestetään',
              value: 'opetustaAntavatKunnat'
            }
          }
        },
        {
          anchor: 'rajoitteet.opetustaAntavatKunnat.autocomplete',
          properties: {
            value: [
              {
                label: 'Puolanka',
                value: '620'
              },
              {
                label: 'Suomussalmi',
                value: '777'
              }
            ]
          }
        },
        {
          anchor: 'rajoitteet.eka.kriteeri0.valintaelementti',
          properties: {
            value: {
              label: 'Määräaika',
              value: 'maaraaika'
            }
          }
        },
        {
          anchor: 'rajoitteet.eka.kriteeri1.valintaelementti',
          properties: {
            value: {
              label: 'Määräaika',
              value: 'maaraaika'
            }
          }
        },
        {
          anchor: 'rajoitteet.eka.kriteeri0.maaraaika.alkamispaiva',
          properties: {
            value: new Date(1603449900000)
          }
        },
        {
          anchor: 'rajoitteet.eka.kriteeri0.maaraaika.paattymispaiva',
          properties: {
            value: new Date(1603626300000)
          }
        },
        {
          anchor: 'rajoitteet.eka.kriteeri1.maaraaika.paattymispaiva',
          properties: {
            value: new Date(1604058300000)
          }
        }
      ],
      rajoitelomake: [
        {
          anchor: 'rajoitelomake.kohteenValinta.valintaelementti',
          properties: {
            value: {
              label: '2. Kunnat, joissa opetusta järjestetään',
              value: 'opetustaAntavatKunnat'
            }
          }
        },
        {
          anchor: 'rajoitelomake.opetustaAntavatKunnat.autocomplete',
          properties: {
            value: [
              {
                label: 'Kajaani',
                value: '205'
              }
            ]
          }
        },
        {
          anchor: 'rajoitelomake.eka.kriteeri0.valintaelementti',
          properties: {
            value: {
              label: 'Määräaika',
              value: 'maaraaika'
            }
          }
        },
        {
          anchor: 'rajoitelomake.eka.kriteeri0.maaraaika.alkamispaiva',
          properties: {
            value: new Date(1602081910306)
          }
        },
        {
          anchor: 'rajoitelomake.eka.kriteeri2.valintaelementti',
          properties: {
            value: {
              label: 'Määräaika',
              value: 'maaraaika'
            }
          }
        },
        {
          anchor: 'rajoitelomake.eka.kriteeri2.maaraaika.paattymispaiva',
          properties: {
            value: new Date(1604159100000)
          }
        }
      ]
    }
  };
