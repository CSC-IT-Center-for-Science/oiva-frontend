import * as R from "ramda";
import common from "../../../i18n/definitions/common";
import moment from "moment";
import ProcedureHandler from "../../../components/02-organisms/procedureHandler";

const asiatTableColumnSetup = [
  { titleKey: common["asiaTable.headers.asianumero"], widthClass: "w-1/12" },
  { titleKey: common["asiaTable.headers.asia"], widthClass: "w-2/12" },
  { titleKey: common["asiaTable.headers.asiakas"], widthClass: "w-3/12" },
  { titleKey: common["asiaTable.headers.maakunta"], widthClass: "w-2/12" },
  { titleKey: common["asiaTable.headers.tila"], widthClass: "w-1/12" },
  { titleKey: common["asiaTable.headers.saapunut"], widthClass: "w-2/12" },
  {
    titleKey: common["asiaTable.headers.actions"],
    widthClass: "w-1/12",
    isSortable: false
  }
];

const generateAsiatTableHeaderStructure = t => {
  return {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            cells: R.map(item => {
              return {
                isSortable: !(item.isSortable === false),
                truncate: true,
                styleClasses: [item.widthClass],
                text: t(item.titleKey)
              };
            })(asiatTableColumnSetup)
          }
        ]
      }
    ]
  };
};

const getMaakuntaNimiFromHakemus = hakemus => {
  const maakuntaObject = R.find(R.propEq("kieli", "FI"))(
    R.path(["jarjestaja", "maakuntaKoodi", "metadata"], hakemus) || []
  );
  return maakuntaObject ? maakuntaObject.nimi : "";
};

const getJarjestajaNimiFromHakemus = hakemus => {
  return R.path(["jarjestaja", "nimi", "fi"], hakemus) || "";
};

// Generates common row data for all Asiat-tables
export const generateAsiaTableRows = (row, i, t) => {
  const paivityspvm = row.paivityspvm
    ? moment(row.paivityspvm).format("D.M.YYYY")
    : "";
  return R.addIndex(R.map)(
    (col, j) => {
      return {
        truncate: true,
        styleClasses: [asiatTableColumnSetup[j].widthClass],
        text: col.text
      };
    },
    [
      { text: "" }, //TODO: Fill when mechanism for Asianumero assignment exists. Currently no source.
      { text: t(common["asiaTypes.lupaChange"]) }, // Only one type known in system at this juncture
      { text: getJarjestajaNimiFromHakemus(row) },
      { text: getMaakuntaNimiFromHakemus(row) },
      {
        text: t(common[`asiaStates.esittelija.${row.tila}`]) || ""
      },
      { text: paivityspvm }
    ]
  );
};

export const generateAvoimetAsiatTableStructure = (hakemusList, t, history) => {
  return [
    generateAsiatTableHeaderStructure(t),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)((row, i) => {
            let actions = [];
            if (row.tila === "VALMISTELUSSA") {
              actions.push({
                id: "esittelyyn",
                text: t(common["asiaTable.actions.esittelyssa"])
              });
            } else if (row.tila === "ESITTELYSSA") {
              actions.push(
                {
                  id: "valmisteluun",
                  text: t(common["asiaTable.actions.valmistelussa"])
                },
                {
                  id: "paata",
                  text: t(common["asiaTable.actions.paatetty"])
                }
              );
            }
            return {
              id: row.uuid,
              onClick: async (row, action) => {
                if (action === "esittelyyn") {
                  const timestamp = new Date().getTime();
                  await new ProcedureHandler().run(
                    "muutospyynnot.tilanmuutos.esittelyyn",
                    [row.id]
                  );
                  history.push("?force=" + timestamp);
                } else if (action === "valmisteluun") {
                  const timestamp = new Date().getTime();
                  await new ProcedureHandler().run(
                    "muutospyynnot.tilanmuutos.valmisteluun",
                    [row.id]
                  );
                  history.push("?force=" + timestamp);
                } else if (action === "paata") {
                  const timestamp = new Date().getTime();
                  await new ProcedureHandler().run(
                    "muutospyynnot.tilanmuutos.paatetyksi",
                    [row.id]
                  );
                  history.push("?force=" + timestamp);
                } else {
                  history.push("/asiat/" + row.id);
                }
              },
              cells: generateAsiaTableRows(row, i, t).concat([
                {
                  menu: {
                    id: `simple-menu-${i}`,
                    actions
                  },
                  styleClasses: [
                    asiatTableColumnSetup[asiatTableColumnSetup.length - 1]
                      .widthClass
                  ]
                }
              ])
            };
          }, hakemusList)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];
};

export const generatePaatetytAsiatTableStructure = (hakemusList, t) => {
  return [
    generateAsiatTableHeaderStructure(t),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)((row, i) => {
            return {
              id: row.uuid,
              onClick: async (row, action) => {
                if (action === "lataa") {
                  const procedureHandler = new ProcedureHandler();
                  const output = await procedureHandler.run(
                    "muutospyynto.esikatselu.latauspolku",
                    [row.id]
                  );
                  const filePath =
                    output.muutospyynto.esikatselu.latauspolku.output;
                  procedureHandler.run(
                    "muutospyynto.lataaminen.downloadAndShow",
                    [filePath, true]
                  );
                } else {
                  console.log("Avaa asian asiakirjat", row);
                }
              },
              cells: generateAsiaTableRows(row, i, t).concat({
                menu: {
                  id: `simple-menu-${i}`,
                  actions: [
                    {
                      id: "lataa",
                      text: t(common["asiaTable.actions.lataa"])
                    }
                  ]
                },
                styleClasses: [
                  asiatTableColumnSetup[asiatTableColumnSetup.length - 1]
                    .widthClass
                ]
              })
            };
          }, hakemusList)
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];
};
