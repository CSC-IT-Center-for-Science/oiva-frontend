import * as R from "ramda";
import common from "../../../i18n/definitions/common";
import moment from "moment";

const asiatTableColumnSetup = [
  {titleKey: common.asiaTable.headers.asianumero, widthClass: "w-2/12"},
  {titleKey: common.asiaTable.headers.tila, widthClass: "w-1/12"},
  {titleKey: common.asiaTable.headers.asia, widthClass: "w-2/12"},
  {titleKey: common.asiaTable.headers.asiakas, widthClass: "w-3/12"},
  {titleKey: common.asiaTable.headers.maakunta, widthClass: "w-1/12"},
  {titleKey: common.asiaTable.headers.saapunut, widthClass: "w-1/12"},
  {titleKey: common.asiaTable.headers.hakupvm, widthClass: "w-1/12"},
  {titleKey: common.asiaTable.headers.actions, widthClass: "w-1/12"}
];

const generateAsiatTableHeaderStructure = (t) => {
  return {
    role: "thead",
    rowGroups: [
      {
        rows: [
          {
            cells: R.map((item) => {
              return {
                isSortable: true,
                truncate: true,
                styleClasses: [item.widthClass],
                text: t(item.titleKey)
              }
            })(asiatTableColumnSetup)
          }
        ]
      }
    ]
  }
};

const getMaakuntaNimiFromHakemus = (hakemus) => {
  const maakuntaObject = R.find(R.propEq("kieli", "FI"))(R.path(["jarjestaja", "maakuntaKoodi", "metadata"], hakemus) || [])
  return maakuntaObject ? maakuntaObject.nimi : '';
};

const getJarjestajaNimiFromHakemus = (hakemus) => {
  return R.path(["jarjestaja", "nimi", "fi"], hakemus) || '';
};

export const generateAsiatTableStructure = (hakemusList, t) => {
  return [
    generateAsiatTableHeaderStructure(t),
    {
      role: "tbody",
      rowGroups: [{
        rows: R.addIndex(R.map)((row, i) => {
          const paivityspvm = row.paivityspvm ?
            moment(row.paivityspvm).format('D.M.YYYY') :
            '';
          const hakupvm = row.hakupvm ?
            moment(row.hakupvm,'yyyy-mm-dd').format('D.M.YYYY') :
            '';
          return {
            id: row.uuid,
            cells: R.addIndex(R.map)(
              (col, j) => {
                return {
                  truncate: true,
                  styleClasses: [asiatTableColumnSetup[j].widthClass],
                  text: col.text
                };
              },
              [
                {text: ''}, //TODO: Fill when mechanism for Asianumero assignment exists. Currently no source.
                {text: t(common.asiaStates.esittelija[row.tila]) || ''},
                {text: t(common.asiaTypes.lupaChange)}, // Only one type known in system at this juncture
                {text: getJarjestajaNimiFromHakemus(row)},
                {text: getMaakuntaNimiFromHakemus(row)},
                {text: paivityspvm},
                {text: hakupvm}
              ]
            ).concat({
              menu: {
                id: `simple-menu-${i}`,
                actions: [
                  {
                    id: "start-preparing",
                    text: t(common.asiaTable.actions.handle)
                  }
                ]
              }
            })
          };
        }, hakemusList)
      }]
    },
    {
      role: "tfoot"
    }
  ]
}
