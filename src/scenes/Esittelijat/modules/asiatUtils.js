import * as R from "ramda";
import common from "../../../i18n/definitions/common";
import moment from "moment";
import ProcedureHandler from "../../../components/02-organisms/procedureHandler";
import { resolveLocalizedOrganizationName } from "../../../modules/helpers";

const asiatTableColumnSetup = [
  { titleKey: common["asiaTable.headers.asianumero"], widthClass: "w-2/12" },
  { titleKey: common["asiaTable.headers.asia"], widthClass: "w-2/12" },
  { titleKey: common["asiaTable.headers.asiakas"], widthClass: "w-3/12" },
  { titleKey: common["asiaTable.headers.maakunta"], widthClass: "w-2/12" },
  { titleKey: common["asiaTable.headers.tila"], widthClass: "w-1/12" },
  { titleKey: common["asiaTable.headers.saapunut"], widthClass: "w-1/12" },
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

const getMaakuntaNimiFromHakemus = (hakemus, locale) => {
  const maakuntaObject = R.find(R.propEq("kieli", locale.toUpperCase()))(
    R.path(["jarjestaja", "maakuntaKoodi", "metadata"], hakemus) || []
  );
  return maakuntaObject ? maakuntaObject.nimi : "";
};

// Generates common row data for all Asiat-tables
export const generateAsiaTableRows = (row, { formatMessage, locale }) => {
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
      { text: row.asianumero },
      { text: formatMessage(common["asiaTypes.lupaChange"]) }, // Only one type known in system at this juncture
      { text: resolveLocalizedOrganizationName(row.jarjestaja, locale) },
      { text: getMaakuntaNimiFromHakemus(row, locale) },
      {
        text: formatMessage(common[`asiaStates.esittelija.${row.tila}`]) || ""
      },
      { text: paivityspvm }
    ]
  );
};

export const generateAvoimetAsiatTableStructure = (
  hakemusList,
  intl,
  history,
  onPaatettyActionClicked
) => {
  const formatMessage = intl.formatMessage;
  return [
    generateAsiatTableHeaderStructure(formatMessage),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)((row, i) => {
            let actions = [];
            if (row.tila === "VALMISTELUSSA") {
              actions.push({
                id: "esittelyyn",
                text: formatMessage(common["asiaTable.actions.esittelyssa"])
              });
            } else if (row.tila === "ESITTELYSSA") {
              actions.push(
                {
                  id: "valmisteluun",
                  text: formatMessage(common["asiaTable.actions.valmistelussa"])
                },
                {
                  id: "paata",
                  text: formatMessage(common["asiaTable.actions.paatetty"])
                }
              );
            }
            return {
              id: row.uuid,
              onClick: async (row, action) => {
                if (action === "esittelyyn") {
                  const timestamp = new Date().getTime();
                  await new ProcedureHandler(
                    formatMessage
                  ).run("muutospyynnot.tilanmuutos.esittelyyn", [row.id]);
                  history.push("?force=" + timestamp);
                } else if (action === "valmisteluun") {
                  const timestamp = new Date().getTime();
                  await new ProcedureHandler(
                    formatMessage
                  ).run("muutospyynnot.tilanmuutos.valmisteluun", [row.id]);
                  history.push("?force=" + timestamp);
                } else if (action === "paata") {
                  await onPaatettyActionClicked(row);
                } else {
                  history.push("/asiat/" + row.id);
                }
              },
              cells: generateAsiaTableRows(row, intl).concat([
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

export const generatePaatetytAsiatTableStructure = (hakemusList, intl) => {
  return [
    generateAsiatTableHeaderStructure(intl.formatMessage),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: R.addIndex(R.map)((row, i) => {
            return {
              id: row.uuid,
              onClick: async (row, action) => {
                if (action === "lataa") {
                  const procedureHandler = new ProcedureHandler(
                    intl.formatMessage
                  );
                  const output = await procedureHandler.run(
                    "muutospyynto.esittelijanEsikatselu.latauspolku",
                    [row.id]
                  );
                  const filePath =
                    output.muutospyynto.esittelijanEsikatselu.latauspolku.output;
                  procedureHandler.run(
                    "muutospyynto.lataaminen.downloadAndShow",
                    [filePath, true]
                  );
                } else {
                  console.log("Avaa asian asiakirjat", row);
                }
              },
              cells: generateAsiaTableRows(row, intl).concat({
                menu: {
                  id: `simple-menu-${i}`,
                  actions: [
                    {
                      id: "lataa",
                      text: intl.formatMessage(
                        common["asiaTable.actions.lataa"]
                      )
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
