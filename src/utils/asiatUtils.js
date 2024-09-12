import common from "../i18n/definitions/common";
import moment from "moment";
import { resolveLocalizedOrganizationName } from "../modules/helpers";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";
import { addIndex, find, map, path, prop, propEq } from "ramda";

export const labelColorClassesByTila = {
  VALMISTELUSSA: "bg-blue-100",
  ESITTELYSSA: "bg-yellow-100",
  PAATETTY: "bg-gray-200",
  KORJAUKSESSA: "bg-red-400 text-white"
};

const asiatTableColumnSetup = avoimet => {
  return [
    { titleKey: common["asiaTable.headers.asianumero"], widthClass: "w-2/12" },
    { titleKey: common["asiaTable.headers.asia"], widthClass: "w-2/12" },
    { titleKey: common["asiaTable.headers.asiakas"], widthClass: "w-3/12" },
    { titleKey: common["asiaTable.headers.maakunta"], widthClass: "w-2/12" },
    { titleKey: common["asiaTable.headers.tila"], widthClass: "w-1/12" },
    {
      titleKey: avoimet
        ? common["asiaTable.headers.saapunut"]
        : common["asiaTable.headers.paatospvm"],
      widthClass: "w-1/12"
    }
  ];
};

const generateAsiatTableHeaderStructure = (t, tableColumnSetup) => {
  return {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            cells: map(item => {
              return {
                isSortable: !(item.isSortable === false),
                truncate: true,
                styleClasses: [item.widthClass],
                text: t(item.titleKey)
              };
            })(tableColumnSetup)
          }
        ]
      }
    ]
  };
};

const getMaakuntaNimiFromHakemus = (hakemus, locale) => {
  const maakuntaObject = find(propEq("kieli", locale.toUpperCase()))(
    path(["jarjestaja", "maakuntaKoodi", "metadata"], hakemus) || []
  );
  return maakuntaObject ? maakuntaObject.nimi : "";
};

// Generates common row data for all Asiat-tables
export const generateAsiaTableRows = (
  row,
  { formatMessage, locale },
  avoimet
) => {
  const tableColumnSetup = asiatTableColumnSetup(avoimet);
  const paivityspvm = row.paivityspvm
    ? moment(row.paivityspvm).format("D.M.YYYY")
    : "";
  const paatospvm = row.paatospvm
    ? moment(row.paatospvm).format("D.M.YYYY")
    : "";

  return addIndex(map)(
    (col, j) => {
      return {
        truncate: false,
        styleClasses: [tableColumnSetup[j].widthClass],
        text: col.text
      };
    },
    [
      { text: row.asianumero || row.diaarinumero },
      {
        text:
          formatMessage(common["asiaTypes.lupaChange"]) +
          (row.kieli && row.kieli === "sv" ? " (SV)" : "")
      }, // Only one type known in system at this juncture
      { text: resolveLocalizedOrganizationName(row.jarjestaja, locale) },
      { text: getMaakuntaNimiFromHakemus(row, locale) },
      {
        text: `<span class="px-3 py-2 rounded-sm ${prop(
          row.tila,
          labelColorClassesByTila
        )}">${
          formatMessage(common[`asiaStates.esittelija.${row.tila}`]) || ""
        }</span>`
      },
      { text: avoimet ? paivityspvm : paatospvm }
    ]
  );
};

export const generateAvoimetAsiatTableStructure = (
  hakemusList,
  intl,
  history,
  koulutusmuotoKebabCase
) => {
  const formatMessage = intl.formatMessage;
  const tableColumnSetup = asiatTableColumnSetup(true);
  return [
    generateAsiatTableHeaderStructure(formatMessage, tableColumnSetup),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: addIndex(map)(row => {
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
              onClick: async row => {
                history.push(
                  localizeRouteKey(
                    intl.locale,
                    AppRoute.Asia,
                    intl.formatMessage,
                    {
                      koulutusmuoto: koulutusmuotoKebabCase,
                      uuid: row.id
                    }
                  )
                );
              },
              cells: generateAsiaTableRows(row, intl, true)
            };
          }, hakemusList || [])
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];
};

export const generatePaatetytAsiatTableStructure = (
  hakemusList,
  intl,
  history,
  koulutusmuotoKebabCase
) => {
  const tableColumnSetup = asiatTableColumnSetup(false);
  return [
    generateAsiatTableHeaderStructure(intl.formatMessage, tableColumnSetup),
    {
      role: "tbody",
      rowGroups: [
        {
          rows: addIndex(map)(row => {
            return {
              id: row.uuid,
              onClick: async row => {
                history.push(
                  localizeRouteKey(
                    intl.locale,
                    AppRoute.Asia,
                    intl.formatMessage,
                    {
                      koulutusmuoto: koulutusmuotoKebabCase,
                      uuid: row.id
                    }
                  )
                );
              },
              cells: generateAsiaTableRows(row, intl, false)
            };
          }, hakemusList || [])
        }
      ]
    },
    {
      role: "tfoot"
    }
  ];
};
